import React, { useRef, useEffect, useState } from 'react';
import { Layers, RotateCcw, Cpu, Zap, Activity } from 'lucide-react';

interface HologramViewerProps {
  accentColor?: string;
  className?: string;
}

interface Point3D {
  x: number;
  y: number;
  z: number;
}

export const HologramViewer: React.FC<HologramViewerProps> = ({
  accentColor = '#06b6d4',
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeMode, setActiveMode] = useState<'topology' | 'flux' | 'sphere'>('topology');
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [stats, setStats] = useState({
    activeThreads: 4096,
    throughput: '842.6 GB/s',
    integrity: '99.99%',
  });

  const stateRef = useRef({
    rotX: 0.35,
    rotY: 0.6,
    rotZ: 0,
    speed: 0.008,
    isDragging: false,
    lastMouseX: 0,
    lastMouseY: 0,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const size = 320;
    canvas.width = size * window.devicePixelRatio;
    canvas.height = size * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    // Generate geometry vertices
    const getVertices = (): { vertices: Point3D[]; edges: [number, number][] } => {
      if (activeMode === 'sphere') {
        const vertices: Point3D[] = [];
        const edges: [number, number][] = [];
        const rings = 6;
        const ptsPerRing = 12;
        const radius = 88;

        for (let r = 0; r < rings; r++) {
          const phi = (Math.PI * (r + 1)) / (rings + 1);
          for (let p = 0; p < ptsPerRing; p++) {
            const theta = (2 * Math.PI * p) / ptsPerRing;
            vertices.push({
              x: radius * Math.sin(phi) * Math.cos(theta),
              y: radius * Math.cos(phi),
              z: radius * Math.sin(phi) * Math.sin(theta),
            });
          }
        }
        // Connect ring neighbors
        for (let r = 0; r < rings; r++) {
          const offset = r * ptsPerRing;
          for (let p = 0; p < ptsPerRing; p++) {
            const nextP = (p + 1) % ptsPerRing;
            edges.push([offset + p, offset + nextP]);
            if (r < rings - 1) {
              edges.push([offset + p, offset + ptsPerRing + p]);
            }
          }
        }
        return { vertices, edges };
      }

      if (activeMode === 'flux') {
        // Double ring toroid
        const vertices: Point3D[] = [];
        const edges: [number, number][] = [];
        const R = 85;
        const r = 32;
        const uSteps = 12;
        const vSteps = 6;

        for (let u = 0; u < uSteps; u++) {
          const theta = (2 * Math.PI * u) / uSteps;
          for (let v = 0; v < vSteps; v++) {
            const phi = (2 * Math.PI * v) / vSteps;
            vertices.push({
              x: (R + r * Math.cos(phi)) * Math.cos(theta),
              y: (R + r * Math.cos(phi)) * Math.sin(theta),
              z: r * Math.sin(phi),
            });
          }
        }
        for (let u = 0; u < uSteps; u++) {
          for (let v = 0; v < vSteps; v++) {
            const idx = u * vSteps + v;
            const nextV = u * vSteps + ((v + 1) % vSteps);
            const nextU = ((u + 1) % uSteps) * vSteps + v;
            edges.push([idx, nextV]);
            edges.push([idx, nextU]);
          }
        }
        return { vertices, edges };
      }

      // Default Topology: Nested Cubes / Octahedron with core node
      const s1 = 80;
      const s2 = 45;
      const vertices: Point3D[] = [
        // Outer cube
        { x: -s1, y: -s1, z: -s1 },
        { x: s1, y: -s1, z: -s1 },
        { x: s1, y: s1, z: -s1 },
        { x: -s1, y: s1, z: -s1 },
        { x: -s1, y: -s1, z: s1 },
        { x: s1, y: -s1, z: s1 },
        { x: s1, y: s1, z: s1 },
        { x: -s1, y: s1, z: s1 },
        // Inner cube
        { x: -s2, y: -s2, z: -s2 },
        { x: s2, y: -s2, z: -s2 },
        { x: s2, y: s2, z: -s2 },
        { x: -s2, y: s2, z: -s2 },
        { x: -s2, y: -s2, z: s2 },
        { x: s2, y: -s2, z: s2 },
        { x: s2, y: s2, z: s2 },
        { x: -s2, y: s2, z: s2 },
        // Center core
        { x: 0, y: 0, z: 0 },
      ];

      const edges: [number, number][] = [
        // Outer box
        [0, 1], [1, 2], [2, 3], [3, 0],
        [4, 5], [5, 6], [6, 7], [7, 4],
        [0, 4], [1, 5], [2, 6], [3, 7],
        // Inner box
        [8, 9], [9, 10], [10, 11], [11, 8],
        [12, 13], [13, 14], [14, 15], [15, 12],
        [8, 12], [9, 13], [10, 14], [11, 15],
        // Cross connections to inner
        [0, 8], [2, 10], [5, 13], [7, 15],
      ];

      return { vertices, edges };
    };

    const { vertices, edges } = getVertices();
    const fov = 350;

    const render = () => {
      const state = stateRef.current;
      if (isAutoRotating) {
        state.rotY += state.speed;
        state.rotX += state.speed * 0.4;
      }

      ctx.clearRect(0, 0, size, size);

      const cx = size / 2;
      const cy = size / 2;

      // Project vertices
      const cosX = Math.cos(state.rotX);
      const sinX = Math.sin(state.rotX);
      const cosY = Math.cos(state.rotY);
      const sinY = Math.sin(state.rotY);

      const projected = vertices.map((v) => {
        // Y rotation
        const x1 = v.x * cosY + v.z * sinY;
        const z1 = -v.x * sinY + v.z * cosY;

        // X rotation
        const y2 = v.y * cosX - z1 * sinX;
        const z2 = v.y * sinX + z1 * cosX;

        // Projection
        const scale = fov / (fov + z2 + 250);
        return {
          x: cx + x1 * scale,
          y: cy + y2 * scale,
          z: z2,
          scale,
        };
      });

      // Ambient circular grid ring in background
      ctx.beginPath();
      ctx.arc(cx, cy, 120, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(cx, cy, 70, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
      ctx.setLineDash([4, 6]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw Edges
      for (const [i, j] of edges) {
        const p1 = projected[i];
        const p2 = projected[j];
        if (!p1 || !p2) continue;

        const avgZ = (p1.z + p2.z) / 2;
        const alpha = Math.max(0.12, Math.min(0.85, 0.45 + avgZ / 300));

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = `${accentColor}${Math.floor(alpha * 220).toString(16).padStart(2, '0')}`;
        ctx.lineWidth = Math.max(0.8, 1.2 * ((p1.scale + p2.scale) / 2));
        ctx.stroke();
      }

      // Draw Vertices (nodes)
      for (let i = 0; i < projected.length; i++) {
        const p = projected[i];
        const nodeAlpha = Math.max(0.2, Math.min(1, 0.6 + p.z / 300));
        const radius = Math.max(1.8, 3.2 * p.scale);

        // Outer glow
        const radGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, radius * 3);
        radGrad.addColorStop(0, `${accentColor}aa`);
        radGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = radGrad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius * 3, 0, Math.PI * 2);
        ctx.fill();

        // Core dot
        ctx.fillStyle = `rgba(255, 255, 255, ${nodeAlpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [activeMode, isAutoRotating, accentColor]);

  // Pointer interactions
  const handleMouseDown = (e: React.MouseEvent) => {
    stateRef.current.isDragging = true;
    stateRef.current.lastMouseX = e.clientX;
    stateRef.current.lastMouseY = e.clientY;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!stateRef.current.isDragging) return;
    const dx = e.clientX - stateRef.current.lastMouseX;
    const dy = e.clientY - stateRef.current.lastMouseY;

    stateRef.current.rotY += dx * 0.008;
    stateRef.current.rotX += dy * 0.008;

    stateRef.current.lastMouseX = e.clientX;
    stateRef.current.lastMouseY = e.clientY;
  };

  const handleMouseUp = () => {
    stateRef.current.isDragging = false;
  };

  const resetOrientation = () => {
    stateRef.current.rotX = 0.35;
    stateRef.current.rotY = 0.6;
  };

  return (
    <div className={`relative flex flex-col items-center justify-between p-4 ${className}`}>
      {/* Top Header bar with clean typography & segmented control */}
      <div className="w-full flex items-center justify-between z-10 pb-2 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: accentColor }} />
          <span className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
            Spatial Core Mesh
          </span>
          <span className="text-[11px] text-slate-400 font-mono">3D Projection</span>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1 bg-black/40 border border-white/10 rounded-lg p-0.5">
          <button
            onClick={() => setActiveMode('topology')}
            className={`px-2 py-0.5 text-[11px] font-medium rounded transition-colors ${
              activeMode === 'topology'
                ? 'bg-white/15 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Mesh
          </button>
          <button
            onClick={() => setActiveMode('flux')}
            className={`px-2 py-0.5 text-[11px] font-medium rounded transition-colors ${
              activeMode === 'flux'
                ? 'bg-white/15 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Torus
          </button>
          <button
            onClick={() => setActiveMode('sphere')}
            className={`px-2 py-0.5 text-[11px] font-medium rounded transition-colors ${
              activeMode === 'sphere'
                ? 'bg-white/15 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Sphere
          </button>
        </div>
      </div>

      {/* Canvas 3D Viewport */}
      <div
        className="relative w-full aspect-square max-w-[280px] flex items-center justify-center cursor-grab active:cursor-grabbing my-1"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        title="Click and drag to rotate the 3D topology"
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full object-contain pointer-events-none drop-shadow-[0_0_25px_rgba(6,182,212,0.18)]"
        />

        {/* Quick Rotation Reset Button */}
        <button
          onClick={resetOrientation}
          title="Reset View Orientation"
          className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-black/50 border border-white/10 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        {/* Toggle Auto Spin */}
        <button
          onClick={() => setIsAutoRotating(!isAutoRotating)}
          title={isAutoRotating ? 'Pause Rotation' : 'Resume Auto Spin'}
          className={`absolute bottom-2 left-2 px-2 py-1 rounded-lg text-[10px] font-mono border transition-all ${
            isAutoRotating
              ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300'
              : 'bg-black/50 border-white/10 text-slate-400'
          }`}
        >
          {isAutoRotating ? 'ORBIT: ACTIVE' : 'ORBIT: PAUSED'}
        </button>
      </div>

      {/* Bottom Live Metrics */}
      <div className="w-full grid grid-cols-3 gap-2 pt-2 border-t border-white/5 text-center">
        <div>
          <div className="text-[10px] text-slate-400">Shards</div>
          <div className="text-xs font-mono font-semibold text-slate-200">1,248</div>
        </div>
        <div>
          <div className="text-[10px] text-slate-400">Flux Rate</div>
          <div className="text-xs font-mono font-semibold text-cyan-300">842 GB/s</div>
        </div>
        <div>
          <div className="text-[10px] text-slate-400">Consensus</div>
          <div className="text-xs font-mono font-semibold text-emerald-400">99.99%</div>
        </div>
      </div>
    </div>
  );
};
