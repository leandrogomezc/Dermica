export const site = {
  name: "Dérmica",
  tagline: "Insumos de medicina estética para médicos en Nicaragua",
  description:
    "Dérmica prepara rellenos de ácido hialurónico, polirrevitalización inyectable y dermocosmética profesional para médicos en Nicaragua. Dejanos tu correo y te avisamos cuando abramos.",
  url: "https://dermica.lat",
  email: "gerencia@dermica.lat",
  country: "Nicaragua",
  locale: "es_NI",
  keywords: [
    "Dérmica",
    "Nicaragua",
    "próximamente",
    "profesionales médicos",
    "rellenos de ácido hialurónico",
    "revitalización inyectable",
    "polirrevitalización",
    "dermocosmética profesional",
    "lista de espera",
  ],
} as const;

export const nav = [
  { label: "Inicio", href: "/" },
  { label: "Categorías", href: "/catalogo" },
  { label: "Quiénes somos", href: "/quienes-somos" },
  { label: "Apertura", href: "/apertura" },
  { label: "Contacto", href: "/contacto" },
] as const;

export const waitlistHref = "/#lista-espera";
