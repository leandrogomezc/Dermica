import type { ReactNode, SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function StrokeIcon({ children, ...props }: IconProps & { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      <g transform="scale(2)" strokeWidth={1}>
        {children}
      </g>
    </svg>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <StrokeIcon {...props}>
      <path d="M4 6h16M4 12h16M4 18h16" />
    </StrokeIcon>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <StrokeIcon {...props}>
      <path d="M6 6l12 12M18 6L6 18" />
    </StrokeIcon>
  );
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <StrokeIcon {...props}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </StrokeIcon>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <StrokeIcon {...props}>
      <path d="M20 6L9 17l-5-5" />
    </StrokeIcon>
  );
}

export function UsersIcon(props: IconProps) {
  return (
    <StrokeIcon {...props}>
      <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="3" />
      <path d="M22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
    </StrokeIcon>
  );
}

export function MailIcon(props: IconProps) {
  return (
    <StrokeIcon {...props}>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M22 7l-10 6L2 7" />
    </StrokeIcon>
  );
}

export function ShieldIcon(props: IconProps) {
  return (
    <StrokeIcon {...props}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12l2 2 4-4" />
    </StrokeIcon>
  );
}

const categoryIcons: Record<string, (p: IconProps) => React.JSX.Element> = {
  drop: (props) => (
    <StrokeIcon {...props}>
      <path d="M12 3s6 6.5 6 10.5a6 6 0 11-12 0C6 9.5 12 3 12 3z" />
      <path d="M9 14a3 3 0 003 3" />
    </StrokeIcon>
  ),
  sparkle: (props) => (
    <StrokeIcon {...props}>
      <path d="M12 3l1.6 4.8L18 9.4l-4.4 1.6L12 15l-1.6-4L6 9.4l4.4-1.6z" />
      <path d="M18 14l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z" />
    </StrokeIcon>
  ),
  leaf: (props) => (
    <StrokeIcon {...props}>
      <path d="M11 20A7 7 0 014 13c0-5 4-9 16-9 0 12-4 16-9 16z" />
      <path d="M8 17c2-4 5-6 9-7" />
    </StrokeIcon>
  ),
};

export function CategoryIcon({ name, ...props }: IconProps & { name: string }) {
  const Comp = categoryIcons[name] ?? categoryIcons.sparkle;
  return Comp(props);
}
