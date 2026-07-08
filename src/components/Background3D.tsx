import { useEffect, useRef, useState } from 'react';

interface Particle3D {
  x: number;
  y: number;
  z: number;
  ox: number; // Original x
  oy: number; // Original y
  oz: number; // Original z
  color: string;
  size: number;
}

interface Vertex3D {
  x: number;
  y: number;
  z: number;
}

interface Connection {
  a: number;
  b: number;
}

interface Orb {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
}

interface Background3DProps {
  theme: 'dark' | 'light';
}

export default function Background3D({ theme }: Background3DProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: 0, y: 0, tx: 0, ty: 0 }); // Target and current coordinates for smoothing

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Track resizing
    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Track mouse
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse between -1 and 1
      mouseRef.current.tx = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.ty = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Colors based on theme
    const isDark = theme === 'dark';
    const primaryColor = isDark ? 'rgba(255, 95, 0, ' : 'rgba(255, 95, 0, ';
    const secondaryColor = isDark ? 'rgba(255, 42, 42, ' : 'rgba(255, 42, 42, ';

    // 1. Generate 3D Particles
    const particleCount = 120;
    const particles: Particle3D[] = [];
    for (let i = 0; i < particleCount; i++) {
      // Spherical or block coordinates
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const radius = 200 + Math.random() * 500; // Spread out radially

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      particles.push({
        x,
        y,
        z,
        ox: x,
        oy: y,
        oz: z,
        color: Math.random() > 0.4 ? primaryColor : secondaryColor,
        size: Math.random() * 1.5 + 0.8,
      });
    }

    // 2. Setup 3D Abstract Wireframe (Torus/Sphere structure)
    const vertices: Vertex3D[] = [];
    const connections: Connection[] = [];
    const shapeRadius = 220;
    const rings = 6;
    const pointsPerRing = 12;

    // Generate sphere vertices
    for (let r = 0; r < rings; r++) {
      const phi = (Math.PI * (r + 1)) / (rings + 1);
      const ringRadius = shapeRadius * Math.sin(phi);
      const y = shapeRadius * Math.cos(phi);

      for (let p = 0; p < pointsPerRing; p++) {
        const theta = (Math.PI * 2 * p) / pointsPerRing;
        const x = ringRadius * Math.cos(theta);
        const z = ringRadius * Math.sin(theta);
        vertices.push({ x, y, z });

        // Connect points within the ring
        const currIndex = r * pointsPerRing + p;
        const nextIndexInRing = r * pointsPerRing + ((p + 1) % pointsPerRing);
        connections.push({ a: currIndex, b: nextIndexInRing });

        // Connect points between rings
        if (r < rings - 1) {
          const pointBelow = (r + 1) * pointsPerRing + p;
          connections.push({ a: currIndex, b: pointBelow });
        }
      }
    }

    // 3. Generate Large Slow Ambient Floating Orbs
    const orbs: Orb[] = [
      {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.min(width, height) * 0.35,
        color: isDark ? 'rgba(255, 95, 0, 0.035)' : 'rgba(255, 95, 0, 0.05)',
      },
      {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.min(width, height) * 0.4,
        color: isDark ? 'rgba(255, 42, 42, 0.025)' : 'rgba(255, 42, 42, 0.04)',
      },
      {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.min(width, height) * 0.3,
        color: isDark ? 'rgba(255, 120, 0, 0.02)' : 'rgba(255, 120, 0, 0.03)',
      },
    ];

    // Rotation matrices
    let rotX = 0.001;
    let rotY = 0.0015;
    let rotZ = 0.0008;

    // View distance
    const fov = 400;

    // Animation loop
    const tick = () => {
      // Clear background
      ctx.fillStyle = isDark ? '#030303' : '#f9f9f9';
      ctx.fillRect(0, 0, width, height);

      // Smooth mouse coordinates with spring effect
      const m = mouseRef.current;
      m.x += (m.tx - m.x) * 0.06;
      m.y += (m.ty - m.y) * 0.06;

      // Draw Ambient Orbs
      orbs.forEach((orb) => {
        orb.x += orb.vx;
        orb.y += orb.vy;

        // Bounce off bounds
        if (orb.x < -orb.size) orb.x = width + orb.size;
        if (orb.x > width + orb.size) orb.x = -orb.size;
        if (orb.y < -orb.size) orb.y = height + orb.size;
        if (orb.y > height + orb.size) orb.y = -orb.size;

        const grad = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.size);
        grad.addColorStop(0, orb.color);
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Update rotation angles dynamically based on mouse
      const currentRotX = rotX + m.y * 0.0015;
      const currentRotY = rotY + m.x * 0.0015;

      const cosX = Math.cos(currentRotX);
      const sinX = Math.sin(currentRotX);
      const cosY = Math.cos(currentRotY);
      const sinY = Math.sin(currentRotY);
      const cosZ = Math.cos(rotZ);
      const sinZ = Math.sin(rotZ);

      // Project 3D coordinate function
      const project = (x: number, y: number, z: number) => {
        // Apply 3D Rotations
        // Rotate Y
        let x1 = x * cosY - z * sinY;
        let z1 = x * sinY + z * cosY;

        // Rotate X
        let y2 = y * cosX - z1 * sinX;
        let z2 = y * sinX + z1 * cosX;

        // Rotate Z
        let x3 = x1 * cosZ - y2 * sinZ;
        let y3 = x1 * sinZ + y2 * cosZ;

        // Apply mouse-based parallax offset to depth
        z2 += 500 + m.x * 100; // Push or pull depth slightly

        // 3D Perspective Projection
        const scale = fov / (fov + z2);
        const projX = x3 * scale + width / 2;
        const projY = y3 * scale + height / 2;

        return { x: projX, y: projY, scale, depth: z2 };
      };

      // Draw Rotating abstract wireframe shape in the center (large background structure)
      ctx.lineWidth = 1;
      connections.forEach((conn) => {
        const p1 = project(vertices[conn.a].x, vertices[conn.a].y, vertices[conn.a].z);
        const p2 = project(vertices[conn.b].x, vertices[conn.b].y, vertices[conn.b].z);

        // Filter out extreme points that could cause rendering glitches
        if (
          p1.x > -100 &&
          p1.x < width + 100 &&
          p1.y > -100 &&
          p1.y < height + 100 &&
          p2.x > -100 &&
          p2.x < width + 100 &&
          p2.y > -100 &&
          p2.y < height + 100
        ) {
          // Fade based on average depth (z-index buffer)
          const avgDepth = (p1.depth + p2.depth) / 2;
          const alpha = Math.max(0.01, Math.min(0.15, (400 / avgDepth) * 0.15));

          ctx.strokeStyle = isDark ? `rgba(255, 95, 0, ${alpha})` : `rgba(255, 95, 0, ${alpha * 0.6})`;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      });

      // Slowly rotate shape vertices in 3D
      const shapeCosY = Math.cos(0.002);
      const shapeSinY = Math.sin(0.002);
      const shapeCosX = Math.cos(0.001);
      const shapeSinX = Math.sin(0.001);

      vertices.forEach((v) => {
        // Rotate Y
        const x1 = v.x * shapeCosY - v.z * shapeSinY;
        const z1 = v.x * shapeSinY + v.z * shapeCosY;
        // Rotate X
        v.x = x1;
        v.y = v.y * shapeCosX - z1 * shapeSinX;
        v.z = v.y * shapeSinX + z1 * shapeCosX;
      });

      // Draw 3D Particles
      particles.forEach((p) => {
        // Rotate points
        // Apply tiny continuous orbit rotation
        const pCos = Math.cos(0.0005);
        const pSin = Math.sin(0.0005);
        const rx = p.x * pCos - p.z * pSin;
        const rz = p.x * pSin + p.z * pCos;
        p.x = rx;
        p.z = rz;

        const proj = project(p.x, p.y, p.z);

        if (proj.x > 0 && proj.x < width && proj.y > 0 && proj.y < height) {
          const alpha = Math.max(0.05, Math.min(0.8, proj.scale * 0.6));
          ctx.fillStyle = `${p.color}${alpha})`;
          ctx.beginPath();
          ctx.arc(proj.x, proj.y, p.size * proj.scale * 2.5, 0, Math.PI * 2);
          ctx.fill();

          // Subtly connect very close projected particles
          particles.forEach((other) => {
            if (other === p) return;
            const dx = other.x - p.x;
            const dy = other.y - p.y;
            const dz = other.z - p.z;
            const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

            if (dist < 120) {
              const otherProj = project(other.x, other.y, other.z);
              const connectionAlpha = Math.max(0, 0.08 - dist / 1500) * proj.scale;
              if (connectionAlpha > 0) {
                ctx.strokeStyle = isDark
                  ? `rgba(255, 255, 255, ${connectionAlpha})`
                  : `rgba(0, 0, 0, ${connectionAlpha})`;
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                ctx.moveTo(proj.x, proj.y);
                ctx.lineTo(otherProj.x, otherProj.y);
                ctx.stroke();
              }
            }
          });
        }
      });

      // Increment overall system angles slightly
      rotZ += 0.0002;

      animationFrameId = requestAnimationFrame(tick);
    };

    tick();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      id="background-3d-canvas"
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
    />
  );
}
