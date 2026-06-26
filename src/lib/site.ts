export const site = {
  name: "Dérmica",
  legalName: "Dérmica Distribuidora",
  tagline: "Distribuidora de productos estéticos profesionales en Honduras",
  description:
    "Distribuidores autorizados de aparatología, cuidado de la piel e insumos profesionales para clínicas, spas, salones de belleza y esteticistas en Honduras.",
  url: "https://dermica.hn",
  // Número en formato internacional sin signos para wa.me (placeholder)
  whatsappNumber: "50499998888",
  phoneDisplay: "+504 9999-8888",
  email: "ventas@dermica.hn",
  locations: [
    {
      city: "Tegucigalpa",
      address: "Col. Lomas del Guijarro, Ave. Principal, Edificio Belle, Local 3",
    },
    {
      city: "San Pedro Sula",
      address: "Barrio Río de Piedras, 5a Calle, 7a Avenida N.O., Local 12",
    },
  ],
  hours: "Lunes a viernes 8:00 a.m. – 5:30 p.m. · Sábado 9:00 a.m. – 1:00 p.m.",
  banks: ["Banco Atlántida", "BAC Credomatic", "Banco Ficohsa"],
  couriers: ["Cargo Expreso", "CAEX"],
  social: {
    instagram: "https://instagram.com/dermica.hn",
    facebook: "https://facebook.com/dermica.hn",
    tiktok: "https://tiktok.com/@dermica.hn",
  },
  // Centro aproximado para el mapa (Tegucigalpa)
  mapEmbed:
    "https://www.google.com/maps?q=Lomas%20del%20Guijarro%20Tegucigalpa%20Honduras&output=embed",
} as const;

export const nav = [
  { label: "Inicio", href: "/" },
  { label: "Catálogo", href: "/catalogo" },
  { label: "Quiénes Somos", href: "/quienes-somos" },
  { label: "Envíos", href: "/envios" },
  { label: "Contacto", href: "/contacto" },
] as const;
