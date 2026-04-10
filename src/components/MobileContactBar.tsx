"use client";

import { Phone, MessageCircle, Send, Calculator } from "lucide-react";
import { useSiteSettings } from "@/context/SiteContext";

export default function MobileContactBar() {
  const settings = useSiteSettings();
  
  const phoneClean = settings.phone.replace(/\s+/g, '');
  
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-[100] bg-[#0a0a0a]/95 backdrop-blur-lg border-t border-[#D4AF37]/30">
      <div className="flex items-center justify-around px-2 py-3">
        {/* Call Button */}
        <a 
          href={`tel:${phoneClean}`}
          className="flex flex-col items-center gap-1 px-4 py-2 text-[#D4AF37] hover:bg-[#D4AF37]/10 rounded-lg transition-colors"
        >
          <Phone className="w-5 h-5" />
          <span className="text-[9px] uppercase tracking-wider">Дзвінок</span>
        </a>
        
        {/* Telegram */}
        <a 
          href={settings.telegram}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-1 px-4 py-2 text-[#D4AF37] hover:bg-[#D4AF37]/10 rounded-lg transition-colors"
        >
          <Send className="w-5 h-5" />
          <span className="text-[9px] uppercase tracking-wider">Telegram</span>
        </a>
        
        {/* Viber */}
        <a 
          href={settings.viber}
          className="flex flex-col items-center gap-1 px-4 py-2 text-[#D4AF37] hover:bg-[#D4AF37]/10 rounded-lg transition-colors"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="text-[9px] uppercase tracking-wider">Viber</span>
        </a>
        
        {/* Quick Order */}
        <button 
          onClick={() => document.getElementById('order')?.scrollIntoView({ behavior: 'smooth' })}
          className="flex flex-col items-center gap-1 px-4 py-2 bg-[#D4AF37] text-black rounded-lg font-bold"
        >
          <Calculator className="w-5 h-5" />
          <span className="text-[9px] uppercase tracking-wider">Заявка</span>
        </button>
      </div>
      
      {/* Safe area padding for iPhone */}
      <div className="h-[env(safe-area-inset-bottom)]" />
    </div>
  );
}
