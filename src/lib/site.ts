export const site = {
  name: "Dérmica",
  legalName: "Dérmica",
  tagline: "Próximamente en Nicaragua para profesionales médicos",
  description:
    "Dérmica prepara su apertura en Nicaragua. Prevemos ofrecer a profesionales médicos rellenos dérmicos de ácido hialurónico, revitalización inyectable y dermocosmética profesional. Aún no vendemos ni atendemos pacientes.",
  url: "https://dermica-tawny.vercel.app",
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
] as const;

export const waitlistHref = "/#lista-espera";

export const prelaunchNote =
  "Próximamente en Nicaragua. Describimos categorías que prevemos ofrecer a profesionales médicos. No hay venta, existencias, pedidos ni citas.";
