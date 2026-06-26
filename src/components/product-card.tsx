import Link from "next/link";
import type { Product } from "@/lib/data";
import { formatLps, formatUsd, getCategory } from "@/lib/data";
import { whatsappProductLink } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/icons";

const toneClasses: Record<Product["tone"], string> = {
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
  tone: Product["tone"];
  label: string;
  className?: string;
}) {
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden bg-gradient-to-br ${toneClasses[tone]} ${className}`}
    >
      <span className="font-display select-none text-6xl font-semibold text-cream/90">
        {label.charAt(0)}
      </span>
      <span className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-cream/10" />
      <span className="absolute -bottom-8 -left-4 h-28 w-28 rounded-full bg-cream/10" />
    </div>
  );
}

export function ProductCard({ product }: { product: Product }) {
  const category = getCategory(product.category);
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-white transition-shadow hover:shadow-lg hover:shadow-plum/5">
      <Link href={`/producto/${product.slug}`} className="relative block">
        <ProductPlaceholder
          tone={product.tone}
          label={product.name}
          className="aspect-[4/3] w-full"
        />
        {product.badge ? (
          <span className="absolute left-3 top-3 rounded-full bg-cream px-3 py-1 text-xs font-semibold text-plum shadow-sm">
            {product.badge}
          </span>
        ) : null}
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-medium uppercase tracking-wider text-gold">
          {category?.shortName} · {product.brand}
        </p>
        <h3 className="mt-2 font-display text-lg font-medium leading-snug text-plum">
          <Link href={`/producto/${product.slug}`} className="hover:underline">
            {product.name}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-2 text-sm text-muted">
          {product.shortDescription}
        </p>

        <div className="mt-4 flex items-baseline gap-2">
          <span className="text-lg font-semibold text-ink">
            {formatLps(product.priceLps)}
          </span>
          <span className="text-sm text-muted">/ {formatUsd(product.priceUsd)}</span>
        </div>

        <a
          href={whatsappProductLink(product.name, product.sku)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1eb558]"
        >
          <WhatsAppIcon className="h-4 w-4" />
          Cotizar
        </a>
      </div>
    </article>
  );
}
