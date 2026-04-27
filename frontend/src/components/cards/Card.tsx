import { ReactNode } from "react";

/**
 * Glass card primitive. Subtle gradient border, soft shadow, hover lift.
 * Padding scales: p-6 on mobile, p-8 on sm+.
 */
export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={[
        "group relative rounded-3xl p-6 sm:p-8",
        "bg-white/[0.04] backdrop-blur-xl",
        "border border-white/10",
        "shadow-[0_8px_40px_-12px_rgba(0,0,0,0.6)]",
        "transition-all duration-500 ease-out",
        "hover:bg-white/[0.06] hover:border-white/[0.18]",
        "hover:shadow-[0_24px_60px_-12px_rgba(0,0,0,0.8)]",
        className,
      ].join(" ")}
    >
      {children}
    </section>
  );
}

export function CardEyebrow({ children }: { children: ReactNode }) {
  return (
    <div className="text-[11px] uppercase tracking-[0.18em] text-purple-300/80 font-semibold mb-3">
      {children}
    </div>
  );
}

export function CardHeading({ children }: { children: ReactNode }) {
  return (
    <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-5 text-white">
      {children}
    </h2>
  );
}
