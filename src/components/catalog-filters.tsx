"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback, type ReactNode } from "react";
import { categories } from "@/lib/data";

export function CatalogFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const activeCategory = params.get("categoria") ?? "";
  const query = params.get("q") ?? "";

  const update = useCallback(
    (key: string, value: string) => {
      const next = new URLSearchParams(params.toString());
      next.delete("marca");
      if (value) next.set(key, value);
      else next.delete(key);
      const qs = next.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [params, pathname, router],
  );

  const hasFilters = activeCategory || query;

  return (
    <div className="space-y-8">
      <div>
        <label htmlFor="catalog-search" className="block text-sm font-semibold text-plum">
          Buscar categoría
        </label>
        <input
          id="catalog-search"
          type="search"
          defaultValue={query}
          placeholder="Ácido hialurónico, piel…"
          onChange={(event) => update("q", event.target.value)}
          className="mt-2 w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-muted/70 focus:border-plum"
        />
      </div>

      <div>
        <h2 className="text-sm font-semibold text-plum">Categorías</h2>
        <div className="mt-3 flex flex-col gap-1">
          <FilterButton active={!activeCategory} onClick={() => update("categoria", "")}>
            Todas
          </FilterButton>
          {categories.map((category) => (
            <FilterButton
              key={category.slug}
              active={activeCategory === category.slug}
              onClick={() => update("categoria", category.slug)}
            >
              {category.shortName}
            </FilterButton>
          ))}
        </div>
      </div>

      {hasFilters ? (
        <button
          type="button"
          onClick={() => router.replace(pathname, { scroll: false })}
          className="text-sm font-medium text-plum underline underline-offset-4 hover:text-plum-700"
        >
          Limpiar filtros
        </button>
      ) : null}
    </div>
  );
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-lg px-3 py-2 text-left text-sm transition-colors ${
        active ? "bg-plum font-medium text-cream" : "text-ink hover:bg-cream-200"
      }`}
    >
      {children}
    </button>
  );
}
