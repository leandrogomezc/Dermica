import Image from "next/image";

type Variant = "horizontal" | "reverse" | "iso";

const files: Record<
  Variant,
  { src: string; width: number; height: number; displayWidth: number }
> = {
  horizontal: {
    src: "/brand/dermica-horizontal-color.svg",
    width: 382,
    height: 124,
    displayWidth: 120,
  },
  reverse: {
    src: "/brand/dermica-horizontal-reverso-color.svg",
    width: 382,
    height: 124,
    displayWidth: 120,
  },
  iso: {
    src: "/brand/dermica-isotipo-color.svg",
    width: 88,
    height: 108,
    displayWidth: 32,
  },
};

// x = altura de la D mayúscula en el horizontal (50 unidades sobre 382).
const CAP_UNITS = 50;
const HORIZONTAL_UNITS = 382;

export function Logo({
  variant = "horizontal",
  decorative = false,
}: {
  variant?: Variant;
  decorative?: boolean;
}) {
  const file = files[variant];
  const displayHeight = Math.round((file.height / file.width) * file.displayWidth);
  const clearSpace =
    variant === "iso"
      ? Math.round(displayHeight / 2.2)
      : Math.round((CAP_UNITS / HORIZONTAL_UNITS) * file.displayWidth);

  return (
    <Image
      src={file.src}
      alt={decorative ? "" : "Dérmica"}
      width={file.width}
      height={file.height}
      unoptimized
      className="h-auto max-w-none shrink-0"
      style={{ width: file.displayWidth, height: displayHeight, margin: clearSpace }}
    />
  );
}
