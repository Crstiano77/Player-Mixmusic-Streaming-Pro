
import React from 'react';

interface NavbarProps {
  onCtaClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onCtaClick }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-bgDark/80 backdrop-blur-xl border-b border-white/5 py-4">
      <div className="container mx-auto px-6 flex justify-between items-center">
        {/* LOGO - CENTERED ON MOBILE FEEL */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-[0_0_15px_rgba(211,47,47,0.4)]">
            <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          </div>
          <div className="text-white font-black text-xl tracking-tighter cursor-default hidden sm:block">
            MIXMUSIC <span className="text-primary">STREAM</span>
          </div>
        </div>
        
        <button 
          onClick={onCtaClick}
          className="bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-white font-black py-2 px-5 rounded-xl text-[10px] uppercase tracking-widest active:scale-95"
        >
          GO LIVE
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
