import time
import psutil
import requests
import platform
import os
import sys
import json
import glob
import ctypes
import struct
from datetime import datetime, timedelta

# Configuration
# Default to the production URL as seen in your logs, but allow override
API_URL = os.getenv('API_URL', 'https://www.sakshyamsigdel.com.np/api/system-status')
API_SECRET = os.getenv('API_SECRET', 'default-secret-key').strip()
INTERVAL = 5  # Seconds
VERSION = "1.1.2"

class IntelGPUMonitor:
    def __init__(self):
        self.libc = ctypes.CDLL('libc.so.6', use_errno=True)
        self.fd = -1
        self.last_val = 0
        self.last_time = 0
        self.valid = False
        
        # Determine syscall number based on architecture
        machine = platform.machine()
        if machine == 'x86_64':
            self.__NR_perf_event_open = 298
        elif machine in ('i386', 'i686'):
            self.__NR_perf_event_open = 336
        else:
            # Default to x86_64 if unknown, as Intel GPUs are typically on x86
            self.__NR_perf_event_open = 298

        self.last_init_retry = 0
        self._init_perf()

    def check_connection(self):
        if self.valid:
            return True
            
        # Retry every 10 seconds if failed
        if time.time() - self.last_init_retry < 10:
            return False
            
        self.last_init_retry = time.time()
        print("DEBUG: Retrying GPU initialization...")
        self._init_perf()
        return self.valid

    def _init_perf(self):
        """Initialize the perf event for i915 or xe."""
        
        # Check paranoid level
        try:
            with open('/proc/sys/kernel/perf_event_paranoid', 'r') as f:
                level = int(f.read().strip())
                if level > 1:
                    print(f"DEBUG: perf_event_paranoid is {level}. Needs to be 1 or 0.")
        except Exception:
            pass

        # 1. Find driver (i915 or xe)
        drivers = ['i915', 'xe']
        pmu_type = None
        driver_name = None
        
        for d in drivers:
            path = f'/sys/bus/event_source/devices/{d}/type'
            if os.path.exists(path):
                pmu_type = self._get_sysfs_val(path)
                if pmu_type is not None:
                    driver_name = d
                    break
        
        if pmu_type is None:
            return

        # 2. Find config
        config = None
        # Try specific known event names first
        candidates = [
            f'/sys/bus/event_source/devices/{driver_name}/events/rcs0-busy', # Render
            f'/sys/bus/event_source/devices/{driver_name}/events/gpu-busy',  # Generic
        ]
        
        for c in candidates:
            if os.path.exists(c):
                config = self._get_config_val(c)
                if config is not None:
                    break
        
        # Fallback: scan directory
        if config is None:
            events_dir = f'/sys/bus/event_source/devices/{driver_name}/events/'
            if os.path.exists(events_dir):
                for f in os.listdir(events_dir):
                    if f.endswith('-busy'):
                        full_path = os.path.join(events_dir, f)
                        config = self._get_config_val(full_path)
                        if config is not None:
                            break
                            
        if config is None:
            return

        # 3. Open perf event
        self.fd = self._open_perf_event(pmu_type, config)
        if self.fd >= 0:
            self.valid = True
            # Initialize baseline readings
            self.last_val = self._read_counter()
            self.last_time = time.time_ns()
            print(f"DEBUG: Perf event opened successfully (fd={self.fd})")
        else:
            err = ctypes.get_errno()
            print(f"DEBUG: Failed to open perf event. Errno: {err}")
            if err == 13:
                print("DEBUG: Permission denied. Try: sudo sysctl kernel.perf_event_paranoid=0")

    def _get_sysfs_val(self, path):
        try:
            with open(path, 'r') as f:
                return int(f.read().strip())
        except (IOError, ValueError):
            return None

    def _get_config_val(self, path):
        try:
            with open(path, 'r') as f:
                content = f.read().strip()
                # Parse "config=0x..." or similar
                for part in content.split(','):
                    if part.startswith('config='):
                        return int(part.split('=')[1], 0)
        except (IOError, ValueError, IndexError):
            return None
        return None

    def _open_perf_event(self, pmu_type, config):
        # struct perf_event_attr
        # We create a 128-byte buffer to hold the struct.
        # The layout starts with: u32 type, u32 size, u64 config
        attr = ctypes.create_string_buffer(128)
        
        # Pack type, size, config into the buffer
        # size=128 tells the kernel the size of our structure
        struct.pack_into('IIQ', attr, 0, pmu_type, 128, config)
        
        # syscall(__NR_perf_event_open, attr, pid, cpu, group_fd, flags)
        # pid=-1 (all processes)
        # cpu=0 (monitor on CPU 0; i915 PMU is system-wide/uncore)
        # group_fd=-1
        # flags=0
        return self.libc.syscall(self.__NR_perf_event_open, ctypes.byref(attr), -1, 0, -1, 0)

    def _read_counter(self):
        if self.fd < 0: return 0
        try:
            # Read 8 bytes (uint64) from the file descriptor
            data = os.read(self.fd, 8)
            return struct.unpack('Q', data)[0]
        except OSError:
            return 0

    def get_usage(self):
        """
        Returns the GPU usage percentage (0.0 - 100.0).
        Call this method periodically (e.g., every few seconds).
        """
        if not self.valid:
            return 0.0

        current_val = self._read_counter()
        current_time = time.time_ns()
        
        delta_val = current_val - self.last_val
        delta_time = current_time - self.last_time
        
        # Update baseline for next call
        self.last_val = current_val
        self.last_time = current_time
        
        if delta_time <= 0:
            return 0.0
            
        # The rcs0-busy counter unit is nanoseconds (time busy)
        # Usage = (busy_time_delta / elapsed_time_delta) * 100
        usage = (delta_val / delta_time) * 100.0
        return min(max(usage, 0.0), 100.0)

    def close(self):
        if self.fd >= 0:
            os.close(self.fd)
            self.fd = -1
            self.valid = False
            
    def __del__(self):
        self.close()

