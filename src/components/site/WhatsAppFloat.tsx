import { MessageCircle } from "lucide-react";
import { whatsappLink } from "@/data/site";

export function WhatsAppFloat() {
  return (
    <a
      href={whatsappLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp inquiry"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-navy-gradient px-4 py-3 text-sm font-semibold text-navy-foreground shadow-[var(--shadow-industrial)] transition-transform hover:scale-105"
    >
      <MessageCircle className="h-5 w-5" />
      <span className="hidden sm:inline">WhatsApp Inquiry</span>
    </a>
  );
}
