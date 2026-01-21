
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Player from './components/Player';
import Footer from './components/Footer';
import StudioMenu from './components/StudioMenu';
import { verses } from './constants/verses';

export type ConnectionState = 'idle' | 'loading' | 'playing' | 'buffering' | 'error' | 'stalled';
export type AudioQuality = 'high' | 'medium' | 'low';
export type VisualPreset = 'spectrum' | 'oscilloscope' | 'radial' | 'grid' | 'fire' | 'plasma' | 'analog' | 'hyper';
export type EQPreset = 'flat' | 'bass' | 'vocal' | 'bright' | 'rock';

export interface EQBands {
  low: number;
  mid: number;
  high: number;
}

const App: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [connectionState, setConnectionState] = useState<ConnectionState>('idle');
  const [volume, setVolume] = useState(0.8);
  const [currentVerse, setCurrentVerse] = useState(verses[0]);
  const [isStudioOpen, setIsStudioOpen] = useState(false);
  const [visualPreset, setVisualPreset] = useState<VisualPreset>('spectrum');
  const [quality, setQuality] = useState<AudioQuality>('high');
  const [likes, setLikes] = useState(1250);
  const [isLiked, setIsLiked] = useState(false);
  
  // Dual Scheduling State
  const [scheduledOnTime, setScheduledOnTime] = useState<string | null>(null);
  const [scheduledOffTime, setScheduledOffTime] = useState<string | null>(null);

  // EQ State
  const [eqPreset, setEqPreset] = useState<EQPreset>('flat');
  const [eqBands, setEqBands] = useState<EQBands>({ low: 0, mid: 0, high: 0 });

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  
  // Filter nodes
  const lowFilterRef = useRef<BiquadFilterNode | null>(null);
  const midFilterRef = useRef<BiquadFilterNode | null>(null);
  const highFilterRef = useRef<BiquadFilterNode | null>(null);

  useEffect(() => {
    const audio = new Audio('http://link.zeno.fm:80/sn4w5hvfppiuv');
    audio.crossOrigin = "anonymous";
    audio.volume = volume;
    audioRef.current = audio;

    audio.onwaiting = () => setConnectionState('buffering');
    audio.onplaying = () => setConnectionState('playing');
    audio.onstalled = () => setConnectionState('stalled');
    audio.onerror = () => setConnectionState('error');
    audio.oncanplay = () => {
      if (isPlaying) setConnectionState('playing');
    };

    const interval = setInterval(() => {
      setCurrentVerse(prev => {
        let next = prev;
        while (next === prev) {
          next = verses[Math.floor(Math.random() * verses.length)];
        }
        return next;
      });
    }, 30000);

    return () => {
      clearInterval(interval);
      audio.pause();
    };
  }, []);

  // Dual Scheduling Watchdog
  useEffect(() => {
    if (!scheduledOnTime && !scheduledOffTime) return;

    const checkSchedule = setInterval(() => {
      const now = new Date();
      
      // Check for Auto-Link (Turn ON)
      if (scheduledOnTime) {
        const targetOn = new Date(scheduledOnTime);
        if (now >= targetOn) {
          if (!isPlaying) {
            startStream();
          }
          setScheduledOnTime(null);
        }
      }

      // Check for Auto-Unlink (Turn OFF)
      if (scheduledOffTime) {
        const targetOff = new Date(scheduledOffTime);
        if (now >= targetOff) {
          if (isPlaying) {
            stopStream();
          }
          setScheduledOffTime(null);
        }
      }
    }, 1000);

    return () => clearInterval(checkSchedule);
  }, [scheduledOnTime, scheduledOffTime, isPlaying]);

  const initAudioContext = () => {
    if (!audioCtxRef.current && audioRef.current) {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 512; 
      
      const lowFilter = ctx.createBiquadFilter();
      lowFilter.type = 'lowshelf';
      lowFilter.frequency.value = 320;
      lowFilter.gain.value = eqBands.low;

      const midFilter = ctx.createBiquadFilter();
      midFilter.type = 'peaking';
      midFilter.frequency.value = 1000;
      midFilter.Q.value = 1;
      midFilter.gain.value = eqBands.mid;

      const highFilter = ctx.createBiquadFilter();
      highFilter.type = 'highshelf';
      highFilter.frequency.value = 3200;
      highFilter.gain.value = eqBands.high;

      const source = ctx.createMediaElementSource(audioRef.current);
      
      source.connect(lowFilter);
      lowFilter.connect(midFilter);
      midFilter.connect(highFilter);
      highFilter.connect(analyser);
      analyser.connect(ctx.destination);
      
      audioCtxRef.current = ctx;
      analyserRef.current = analyser;
      lowFilterRef.current = lowFilter;
      midFilterRef.current = midFilter;
      highFilterRef.current = highFilter;
    }
  };

  const startStream = () => {
    initAudioContext();
    setConnectionState('loading');
    if (audioCtxRef.current?.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    audioRef.current?.play()
      .then(() => setIsPlaying(true))
      .catch(() => setConnectionState('error'));
  };

  const stopStream = () => {
    audioRef.current?.pause();
    setIsPlaying(false);
    setConnectionState('idle');
  };

  const togglePlay = useCallback(() => {
    if (!audioRef.current) return;
    if (isPlaying) stopStream();
    else startStream();
  }, [isPlaying, eqBands]);

  const handleQualityChange = (q: AudioQuality) => {
    setQuality(q);
    if (isPlaying && audioRef.current) {
      setConnectionState('buffering');
      setTimeout(() => {
        if (isPlaying) setConnectionState('playing');
      }, 1500);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (audioRef.current) audioRef.current.volume = val;
  };

  const handleLike = () => {
    if (isLiked) setLikes(prev => prev - 1);
    else setLikes(prev => prev + 1);
    setIsLiked(!isLiked);
  };

  const setManualBand = (band: keyof EQBands, value: number) => {
    setEqBands(prev => ({ ...prev, [band]: value }));
    setEqPreset('flat');
    
    if (band === 'low' && lowFilterRef.current) lowFilterRef.current.gain.value = value;
    if (band === 'mid' && midFilterRef.current) midFilterRef.current.gain.value = value;
    if (band === 'high' && highFilterRef.current) highFilterRef.current.gain.value = value;
  };

  const applyEqPreset = (preset: EQPreset) => {
    setEqPreset(preset);
    let bands: EQBands = { low: 0, mid: 0, high: 0 };
    
    switch(preset) {
      case 'bass': bands = { low: 8, mid: 0, high: -2 }; break;
      case 'vocal': bands = { low: -2, mid: 6, high: 2 }; break;
      case 'bright': bands = { low: -4, mid: 0, high: 8 }; break;
      case 'rock': bands = { low: 5, mid: -2, high: 5 }; break;
      case 'flat': bands = { low: 0, mid: 0, high: 0 }; break;
    }
    
    setEqBands(bands);
    if (lowFilterRef.current) lowFilterRef.current.gain.value = bands.low;
    if (midFilterRef.current) midFilterRef.current.gain.value = bands.mid;
    if (highFilterRef.current) highFilterRef.current.gain.value = bands.high;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#050505] selection:bg-primary/30 selection:text-white overflow-hidden transition-colors duration-1000">
      <Navbar onCtaClick={() => document.getElementById('player-section')?.scrollIntoView({ behavior: 'smooth' })} />

      <main className="flex-grow flex flex-col items-center justify-center px-4 py-8 md:px-6">
        <div className="w-full max-w-screen-xl mx-auto flex flex-col items-center gap-6">
          <Hero />
          
          <div id="player-section" className="w-full max-w-[480px] md:max-w-[520px]">
            <Player 
              isPlaying={isPlaying}
              connectionState={connectionState}
              togglePlay={togglePlay}
              volume={volume}
              onVolumeChange={handleVolumeChange}
              currentVerse={currentVerse}
              likes={likes}
              isLiked={isLiked}
              onLike={handleLike}
              analyser={analyserRef.current}
              visualPreset={visualPreset}
              onOpenStudio={() => setIsStudioOpen(true)}
              quality={quality}
            />
          </div>
        </div>
      </main>

      <Footer />

      <AnimatePresence>
        {isStudioOpen && (
          <StudioMenu 
            isOpen={isStudioOpen} 
            onClose={() => setIsStudioOpen(false)}
            currentPreset={visualPreset}
            setPreset={setVisualPreset}
            currentQuality={quality}
            setQuality={handleQualityChange}
            eqPreset={eqPreset}
            applyEqPreset={applyEqPreset}
            eqBands={eqBands}
            setManualBand={setManualBand}
            scheduledOnTime={scheduledOnTime}
            setScheduledOnTime={setScheduledOnTime}
            scheduledOffTime={scheduledOffTime}
            setScheduledOffTime={setScheduledOffTime}
            isPlaying={isPlaying}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
