"use client";

import { useEffect, useRef } from "react";

/* Rotating icosahedron-like wireframe in neon green — matches INFINITUM UI */
export function Polyhedron({ size = 140 }: { size?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let frame = 0;
    let raf: number;

    const EDGES = [
      [0,1],[0,2],[0,3],[0,4],[0,5],
      [1,2],[2,3],[3,4],[4,5],[5,1],
      [6,1],[6,2],[7,2],[7,3],[8,3],[8,4],[9,4],[9,5],[10,5],[10,1],
      [6,7],[7,8],[8,9],[9,10],[10,6],
      [6,11],[7,11],[8,11],[9,11],[10,11],
    ];

    const phi = (1 + Math.sqrt(5)) / 2;
    const VERTS = [
      [0,1,phi],[0,-1,phi],[0,1,-phi],[0,-1,-phi],
      [1,phi,0],[-1,phi,0],[1,-phi,0],[-1,-phi,0],
      [phi,0,1],[phi,0,-1],[-phi,0,1],[-phi,0,-1],
    ].map(([x,y,z]) => {
      const n = Math.sqrt(x*x+y*y+z*z);
      return [x/n, y/n, z/n];
    });

    function project([x,y,z]: number[], angle: number): [number,number] {
      const cos = Math.cos(angle), sin = Math.sin(angle);
      const rx = cos*x - sin*z;
      const rz = sin*x + cos*z;
      const ry = y;
      const angle2 = angle * 0.37;
      const cos2 = Math.cos(angle2), sin2 = Math.sin(angle2);
      const ry2 = cos2*ry - sin2*rz;
      const rz2 = sin2*ry + cos2*rz;
      const d = 3.5;
      const scale = size * 0.44 * (d / (d + rz2));
      return [size/2 + rx * scale, size/2 + ry2 * scale];
    }

    function draw() {
      ctx.clearRect(0, 0, size, size);
      const angle = frame * 0.008;

      EDGES.forEach(([a,b]) => {
        const [x1,y1] = project(VERTS[a], angle);
        const [x2,y2] = project(VERTS[b], angle);
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = "rgba(57,255,20,0.55)";
        ctx.lineWidth = 0.8;
        ctx.stroke();
      });

      VERTS.forEach((v) => {
        const [x,y] = project(v, angle);
        ctx.beginPath();
        ctx.arc(x, y, 1.5, 0, Math.PI*2);
        ctx.fillStyle = "rgba(57,255,20,0.9)";
        ctx.fill();
      });

      frame++;
      raf = requestAnimationFrame(draw);
    }

    draw();
    return () => cancelAnimationFrame(raf);
  }, [size]);

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      style={{ filter: "drop-shadow(0 0 8px rgba(57,255,20,0.5))" }}
    />
  );
}
