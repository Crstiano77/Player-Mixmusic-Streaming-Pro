
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Heart, Share2, Volume1, Volume2, Sliders, Wifi, WifiOff, Loader2, Eye, EyeOff, Radio, Cpu, Activity, Signal } from 'lucide-react';
import Visualizer from './Visualizer';
import { ConnectionState, AudioQuality, VisualPreset } from '../App';

interface PlayerProps {
  isPlaying: boolean;
  connectionState: ConnectionState;
  togglePlay: () => void;
  volume: number;
  onVolumeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  currentVerse: string;
  likes: number;
  isLiked: boolean;
  onLike: () => void;
  analyser: AnalyserNode | null;
  visualPreset: VisualPreset;
  onOpenStudio: () => void;
  quality: AudioQuality;
}

const Player: React.FC<PlayerProps> = ({ 
  isPlaying, 
  connectionState,
  togglePlay, 
  volume, 
  onVolumeChange, 
  currentVerse,
  likes,
  isLiked,
  onLike,
  analyser,
  visualPreset,
  onOpenStudio,
  quality
}) => {
  const [showVerse, setShowVerse] = useState(true);
  const [shareCopied, setShareCopied] = useState(false);
  const [bitrate, setBitrate] = useState(0);

  // Mock dynamic bitrate for professional feel
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        const base = quality === 'high' ? 318 : quality === 'medium' ? 126 : 62;
        setBitrate(base + Math.random() * 4);
      }, 2000);
      return () => clearInterval(interval);
    } else {
      setBitrate(0);
    }
  }, [isPlaying, quality]);

  const status = (() => {
    switch(connectionState) {
      case 'playing': return { text: 'LIVE BROADCAST', color: 'text-green-500', bg: 'bg-green-500/10', dotColor: 'bg-green-500', icon: <Wifi size={14} /> };
      case 'buffering': 
      case 'loading': return { text: 'SYNCHRONIZING', color: 'text-amber-500', bg: 'bg-amber-500/10', dotColor: 'bg-amber-500', icon: <Loader2 size={14} className="animate-spin" /> };
      case 'error': return { text: 'LINK FAILURE', color: 'text-red-500', bg: 'bg-red-500/10', dotColor: 'bg-red-500', icon: <WifiOff size={14} /> };
      default: return { text: 'STATION STANDBY', color: 'text-gray-500', bg: 'bg-white/5', dotColor: 'bg-gray-500', icon: <Radio size={14} /> };
    }
  })();

  const isLoading = connectionState === 'loading' || connectionState === 'buffering';

  const handleShare = async () => {
    const shareUrl = window.location.origin + window.location.pathname;
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Mix Music', text: 'Ouvindo a Mix Music!', url: shareUrl });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        setShareCopied(true);
        setTimeout(() => setShareCopied(false), 2000);
      }
    } catch {
      await navigator.clipboard.writeText(shareUrl);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-[#080808] p-8 sm:p-12 rounded-[56px] border border-white/10 shadow-[0_80px_160px_-40px_rgba(0,0,0,1)] relative overflow-hidden w-full ring-1 ring-white/5"
    >
      <AnimatePresence>
        {isPlaying && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute -top-20 -right-20 w-[400px] h-[400px] bg-primary/10 blur-[150px] rounded-full pointer-events-none"
          />
        )}
      </AnimatePresence>
      
      <div className="relative z-10 flex flex-col items-center">
        {/* PRO HUD */}
        <div className="w-full flex justify-between items-center mb-10">
          <div className="flex flex-col gap-1">
             <div className={`${status.bg} px-5 py-2.5 rounded-2xl flex items-center gap-3 border border-white/5 shadow-inner`}>
              <div className="relative flex items-center justify-center w-2 h-2">
                <motion.span animate={{ scale: [1, 3], opacity: [0.6, 0] }} transition={{ duration: 1.5, repeat: Infinity }} className={`absolute w-full h-full ${status.dotColor} rounded-full`} />
                <span className={`relative w-2 h-2 ${status.dotColor} rounded-full shadow-[0_0_10px_currentColor]`} />
              </div>
              <span className={`${status.color} font-black text-[10px] uppercase tracking-[0.3em] whitespace-nowrap`}>{status.text}</span>
            </div>
          </div>
          
          <button onClick={onOpenStudio} className="p-4 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-primary rounded-2xl transition-all border border-white/5 active:scale-90 group">
            <Sliders size={20} className="group-hover:rotate-12 transition-transform" />
          </button>
        </div>

        {/* VISUALIZER */}
        <div className="w-full relative mb-12">
           <div className={`h-44 sm:h-52 rounded-[40px] overflow-hidden ring-1 ring-white/10 shadow-2xl transition-all duration-1000 ${isPlaying ? 'opacity-100 scale-100' : 'opacity-20 scale-[0.98] blur-sm'}`}>
             <Visualizer analyser={analyser} preset={visualPreset} isPlaying={isPlaying && connectionState === 'playing'} />
           </div>
           
           <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex gap-4">
              <div className="bg-black/95 px-4 py-2 rounded-xl border border-white/10 flex items-center gap-3 shadow-2xl backdrop-blur-xl">
                 <div className="flex flex-col">
                    <span className="text-[7px] text-white/30 uppercase font-black tracking-widest leading-none mb-1">Carrier Bitrate</span>
                    <span className="text-[11px] font-mono text-primary font-bold tabular-nums">
                      {isPlaying ? bitrate.toFixed(1) : '000.0'} <span className="text-[8px] opacity-50">kbps</span>
                    </span>
                 </div>
                 <div className="w-[1px] h-6 bg-white/5" />
                 <div className="flex flex-col">
                    <span className="text-[7px] text-white/30 uppercase font-black tracking-widest leading-none mb-1">Engine Quality</span>
                    <span className="text-[11px] font-mono text-gray-400 font-bold uppercase tracking-tight">
                      {quality} <span className="text-[8px] opacity-30 text-white">HI-FI</span>
                    </span>
                 </div>
              </div>
           </div>
        </div>

        {/* VERSE BOX WITH ENHANCED VISIBILITY TOGGLE */}
        <div className="w-full relative group/verse mb-10 mt-6">
          <div className="absolute -top-4 right-6 z-20">
            <button 
              onClick={() => setShowVerse(!showVerse)} 
              className="bg-black/90 backdrop-blur-xl border border-white/10 p-2.5 rounded-xl text-gray-500 hover:text-primary transition-all shadow-2xl active:scale-90 flex items-center justify-center overflow-hidden w-11 h-11"
            >
              <AnimatePresence mode="wait" initial={false}>
                {showVerse ? (
                  <motion.div
                    key="eye"
                    initial={{ y: 20, opacity: 0, rotate: -45 }}
                    animate={{ y: 0, opacity: 1, rotate: 0 }}
                    exit={{ y: -20, opacity: 0, rotate: 45 }}
                    transition={{ duration: 0.3, ease: "backOut" }}
                  >
                    <EyeOff size={18} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="eye-off"
                    initial={{ y: 20, opacity: 0, scale: 0.5 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: -20, opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.3, ease: "backOut" }}
                  >
                    <Eye size={18} />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>

          <motion.div 
            animate={{ 
              height: showVerse ? 'auto' : '64px',
              padding: showVerse ? '32px 40px' : '0px',
              opacity: showVerse ? 1 : 0.2
            }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className={`w-full relative bg-white/[0.02] backdrop-blur-[80px] border ${showVerse ? 'border-white/[0.06]' : 'border-transparent'} rounded-[36px] overflow-hidden flex items-center justify-center text-center`}
          >
            <AnimatePresence mode="wait">
              {showVerse ? (
                <motion.div
                  key={currentVerse}
                  initial={{ opacity: 0, y: 15, filter: 'blur(10px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -15, filter: 'blur(10px)' }}
                  transition={{ duration: 0.8 }}
                  className="z-10"
                >
                  <p className="font-sans font-medium text-gray-200 text-lg md:text-xl leading-relaxed tracking-tight italic antialiased">
                    {currentVerse}
                  </p>
                </motion.div>
              ) : (
                <div className="text-[10px] font-black text-white/10 tracking-[0.5em] uppercase flex items-center gap-3">
                  <Activity size={14} className="opacity-20" /> 
                  DATA_ENCRYPTION_ACTIVE
                </div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Station Branding */}
        <div className="text-center mb-12">
          <motion.h2 
            animate={isPlaying ? { scale: [1, 1.02, 1] } : {}}
            transition={{ duration: 4, repeat: Infinity }}
            className="text-4xl font-black mb-2 tracking-tighter text-white uppercase drop-shadow-2xl"
          >
            Mixmusic <span className="text-primary">Digital</span>
          </motion.h2>
          <div className="bg-white/5 px-4 py-1.5 rounded-full border border-white/5 inline-flex items-center gap-3 shadow-inner">
             <Signal size={10} className={isPlaying ? 'text-green-500' : 'text-gray-600'} />
            <span className={`${isPlaying ? 'text-primary' : 'text-zinc-600'} font-black uppercase tracking-[0.3em] text-[9px]`}>
              {isPlaying ? 'STREAMING AT HIGH BITRATE' : 'STANDBY MODE ACTIVE'}
            </span>
          </div>
        </div>

        {/* CONTROLS */}
        <div className="flex items-center justify-center gap-14 mb-14">
          <button onClick={onLike} className={`flex flex-col items-center group transition-all duration-500 ${isLiked ? 'text-primary scale-110' : 'text-zinc-700 hover:text-zinc-400'}`}>
            <Heart fill={isLiked ? "currentColor" : "none"} className="w-8 h-8 mb-2" strokeWidth={2.5} />
            <span className="text-[11px] font-black tabular-nums tracking-tighter">{(likes/1000).toFixed(1)}K</span>
          </button>

          <div className="relative group flex items-center justify-center">
            {[1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                initial={{ scale: 1, opacity: 0 }}
                animate={{ 
                  scale: isPlaying ? [1, 1.8 + i * 0.15] : [1, 1.4 + i * 0.05],
                  opacity: isPlaying ? [0.4 / i, 0] : [0.1 / i, 0]
                }}
                transition={{ duration: isPlaying ? 2.5 : 5, repeat: Infinity, delay: i * 0.6, ease: "easeOut" }}
                className={`absolute w-32 h-32 rounded-full border-2 ${isPlaying ? 'border-primary/40' : 'border-zinc-800/30'} pointer-events-none`}
              />
            ))}

            <button 
              onClick={togglePlay}
              disabled={isLoading}
              className={`relative z-20 w-32 h-32 rounded-full flex items-center justify-center transition-all duration-700 active:scale-90 shadow-[0_30px_80px_rgba(0,0,0,0.9)] ${isPlaying ? 'bg-primary hover:bg-red-700 shadow-primary/40 scale-105' : 'bg-zinc-900 hover:bg-zinc-800 shadow-black'} border border-white/10 ring-8 ring-black/40`}
            >
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div key="l" initial={{ opacity: 0, rotate: 0 }} animate={{ opacity: 1, rotate: 360 }} exit={{ opacity: 0 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                    <Loader2 className="w-14 h-14 text-white" />
                  </motion.div>
                ) : isPlaying ? (
                  <motion.div key="p" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }}>
                    <Pause className="w-14 h-14 fill-current text-white" />
                  </motion.div>
                ) : (
                  <motion.div key="s" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }}>
                    <Play className="w-14 h-14 fill-current ml-2 text-zinc-500 group-hover:text-white transition-colors" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>

          <button onClick={handleShare} className="flex flex-col items-center group transition-all duration-500 text-zinc-700 hover:text-primary">
            <div className="relative">
              <Share2 className="w-8 h-8 mb-2 group-hover:scale-110" strokeWidth={2.5} />
              {shareCopied && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="absolute -top-14 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-black px-3 py-1.5 rounded-xl uppercase shadow-2xl">COPIED</motion.div>
              )}
            </div>
            <span className="text-[11px] font-black uppercase tracking-tighter">SHARE</span>
          </button>
        </div>

        {/* VOLUME */}
        <div className="w-full max-w-md bg-white/[0.03] p-6 rounded-[32px] border border-white/5 shadow-inner">
          <div className="flex justify-between items-center mb-4 px-2">
            <span className="text-[9px] font-black text-gray-700 uppercase tracking-[0.4em]">Master Stage Gain</span>
            <span className={`text-[11px] font-mono tabular-nums font-black ${isPlaying ? 'text-primary' : 'text-zinc-800'}`}>
              -{Math.round((1 - volume) * 60)} <span className="text-[8px] opacity-40">DBU</span>
            </span>
          </div>
          <div className="flex items-center gap-6">
            <Volume1 size={20} className={isPlaying ? 'text-zinc-600' : 'text-zinc-900'} />
            <input 
              type="range" min="0" max="1" step="0.01" value={volume}
              onChange={onVolumeChange}
              className={`w-full h-2 bg-white/5 rounded-full appearance-none cursor-pointer transition-all ${isPlaying ? 'accent-primary hover:accent-red-500' : 'accent-zinc-800'}`}
            />
            <Volume2 size={20} className={isPlaying ? 'text-zinc-600' : 'text-zinc-900'} />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Player;
