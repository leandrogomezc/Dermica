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
    <span className="inline-block text-xs font-semibold text-clinical">
      {children}
    </span>
  );
}

export function PageHero({
  eyebrow,
  title,
  children,
}: {
  eyebrow: ReactNode;
  title: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className="max-w-3xl">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h1 className="font-display mt-4 text-4xl font-semibold leading-tight text-clinical sm:text-5xl">
        {title}
      </h1>
      {children}
    </div>
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
      <h2 className="font-display mt-3 text-3xl font-semibold leading-tight text-clinical sm:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-base leading-relaxed text-clinical">{description}</p>
      ) : null}
    </div>
  );
}

type Variant = "primary" | "outline" | "ghost";

const variants: Record<Variant, string> = {
  primary:
    "bg-clinical text-white hover:bg-clinical/90 focus-visible:ring-clinical",
  outline:
    "border border-clinical text-clinical hover:bg-clinical hover:text-white focus-visible:ring-clinical",
  ghost: "text-clinical hover:bg-sky-100 focus-visible:ring-clinical",
};

const sizeClasses = "min-h-11 px-6 py-3 text-sm";

function classes(variant: Variant, full?: boolean, extra = "") {
  return `inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors focus:outline-none focus-visible:ring-4 ${sizeClasses} ${variants[variant]} ${full ? "w-full" : ""} ${extra}`;
}

export function ButtonLink({
  href,
  children,
  variant = "primary",
  full,
  external,
  className = "",
  onClick,
  metric,
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  full?: boolean;
  external?: boolean;
  className?: string;
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
  metric?: "cta";
}) {
  const metricProps = metric ? { "data-metric": metric } : {};
  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClick}
        className={classes(variant, full, className)}
        {...metricProps}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} onClick={onClick} className={classes(variant, full, className)} {...metricProps}>
      {children}
    </Link>
  );
}
