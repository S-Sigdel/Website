# Personal Portfolio Website

A modern personal portfolio website built with Next.js, featuring vim-inspired keyboard navigation and an interactive terminal interface.

## Features

- Vim-style keyboard navigation (j/k for scrolling, g/gg for top/bottom, / for search)
- Interactive terminal component
- Projects showcase with carousel
- Responsive design with Tailwind CSS
- Real-time status display

## Tech Stack

- Next.js 16.0.4
- React 19
- TypeScript
- Tailwind CSS 4

## Getting Started

Install dependencies:

```bash
pnpm install
```

Run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Keyboard Shortcuts

- `j` - Scroll down
- `k` - Scroll up
- `gg` - Scroll to top
- `G` - Scroll to bottom
- `/` - Open search overlay

## Build

```bash
pnpm build
pnpm start
```

## System Monitor Setup

This feature allows your personal computer to send real-time performance data (CPU, RAM, Uptime) to the website.

### How It Works

The system monitor uses a client-server architecture:
1.  **Client (Your PC)**: A Python script runs locally, gathering system metrics using `psutil`.
2.  **Transport**: It sends a JSON payload via HTTP POST to the website's API endpoint (`/api/system-status`).
3.  **Server (Next.js)**: The API route receives the data and stores it in an **in-memory variable**.
    *   *Note*: Since Vercel/Next.js serverless functions are ephemeral, this "database" is temporary. It caches the last received state. If the server restarts, data is lost until the next heartbeat from your PC.
4.  **Frontend**: The React component polls this API every 5 seconds. If the timestamp of the data is older than 60 seconds, it automatically switches to "OFFLINE" mode.

### 1. Website Configuration (Vercel)

1.  **Generate a Secret Key**:
    ```bash
    openssl rand -hex 32
    ```
2.  **Add Environment Variable**:
    -   Go to Vercel Project Settings > Environment Variables.
    -   Add `API_SECRET` with the value generated above.
    -   Redeploy the project.

> **Important**: Ensure your `API_URL` uses `www.` (e.g., `https://www.sakshyamsigdel.com.np/api/system-status`) if your domain is configured that way. Vercel redirects from non-www to www can sometimes strip the Authorization header.

### 2. Host Script Setup (Your Computer)

We use a Python script to collect and send data. Since the `scripts/` folder is git-ignored, you should create this file manually on your host machine.

**Prerequisites:** Python 3, `pip`.

1.  **Install dependencies**:
    ```bash
    pip install psutil requests
    ```

2.  **Create `monitor.py`**:

```python
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
API_URL = os.getenv('API_URL', 'https://www.sakshyamsigdel.com.np/api/system-status')
API_SECRET = os.getenv('API_SECRET', 'default-secret-key').strip()
INTERVAL = 5  # Seconds

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
```

3.  **Run it**:
    ```bash
    # Set your secret key
    export API_SECRET="your-secret-key-from-vercel"
    
    # Run the script
    python3 monitor.py
    ```

### 3. Run as Service (Linux)

Create `~/.config/systemd/user/portfolio-monitor.service`:

```ini
[Unit]
Description=Portfolio System Monitor
After=network.target

[Service]
Type=simple
Environment="API_SECRET=your-secret-key-from-vercel"
ExecStart=/usr/bin/python3 /path/to/your/monitor.py
Restart=always
RestartSec=10

[Install]
WantedBy=default.target
```

Enable it:
```bash
systemctl --user enable --now portfolio-monitor
```

## Interesting Technical Details

### Vim Navigation
The website implements a global keyboard event listener that mimics Vim's navigation keys.
- `j`/`k`: Smoothly scrolls the window by a fixed amount.
- `g`/`G`: Uses `window.scrollTo` for top/bottom navigation.
- `/`: Triggers the search overlay state.
- **Status Bar**: A React Context (`StatusContext`) tracks the current "mode" (NORMAL, INSERT) and updates the bottom bar dynamically, just like airline/lightline in Vim.

### Mouse-Following Background
A custom HTML5 Canvas component (`Background.tsx`) creates a subtle lighting effect.
- It tracks mouse coordinates via an event listener.
- Uses `requestAnimationFrame` for smooth 60fps rendering.
- Draws a radial gradient with `mix-blend-mode: screen` to create a "flashlight" effect that reveals the texture of the background without obscuring content.

### Offline Detection
The `MachineInfo` component compares the server timestamp with the client's current time.
```typescript
const isOffline = (Date.now() / 1000 - timestampSecs) > 60;
```
If the difference exceeds 60 seconds, the UI applies a grayscale filter and updates the global status bar to "OFFLINE".
