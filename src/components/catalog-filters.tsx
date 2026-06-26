"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { categories, brands } from "@/lib/data";

export function CatalogFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const activeCategory = params.get("categoria") ?? "";
  const activeBrand = params.get("marca") ?? "";
  const query = params.get("q") ?? "";

  const update = useCallback(
    (key: string, value: string) => {
      const next = new URLSearchParams(params.toString());
      if (value) next.set(key, value);
      else next.delete(key);
      const qs = next.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [params, pathname, router],
  );

  const hasFilters = activeCategory || activeBrand || query;

  return (
    <div className="space-y-8">
      <div>
        <label
          htmlFor="catalog-search"
          className="block text-sm font-semibold text-plum"
        >
          Buscar producto
        </label>
        <input
          id="catalog-search"
          type="search"
          defaultValue={query}
          placeholder="Ej. radiofrecuencia, sérum, pestañas…"
          onChange={(e) => update("q", e.target.value)}
          className="mt-2 w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-muted/70 focus:border-plum"
        />
      </div>

      <div>
        <h3 className="text-sm font-semibold text-plum">Categorías</h3>
        <div className="mt-3 flex flex-col gap-1">
          <FilterButton
            active={!activeCategory}
            onClick={() => update("categoria", "")}
          >
            Todas las categorías
          </FilterButton>
          {categories.map((c) => (
            <FilterButton
              key={c.slug}
              active={activeCategory === c.slug}
              onClick={() => update("categoria", c.slug)}
            >
              {c.shortName}
            </FilterButton>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-plum">Marca</h3>
        <select
          value={activeBrand}
          onChange={(e) => update("marca", e.target.value)}
          className="mt-3 w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-ink outline-none focus:border-plum"
        >
          <option value="">Todas las marcas</option>
          {brands.map((b) => (
            <option key={b.name} value={b.name}>
              {b.name}
            </option>
          ))}
        </select>
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
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg px-3 py-2 text-left text-sm transition-colors ${
        active
          ? "bg-plum font-medium text-cream"
          : "text-ink hover:bg-cream-200"
      }`}
    >
      {children}
    </button>
  );
}
