import { useId } from "react";
import { cn } from "@/lib/utils";

interface LogoSymbolProps {
  size?: number;
  className?: string;
  showGlow?: boolean;
  animated?: boolean;
}

export function LogoSymbol({
  size = 32,
  className = "",
  showGlow = true,
  animated = false,
}: LogoSymbolProps) {
  const uid = useId().replace(/:/g, "");
  const lineGrad = `${uid}-logo-line`;
  const centerGlow = `${uid}-logo-center`;

  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center",
        className
      )}
      style={{ width: size, height: size }}
      aria-hidden
    >
      {showGlow ? (
        <div
          className="pointer-events-none absolute inset-0 rounded-full bg-cyan-500/25 blur-md"
          style={{ transform: "scale(1.3)" }}
        />
      ) : null}

      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn(
          "relative z-10 transition-transform duration-300",
          animated && "hover:scale-105"
        )}
      >
        <defs>
          <linearGradient
            id={lineGrad}
            x1="6"
            y1="20"
            x2="34"
            y2="20"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#38BDF8" stopOpacity="0.8" />
            <stop offset="0.5" stopColor="#818CF8" stopOpacity="0.9" />
            <stop offset="1" stopColor="#C084FC" stopOpacity="0.8" />
          </linearGradient>
          <radialGradient id={centerGlow} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="45%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#0284C7" stopOpacity="0.2" />
          </radialGradient>
        </defs>

        <circle
          cx="20"
          cy="20"
          r="16"
          stroke="rgba(255, 255, 255, 0.08)"
          strokeWidth="1"
          strokeDasharray="2 3"
        />

        <path
          d="M20 6L33 13V27L20 34L7 27V13L20 6Z"
          stroke={`url(#${lineGrad})`}
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.75"
        />

        <line
          x1="20"
          y1="6"
          x2="20"
          y2="34"
          stroke="rgba(56, 189, 248, 0.4)"
          strokeWidth="1"
        />
        <line
          x1="7"
          y1="13"
          x2="33"
          y2="27"
          stroke="rgba(99, 102, 241, 0.35)"
          strokeWidth="1"
        />
        <line
          x1="7"
          y1="27"
          x2="33"
          y2="13"
          stroke="rgba(99, 102, 241, 0.35)"
          strokeWidth="1"
        />

        <circle cx="20" cy="6" r="2.2" fill="#38BDF8" />
        <circle cx="33" cy="13" r="2.2" fill="#818CF8" />
        <circle cx="33" cy="27" r="2.2" fill="#A855F7" />
        <circle cx="20" cy="34" r="2.2" fill="#C084FC" />
        <circle cx="7" cy="27" r="2.2" fill="#818CF8" />
        <circle cx="7" cy="13" r="2.2" fill="#38BDF8" />

        <circle cx="20" cy="20" r="4.5" fill={`url(#${centerGlow})`} />
        <circle cx="20" cy="20" r="2" fill="#FFFFFF" />
      </svg>
    </div>
  );
}