# Instantiate global monitor
gpu_monitor = IntelGPUMonitor()

def get_size(bytes, suffix="B"):
    """
    Scale bytes to its proper format
    e.g:
        1253656 => '1.20MB'
        1253656678 => '1.17GB'
    """
    factor = 1024
    for unit in ["", "K", "M", "G", "T", "P"]:
        if bytes < factor:
            return f"{bytes:.2f}{unit}{suffix}"
        bytes /= factor

def get_gpu_info():
    """
    Attempt to get GPU usage.
    First try using perf events (like btop), then fall back to sysfs.
    """
    # Method 1: Perf Events (btop style)
    # Try to connect if not valid
    if gpu_monitor.check_connection():
        return {
            "usage": gpu_monitor.get_usage(),
            "power": 0
        }

    # Method 2: Sysfs fallback (Aggressive Search)
    print("DEBUG: Attempting aggressive sysfs search...")
    
    # List of potential filenames to look for
    target_files = ['busy_percent', 'gpu_busy_percent', 'gt_act_freq_mhz', 'gpu_usage']
    
    found_path = None
    
    # 1. Search DRM class
    base_dirs = ['/sys/class/drm', '/sys/class/hwmon']
    
    for base in base_dirs:
        if not os.path.exists(base):
            continue
            
        for root, dirs, files in os.walk(base):
            for filename in files:
                if any(t in filename for t in target_files):
                    full_path = os.path.join(root, filename)
                    # Check if we can read it
                    try:
                        with open(full_path, 'r') as f:
                            val = f.read().strip()
                            # Try to convert to int to ensure it's a number
                            int_val = int(val)
                            print(f"DEBUG: Found readable candidate: {full_path} = {val}")
                            
                            # If it looks like a percentage (0-100), prefer it
                            if 'percent' in filename and 0 <= int_val <= 100:
                                found_path = full_path
                                break
                    except Exception:
                        continue
            if found_path: break
        if found_path: break

    if found_path:
        try:
            with open(found_path, 'r') as f:
                usage = int(f.read().strip())
                return {
                    "usage": usage,
                    "power": 0
                }
        except Exception:
            pass
    else:
        print("DEBUG: Aggressive search yielded no readable GPU usage files.")

    return None

def get_os_name():
    """
    Try to get a pretty OS name from /etc/os-release
    """
    try:
        if os.path.exists('/etc/os-release'):
            with open('/etc/os-release', 'r') as f:
                for line in f:
                    if line.startswith('PRETTY_NAME='):
                        return line.split('=')[1].strip().strip('"')
    except Exception:
        pass
    return f"{platform.system()} {platform.release()}"

def get_cpu_model():
    """
    Get CPU model name.
    On Linux, platform.processor() often returns just the arch (e.g. x86_64).
    We want the pretty name from /proc/cpuinfo.
    """
    try:
        if platform.system() == "Linux":
            with open('/proc/cpuinfo', 'r') as f:
                for line in f:
                    if "model name" in line:
                        return line.split(':')[1].strip()
    except Exception:
        pass
    return platform.processor() or "Unknown CPU"

