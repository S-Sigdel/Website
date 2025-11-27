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

### 2. Host Script Setup (Your Computer)

We use a Python script to collect and send data.

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
import subprocess
import json
import os
from datetime import datetime

# --- CONFIGURATION ---
WEBSITE_URL = "https://your-website.vercel.app/api/system-status" 
API_SECRET = "your-generated-secret-key-here" 
# ---------------------

def get_uptime():
    return time.time() - psutil.boot_time()

def main():
    print(f"Starting monitor for {WEBSITE_URL}")
    while True:
        try:
            payload = {
                "cpu": psutil.cpu_percent(interval=1),
                "memory": psutil.virtual_memory().percent,
                "uptime": get_uptime(),
                "timestamp": datetime.now().isoformat(),
            }
            headers = {
                "Authorization": f"Bearer {API_SECRET}",
                "Content-Type": "application/json"
            }
            requests.post(WEBSITE_URL, json=payload, headers=headers)
        except Exception as e:
            print(f"Error: {e}")
        time.sleep(5)

if __name__ == "__main__":
    main()
```

3.  **Run it**:
    ```bash
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
