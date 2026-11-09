import Link from "next/link";
import type { Category } from "@/lib/data";
import { CategoryIcon, ArrowRightIcon } from "@/components/icons";

export function CategoryCard({ category }: { category: Category }) {
  return (
    <Link
      href={`/catalogo/${category.slug}`}
      className="group flex h-full flex-col rounded-2xl border border-mist bg-white p-7 transition-all hover:-translate-y-1 hover:border-clinical hover:shadow-lg hover:shadow-clinical/5"
    >
      <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-sky-100 text-clinical transition-colors group-hover:bg-clinical group-hover:text-white">
        <CategoryIcon name={category.icon} className="h-7 w-7" />
      </span>
      <h3 className="font-display mt-5 text-xl font-semibold text-clinical">{category.name}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-clinical">{category.description}</p>
      <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-clinical">
        Ver esta categoría
        <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </span>
    </Link>
  );
}
