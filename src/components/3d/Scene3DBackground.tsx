import React, { useEffect, useRef } from 'react';

interface Scene3DBackgroundProps {
  accentColor?: string;
  particleDensity?: 'low' | 'normal' | 'high';
}

interface Particle3D {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  size: number;
  baseAlpha: number;
}

export const Scene3DBackground: React.FC<Scene3DBackgroundProps> = ({
  accentColor = '#06b6d4',
  particleDensity = 'normal',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      // Normalize between -1 and 1
      mouseRef.current.targetX = (e.clientX / width - 0.5) * 2;
      mouseRef.current.targetY = (e.clientY / height - 0.5) * 2;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const count = particleDensity === 'low' ? 45 : particleDensity === 'high' ? 95 : 65;
    const particles: Particle3D[] = [];

    for (let i = 0; i < count; i++) {
      particles.push({
        x: (Math.random() - 0.5) * width * 1.5,
        y: (Math.random() - 0.5) * height * 1.5,
        z: Math.random() * 800 + 200,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        vz: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 1,
        baseAlpha: Math.random() * 0.4 + 0.15,
      });
    }

    const focalLength = 400;

    const render = () => {
      // Smooth mouse lerp
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      ctx.clearRect(0, 0, width, height);

      // Deep radial background gradient
      const bgGrad = ctx.createRadialGradient(
        width * 0.5 + mouseRef.current.x * 50,
        height * 0.4 + mouseRef.current.y * 50,
        100,
        width * 0.5,
        height * 0.5,
        Math.max(width, height) * 0.8
      );
      bgGrad.addColorStop(0, 'rgba(13, 20, 36, 0.4)');
      bgGrad.addColorStop(0.5, 'rgba(9, 13, 22, 0.6)');
      bgGrad.addColorStop(1, 'rgba(7, 9, 14, 0.95)');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Ambient subtle accent orb
      const orbGrad = ctx.createRadialGradient(
        width * 0.75 + mouseRef.current.x * 60,
        height * 0.25 + mouseRef.current.y * 40,
        20,
        width * 0.75,
        height * 0.25,
        500
      );
      orbGrad.addColorStop(0, `${accentColor}18`);
      orbGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = orbGrad;
      ctx.fillRect(0, 0, width, height);

      const projected: { x: number; y: number; scale: number; alpha: number }[] = [];

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Update positions with subtle floating
        p.x += p.vx;
        p.y += p.vy;
        p.z += p.vz;

        // Boundaries reset
        if (p.z < 100) p.z = 1000;
        if (p.z > 1000) p.z = 100;
        if (p.x < -width) p.x = width;
        if (p.x > width) p.x = -width;
        if (p.y < -height) p.y = height;
        if (p.y > height) p.y = -height;

        // Parallax offset
        const parallaxX = p.x - mouseRef.current.x * 80;
        const parallaxY = p.y - mouseRef.current.y * 80;

        const scale = focalLength / (focalLength + p.z);
        const projX = width / 2 + parallaxX * scale;
        const projY = height / 2 + parallaxY * scale;

        projected.push({
          x: projX,
          y: projY,
          scale,
          alpha: p.baseAlpha * scale * 1.6,
        });

        // Draw particle
        ctx.beginPath();
        ctx.arc(projX, projY, Math.max(0.6, p.size * scale), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(220, 240, 255, ${Math.min(1, p.baseAlpha * scale * 2.2)})`;
        ctx.fill();
      }

      // Draw faint connection filaments between close particles
      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const dx = projected[i].x - projected[j].x;
          const dy = projected[i].y - projected[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            const lineAlpha = (1 - dist / 120) * 0.12 * projected[i].scale;
            ctx.beginPath();
            ctx.moveTo(projected[i].x, projected[i].y);
            ctx.lineTo(projected[j].x, projected[j].y);
            ctx.strokeStyle = `${accentColor}${Math.floor(lineAlpha * 255).toString(16).padStart(2, '0')}`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [accentColor, particleDensity]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.95 }}
    />
  );
};
