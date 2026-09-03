"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type ParticleWord = "INTEGRATED LEADS" | "KEEP ADDING";

interface Particle {
  x: number;
  y: number;
  originX: number;
  originY: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
}

export function ParticleHeroText() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [activeWord, setActiveWord] = useState<ParticleWord>("INTEGRATED LEADS");
  const animationFrameId = useRef<number | null>(null);
  const mouseRef = useRef({ x: -1000, y: -1000, radius: 80 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let particles: Particle[] = [];
    let width = 0;
    let height = 120;

    const sizeCanvas = () => {
      const parentWidth = wrapRef.current?.clientWidth ?? window.innerWidth - 32;
      width = Math.max(260, Math.min(parentWidth, 900));
      height = width < 400 ? 88 : width < 640 ? 110 : width < 900 ? 128 : 140;
      canvas.width = width;
      canvas.height = height;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    };

    const initParticles = () => {
      sizeCanvas();
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "#1A1A1A";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const fontSize =
        width < 360 ? 22 : width < 500 ? 28 : width < 768 ? 40 : 56;
      const family =
        getComputedStyle(document.body).fontFamily ||
        "ui-sans-serif, system-ui, sans-serif";
      ctx.font = `800 ${fontSize}px ${family}`;
      ctx.fillText(activeWord, width / 2, height / 2);

      const imageData = ctx.getImageData(0, 0, width, height);
      const data = imageData.data;
      particles = [];

      const step = width < 480 ? 5 : 4;
      for (let y = 0; y < height; y += step) {
        for (let x = 0; x < width; x += step) {
          const index = (y * width + x) * 4;
          const alpha = data[index + 3];

          if (alpha > 128) {
            const ratio = x / width;
            let color = "#1568B8";
            if (ratio > 0.35 && ratio < 0.65) color = "#0E8A72";
            else if (ratio >= 0.65) color = "#0B8F5A";

            particles.push({
              x: Math.random() * width,
              y: Math.random() * height,
              originX: x,
              originY: y,
              vx: (Math.random() - 0.5) * 2,
              vy: (Math.random() - 0.5) * 2,
              size: Math.random() > 0.8 ? 2.15 : 1.55,
              color,
              alpha: Math.random() * 0.18 + 0.82,
            });
          }
        }
      }
      ctx.clearRect(0, 0, width, height);
    };

    initParticles();

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouseRef.current.x = -1000;
      mouseRef.current.y = -1000;
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const mouse = mouseRef.current;
      const friction = 0.86;
      const ease = 0.08;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.radius) {
          const angle = Math.atan2(dy, dx);
          const force = (mouse.radius - dist) / mouse.radius;
          p.vx -= Math.cos(angle) * force * 4.5;
          p.vy -= Math.sin(angle) * force * 4.5;
        }

        p.vx += (p.originX - p.x) * ease;
        p.vy += (p.originY - p.y) * ease;
        p.vx *= friction;
        p.vy *= friction;
        p.x += p.vx;
        p.y += p.vy;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();

        if (i % 6 === 0 && i + 1 < particles.length) {
          const p2 = particles[i + 1];
          const cdx = p.x - p2.x;
          const cdy = p.y - p2.y;
          const cdist = Math.sqrt(cdx * cdx + cdy * cdy);
          if (cdist < 14) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = p.color;
            ctx.globalAlpha = (1 - cdist / 14) * 0.25;
            ctx.stroke();
          }
        }
      }

      ctx.globalAlpha = 1;
      animationFrameId.current = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      initParticles();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("resize", handleResize);
    };
  }, [activeWord]);

  return (
    <div
      ref={wrapRef}
      className="relative mx-auto my-1 flex w-full max-w-[900px] flex-col items-center justify-center px-1 sm:my-2"
    >
      <div className="relative w-full cursor-pointer overflow-hidden">
        <canvas
          ref={canvasRef}
          className="mx-auto max-w-full rounded-xl drop-shadow-[0_8px_22px_rgba(21,104,184,0.22)] transition-all duration-300"
        />
        <span className="sr-only">{activeWord}</span>
      </div>

      <div className="mt-2 flex max-w-full flex-wrap items-center justify-center gap-1 rounded-full border border-[#52ADFF]/20 bg-white/80 p-1 text-xs shadow-sm backdrop-blur-md sm:mt-3 sm:gap-2">
        <button
          type="button"
          onClick={() => setActiveWord("INTEGRATED LEADS")}
          className={cn(
            "rounded-full px-2.5 py-1 text-[10px] font-medium tracking-wide transition-all sm:px-3 sm:text-xs",
            activeWord === "INTEGRATED LEADS"
              ? "bg-[linear-gradient(135deg,#1568B8,#0B8F5A)] font-semibold text-white shadow-sm"
              : "text-slate-500 hover:text-slate-800"
          )}
        >
          ● INTEGRATED LEADS
        </button>
        <button
          type="button"
          onClick={() => setActiveWord("KEEP ADDING")}
          className={cn(
            "rounded-full px-2.5 py-1 text-[10px] font-medium tracking-wide transition-all sm:px-3 sm:text-xs",
            activeWord === "KEEP ADDING"
              ? "bg-[linear-gradient(135deg,#1568B8,#0B8F5A)] font-semibold text-white shadow-sm"
              : "text-slate-500 hover:text-slate-800"
          )}
        >
          ● KEEP ADDING
        </button>
      </div>
    </div>
  );
}