def get_system_info():
    try:
        # CPU
        cpu_freq = psutil.cpu_freq()
        cpu_usage = psutil.cpu_percent(interval=0.1) # Small interval to not block too long
        cpu_cores = []
        
        # Per-core usage
        per_core = psutil.cpu_percent(interval=0.1, percpu=True)
        for i, usage in enumerate(per_core):
            cpu_cores.append({
                "id": i,
                "usage": usage,
                "temperature": 0 # Hard to get cross-platform without specific libs
            })

        # Memory
        svmem = psutil.virtual_memory()
        
        # Uptime
        boot_time_timestamp = psutil.boot_time()
        bt = datetime.fromtimestamp(boot_time_timestamp)
        uptime_seconds = time.time() - boot_time_timestamp
        uptime_str = str(datetime.now() - bt).split('.')[0]

        # Battery
        battery = psutil.sensors_battery()
        battery_info = None
        if battery:
            battery_info = {
                "level": round(battery.percent, 2),
                "timeRemaining": str(timedelta(seconds=battery.secsleft)) if battery.secsleft != psutil.POWER_TIME_UNLIMITED else "Charging"
            }

        # Load Average
        try:
            if hasattr(os, 'getloadavg'):
                load1, load5, load15 = os.getloadavg()
            else:
                load1, load5, load15 = 0, 0, 0
        except OSError:
            load1, load5, load15 = 0, 0, 0

        data = {
            "username": os.getenv('USER', 'user'),
            "hostname": platform.node(),
            "os": get_os_name(),
            "kernel": platform.release(),
            "uptime": uptime_str,
            "shell": os.getenv('SHELL', 'unknown').split('/')[-1],
            "cpu": {
                "model": get_cpu_model(),
                "frequency": cpu_freq.current if cpu_freq else 0,
                "usage": cpu_usage,
                "temperature": 0,
                "power": 0,
                "cores": cpu_cores
            },
            "gpu": get_gpu_info(),
            "memory": f"{get_size(svmem.used)} / {get_size(svmem.total)}",
            "memoryPercent": svmem.percent,
            "battery": battery_info,
            "loadAverage": {
                "one": load1,
                "five": load5,
                "fifteen": load15
            },
            "timestamp": time.time(),
            "version": VERSION
        }
        return data
    except Exception as e:
        print(f"Error collecting stats: {e}")
        return None

def main():
    print(f"Starting monitor for {API_URL}")
    print(f"Press Ctrl+C to stop")
    
    # Check if we can connect first
    try:
        print("Testing connection...")
        requests.get(API_URL.replace('/api/system-status', ''), timeout=5)
        print("Connection successful!")
    except Exception as e:
        print(f"Warning: Could not connect to base URL: {e}")
        print("Continuing anyway...")

    while True:
        try:
            data = get_system_info()
            if data:
                # Debug: Print what we are sending
                gpu_data = data.get('gpu')
                print(f"\r[Sending] CPU: {data.get('cpu', {}).get('model')} | GPU: {gpu_data if gpu_data else 'MISSING (See below)'}", end="")
                
                if not gpu_data and not getattr(main, 'warned_gpu', False):
                    print("\n\n⚠️  GPU DATA MISSING")
                    print("To fix this, run the following command in another terminal:")
                    print("sudo sysctl kernel.perf_event_paranoid=0")
                    print("Then restart this script.\n")
                    main.warned_gpu = True

                headers = {
                    'Content-Type': 'application/json',
                    'Authorization': f'Bearer {API_SECRET}'
                }
                
                response = requests.post(API_URL, json=data, headers=headers, timeout=5)
                
                if response.status_code != 200:
                    print(f"\n[{datetime.now().strftime('%H:%M:%S')}] Failed: {response.status_code} - {response.text}")
            
            time.sleep(INTERVAL)
            
        except requests.exceptions.ConnectionError:
            print(f"\n[{datetime.now().strftime('%H:%M:%S')}] Connection error - is the server running?")
            time.sleep(5)
        except KeyboardInterrupt:
            print("\nStopping monitor...")
            break
        except Exception as e:
            print(f"\n[{datetime.now().strftime('%H:%M:%S')}] Error: {e}")
            time.sleep(5)

if __name__ == "__main__":
    main()
