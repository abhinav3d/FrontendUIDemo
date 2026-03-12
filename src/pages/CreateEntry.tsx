import React, { useState, useRef } from 'react';
import { ArrowRight, Camera, CheckCircle2, Info, Upload, X, Image as ImageIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import Button from '../components/ui/Button';
import { cn } from '../utils';

export default function CreateEntry() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const guidelines = [
    { title: "Front Facing", desc: "The subject should be looking directly at the camera for best anatomical reconstruction." },
    { title: "Natural Light", desc: "Avoid harsh shadows or overexposure. Soft, natural lighting captures the most detail." },
    { title: "Clear Features", desc: "Ensure eyes, nose, and mouth are clearly visible and not obstructed by hair or accessories." },
    { title: "High Resolution", desc: "The more pixels we have, the more detail our AI and artists can extract for the sculpt." }
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-24 space-y-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
        <div className="space-y-12">
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-commerce">Creation Gateway</span>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter uppercase italic leading-[0.9]">
              Prepare Your <br />
              <span className="text-commerce">Reference</span>
            </h1>
            <p className="text-lg text-neutral-500 dark:text-neutral-400 leading-relaxed">
              To ensure a museum-grade sculpt, we require a high-quality reference photo. Please follow these guidelines before uploading.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {guidelines.map((item, index) => (
              <motion.div 
                key={item.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="space-y-3"
              >
                <div className="flex items-center gap-2 text-commerce">
                  <CheckCircle2 size={18} />
                  <h4 className="font-bold text-sm uppercase tracking-widest">{item.title}</h4>
                </div>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="p-6 bg-neutral-50 dark:bg-neutral-900 rounded-2xl border border-black/5 dark:border-white/5 flex gap-4 items-start">
            <Info size={20} className="text-commerce shrink-0 mt-1" />
            <p className="text-xs text-neutral-500 leading-relaxed">
              <span className="font-bold text-neutral-900 dark:text-neutral-100">Note:</span> Our AI will automatically validate your photo upon upload. If the quality is too low for a high-precision sculpt, we will suggest a replacement.
            </p>
          </div>
        </div>

        <div className="space-y-8">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          
          <div 
            onClick={() => !selectedImage && fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
              "aspect-[4/5] rounded-[3rem] border-2 border-dashed flex flex-col items-center justify-center text-center p-12 group transition-all duration-500 relative overflow-hidden",
              selectedImage ? "border-commerce bg-neutral-50 dark:bg-neutral-900" : "border-neutral-200 dark:border-neutral-800 hover:border-commerce cursor-pointer",
              isDragging && "border-commerce bg-commerce/5 scale-[0.98]"
            )}
          >
            <AnimatePresence mode="wait">
              {selectedImage ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 w-full h-full"
                >
                  <img src={selectedImage} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-4">
                    <button 
                      onClick={clearImage}
                      className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-red-500 transition-colors"
                    >
                      <X size={24} />
                    </button>
                    <p className="text-white text-xs font-bold uppercase tracking-widest">Remove Photo</p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex flex-col items-center"
                >
                  <div className="w-20 h-20 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center mb-6 group-hover:bg-commerce/10 transition-colors">
                    <Camera size={32} className="text-neutral-400 group-hover:text-commerce transition-colors" />
                  </div>
                  <h3 className="text-2xl font-bold tracking-tight mb-2">Ready to Upload?</h3>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-8 max-w-xs leading-relaxed">
                    Drag and drop your reference photo here or click to browse your files.
                  </p>
                  <div className="flex items-center gap-2 text-commerce text-xs font-bold uppercase tracking-widest">
                    <Upload size={14} />
                    Browse Files
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <div className="space-y-4">
            <Button 
              disabled={!selectedImage}
              onClick={() => navigate('/configurator')}
              className="w-full py-6 rounded-full text-sm"
            >
              Continue to Workspace <ArrowRight size={18} />
            </Button>

            <div className="flex justify-center gap-8 text-[10px] font-bold uppercase tracking-widest text-neutral-400">
              <span className="flex items-center gap-1.5"><ImageIcon size={10} /> JPG / PNG / HEIC</span>
              <span>Max 20MB</span>
              <span>Secure & Private</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
