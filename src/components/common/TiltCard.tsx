import React, { useRef, useState, useCallback } from 'react';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  maxTilt?: number;
  elevateOnHover?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export const TiltCard: React.FC<TiltCardProps> = ({
  children,
  className = '',
  glowColor = 'rgba(6, 182, 212, 0.15)',
  maxTilt = 8,
  elevateOnHover = true,
  onClick,
  style = {},
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [sheen, setSheen] = useState({ x: 50, y: 50, opacity: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Compute tilt angles
      const rotateX = ((y - centerY) / centerY) * -maxTilt;
      const rotateY = ((x - centerX) / centerX) * maxTilt;

      // Sheen coordinate percentage
      const sheenX = (x / rect.width) * 100;
      const sheenY = (y / rect.height) * 100;

      setTilt({ x: rotateX, y: rotateY });
      setSheen({ x: sheenX, y: sheenY, opacity: 0.18 });
    },
    [maxTilt]
  );

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
    setSheen((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative perspective-1000 select-none transition-transform duration-200 ease-out ${className}`}
      style={{
        transformStyle: 'preserve-3d',
        ...style,
      }}
    >
      <div
        className="w-full h-full rounded-2xl glass-panel relative overflow-hidden transition-all duration-300 ease-out"
        style={{
          transform: `rotateX(${tilt.x.toFixed(2)}deg) rotateY(${tilt.y.toFixed(2)}deg) ${
            isHovered && elevateOnHover ? 'translateZ(12px) scale3d(1.015, 1.015, 1.015)' : 'translateZ(0px)'
          }`,
          boxShadow: isHovered
            ? `0 24px 48px -12px rgba(0, 0, 0, 0.7), 0 0 24px 0 ${glowColor}, inset 0 1px 0 rgba(255, 255, 255, 0.2)`
            : '0 10px 30px -10px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
          borderColor: isHovered ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.08)',
        }}
      >
        {/* Specular glare dynamic highlight */}
        <div
          className="pointer-events-none absolute inset-0 z-30 transition-opacity duration-300"
          style={{
            opacity: sheen.opacity,
            background: `radial-gradient(circle at ${sheen.x}% ${sheen.y}%, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0) 60%)`,
            mixBlendMode: 'overlay',
          }}
        />

        {/* Ambient neon rim highlight */}
        <div
          className="pointer-events-none absolute -inset-px rounded-2xl transition-opacity duration-500"
          style={{
            opacity: isHovered ? 0.35 : 0,
            background: `radial-gradient(400px circle at ${sheen.x}% ${sheen.y}%, ${glowColor}, transparent 40%)`,
          }}
        />

        {/* Card content container with 3D preservation */}
        <div className="relative z-10 w-full h-full transform-style-3d">
          {children}
        </div>
      </div>
    </div>
  );
};
