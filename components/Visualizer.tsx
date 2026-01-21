
import React, { useRef, useEffect } from 'react';
import { VisualPreset } from '../App';

interface VisualizerProps {
  analyser: AnalyserNode | null;
  preset: VisualPreset;
  isPlaying: boolean;
}

const Visualizer: React.FC<VisualizerProps> = ({ analyser, preset, isPlaying }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const peaksRef = useRef<number[]>([]);
  const backgroundOffsetRef = useRef(0);
  const fireParticlesRef = useRef<{x: number, y: number, size: number, speed: number, alpha: number}[]>([]);

  useEffect(() => {
    if (!canvasRef.current || !analyser) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let animationId: number;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    if (peaksRef.current.length !== bufferLength) {
      peaksRef.current = new Array(bufferLength).fill(0);
    }

    if (fireParticlesRef.current.length === 0) {
      for (let i = 0; i < 60; i++) {
        fireParticlesRef.current.push({
          x: Math.random(),
          y: Math.random(),
          size: Math.random() * 15 + 5,
          speed: Math.random() * 2 + 0.5,
          alpha: Math.random()
        });
      }
    }

    const render = () => {
      const width = canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      const height = canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      const dw = width / window.devicePixelRatio;
      const dh = height / window.devicePixelRatio;

      backgroundOffsetRef.current += 0.05;
      const time = Date.now() * 0.001;
      
      analyser.getByteFrequencyData(dataArray);
      const bassValue = dataArray[2] / 255;
      const midValue = dataArray[20] / 255;

      // 1. BASE BACKGROUND PER PRESET
      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, dw, dh);

      // Unique Background Layer
      switch(preset) {
        case 'fire': {
          const grad = ctx.createRadialGradient(dw/2, dh, 0, dw/2, dh, dh * 1.2);
          grad.addColorStop(0, `rgba(120, 20, 0, ${0.4 * bassValue})`);
          grad.addColorStop(1, '#050505');
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, dw, dh);
          break;
        }
        case 'plasma': {
          for (let i = 0; i < 3; i++) {
            const px = (Math.sin(time * 0.2 + i) * 0.4 + 0.5) * dw;
            const py = (Math.cos(time * 0.15 + i * 1.5) * 0.4 + 0.5) * dh;
            const r = (150 + bassValue * 200);
            const pGrad = ctx.createRadialGradient(px, py, 0, px, py, r);
            pGrad.addColorStop(0, i === 0 ? `rgba(211, 47, 47, 0.15)` : i === 1 ? `rgba(100, 0, 255, 0.1)` : `rgba(0, 200, 255, 0.1)`);
            pGrad.addColorStop(1, 'transparent');
            ctx.fillStyle = pGrad;
            ctx.fillRect(0, 0, dw, dh);
          }
          break;
        }
        case 'hyper': {
          // Dynamic Bokeh Background
          ctx.globalAlpha = 0.3 * midValue;
          for(let i=0; i<10; i++) {
            const bx = (Math.sin(time * 0.1 + i) * 0.5 + 0.5) * dw;
            const by = (Math.cos(time * 0.08 + i * 2) * 0.5 + 0.5) * dh;
            ctx.fillStyle = `hsla(${i * 36}, 70%, 50%, 0.2)`;
            ctx.beginPath();
            ctx.arc(bx, by, 40 + bassValue * 60, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.globalAlpha = 1.0;
          break;
        }
        case 'analog': {
          // Brushed Metal / Texture Background
          const metalGrad = ctx.createRadialGradient(dw/2, dh/2, 0, dw/2, dh/2, dh);
          metalGrad.addColorStop(0, '#1a1a1a');
          metalGrad.addColorStop(1, '#080808');
          ctx.fillStyle = metalGrad;
          ctx.fillRect(0, 0, dw, dh);
          break;
        }
        case 'grid': {
          // Horizon Glow
          const horiz = dh * 0.7;
          const hGrad = ctx.createLinearGradient(0, horiz - 100, 0, horiz);
          hGrad.addColorStop(0, 'transparent');
          hGrad.addColorStop(1, `rgba(211, 47, 47, ${0.2 * bassValue})`);
          ctx.fillStyle = hGrad;
          ctx.fillRect(0, 0, dw, horiz);
          break;
        }
      }

      // 2. MAIN VISUALIZATION RENDERING
      if (preset === 'spectrum' || preset === 'hyper') {
        const barCount = preset === 'hyper' ? 64 : 48;
        const barWidth = (dw / barCount);
        for (let i = 0; i < barCount; i++) {
          const val = dataArray[i];
          const barHeight = (val / 255) * dh * 0.75;
          if (val > peaksRef.current[i]) peaksRef.current[i] = val;
          else peaksRef.current[i] -= 1.5;
          if (peaksRef.current[i] < 0) peaksRef.current[i] = 0;

          const x = i * barWidth;
          const peakY = dh - (peaksRef.current[i] / 255) * dh * 0.75 - 10;

          if (preset === 'hyper') {
             ctx.fillStyle = `hsla(${(i/barCount)*360}, 80%, 50%, 0.8)`;
             ctx.fillRect(x + 2, dh - barHeight - 10, barWidth - 4, barHeight);
             ctx.fillStyle = 'rgba(255,255,255,0.6)';
             ctx.fillRect(x + 2, peakY, barWidth - 4, 2);
          } else {
             const gradient = ctx.createLinearGradient(0, dh, 0, dh - barHeight);
             gradient.addColorStop(0, 'rgba(211, 47, 47, 0.4)');
             gradient.addColorStop(1, 'rgba(211, 47, 47, 1)');
             ctx.fillStyle = gradient;
             ctx.fillRect(x + 1, dh - barHeight - 10, barWidth - 2, barHeight);
             ctx.fillStyle = 'rgba(255,255,255,0.2)';
             ctx.fillRect(x + 1, peakY, barWidth - 2, 1);
          }
        }
      } else if (preset === 'fire') {
        fireParticlesRef.current.forEach(p => {
          p.y -= p.speed * (0.4 + bassValue * 2.5);
          if (p.y < -0.1) { p.y = 1.1; p.x = Math.random(); }
          const px = p.x * dw;
          const py = p.y * dh;
          const size = p.size * (1 + bassValue);
          const pGrad = ctx.createRadialGradient(px, py, 0, px, py, size);
          pGrad.addColorStop(0, `rgba(255, ${120 + bassValue * 135}, 0, ${p.alpha * bassValue})`);
          pGrad.addColorStop(1, 'transparent');
          ctx.fillStyle = pGrad;
          ctx.beginPath(); ctx.arc(px, py, size, 0, Math.PI * 2); ctx.fill();
        });
        const bars = 40;
        const bWidth = dw / bars;
        for(let i=0; i<bars; i++) {
          const v = dataArray[i*2] / 255;
          const h = v * dh * 0.85;
          const fGrad = ctx.createLinearGradient(0, dh, 0, dh-h);
          fGrad.addColorStop(0, '#ff1100');
          fGrad.addColorStop(1, '#ffff00');
          ctx.fillStyle = fGrad;
          ctx.globalAlpha = 0.5;
          ctx.fillRect(i * bWidth, dh - h - 5, bWidth - 2, h);
          ctx.globalAlpha = 1.0;
        }
      } else if (preset === 'plasma') {
        ctx.globalCompositeOperation = 'lighter';
        for (let i = 0; i < 4; i++) {
          const x = (Math.sin(time * 0.4 + i * 2) * 0.3 + 0.5) * dw;
          const y = (Math.cos(time * 0.5 + i) * 0.3 + 0.5) * dh;
          const r = (80 + bassValue * 120) * (i + 1);
          const pGrad = ctx.createRadialGradient(x, y, 0, x, y, r);
          pGrad.addColorStop(0, `rgba(211, 47, 47, ${0.6 * midValue})`);
          pGrad.addColorStop(1, 'transparent');
          ctx.fillStyle = pGrad;
          ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
        }
        ctx.globalCompositeOperation = 'source-over';
      } else if (preset === 'analog') {
        const level = (dataArray[2] + dataArray[6] + dataArray[10]) / 765;
        const centerX = dw / 2;
        const centerY = dh * 0.85;
        const radius = dh * 0.7;
        ctx.strokeStyle = '#222'; ctx.lineWidth = 12; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.arc(centerX, centerY, radius, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke();
        const endAngle = Math.PI * 1.1 + (Math.PI * 0.8 * level);
        ctx.strokeStyle = level > 0.85 ? '#ff0000' : '#D32F2F';
        ctx.beginPath(); ctx.arc(centerX, centerY, radius, Math.PI * 1.1, endAngle); ctx.stroke();
        ctx.save(); ctx.translate(centerX, centerY); ctx.rotate(endAngle + Math.PI / 2);
        ctx.fillStyle = '#eee'; ctx.beginPath(); ctx.moveTo(-3, 0); ctx.lineTo(3, 0); ctx.lineTo(0, -radius * 1.05); ctx.fill();
        ctx.restore();
        ctx.font = '900 18px Montserrat'; ctx.fillStyle = 'rgba(255,255,255,0.05)'; ctx.textAlign = 'center';
        ctx.fillText('PEAK LEVEL VU', centerX, centerY - 60);
      } else if (preset === 'oscilloscope') {
        const timeData = new Uint8Array(bufferLength);
        analyser.getByteTimeDomainData(timeData);
        ctx.lineWidth = 2.5; ctx.strokeStyle = '#D32F2F'; ctx.shadowBlur = 15; ctx.shadowColor = '#D32F2F';
        ctx.beginPath();
        const sliceWidth = dw / bufferLength;
        let ox = 0;
        for (let i = 0; i < bufferLength; i++) {
          const v = timeData[i] / 128.0;
          const y = (dh / 2) + ((v - 1) * (dh / 2) * 0.95);
          if (i === 0) ctx.moveTo(ox, y);
          else ctx.lineTo(ox, y);
          ox += sliceWidth;
        }
        ctx.stroke();
        ctx.shadowBlur = 0;
      } else if (preset === 'radial') {
        const centerX = dw / 2;
        const centerY = dh / 2;
        const radius = dh * 0.3;
        for (let i = 0; i < 90; i++) {
          const val = dataArray[i * 2];
          const barLen = (val / 255) * radius * 1.2;
          const angle = (i / 90) * Math.PI * 2;
          ctx.strokeStyle = `rgba(211, 47, 47, ${0.4 + val/400})`; ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(centerX + Math.cos(angle) * radius, centerY + Math.sin(angle) * radius);
          ctx.lineTo(centerX + Math.cos(angle) * (radius + barLen), centerY + Math.sin(angle) * (radius + barLen));
          ctx.stroke();
        }
      } else if (preset === 'grid') {
        const gridIntensity = dataArray[8] / 255;
        ctx.strokeStyle = `rgba(211, 47, 47, ${0.1 + gridIntensity * 0.4})`;
        ctx.lineWidth = 1.2;
        const spacing = 40;
        const offset = (Date.now() * 0.05) % spacing;
        for (let x = -spacing; x < dw + spacing; x += spacing) {
          ctx.beginPath(); ctx.moveTo(x + offset, 0); ctx.lineTo(x + offset, dh); ctx.stroke();
        }
        for (let y = -spacing; y < dh + spacing; y += spacing) {
          ctx.beginPath(); ctx.moveTo(0, y + offset); ctx.lineTo(dw, y + offset); ctx.stroke();
        }
        // Central Pulse
        ctx.fillStyle = `rgba(211, 47, 47, ${0.05 * gridIntensity})`;
        ctx.beginPath(); ctx.arc(dw/2, dh/2, 50 + gridIntensity * 100, 0, Math.PI * 2); ctx.fill();
      }

      // OSD OVERLAY
      if (isPlaying) {
        ctx.font = '900 7px Montserrat';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        const statusLines = [
          `ENGINE: L-SYNCH V5`,
          `PRESET: ${preset.toUpperCase()}`,
          `B-SYNC: ${Math.round(bassValue * 100)}%`
        ];
        statusLines.forEach((line, i) => ctx.fillText(line, 20, 25 + (i * 10)));
        ctx.fillText(new Date().toLocaleTimeString(), dw - 80, 25);
      }

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [analyser, preset, isPlaying]);

  return (
    <div className="relative w-full h-full overflow-hidden rounded-[32px] bg-[#050505] border border-white/5 shadow-2xl group">
      <canvas ref={canvasRef} className="w-full h-full block" />
      
      {/* Visual Depth Overlays */}
      <div className="absolute inset-0 pointer-events-none opacity-5 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.15)_50%)] bg-[length:100%_4px]"></div>
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.4)_100%)]"></div>
      
      {/* Functional HUD Brackets */}
      <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-primary/30 transition-all group-hover:w-6 group-hover:h-6"></div>
      <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-primary/30 transition-all group-hover:w-6 group-hover:h-6"></div>
      <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-primary/30 transition-all group-hover:w-6 group-hover:h-6"></div>
      <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-primary/30 transition-all group-hover:w-6 group-hover:h-6"></div>
    </div>
  );
};

export default Visualizer;
