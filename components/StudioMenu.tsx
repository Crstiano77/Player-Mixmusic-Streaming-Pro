import React, { useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { 
  X, Activity, Cpu, Layers, Settings2, Zap, Radio, Globe, 
  Disc, Music, Music2, Waves, Mic2, ShieldCheck, ZapOff, 
  Flame, Droplets, Gauge, MonitorPlay, Timer, Calendar, 
  Clock, Trash2, Wifi, WifiOff, Power, ChevronRight, Binary
} from 'lucide-react';
import { AudioQuality, VisualPreset, EQPreset, EQBands } from '../App';

interface StudioMenuProps {
  isOpen: boolean;
  onClose: () => void;
  currentPreset: VisualPreset;
  setPreset: (p: VisualPreset) => void;
  currentQuality: AudioQuality;
  setQuality: (q: AudioQuality) => void;
  eqPreset: EQPreset;
  applyEqPreset: (p: EQPreset) => void;
  eqBands: EQBands;
  setManualBand: (band: keyof EQBands, value: number) => void;
  scheduledOnTime: string | null;
  setScheduledOnTime: (time: string | null) => void;
  scheduledOffTime: string | null;
  setScheduledOffTime: (time: string | null) => void;
  isPlaying: boolean;
}

const StudioMenu: React.FC<StudioMenuProps> = ({ 
  isOpen, 
  onClose, 
  currentPreset, 
  setPreset, 
  currentQuality, 
  setQuality,
  eqPreset,
  applyEqPreset,
  eqBands,
  setManualBand,
  scheduledOnTime,
  setScheduledOnTime,
  scheduledOffTime,
  setScheduledOffTime,
  isPlaying
}) => {
  const [localOnTime, setLocalOnTime] = useState('');
  const [localOffTime, setLocalOffTime] = useState('');

  if (!isOpen) return null;

  const bitrates = {
    high: '320 KBPS / 48 kHz',
    medium: '128 KBPS / 44.1 kHz',
    low: '64 KBPS / 22 kHz'
  };

  const presetsList = [
    { id: 'spectrum', name: 'Digital Bar', icon: <Layers size={16}/> },
    { id: 'hyper', name: 'Hyper Edit', icon: <MonitorPlay size={16}/>, label: 'PRO ENGINE' },
    { id: 'fire', name: 'Pyrotechnic', icon: <Flame size={16}/>, label: 'FX CORE' },
    { id: 'plasma', name: 'Liquid Aura', icon: <Droplets size={16}/> },
    { id: 'analog', name: 'Legacy VU', icon: <Gauge size={16}/> },
    { id: 'oscilloscope', name: 'Wave Link', icon: <Activity size={16}/> },
    { id: 'radial', name: 'Core Pulse', icon: <Disc size={16}/> },
    { id: 'grid', name: 'Cyber Net', icon: <Cpu size={16}/> }
  ];

  // Fix: Adding explicit Variants type and casting ease to any to resolve cubic-bezier array type mismatch
  const containerVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { 
        duration: 0.5, 
        ease: [0.16, 1, 0.3, 1] as any,
        staggerChildren: 0.1
      }
    },
    exit: { opacity: 0, scale: 0.95, y: 20 }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-3xl"
      />
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="relative bg-[#0a0a0a]/90 border border-white/10 w-full max-w-xl rounded-[40px] shadow-[0_50px_100px_-20px_rgba(0,0,0,1)] overflow-hidden flex flex-col ring-1 ring-white/5 max-h-[90vh]"
      >
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[80px] rounded-full pointer-events-none" />

        {/* Header Profissional */}
        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
          <div className="flex items-center gap-5">
            <div className="relative group">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-2 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              />
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-zinc-800 to-black flex items-center justify-center border border-white/10 shadow-2xl relative z-10">
                  <Settings2 className="text-primary w-7 h-7" />
              </div>
            </div>
            <div>
                <h3 className="font-black text-2xl leading-none uppercase tracking-tighter text-white">Studio Console</h3>
                <div className="flex items-center gap-2 mt-2">
                  <span className="flex items-center gap-1.5 text-[10px] text-primary font-black tracking-widest uppercase">
                    <Binary size={10} /> MASTER ENGINE
                  </span>
                  <div className="w-1 h-1 rounded-full bg-white/10" />
                  <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">STATION_V.5.4</span>
                </div>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="w-12 h-12 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-2xl transition-all text-zinc-500 hover:text-white border border-white/5 active:scale-90"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-8 space-y-12 overflow-y-auto scrollbar-hide">
          
          {/* STREAM SCHEDULER - PAINEL DE AUTOMAÇÃO */}
          <motion.section variants={itemVariants} className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                  <Timer size={16} className="text-primary" />
                </div>
                <label className="text-[11px] font-black uppercase tracking-[0.4em] text-white/80">Stream Scheduler</label>
              </div>
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                 <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Automation Ready</span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {/* Card Autoplay (ON) */}
              <div className="bg-gradient-to-br from-white/[0.04] to-transparent border border-white/10 rounded-[32px] p-6 space-y-5 transition-all hover:border-white/20 group/card relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/5 blur-3xl pointer-events-none group-hover/card:bg-green-500/10 transition-colors" />
                
                <div className="flex items-center justify-between relative">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-xl transition-all ${scheduledOnTime ? 'bg-green-500 text-white shadow-[0_0_20px_rgba(34,197,94,0.3)]' : 'bg-zinc-800 text-zinc-500'}`}>
                      <Wifi size={18} />
                    </div>
                    <div>
                      <span className="text-[11px] font-black uppercase tracking-widest text-white block">Auto Link</span>
                      <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-tighter">Scheduler Entry Stage</span>
                    </div>
                  </div>
                  {scheduledOnTime && (
                    <motion.button 
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setScheduledOnTime(null)} 
                      className="w-10 h-10 flex items-center justify-center bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all border border-red-500/20"
                    >
                      <Trash2 size={14} />
                    </motion.button>
                  )}
                </div>

                <div className="flex gap-3 relative">
                  <div className="relative flex-grow group/input">
                    <input 
                      type="datetime-local" 
                      value={localOnTime}
                      onChange={(e) => setLocalOnTime(e.target.value)}
                      className="w-full bg-black border border-white/5 rounded-2xl px-5 py-4 text-xs font-mono text-white/70 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all appearance-none"
                    />
                    <Calendar size={12} className="absolute right-5 top-1/2 -translate-y-1/2 text-white/10 pointer-events-none transition-colors group-focus-within/input:text-primary" />
                  </div>
                  <button 
                    onClick={() => setScheduledOnTime(localOnTime)}
                    disabled={!localOnTime}
                    className={`px-8 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 disabled:opacity-30 ${scheduledOnTime ? 'bg-white/10 text-white border border-white/20' : 'bg-primary text-white shadow-2xl hover:bg-primary/80'}`}
                  >
                    {scheduledOnTime ? 'RE-SYNC' : 'SET LINK'}
                  </button>
                </div>
              </div>

              {/* Card Autostop (OFF) */}
              <div className="bg-gradient-to-br from-white/[0.04] to-transparent border border-white/10 rounded-[32px] p-6 space-y-5 transition-all hover:border-white/20 group/card relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 blur-3xl pointer-events-none group-hover/card:bg-red-500/10 transition-colors" />

                <div className="flex items-center justify-between relative">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-xl transition-all ${scheduledOffTime ? 'bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.3)]' : 'bg-zinc-800 text-zinc-500'}`}>
                      <WifiOff size={18} />
                    </div>
                    <div>
                      <span className="text-[11px] font-black uppercase tracking-widest text-white block">Auto Unlink</span>
                      <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-tighter">Scheduler Exit Stage</span>
                    </div>
                  </div>
                  {scheduledOffTime && (
                    <motion.button 
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setScheduledOffTime(null)} 
                      className="w-10 h-10 flex items-center justify-center bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all border border-red-500/20"
                    >
                      <Trash2 size={14} />
                    </motion.button>
                  )}
                </div>

                <div className="flex gap-3 relative">
                  <div className="relative flex-grow group/input">
                    <input 
                      type="datetime-local" 
                      value={localOffTime}
                      onChange={(e) => setLocalOffTime(e.target.value)}
                      className="w-full bg-black border border-white/5 rounded-2xl px-5 py-4 text-xs font-mono text-white/70 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all appearance-none"
                    />
                    <Calendar size={12} className="absolute right-5 top-1/2 -translate-y-1/2 text-white/10 pointer-events-none group-focus-within/input:text-primary" />
                  </div>
                  <button 
                    onClick={() => setScheduledOffTime(localOffTime)}
                    disabled={!localOffTime}
                    className={`px-8 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 disabled:opacity-30 ${scheduledOffTime ? 'bg-white/10 text-white border border-white/20' : 'bg-primary text-white shadow-2xl hover:bg-primary/80'}`}
                  >
                    {scheduledOffTime ? 'RE-SYNC' : 'SET UNLINK'}
                  </button>
                </div>
              </div>
            </div>

            {/* Status Panel */}
            <AnimatePresence>
              {(scheduledOnTime || scheduledOffTime) && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-black/80 rounded-[28px] border border-white/5 p-6 backdrop-blur-xl relative group overflow-hidden"
                >
                  <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="flex items-center gap-3 mb-5 border-b border-white/5 pb-4">
                    <Activity size={14} className="text-primary animate-pulse" />
                    <span className="text-[10px] font-black text-white/80 uppercase tracking-[0.3em]">Master Schedule Live Dashboard</span>
                  </div>
                  <div className="grid grid-cols-2 gap-8 relative z-10">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                         <div className={`w-1.5 h-1.5 rounded-full ${scheduledOnTime ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-zinc-800'}`} />
                         <span className="text-[8px] font-black text-zinc-500 uppercase tracking-[0.2em]">Next Connection</span>
                      </div>
                      <p className="text-sm font-mono text-white font-bold tracking-tight">
                        {scheduledOnTime ? new Date(scheduledOnTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' }) : 'NOT_SET'}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                         <div className={`w-1.5 h-1.5 rounded-full ${scheduledOffTime ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'bg-zinc-800'}`} />
                         <span className="text-[8px] font-black text-zinc-500 uppercase tracking-[0.2em]">Next Termination</span>
                      </div>
                      <p className="text-sm font-mono text-white font-bold tracking-tight">
                        {scheduledOffTime ? new Date(scheduledOffTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' }) : 'NOT_SET'}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.section>

          {/* Audio Engine Quality */}
          <motion.section variants={itemVariants} className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                  <Gauge size={16} className="text-primary" />
                </div>
                <label className="text-[11px] font-black uppercase tracking-[0.4em] text-white/80">Audio Synthesis Engine</label>
              </div>
              <ShieldCheck size={14} className="text-green-500/20" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[
                { id: 'high', name: 'Ultra-Fi', icon: <Zap size={18}/>, label: '320k Lossless' },
                { id: 'medium', name: 'Optimal', icon: <Radio size={18}/>, label: '128k Balanced' },
                { id: 'low', name: 'Eco-Link', icon: <Globe size={18}/>, label: '64k Economy' }
              ].map((q) => (
                <button
                  key={q.id}
                  onClick={() => setQuality(q.id as AudioQuality)}
                  className={`group flex flex-col items-center gap-4 p-6 rounded-[32px] border transition-all duration-500 relative overflow-hidden ${
                    currentQuality === q.id 
                    ? 'bg-primary border-primary shadow-[0_20px_40px_rgba(211,47,47,0.3)] text-white scale-105 z-10' 
                    : 'bg-white/[0.03] border-white/5 text-zinc-600 hover:bg-white/10 hover:text-zinc-300'
                  }`}
                >
                  <div className={`transition-transform duration-500 ${currentQuality === q.id ? 'scale-110' : 'group-hover:scale-110'}`}>
                    {q.icon}
                  </div>
                  <div className="text-center">
                    <span className="font-black text-[12px] block uppercase tracking-tight">{q.name}</span>
                    <span className={`text-[8px] font-mono tracking-tighter mt-1 block uppercase ${currentQuality === q.id ? 'text-white/60' : 'text-zinc-600'}`}>{q.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </motion.section>

          {/* Equalization Presets */}
          <motion.section variants={itemVariants} className="space-y-8">
             <div className="flex items-center gap-3 px-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                  <Music size={16} className="text-primary" />
                </div>
                <label className="text-[11px] font-black uppercase tracking-[0.4em] text-white/80">Master Signal EQ</label>
            </div>
            
            <div className="flex flex-wrap gap-2.5">
              {[
                { id: 'flat', name: 'BYPASS', icon: <Music size={14} /> },
                { id: 'bass', name: 'SUB-BASE', icon: <Waves size={14} /> },
                { id: 'vocal', name: 'SPEECH', icon: <Mic2 size={14} /> },
                { id: 'bright', name: 'CRISP', icon: <Zap size={14} /> },
                { id: 'rock', name: 'STADIUM', icon: <Music2 size={14} /> }
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => applyEqPreset(p.id as EQPreset)}
                  className={`flex items-center gap-2.5 px-6 py-3.5 rounded-2xl border text-[11px] font-black uppercase tracking-widest transition-all duration-300 ${
                    eqPreset === p.id 
                    ? 'bg-primary border-primary text-white shadow-xl scale-105 active:scale-95' 
                    : 'bg-white/5 border-white/5 text-zinc-600 hover:bg-white/10 active:scale-95'
                  }`}
                >
                  {p.icon}
                  {p.name}
                </button>
              ))}
            </div>

            {/* Manual EQ Sliders Rack */}
            <div className="grid grid-cols-3 gap-10 bg-black/80 p-10 rounded-[40px] border border-white/10 shadow-inner group relative overflow-hidden">
               <div className="absolute inset-0 bg-primary/[0.02] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
               {(['low', 'mid', 'high'] as const).map((band) => (
                 <div key={band} className="flex flex-col items-center gap-6 relative z-10">
                    <div className="h-40 w-3 bg-white/5 rounded-full relative flex flex-col justify-end ring-1 ring-white/10 shadow-inner overflow-hidden group/slider">
                      <motion.div 
                        animate={{ height: `${((eqBands[band] + 12) / 24) * 100}%` }}
                        className="w-full bg-primary rounded-full shadow-[0_0_20px_rgba(211,47,47,0.8)] relative"
                      >
                         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rounded-full border-4 border-primary shadow-2xl -translate-y-1/2" />
                      </motion.div>
                      <input 
                        type="range"
                        min="-12"
                        max="12"
                        step="0.5"
                        value={eqBands[band]}
                        onChange={(e) => setManualBand(band, parseFloat(e.target.value))}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer -rotate-180 [writing-mode:bt-lr] z-20"
                        style={{ appearance: 'slider-vertical' as any }}
                      />
                    </div>
                    <div className="text-center">
                      <span className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.2em] block mb-2">{band}</span>
                      <div className="px-3 py-1 bg-white/5 rounded-lg border border-white/5">
                        <span className="text-[12px] font-mono text-primary font-black">{eqBands[band] > 0 ? `+${eqBands[band]}` : eqBands[band]} <span className="text-[9px] opacity-40">dB</span></span>
                      </div>
                    </div>
                 </div>
               ))}
            </div>
          </motion.section>

          {/* Visualization Presets Grid */}
          <motion.section variants={itemVariants} className="space-y-6">
            <div className="flex items-center gap-3 px-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                  <MonitorPlay size={16} className="text-primary" />
                </div>
                <label className="text-[11px] font-black uppercase tracking-[0.4em] text-white/80">Signal Analysis HUD</label>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {presetsList.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPreset(p.id as VisualPreset)}
                  className={`flex items-center gap-4 p-5 rounded-[28px] border transition-all text-left relative overflow-hidden group/viz ${
                    currentPreset === p.id 
                    ? 'bg-primary/10 border-primary/40 text-white shadow-2xl ring-1 ring-primary/20' 
                    : 'bg-white/[0.02] border-white/5 text-zinc-600 hover:bg-white/10 hover:text-zinc-300'
                  }`}
                >
                  <div className={`p-2.5 rounded-xl transition-colors ${currentPreset === p.id ? 'bg-primary text-white shadow-[0_0_15px_rgba(211,47,47,0.5)]' : 'bg-white/5 text-zinc-500 group-hover/viz:text-zinc-200'}`}>
                    {p.icon}
                  </div>
                  <div>
                    <span className="font-black text-[13px] uppercase tracking-tighter leading-none block">{p.name}</span>
                    <div className="flex items-center gap-2 mt-1">
                       <div className={`w-1 h-1 rounded-full ${currentPreset === p.id ? 'bg-primary' : 'bg-zinc-800'}`} />
                       <span className={`text-[8px] font-black uppercase opacity-60 tracking-[0.2em] ${currentPreset === p.id ? 'text-primary' : 'text-zinc-600'}`}>{p.label || 'Standard'}</span>
                    </div>
                  </div>
                  {currentPreset === p.id && (
                    <div className="absolute top-1/2 -translate-y-1/2 right-4 text-primary opacity-50">
                      <ChevronRight size={16} />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </motion.section>
        </div>

        {/* Console Footer */}
        <div className="p-8 bg-gradient-to-t from-white/[0.04] to-transparent text-center border-t border-white/5">
          <div className="flex items-center justify-center gap-10 opacity-30">
            <div className="flex flex-col items-center">
               <span className="text-[8px] font-black text-white/50 uppercase tracking-[0.3em] mb-1">LATENCY_SYNC</span>
               <span className="text-[10px] font-mono text-white/80">0.02ms</span>
            </div>
            <div className="w-[1px] h-6 bg-white/10" />
            <div className="flex flex-col items-center">
               <span className="text-[8px] font-black text-white/50 uppercase tracking-[0.3em] mb-1">CPU_LOAD</span>
               <span className="text-[10px] font-mono text-white/80">3.4%</span>
            </div>
            <div className="w-[1px] h-6 bg-white/10" />
            <div className="flex flex-col items-center">
               <span className="text-[8px] font-black text-white/50 uppercase tracking-[0.3em] mb-1">UPTIME_SES</span>
               <span className="text-[10px] font-mono text-white/80">04:12:09</span>
            </div>
          </div>
          <p className="text-[11px] text-zinc-700 font-black uppercase tracking-[0.6em] mt-8 flex items-center justify-center gap-4">
            <ZapOff size={14} className="opacity-20" />
            STATION_CORE_V.5.4_FINAL
            <ZapOff size={14} className="opacity-20" />
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default StudioMenu;
