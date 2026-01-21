
import React from 'react';
import { motion } from 'framer-motion';

const Hero: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      className="w-full text-center space-y-4 relative z-10"
    >
      {/* SUBTLE BRAND IDENTIFIER FOR MOBILE APP FEEL */}
      <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
        <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(211,47,47,0.8)]" />
        <span className="text-[10px] font-black text-white/60 uppercase tracking-[0.4em]">Broadcast Live</span>
      </div>
      
      {/* INFINITE BACKGROUND TEXT DRIFT - KEPT FOR ATMOSPHERE BUT DIMMED */}
      <div className="fixed top-1/2 left-0 -translate-y-1/2 w-full text-[12rem] font-black text-white/[0.01] pointer-events-none select-none whitespace-nowrap overflow-hidden -z-10">
        <motion.div
          animate={{ x: [0, -1500] }}
          transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
        >
          MIXMUSIC • STREAMING • DIGITAL • HI-FI • MIXMUSIC • STREAMING • DIGITAL • HI-FI
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Hero;
