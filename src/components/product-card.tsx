import Link from "next/link";
import type { Category } from "@/lib/data";
import { ArrowRightIcon } from "@/components/icons";

const toneClasses: Record<Category["tone"], string> = {
  plum: "from-plum to-plum-900",
  blush: "from-blush to-blush-300",
  gold: "from-gold to-blush-300",
  ink: "from-ink to-plum-900",
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
      className={`relative flex items-center justify-center overflow-hidden bg-gradient-to-br ${toneClasses[tone]} ${className}`}
      aria-hidden="true"
    >
      <span className="font-display select-none px-6 text-center text-2xl font-semibold leading-tight text-cream/95 sm:text-3xl">
        {label}
      </span>
      <span className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-cream/10" />
      <span className="absolute -bottom-8 -left-4 h-28 w-28 rounded-full bg-cream/10" />
    </div>
  );
}

export function OfferingCard({ category }: { category: Category }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-white transition-shadow hover:shadow-lg hover:shadow-plum/5">
      <Link href={`/catalogo/${category.slug}`} className="relative block">
        <ProductPlaceholder
          tone={category.tone}
          label={category.shortName}
          className="aspect-[4/3] w-full"
        />
        <span className="absolute left-3 top-3 rounded-full bg-cream px-3 py-1 text-xs font-semibold text-plum shadow-sm">
          En preparación
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-medium uppercase tracking-wider text-gold">
          Categoría prevista
        </p>
        <h3 className="mt-2 font-display text-lg font-medium leading-snug text-plum">
          <Link href={`/catalogo/${category.slug}`} className="hover:underline">
            {category.name}
          </Link>
        </h3>
        <p className="mt-2 flex-1 text-sm text-muted">{category.description}</p>
        <Link
          href={`/catalogo/${category.slug}`}
          className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-plum"
        >
          Conocer la categoría
          <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </article>
  );
}
