'use client';

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';

// Game Constants (tuned per tick; the loop runs a fixed 60 ticks/sec so the
// game plays at the same speed on 60Hz and high refresh rate screens)
const W = 600;
const H = 240;
const TICK_MS = 1000 / 60;
const MAX_FRAME_MS = 250; // Avoid a burst of catch-up ticks after a tab switch
const SPEED = 1.5;
const OBSTACLE_GAP = 70;
const OBSTACLE_WIDTH = 30;
const OBSTACLE_SPACING = 162; // Distance between pillars in px
const PLAYER_X = 50;
const PLAYER_RADIUS = 10;
const COIN_RADIUS = 5;
const GRAVITY = 0.28;
const JUMP_FORCE = -5.5;

type Obstacle = { x: number; topHeight: number; passed: boolean };
type Coin = { x: number; y: number };
// Best score lives in localStorage; components subscribe to it
const BEST_KEY = 'minigame-highscore';
const BEST_EVENT = 'pacflap-best';

function subscribeBest(onChange: () => void) {
  window.addEventListener('storage', onChange);
  window.addEventListener(BEST_EVENT, onChange);
  return () => {
    window.removeEventListener('storage', onChange);
    window.removeEventListener(BEST_EVENT, onChange);
  };
}

function readBest() {
  try {
    return parseInt(localStorage.getItem(BEST_KEY) ?? '0') || 0;
  } catch {
    return 0;
  }
}

function saveBest(score: number) {
  try {
    localStorage.setItem(BEST_KEY, String(score));
  } catch {}
  window.dispatchEvent(new Event(BEST_EVENT));
}

// Light/dark scheme, so the canvas repaints with the site's colors
const DARK_QUERY = '(prefers-color-scheme: dark)';

function subscribeScheme(onChange: () => void) {
  const media = window.matchMedia(DARK_QUERY);
  media.addEventListener('change', onChange);
  return () => media.removeEventListener('change', onChange);
}

const getScheme = () => (window.matchMedia(DARK_QUERY).matches ? 'dark' : 'light');

