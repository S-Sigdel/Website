'use client';

import { useEffect, useRef, useState } from 'react';

export default function MiniGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<'start' | 'playing' | 'gameover'>('start');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [streak, setStreak] = useState(0);
  
  // Game state refs
  const playerRef = useRef({ x: 50, y: 100, velocity: 0, radius: 10, rotation: 0 });
  const collectiblesRef = useRef<{x: number, y: number, id: number, collected: boolean}[]>([]);
  const streakRef = useRef(0);

  // Load High Score
  useEffect(() => {
    const saved = localStorage.getItem('minigame-highscore');
    if (saved) setHighScore(parseInt(saved));
  }, []);

  // Save High Score
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('minigame-highscore', score.toString());
    }
  }, [score, highScore]);

  const handleJump = () => {
    if (gameState === 'playing') {
      playerRef.current.velocity = -3.5; // JUMP force
    } else if (gameState === 'start') {
      setGameState('playing');
    } else if (gameState === 'gameover') {
      setGameState('start');
    }
  };

  // Input handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent capturing keys if user is typing in an input (like the Terminal)
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
  }, [gameState]);

  // Main Game Loop Effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let obstacles: { x: number; topHeight: number; passed: boolean }[] = [];
    let frameCount = 0;
    let currentScore = 0;

    // Game Constants
    const OBSTACLE_GAP = 70; // Slightly wider for better playability with coins
    const OBSTACLE_WIDTH = 30;
    const PLAYER_RADIUS = 10;
    const GRAVITY = 0.25;
    const JUMP_FORCE = -3.5;
    const SPEED = 2.5;

    // Reset player on start
    if (gameState === 'playing') {
        playerRef.current = { x: 50, y: canvas.height / 2, velocity: JUMP_FORCE, radius: PLAYER_RADIUS, rotation: 0 };
        collectiblesRef.current = [];
        streakRef.current = 0;
        setStreak(0);
        setScore(0);
    }

    const render = () => {
      // Clear with dark background
      ctx.fillStyle = '#11111b'; // Crust/Mantle
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw Grid Background (GD Style)
      ctx.strokeStyle = '#313244'; // Surface0
      ctx.lineWidth = 1;
      const gridSize = 20;
      const offset = (frameCount * SPEED) % gridSize;
      
      ctx.beginPath();
      for (let x = -offset; x < canvas.width; x += gridSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
      }
      ctx.stroke();

      if (gameState === 'start') {
         // Bobbing animation
         const bobY = (canvas.height / 2) + Math.sin(frameCount * 0.1) * 5;
         
         ctx.fillStyle = '#cba6f7';
         ctx.font = '12px monospace';
         ctx.textAlign = 'center';
         ctx.fillText('PRESS SPACE OR TAP', canvas.width / 2, canvas.height / 2 + 30);
         
         // Draw Player (Pacman)
         ctx.save();
         ctx.translate(50, bobY);
         ctx.beginPath();
         const mouthOpen = Math.abs(Math.sin(frameCount * 0.2)) * 0.2 * Math.PI;
         ctx.arc(0, 0, PLAYER_RADIUS, mouthOpen, 2 * Math.PI - mouthOpen);
         ctx.lineTo(0, 0);
         ctx.fillStyle = '#fab387'; // Peach
         ctx.fill();
         ctx.restore();

         frameCount++;
         animationId = requestAnimationFrame(render);
         return;
      } 
      
      if (gameState === 'gameover') {
         ctx.fillStyle = '#f38ba8';
         ctx.font = 'bold 16px monospace';
         ctx.textAlign = 'center';
         ctx.fillText('CRASHED', canvas.width / 2, canvas.height / 2 - 15);
         ctx.fillStyle = '#cba6f7';
         ctx.font = '12px monospace';
         ctx.fillText(`Score: ${score}`, canvas.width / 2, canvas.height / 2 + 10);
         ctx.fillText('Press SPACE to restart', canvas.width / 2, canvas.height / 2 + 25);
         return;
      }

      // Game Loop (Playing)
      // Physics
      playerRef.current.velocity += GRAVITY;
      playerRef.current.y += playerRef.current.velocity;
      
      // Rotation based on velocity
      playerRef.current.rotation = Math.min(Math.PI / 4, Math.max(-Math.PI / 4, (playerRef.current.velocity * 0.1)));

      // Spawn Obstacles
      if (frameCount % 90 === 0) {
        const minHeight = 20;
        const maxHeight = canvas.height - OBSTACLE_GAP - minHeight;
        const topHeight = Math.floor(Math.random() * (maxHeight - minHeight + 1)) + minHeight;
        obstacles.push({ x: canvas.width, topHeight, passed: false });
        
        // Chance to spawn collectible
        if (Math.random() > 0.25) {
            // Ensure coin is accessible within the gap
            // Padding of 15px from top and bottom of gap to avoid being too close to pillars
            const safePadding = 15;
            const minCoinY = topHeight + safePadding;
            const maxCoinY = topHeight + OBSTACLE_GAP - safePadding;
            const coinY = Math.random() * (maxCoinY - minCoinY) + minCoinY;
            
            collectiblesRef.current.push({ 
                x: canvas.width + OBSTACLE_WIDTH/2, // Center in the obstacle width
                y: coinY, 
                id: Date.now(),
                collected: false
            });
        }
      }

      // Update Obstacles
      obstacles.forEach((obs, index) => {
        obs.x -= SPEED;
        if (obs.x + OBSTACLE_WIDTH < 0) obstacles.splice(index, 1);

        // Collision (Circle vs Rect)
        if (
          playerRef.current.x + PLAYER_RADIUS > obs.x &&
          playerRef.current.x - PLAYER_RADIUS < obs.x + OBSTACLE_WIDTH &&
          (playerRef.current.y - PLAYER_RADIUS < obs.topHeight || playerRef.current.y + PLAYER_RADIUS > obs.topHeight + OBSTACLE_GAP)
        ) {
            setGameState('gameover');
        }

        // Score for passing
        if (!obs.passed && playerRef.current.x > obs.x + OBSTACLE_WIDTH) {
          obs.passed = true;
          currentScore++;
          setScore(currentScore);
        }

        // Draw Obstacles (Neon Blocks)
        ctx.fillStyle = '#1e1e2e'; // Base
        ctx.strokeStyle = '#a6e3a1'; // Green Neon
        ctx.lineWidth = 2;
        
        // Top
        ctx.fillRect(obs.x, 0, OBSTACLE_WIDTH, obs.topHeight);
        ctx.strokeRect(obs.x, 0, OBSTACLE_WIDTH, obs.topHeight);
        
        // Bottom
        ctx.fillRect(obs.x, obs.topHeight + OBSTACLE_GAP, OBSTACLE_WIDTH, canvas.height - (obs.topHeight + OBSTACLE_GAP));
        ctx.strokeRect(obs.x, obs.topHeight + OBSTACLE_GAP, OBSTACLE_WIDTH, canvas.height - (obs.topHeight + OBSTACLE_GAP));
      });

      // Update Collectibles
      for (let i = collectiblesRef.current.length - 1; i >= 0; i--) {
          const coin = collectiblesRef.current[i];
          coin.x -= SPEED;
          
          // Remove if off screen
          if (coin.x < -20) {
              if (!coin.collected) {
                  // Missed a coin, reset streak
                  streakRef.current = 0;
                  setStreak(0);
              }
              collectiblesRef.current.splice(i, 1);
              continue;
          }

          if (coin.collected) continue;

          // Collision with Player
          const dx = playerRef.current.x - coin.x;
          const dy = playerRef.current.y - coin.y;
          const distance = Math.sqrt(dx*dx + dy*dy);
          
          if (distance < (PLAYER_RADIUS + 8)) { // 8 is coin radius
              coin.collected = true;
              collectiblesRef.current.splice(i, 1);
              
              // Streak Logic
              streakRef.current += 1;
              setStreak(streakRef.current);
              
              // Score calculation: 2, 4, 6, 8, 10 (max)
              const bonus = Math.min(streakRef.current * 2, 10);
              currentScore += bonus;
              setScore(currentScore);
          }

          // Draw Coin
          ctx.beginPath();
          ctx.arc(coin.x, coin.y, 5, 0, Math.PI * 2);
          ctx.fillStyle = '#f9e2af'; // Gold
          ctx.fill();
          ctx.strokeStyle = '#fab387';
          ctx.lineWidth = 2;
          ctx.stroke();
      }

      // Bounds
      if (playerRef.current.y + PLAYER_RADIUS > canvas.height || playerRef.current.y - PLAYER_RADIUS < 0) {
        setGameState('gameover');
      }

      // Draw Player (Pacman)
      ctx.save();
      ctx.translate(playerRef.current.x, playerRef.current.y);
      ctx.rotate(playerRef.current.rotation);
      ctx.beginPath();
      const mouthOpen = Math.abs(Math.sin(frameCount * 0.2)) * 0.2 * Math.PI;
      ctx.arc(0, 0, PLAYER_RADIUS, mouthOpen, 2 * Math.PI - mouthOpen);
      ctx.lineTo(0, 0);
      ctx.fillStyle = '#fab387';
      ctx.fill();
      ctx.restore();

      // Score Display
      ctx.fillStyle = '#cba6f7';
      ctx.font = 'bold 16px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`Score: ${currentScore}`, 10, 20);
      
      // Streak Display
      if (streakRef.current > 0) {
          ctx.fillStyle = '#fab387';
          ctx.font = '12px monospace';
          ctx.fillText(`Streak: ${streakRef.current}x`, 10, 35);
      }

      frameCount++;
      animationId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationId);
  }, [gameState]);

  return (
    <div className="mt-6 border-2 border-mauve rounded bg-base overflow-hidden font-mono text-xs select-none shadow-[0_0_15px_rgba(203,166,247,0.15)]">
      {/* Title Bar */}
      <div className="bg-mauve/10 border-b border-mauve/20 p-1.5 flex items-center justify-between px-3">
        <div className="text-mauve font-bold text-[10px]">~ [GAME] ./pac-flap</div>
        <div className="text-overlay1 text-[10px]">high-score: {highScore}</div>
      </div>

      {/* Game Canvas */}
      <div className="relative bg-base" onClick={handleJump} onTouchStart={(e) => { e.preventDefault(); handleJump(); }}>
        <canvas 
            ref={canvasRef} 
            width={600} 
            height={240} 
            className="w-full h-full block cursor-pointer touch-none"
        />
      </div>

      {/* Status Bar */}
      <div className="bg-surface0/50 border-t border-surface1 p-1.5 px-3 text-[10px] text-overlay1 flex justify-between">
         <span className="text-green">{gameState === 'playing' ? 'running...' : gameState === 'gameover' ? 'crashed!' : 'ready'}</span>
         <span>(game)</span>
      </div>
    </div>
  );
}