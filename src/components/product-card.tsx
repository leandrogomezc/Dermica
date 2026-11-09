import Link from "next/link";
import type { Category } from "@/lib/data";
import { ArrowRightIcon } from "@/components/icons";

const toneClasses: Record<Category["tone"], { surface: string; label: string; spot: string }> = {
  plum: { surface: "bg-clinical", label: "text-white", spot: "bg-white/10" },
  blush: { surface: "bg-sky-100", label: "text-clinical", spot: "bg-clinical/5" },
  gold: { surface: "bg-mist", label: "text-clinical", spot: "bg-clinical/5" },
  ink: { surface: "bg-clinical", label: "text-white", spot: "bg-white/10" },
};

export function ProductPlaceholder({
  tone,
  label,
  className = "",
}: {
  tone: Category["tone"];
  label: string;
  className?: string;
}) {
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden ${toneClasses[tone].surface} ${className}`}
      aria-hidden="true"
    >
      <span
        className={`font-display select-none px-6 text-center text-2xl font-semibold leading-tight sm:text-3xl ${toneClasses[tone].label}`}
      >
        {label}
      </span>
      <span className={`absolute -right-6 -top-6 h-24 w-24 rounded-full ${toneClasses[tone].spot}`} />
      <span className={`absolute -bottom-8 -left-4 h-28 w-28 rounded-full ${toneClasses[tone].spot}`} />
    </div>
  );
}

export function OfferingCard({ category }: { category: Category }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-mist bg-white">
      <Link href={`/catalogo/${category.slug}`} className="relative block">
        <ProductPlaceholder
          tone={category.tone}
          label={category.shortName}
          className="aspect-[4/3] w-full"
        />
        <span
          className={`absolute left-3 top-3 rounded-lg px-3 py-1 text-xs font-semibold text-clinical ${
            category.tone === "blush" || category.tone === "gold" ? "bg-white" : "bg-sky-100"
          }`}
        >
          En preparación
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-medium text-clinical">
          Categoría prevista
        </p>
        <h3 className="mt-2 font-display text-lg font-semibold leading-snug text-clinical">
          <Link href={`/catalogo/${category.slug}`} className="hover:underline">
            {category.name}
          </Link>
        </h3>
        <p className="mt-2 flex-1 text-sm text-clinical">{category.description}</p>
        <Link
          href={`/catalogo/${category.slug}`}
          className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-clinical"
        >
          Ver esta categoría
          <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </article>
  );
}
