"use client";

import { useEffect, useRef, useState } from "react";
import { Plus } from "lucide-react";

interface LabNode {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  pulse: number;
}

export function NetworkLab() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const nodesRef = useRef<LabNode[]>([]);
  const animRef = useRef<number | null>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const [count, setCount] = useState(0);

  function seed(width: number, height: number) {
    const nodes: LabNode[] = [];
    const n = width < 640 ? 14 : 22;
    const colors = ["#38BDF8", "#818CF8", "#34D399", "#A855F7"];
    for (let i = 0; i < n; i++) {
      nodes.push({
        id: i,
        x: Math.random() * (width - 80) + 40,
        y: Math.random() * (height - 80) + 40,
        vx: (Math.random() - 0.5) * 0.55,
        vy: (Math.random() - 0.5) * 0.55,
        radius: i % 7 === 0 ? 5 : 3.2,
        color: colors[i % colors.length],
        pulse: Math.random() * Math.PI * 2,
      });
    }
    nodesRef.current = nodes;
    setCount(nodes.length);
  }

  function addNode(clientX?: number, clientY?: number) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x =
      clientX != null
        ? clientX - rect.left
        : Math.random() * (canvas.width - 80) + 40;
    const y =
      clientY != null
        ? clientY - rect.top
        : Math.random() * (canvas.height - 80) + 40;
    nodesRef.current.push({
      id: Date.now(),
      x: Math.max(24, Math.min(canvas.width - 24, x)),
      y: Math.max(24, Math.min(canvas.height - 24, y)),
      vx: (Math.random() - 0.5) * 1,
      vy: (Math.random() - 0.5) * 1,
      radius: 5,
      color: "#38BDF8",
      pulse: 0,
    });
    setCount(nodesRef.current.length);
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = container.clientWidth);
    let height = (canvas.height = Math.max(340, Math.min(460, window.innerHeight * 0.48)));
    seed(width, height);

    const onResize = () => {
      width = canvas.width = container.clientWidth;
      height = canvas.height = Math.max(
        340,
        Math.min(460, window.innerHeight * 0.48)
      );
    };

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
    };

    const onLeave = () => {
      mouseRef.current.x = -1000;
      mouseRef.current.y = -1000;
    };

    const onClick = (e: MouseEvent) => addNode(e.clientX, e.clientY);

    window.addEventListener("resize", onResize);
    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mouseleave", onLeave);
    canvas.addEventListener("click", onClick);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      const nodes = nodesRef.current;
      const mouse = mouseRef.current;
      const reach = width < 640 ? 100 : 140;

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dist = Math.hypot(b.x - a.x, b.y - a.y);
          if (dist < reach) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(56, 189, 248, ${(1 - dist / reach) * 0.35})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      for (const node of nodes) {
        if (!reduce) {
          node.x += node.vx;
          node.y += node.vy;
          if (node.x < 20 || node.x > width - 20) node.vx *= -1;
          if (node.y < 20 || node.y > height - 20) node.vy *= -1;
          node.pulse += 0.04;
        }

        const mDist = Math.hypot(mouse.x - node.x, mouse.y - node.y);
        const pulse = Math.sin(node.pulse) * 0.5 + 0.5;
        const r = node.radius + (mDist < 90 ? 2 : 0);

        ctx.beginPath();
        ctx.arc(node.x, node.y, r * 2.1 + pulse * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.globalAlpha = 0.12;
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.beginPath();
        ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(node.x, node.y, 1.4, 0, Math.PI * 2);
        ctx.fillStyle = "#fff";
        ctx.fill();
      }

      animRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", onResize);
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mouseleave", onLeave);
      canvas.removeEventListener("click", onClick);
    };
  }, []);

  return (
    <section
      id="network-playground"
      className="network-lab relative overflow-hidden border-t border-white/5 bg-[#090C16] py-20 md:py-28"
    >
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3.5 py-1 font-mono text-xs text-cyan-300">
            <span>SANDBOX</span>
          </div>
          <h2 className="font-heading text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
            Network Lab.{" "}
            <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent">
              A metaphor you can touch.
            </span>
          </h2>
          <p className="mt-4 text-base text-slate-400 sm:text-lg">
            This is not live customer data. Click the canvas — or Add a lead —
            and watch points join. Adding creates nodes. Proximity creates
            connections. That is the brand in motion.
          </p>
        </div>

        <div
          ref={containerRef}
          className="overflow-hidden rounded-2xl border border-white/10 bg-[#0B0D16] shadow-[0_20px_60px_-18px_rgba(0,0,0,0.75)]"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-5 py-3.5 text-xs">
            <p className="font-mono text-slate-400">
              <span className="text-cyan-300">{count}</span> sandbox nodes
            </p>
            <button
              type="button"
              onClick={() => addNode()}
              className="inline-flex items-center gap-1.5 rounded-md border border-cyan-500/40 bg-cyan-500/15 px-3 py-1.5 font-medium text-cyan-200 transition-colors hover:bg-cyan-500/25"
            >
              <Plus className="size-3.5" />
              Add a lead
            </button>
          </div>
          <canvas
            ref={canvasRef}
            className="block w-full cursor-crosshair"
            aria-label="Sandbox network. Click to add a lead node."
          />
        </div>
      </div>
    </section>
  );
}
