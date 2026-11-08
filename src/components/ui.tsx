import Link from "next/link";
import type { MouseEvent, ReactNode } from "react";

export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-6xl px-5 sm:px-8 ${className}`}>
      {children}
    </div>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="inline-block text-xs font-semibold uppercase tracking-[0.22em] text-gold">
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className = "",
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={`${align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"} ${className}`}
    >
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <h2 className="font-display mt-3 text-3xl font-medium leading-tight text-plum sm:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-base leading-relaxed text-muted">{description}</p>
      ) : null}
    </div>
  );
}

type Variant = "primary" | "outline" | "ghost";

const variants: Record<Variant, string> = {
  primary:
    "bg-plum text-cream hover:bg-plum-700 focus-visible:ring-plum/40",
  outline:
    "border border-plum/30 text-plum hover:bg-plum hover:text-cream focus-visible:ring-plum/30",
  ghost: "text-plum hover:bg-cream-200 focus-visible:ring-plum/20",
};

const sizeClasses = "px-6 py-3 text-sm";

function classes(variant: Variant, full?: boolean, extra = "") {
  return `inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors focus:outline-none focus-visible:ring-4 ${sizeClasses} ${variants[variant]} ${full ? "w-full" : ""} ${extra}`;
}

export function ButtonLink({
  href,
  children,
  variant = "primary",
  full,
  external,
  className = "",
  onClick,
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  full?: boolean;
  external?: boolean;
  className?: string;
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
}) {
  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClick}
        className={classes(variant, full, className)}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} onClick={onClick} className={classes(variant, full, className)}>
      {children}
    </Link>
  );
}
