import { whatsappLink } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/icons";

export function WhatsAppFloat() {
  return (
    <a
      href={whatsappLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Cotizar por WhatsApp"
      className="group fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-full bg-[#25D366] py-3 pl-3 pr-4 text-white shadow-lg shadow-black/20 transition-transform hover:scale-105 sm:bottom-7 sm:right-7"
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15">
        <WhatsAppIcon className="h-6 w-6" />
      </span>
      <span className="hidden text-sm font-semibold sm:block">
        Cotizar por WhatsApp
      </span>
    </a>
  );
}
