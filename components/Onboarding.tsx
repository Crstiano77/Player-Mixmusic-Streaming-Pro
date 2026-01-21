
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Check } from 'lucide-react';

interface Step {
  title: string;
  description: string;
  targetId?: string;
}

const steps: Step[] = [
  {
    title: "Bem-vindo à Mix Music",
    description: "Sua nova rádio favorita com o melhor conteúdo cristão agora tem uma experiência premium. Vamos te mostrar o básico?",
  },
  {
    title: "O Coração da Rádio",
    description: "Use o botão central para começar sua experiência de adoração. Basta um clique para ouvir o melhor louvor.",
    targetId: "player-section"
  },
  {
    title: "Inspiração Diária",
    description: "Fique de olho no box de versículos. Ele se atualiza automaticamente com palavras que tocam o coração.",
  },
  {
    title: "Interação e Partilha",
    description: "Gostou de um hino? Deixe seu like! Quer abençoar alguém? Use o botão enviar para compartilhar o link da rádio.",
  },
  {
    title: "Tudo Pronto!",
    description: "Agora você está pronto para navegar na Mix Music. Que sua experiência seja abençoada!",
  }
];

interface OnboardingProps {
  onComplete: () => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const next = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const prev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-xl flex items-center justify-center p-6"
    >
      <motion.div 
        layout
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-cardBg border border-white/10 p-10 rounded-[40px] max-w-lg w-full shadow-2xl relative"
      >
        <div className="absolute top-0 right-0 p-8">
            <span className="text-primary/50 font-bold text-6xl opacity-20 pointer-events-none">
                0{currentStep + 1}
            </span>
        </div>

        <AnimatePresence mode="wait">
          <motion.div 
            key={currentStep}
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            className="space-y-6"
          >
            <h3 className="text-3xl font-black text-white">{steps[currentStep].title}</h3>
            <p className="text-gray-400 text-lg leading-relaxed">{steps[currentStep].description}</p>
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center justify-between mt-12">
          <div className="flex gap-1.5">
            {steps.map((_, i) => (
              <div 
                key={i} 
                className={`h-1.5 rounded-full transition-all duration-300 ${i === currentStep ? 'w-8 bg-primary' : 'w-2 bg-white/10'}`}
              />
            ))}
          </div>

          <div className="flex gap-4">
            {currentStep > 0 && (
              <button 
                onClick={prev}
                className="p-3 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors"
              >
                <ChevronLeft size={24} />
              </button>
            )}
            
            <button 
              onClick={next}
              className="px-8 py-3 rounded-full bg-primary hover:bg-red-700 text-white font-bold flex items-center gap-2 transition-all hover:scale-105"
            >
              {currentStep === steps.length - 1 ? (
                <>Começar <Check size={20} /></>
              ) : (
                <>Próximo <ChevronRight size={20} /></>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Onboarding;