export default function PacFlap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<'start' | 'playing' | 'gameover'>('start');
  const [visible, setVisible] = useState(false);
  const best = useSyncExternalStore(subscribeBest, readBest, () => 0);
  const scheme = useSyncExternalStore(subscribeScheme, getScheme, () => 'light');

  // Run state lives outside React so a run survives pausing off-screen
  const playerRef = useRef({ y: H / 2, velocity: 0, rotation: 0 });
  const obstaclesRef = useRef<Obstacle[]>([]);
  const coinsRef = useRef<Coin[]>([]);
  const streakRef = useRef(0);
  const scoreRef = useRef(0);
  const tickRef = useRef(0);
  const spawnDistanceRef = useRef(0);

  // Only animate while the game is on screen
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleJump = useCallback(() => {
    if (gameState === 'playing') {
      playerRef.current.velocity = JUMP_FORCE;
    } else if (gameState === 'start') {
      playerRef.current = { y: H / 2, velocity: JUMP_FORCE, rotation: 0 };
      obstaclesRef.current = [];
      coinsRef.current = [];
      streakRef.current = 0;
      scoreRef.current = 0;
      tickRef.current = 0;
      spawnDistanceRef.current = OBSTACLE_SPACING; // Spawn the first pillar right away
      setGameState('playing');
    } else {
      setGameState('start');
    }
  }, [gameState]);

  // Space / ArrowUp, but only while the game is on screen so page scrolling still works
  useEffect(() => {
    if (!visible) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const active = document.activeElement;
      if (
        active?.tagName === 'INPUT' ||
        active?.tagName === 'TEXTAREA' ||
        active?.getAttribute('contenteditable') === 'true'
      ) {
        return;
      }

      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        handleJump();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleJump, visible]);

  // Main Game Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw at device resolution so it stays sharp on phones
    const dpr = Math.min(window.devicePixelRatio || 1, 3);
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Monochrome: draw with the site's current theme colors
    const css = getComputedStyle(containerRef.current ?? document.documentElement);
    const color = (name: string, fallback: string) => css.getPropertyValue(name).trim() || fallback;
    const palette = {
      bg: color('--bg', scheme === 'dark' ? '#0b0b0b' : '#ffffff'),
      fg: color('--fg', scheme === 'dark' ? '#ededed' : '#111111'),
      muted: color('--muted', '#6b6b6b'),
      line: color('--line', scheme === 'dark' ? '#232323' : '#e8e8e8'),
    };

    const player = playerRef.current;

    // Advance one tick of the running game; returns false on a crash
    const step = () => {
      player.velocity += GRAVITY;
      player.y += player.velocity;
      player.rotation = Math.min(Math.PI / 4, Math.max(-Math.PI / 4, player.velocity * 0.1));

      spawnDistanceRef.current += SPEED;
      if (spawnDistanceRef.current >= OBSTACLE_SPACING) {
        spawnDistanceRef.current -= OBSTACLE_SPACING;
        const minHeight = 20;
        const maxHeight = H - OBSTACLE_GAP - minHeight;
        const topHeight = Math.floor(Math.random() * (maxHeight - minHeight + 1)) + minHeight;
        obstaclesRef.current.push({ x: W, topHeight, passed: false });

        // Coin somewhere inside the gap, away from the pillar edges
        if (Math.random() > 0.25) {
          const safePadding = 15;
          const minCoinY = topHeight + safePadding;
          const maxCoinY = topHeight + OBSTACLE_GAP - safePadding;
          coinsRef.current.push({
            x: W + OBSTACLE_WIDTH / 2,
            y: Math.random() * (maxCoinY - minCoinY) + minCoinY,
          });
        }
      }

      for (const obs of obstaclesRef.current) {
        obs.x -= SPEED;

        // Collision (Circle vs Rect)
        if (
          PLAYER_X + PLAYER_RADIUS > obs.x &&
          PLAYER_X - PLAYER_RADIUS < obs.x + OBSTACLE_WIDTH &&
          (player.y - PLAYER_RADIUS < obs.topHeight || player.y + PLAYER_RADIUS > obs.topHeight + OBSTACLE_GAP)
        ) {
          return false;
        }

        if (!obs.passed && PLAYER_X > obs.x + OBSTACLE_WIDTH) {
          obs.passed = true;
          scoreRef.current++;
        }
      }
      obstaclesRef.current = obstaclesRef.current.filter(obs => obs.x + OBSTACLE_WIDTH >= 0);

      const coins = coinsRef.current;
      for (let i = coins.length - 1; i >= 0; i--) {
        const coin = coins[i];
        coin.x -= SPEED;

        // Missed a coin, reset streak
        if (coin.x < -20) {
          streakRef.current = 0;
          coins.splice(i, 1);
          continue;
        }

        const dx = PLAYER_X - coin.x;
        const dy = player.y - coin.y;
        if (Math.sqrt(dx * dx + dy * dy) < PLAYER_RADIUS + 8) {
          coins.splice(i, 1);
          // Score calculation: 2, 4, 6, 8, 10 (max)
          streakRef.current += 1;
          scoreRef.current += Math.min(streakRef.current * 2, 10);
        }
      }

      if (player.y + PLAYER_RADIUS > H || player.y - PLAYER_RADIUS < 0) {
        return false;
      }

      tickRef.current++;
      return true;
    };

    const drawBackground = () => {
      ctx.fillStyle = palette.bg;
      ctx.fillRect(0, 0, W, H);

      ctx.strokeStyle = palette.line;
      ctx.lineWidth = 1;
      const gridSize = 20;
      const offset = (tickRef.current * SPEED) % gridSize;
      ctx.beginPath();
      for (let x = -offset; x < W; x += gridSize) {
        ctx.moveTo(x + 0.5, 0);
        ctx.lineTo(x + 0.5, H);
      }
      for (let y = 0; y < H; y += gridSize) {
        ctx.moveTo(0, y + 0.5);
        ctx.lineTo(W, y + 0.5);
      }
      ctx.stroke();
    };

    const drawPlayer = (y: number, rotation: number) => {
      ctx.save();
      ctx.translate(PLAYER_X, y);
      ctx.rotate(rotation);
      ctx.beginPath();
      const mouthOpen = Math.abs(Math.sin(tickRef.current * 0.2)) * 0.2 * Math.PI;
      ctx.arc(0, 0, PLAYER_RADIUS, mouthOpen, 2 * Math.PI - mouthOpen);
      ctx.lineTo(0, 0);
      ctx.fillStyle = palette.fg;
      ctx.fill();
      ctx.restore();
    };

    const drawText = (text: string, y: number, color: string, weight = '') => {
      ctx.fillStyle = color;
      ctx.font = `${weight} 18px ui-monospace, monospace`;
      ctx.textAlign = 'center';
      ctx.fillText(text, W / 2, y);
    };

    const draw = () => {
      drawBackground();

      if (gameState === 'start') {
        drawPlayer(H / 2 + Math.sin(tickRef.current * 0.1) * 5, 0);
        drawText('tap or press space', H / 2 + 42, palette.muted);
        return;
      }

      ctx.fillStyle = palette.bg;
      ctx.strokeStyle = palette.fg;
      ctx.lineWidth = 1.5;
      for (const obs of obstaclesRef.current) {
        const bottomY = obs.topHeight + OBSTACLE_GAP;
        ctx.fillRect(obs.x, -2, OBSTACLE_WIDTH, obs.topHeight + 2);
        ctx.strokeRect(obs.x, -2, OBSTACLE_WIDTH, obs.topHeight + 2);
        ctx.fillRect(obs.x, bottomY, OBSTACLE_WIDTH, H - bottomY + 2);
        ctx.strokeRect(obs.x, bottomY, OBSTACLE_WIDTH, H - bottomY + 2);
      }

      ctx.strokeStyle = palette.fg;
      ctx.lineWidth = 1.5;
      for (const coin of coinsRef.current) {
        ctx.beginPath();
        ctx.arc(coin.x, coin.y, COIN_RADIUS, 0, Math.PI * 2);
        ctx.stroke();
      }

      drawPlayer(player.y, player.rotation);

      ctx.fillStyle = palette.fg;
      ctx.font = '600 18px ui-monospace, monospace';
      ctx.textAlign = 'left';
      ctx.fillText(String(scoreRef.current), 14, 28);
      if (streakRef.current > 1) {
        ctx.fillStyle = palette.muted;
        ctx.font = '15px ui-monospace, monospace';
        ctx.fillText(`${streakRef.current}x`, 14, 48);
      }
    };

    if (gameState === 'gameover') {
      drawBackground();
      drawText('crashed', H / 2 - 14, palette.fg, '600');
      drawText(`score ${scoreRef.current} · tap to retry`, H / 2 + 18, palette.muted);
      return;
    }

    // Paint a still frame and stay paused while off screen
    draw();
    if (!visible) return;

    let animationId = 0;
    let last = performance.now();
    let accumulator = 0;

    const frame = (now: number) => {
      accumulator += Math.min(now - last, MAX_FRAME_MS);
      last = now;

      while (accumulator >= TICK_MS) {
        accumulator -= TICK_MS;
        if (gameState === 'playing') {
          if (!step()) {
            if (scoreRef.current > readBest()) saveBest(scoreRef.current);
            setGameState('gameover');
            return;
          }
        } else {
          tickRef.current++;
        }
      }

      draw();
      animationId = requestAnimationFrame(frame);
    };

    animationId = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(animationId);
  }, [gameState, visible, scheme]);

  return (
    <div ref={containerRef} className="select-none">
      <div
        className="overflow-hidden rounded-lg border border-line"
        onClick={handleJump}
        onTouchStart={(e) => { e.preventDefault(); handleJump(); }}
      >
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          aria-label="Pac-Man flappy mini game"
          className="block w-full aspect-[5/2] cursor-pointer touch-none"
        />
      </div>
      <div className="mt-2 flex justify-between font-mono text-xs text-muted">
        <span>pac-flap</span>
        <span>best {best}</span>
      </div>
    </div>
  );
}
