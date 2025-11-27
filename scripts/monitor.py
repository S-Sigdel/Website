import time
import psutil
import requests
import platform
import os
import sys
import json
from datetime import datetime, timedelta

# Configuration
# Default to the production URL as seen in your logs, but allow override
API_URL = os.getenv('API_URL', 'https://sakshyamsigdel.com.np/api/system-status')
API_SECRET = os.getenv('API_SECRET', 'default-secret-key').strip()
INTERVAL = 2  # Seconds

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
                "level": battery.percent,
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
            "os": f"{platform.system()} {platform.release()}",
            "kernel": platform.version(),
            "uptime": uptime_str,
            "shell": os.getenv('SHELL', 'unknown').split('/')[-1],
            "cpu": {
                "model": platform.processor(),
                "frequency": cpu_freq.current if cpu_freq else 0,
                "usage": cpu_usage,
                "temperature": 0,
                "power": 0,
                "cores": cpu_cores
            },
            "memory": f"{get_size(svmem.used)} / {get_size(svmem.total)}",
            "memoryPercent": svmem.percent,
            "battery": battery_info,
            "loadAverage": {
                "one": load1,
                "five": load5,
                "fifteen": load15
            },
            "timestamp": time.time()
        }
        return data
    except Exception as e:
        print(f"Error collecting stats: {e}")
        return None

def main():
    print(f"Starting monitor for {API_URL}")
    print(f"Using Secret: {API_SECRET[:2]}***{API_SECRET[-2:] if len(API_SECRET) > 4 else ''} (Length: {len(API_SECRET)})")
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
                headers = {
                    'Content-Type': 'application/json',
                    'Authorization': f'Bearer {API_SECRET}'
                }
                
                # Print a dot to show activity without spamming
                print(".", end="", flush=True)
                
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
