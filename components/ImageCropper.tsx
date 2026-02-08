import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Check, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface ImageCropperProps {
  imageSrc: string;
  aspectRatio: number; // width / height
  onCrop: (base64: string) => void;
  onCancel: () => void;
}

const ImageCropper: React.FC<ImageCropperProps> = ({ imageSrc, aspectRatio, onCrop, onCancel }) => {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const imageRef = useRef<HTMLImageElement>(new Image());

  useEffect(() => {
    imageRef.current.src = imageSrc;
    // Reset state on new image
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, [imageSrc]);

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    (e.target as Element).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isDragging) {
      setPan(prev => ({ x: prev.x + e.movementX, y: prev.y + e.movementY }));
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    (e.target as Element).releasePointerCapture(e.pointerId);
  };

  const executeCrop = () => {
     const canvas = document.createElement('canvas');
     const ctx = canvas.getContext('2d');
     if (!ctx) return;

     // High quality output dimensions
     // We base it on the aspect ratio. Default base width 1200px.
     const width = 1200;
     const height = width / aspectRatio;
     canvas.width = width;
     canvas.height = height;

     const cx = width / 2;
     const cy = height / 2;

     const img = imageRef.current;
     
     // Calculate coverage scale
     const scaleX = width / img.naturalWidth;
     const scaleY = height / img.naturalHeight;
     const baseScale = Math.max(scaleX, scaleY);
     
     const finalScale = baseScale * zoom;

     // Apply transformations
     ctx.translate(cx, cy);
     // Approximate pan scaling (factor derived from visual container width assumption ~400px in UI vs 1200px output)
     // To be precise, we need the container width. For now, assuming standard UI scaling factor of 3x.
     ctx.translate(pan.x * 3, pan.y * 3); 
     ctx.scale(finalScale, finalScale);
     ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);

     onCrop(canvas.toDataURL('image/jpeg', 0.9));
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div 
         initial={{ scale: 0.95, opacity: 0 }} 
         animate={{ scale: 1, opacity: 1 }}
         className="bg-[#0f172a] border border-slate-700 p-6 rounded-3xl w-full max-w-2xl shadow-2xl flex flex-col gap-6"
      >
         <div className="flex justify-between items-center border-b border-slate-800 pb-4">
             <h3 className="text-xl font-black text-white tracking-tight">Adjust Image</h3>
             <button onClick={() => { setZoom(1); setPan({x:0, y:0}); }} className="text-xs font-bold text-cyan-400 flex items-center gap-1 hover:text-cyan-300">
                 <RotateCcw className="w-3 h-3" /> Reset
             </button>
         </div>
         
         {/* Crop Area Container */}
         <div className="flex-1 flex items-center justify-center bg-slate-950/50 rounded-xl overflow-hidden relative min-h-[300px]">
             {/* Actual Crop Box */}
             <div 
                className="relative overflow-hidden bg-slate-900 cursor-move border-2 border-white/20 shadow-2xl ring-1 ring-black/50 touch-none"
                style={{ 
                    aspectRatio: aspectRatio,
                    width: '100%',
                    maxWidth: aspectRatio > 1 ? '500px' : '300px',
                    maxHeight: '60vh'
                }}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerUp}
             >
                 <div 
                    className="w-full h-full flex items-center justify-center origin-center"
                 >
                    <img 
                        src={imageSrc} 
                        alt="Crop target"
                        style={{ 
                            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                            maxWidth: 'none',
                            maxHeight: 'none',
                            height: '100%', // Cover behavior
                            width: 'auto',
                            objectFit: 'cover',
                            pointerEvents: 'none'
                        }}
                    />
                 </div>
                 
                 {/* Professional Rule of Thirds Grid */}
                 <div className="absolute inset-0 pointer-events-none">
                     <div className="absolute left-1/3 top-0 bottom-0 w-px bg-white/30 shadow-[0_0_2px_black]" />
                     <div className="absolute right-1/3 top-0 bottom-0 w-px bg-white/30 shadow-[0_0_2px_black]" />
                     <div className="absolute top-1/3 left-0 right-0 h-px bg-white/30 shadow-[0_0_2px_black]" />
                     <div className="absolute bottom-1/3 left-0 right-0 h-px bg-white/30 shadow-[0_0_2px_black]" />
                 </div>
             </div>
             
             <p className="absolute bottom-2 text-[10px] text-slate-500 font-mono uppercase tracking-widest pointer-events-none">
                 Drag to Pan • Pinch to Zoom
             </p>
         </div>

         <div className="space-y-6">
             {/* Controls */}
             <div className="flex items-center gap-4 bg-slate-900 p-3 rounded-xl border border-slate-800">
                <ZoomOut className="w-5 h-5 text-slate-400" />
                <input 
                    type="range" 
                    min="1" 
                    max="4" 
                    step="0.05" 
                    value={zoom}
                    onChange={(e) => setZoom(parseFloat(e.target.value))}
                    className="flex-1 accent-cyan-500 h-1.5 bg-slate-700 rounded-full appearance-none cursor-pointer"
                />
                <ZoomIn className="w-5 h-5 text-slate-400" />
             </div>

             <div className="flex gap-4">
                 <button 
                    onClick={onCancel}
                    className="flex-1 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl transition-colors flex items-center justify-center gap-2 border border-slate-700"
                 >
                    <X className="w-5 h-5" /> Cancel
                 </button>
                 <button 
                    onClick={executeCrop}
                    className="flex-1 py-3.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-cyan-900/20 flex items-center justify-center gap-2"
                 >
                    <Check className="w-5 h-5" /> Apply Crop
                 </button>
             </div>
         </div>
      </motion.div>
    </div>
  );
};

export default ImageCropper;