import { site } from "./site";

const DEFAULT_MESSAGE =
  "¡Hola Dérmica! Me gustaría recibir información y una cotización de sus productos profesionales.";

export function whatsappLink(message: string = DEFAULT_MESSAGE): string {
  const text = encodeURIComponent(message);
  return `https://wa.me/${site.whatsappNumber}?text=${text}`;
}

export function whatsappProductLink(productName: string, sku?: string): string {
  const ref = sku ? ` (Ref. ${sku})` : "";
  return whatsappLink(
    `¡Hola Dérmica! Estoy interesado/a en cotizar el producto "${productName}"${ref}. ¿Me podrían enviar precio y disponibilidad?`,
  );
}
