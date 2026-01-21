
import React from 'react';
import { Instagram, Facebook, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-white/5 py-12 mt-auto">
      <div className="container mx-auto px-4 text-center">
        <p className="text-gray-500 mb-6 font-medium">
          © {new Date().getFullYear()} Mix Music Streaming - Profissionalismo e Fé.
        </p>
        
        <div className="flex justify-center gap-6">
          <a href="#" className="text-gray-500 hover:text-primary transition-colors">
            <Instagram size={20} />
          </a>
          <a href="#" className="text-gray-500 hover:text-primary transition-colors">
            <Facebook size={20} />
          </a>
          <a href="#" className="text-gray-500 hover:text-primary transition-colors">
            <Mail size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
