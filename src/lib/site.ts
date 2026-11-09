export const site = {
  name: "Dérmica",
  tagline: "Insumos de medicina estética para médicos en Nicaragua",
  description:
    "En marzo de 2027 Dérmica abre en Nicaragua para médicos. Anotate: hay un cupo de 30 médicos fundadores, con acceso anticipado y precio de apertura.",
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
  { label: "Preguntas", href: "/preguntas-frecuentes" },
  { label: "Contacto", href: "/contacto" },
] as const;

export const waitlistHref = "/#lista-espera";
