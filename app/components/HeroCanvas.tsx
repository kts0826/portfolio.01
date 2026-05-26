'use client';
import { useEffect, useRef } from 'react';

type V3 = [number, number, number];

function rotY(p: V3, a: number): V3 {
  return [p[0]*Math.cos(a)+p[2]*Math.sin(a), p[1], -p[0]*Math.sin(a)+p[2]*Math.cos(a)];
}
function rotX(p: V3, a: number): V3 {
  return [p[0], p[1]*Math.cos(a)-p[2]*Math.sin(a), p[1]*Math.sin(a)+p[2]*Math.cos(a)];
}

// 6-sided outer bipyramid + 6-sided inner bipyramid (52% scale, 30° rotated)
// Index layout: 0=outer top, 1-6=outer eq, 7=outer bottom,
//               8=inner top, 9-14=inner eq, 15=inner bottom
const NO = 6, NI = 6, IS = 0.52, IR = Math.PI / NI;

const VERTS: V3[] = [
  [0, 1.8, 0],
  ...[...Array(NO)].map((_, i) => {
    const a = (i / NO) * Math.PI * 2;
    return [Math.cos(a), 0, Math.sin(a)] as V3;
  }),
  [0, -1.4, 0],
  [0, 1.8 * IS, 0],
  ...[...Array(NI)].map((_, i) => {
    const a = (i / NI) * Math.PI * 2 + IR;
    return [IS * Math.cos(a), 0, IS * Math.sin(a)] as V3;
  }),
  [0, -1.4 * IS, 0],
];

// [v1, v2, baseAlpha]  — total 44 edges
const EDGES: [number, number, number][] = [
  // Outer: top → equatorial (6)
  ...[...Array(NO)].map((_, i) => [0, i + 1, 1.0] as [number, number, number]),
  // Outer: equatorial ring (6)
  ...[...Array(NO)].map((_, i) => [i + 1, (i + 1) % NO + 1, 0.85] as [number, number, number]),
  // Outer: bottom → equatorial (6)
  ...[...Array(NO)].map((_, i) => [NO + 1, i + 1, 1.0] as [number, number, number]),
  // Inner: top → equatorial (6)
  ...[...Array(NI)].map((_, i) => [NO + 2, i + NO + 3, 0.52] as [number, number, number]),
  // Inner: equatorial ring (6)
  ...[...Array(NI)].map((_, i) => [i + NO + 3, (i + 1) % NI + NO + 3, 0.45] as [number, number, number]),
  // Inner: bottom → equatorial (6)
  ...[...Array(NI)].map((_, i) => [NO + NI + 3, i + NO + 3, 0.52] as [number, number, number]),
  // Outer eq → Inner eq connections (6)
  ...[...Array(NO)].map((_, i) => [i + 1, i + NO + 3, 0.28] as [number, number, number]),
  // Axis top/bottom (2)
  [0, NO + 2, 0.25],
  [NO + 1, NO + NI + 3, 0.25],
];

export default function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const rotRef   = useRef({ x: 0.3, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => { canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight; };
    resize();
    window.addEventListener('resize', resize);

    const onMouse = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX / window.innerWidth  - 0.5;
      mouseRef.current.y = e.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener('mousemove', onMouse);

    // Particles orbiting in 3D sphere around the crystal
    const particles = Array.from({ length: 90 }, () => ({
      theta: Math.random() * Math.PI * 2,
      phi:   Math.random() * Math.PI,
      r:     1.5 + Math.random() * 1.0,
      speed: (0.003 + Math.random() * 0.005) * (Math.random() < 0.5 ? 1 : -1),
      size:  Math.random() * 1.6 + 0.4,
    }));

    let raf = 0, t = 0;

    const draw = () => {
      const W = canvas.width, H = canvas.height;
      if (!W || !H) { raf = requestAnimationFrame(draw); return; }

      const CX = W * 0.5, CY = H * 0.5;
      const SC = Math.min(W, H) * 0.22;
      const FOV = 5;

      ctx.clearRect(0, 0, W, H);

      // Smooth rotation: mouse controls tilt, auto-spin on Y
      rotRef.current.x += (mouseRef.current.y * 0.9  + 0.3          - rotRef.current.x) * 0.05;
      rotRef.current.y += (mouseRef.current.x * 1.4  + t * 0.8      - rotRef.current.y) * 0.05;

      const ax = rotRef.current.x, ay = rotRef.current.y;

      const project = (v: V3): [number, number, number] => {
        let q = rotY(v, ay);
        q = rotX(q, ax);
        const s = FOV / (FOV + q[2]);
        return [CX + q[0] * SC * s, CY - q[1] * SC * s, q[2]];
      };

      const proj = VERTS.map(project);

      // Sort edges back-to-front
      const sorted = [...EDGES].sort(([a1, b1], [a2, b2]) => {
        const zA = (proj[a1][2] + proj[b1][2]) * 0.5;
        const zB = (proj[a2][2] + proj[b2][2]) * 0.5;
        return zB - zA;
      });

      // Draw edges
      sorted.forEach(([i1, i2, base]) => {
        const [sx1, sy1, z1] = proj[i1];
        const [sx2, sy2, z2] = proj[i2];
        const depth  = 1 - (z1 + z2) * 0.2;
        const alpha  = Math.min(base * Math.max(0.1, depth), 1);
        if (alpha < 0.05) return;

        const bright = alpha > 0.68;
        if (bright) { ctx.shadowColor = '#FF2D00'; ctx.shadowBlur = 12; }
        ctx.strokeStyle = `rgba(255,45,0,${alpha.toFixed(3)})`;
        ctx.lineWidth   = bright ? 1.6 : 0.75;
        ctx.beginPath(); ctx.moveTo(sx1, sy1); ctx.lineTo(sx2, sy2); ctx.stroke();
        ctx.shadowBlur  = 0;
      });

      // Vertex dots
      proj.forEach(([sx, sy, z], vi) => {
        const depth  = Math.max(0, 1 - z * 0.3);
        const outer  = vi <= 5;
        const alpha  = (outer ? 0.95 : 0.55) * depth;
        if (alpha < 0.05) return;
        ctx.beginPath();
        ctx.arc(sx, sy, (outer ? SC * 0.032 : SC * 0.022), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,45,0,${alpha.toFixed(3)})`;
        ctx.fill();
      });

      // Orbiting particles
      particles.forEach((p) => {
        p.theta += p.speed;
        const wx = p.r * Math.sin(p.phi) * Math.cos(p.theta);
        const wy = p.r * Math.cos(p.phi);
        const wz = p.r * Math.sin(p.phi) * Math.sin(p.theta);
        let q = rotY([wx, wy, wz], ay);
        q = rotX(q, ax);
        const s    = FOV / (FOV + q[2]);
        const sx   = CX + q[0] * SC * s;
        const sy   = CY - q[1] * SC * s;
        const dep  = Math.max(0, 1 - q[2] * 0.25);
        ctx.beginPath();
        ctx.arc(sx, sy, p.size * s, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,45,0,${(dep * 0.32).toFixed(3)})`;
        ctx.fill();
      });

      t += 0.006;
      raf = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouse);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ pointerEvents: 'none' }}
    />
  );
}
