import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Layers, Info, ArrowRight, MessageSquare, Check, Sparkles, Palette, SlidersHorizontal, Camera, ChevronRight, ChevronLeft, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ModelViewer from '../components/ModelViewer';
import { cn } from '../utils';
import { STYLE_DATA, StyleTemplate } from '../data/styleData';
import Button from '../components/ui/Button';

type Stage = 'upload' | 'style' | 'refine' | 'preview' | 'checkout';

const STAGES: { id: Stage; label: string; icon: any; desc: string }[] = [
  { id: 'upload', label: 'Reference', icon: Camera, desc: 'Upload your photo' },
  { id: 'style', label: 'Aesthetic', icon: Palette, desc: 'Choose your style' },
  { id: 'refine', label: 'Refine', icon: SlidersHorizontal, desc: 'Configure details' },
  { id: 'preview', label: 'Preview', icon: Sparkles, desc: 'AI Reconstruction' },
  { id: 'checkout', label: 'Checkout', icon: Check, desc: 'Finalize Order' },
];

export default function Configurator() {
  const navigate = useNavigate();
  const [activeStage, setActiveStage] = useState<Stage>('upload');
  const [selectedStyleId, setSelectedStyleId] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState('15cm');
  const [material, setMaterial] = useState('Matte Resin (Standard)');
  const [isPriority, setIsPriority] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [useAI, setUseAI] = useState<boolean | null>(null);
  const [aiCoinBalance, setAiCoinBalance] = useState(50);
  const [validationStatus, setValidationStatus] = useState<{
    status: 'valid' | 'warning' | 'error';
    message: string;
    code?: 'subject_mismatch' | 'multiple_subjects' | 'low_quality' | 'nsfw';
  }>({ status: 'valid', message: 'Image validated for AI reconstruction.' });

  const selectedStyle = useMemo(() => 
    STYLE_DATA.templates.find(t => t.id === selectedStyleId),
    [selectedStyleId]
  );

  const simulateValidation = () => {
    // Mock validation logic based on style and image
    if (!selectedStyle) return;
    
    // For demo purposes, we'll trigger a mismatch if the style is "Royal" (Pet) but we pretend it's a human
    if (selectedStyle.styleKey.includes('PETS') && Math.random() > 0.7) {
      setValidationStatus({
        status: 'error',
        message: 'Subject Mismatch: This template is designed for pets, but a human was detected.',
        code: 'subject_mismatch'
      });
      setUseAI(false);
    } else if (Math.random() > 0.8) {
      setValidationStatus({
        status: 'warning',
        message: 'Multiple subjects detected. AI might struggle with precise reconstruction.',
        code: 'multiple_subjects'
      });
    } else {
      setValidationStatus({ status: 'valid', message: 'Image validated for AI reconstruction.' });
      setUseAI(true);
    }
  };

  const creationName = useMemo(() => {
    if (!uploadedImage) return 'Untitled Creation';
    const hash = Math.random().toString(36).substring(7).toUpperCase();
    return `SCULPT-${hash}`;
  }, [uploadedImage]);

  const calculateTotal = () => {
    const base = selectedStyle ? 129 : 0;
    const sizeAdd = selectedSize === '20cm' ? 40 : selectedSize === '15cm' ? 20 : 0;
    const materialAdd = material.includes('Premium') ? 15 : material.includes('Painted') ? 50 : 0;
    const priorityAdd = isPriority ? 40 : 0;
    return base + sizeAdd + materialAdd + priorityAdd;
  };

  const handleNext = () => {
    const currentIndex = STAGES.findIndex(s => s.id === activeStage);
    if (activeStage === 'style') {
      simulateValidation();
    }
    
    let nextStageId = STAGES[currentIndex + 1]?.id;

    // Skip preview if not using AI
    if (activeStage === 'refine' && useAI === false) {
      nextStageId = 'checkout';
    }

    if (nextStageId) {
      setActiveStage(nextStageId);
    }
  };

  const handleBack = () => {
    const currentIndex = STAGES.findIndex(s => s.id === activeStage);
    let prevStageId = STAGES[currentIndex - 1]?.id;

    // Skip preview when going back from checkout if not using AI
    if (activeStage === 'checkout' && useAI === false) {
      prevStageId = 'refine';
    }

    if (prevStageId) {
      setActiveStage(prevStageId);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left Side: Creative Workspace */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          {/* Stage Navigation */}
          <div className="bg-white dark:bg-black border border-black/5 dark:border-white/5 rounded-[2rem] p-2 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar p-1">
              {STAGES.map((s, i) => {
                const Icon = s.icon;
                const isActive = activeStage === s.id;
                const isCompleted = STAGES.findIndex(st => st.id === activeStage) > i;
                
                return (
                  <button
                    key={s.id}
                    onClick={() => setActiveStage(s.id)}
                    className={cn(
                      "flex items-center gap-3 px-6 py-3 rounded-full transition-all whitespace-nowrap group",
                      isActive 
                        ? "bg-commerce text-white shadow-lg shadow-commerce/20" 
                        : isCompleted 
                          ? "text-commerce hover:bg-commerce/5" 
                          : "text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
                    )}
                  >
                    <div className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border",
                      isActive ? "border-white/40" : isCompleted ? "border-commerce/40" : "border-neutral-200 dark:border-neutral-800"
                    )}>
                      {isCompleted ? <Check size={12} /> : i + 1}
                    </div>
                    <div className="text-left">
                      <p className="text-[10px] font-bold uppercase tracking-widest leading-none">{s.label}</p>
                    </div>
                  </button>
                );
              })}
            </div>
            <div className="hidden md:flex items-center gap-2 px-6 border-l border-black/5 dark:border-white/5">
              <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Step {STAGES.findIndex(s => s.id === activeStage) + 1} of 4</span>
            </div>
          </div>

          {/* Stage Content */}
          <div className="flex-1 min-h-[500px] bg-neutral-50 dark:bg-neutral-950 rounded-[3rem] border border-black/5 dark:border-white/5 overflow-hidden relative">
            <AnimatePresence mode="wait">
              {activeStage === 'upload' && (
                <motion.div 
                  key="upload"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="h-full flex flex-col items-center justify-center p-12 text-center space-y-8"
                >
                  <div className="space-y-4 max-w-md">
                    <h3 className="text-3xl font-bold tracking-tight">Provide Your Reference</h3>
                    <p className="text-sm text-neutral-500">Our AI and artists need a clear photo to begin the reconstruction process.</p>
                  </div>
                  
                  <div 
                    className="w-full max-w-lg aspect-video rounded-[2.5rem] border-2 border-dashed border-neutral-200 dark:border-neutral-800 flex flex-col items-center justify-center group hover:border-commerce transition-all cursor-pointer bg-white dark:bg-black"
                    onClick={() => setUploadedImage('https://picsum.photos/seed/ref/800/800')}
                  >
                    {uploadedImage ? (
                      <img src={uploadedImage} alt="Reference" className="w-full h-full object-cover rounded-[2.3rem]" />
                    ) : (
                      <>
                        <div className="w-16 h-16 rounded-full bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center mb-4 group-hover:bg-commerce/10 transition-colors">
                          <Upload className="text-neutral-400 group-hover:text-commerce transition-colors" />
                        </div>
                        <p className="text-sm font-bold">Click to upload or drag and drop</p>
                        <p className="text-xs text-neutral-400 mt-2">JPG, PNG, HEIC up to 20MB</p>
                      </>
                    )}
                  </div>

                  <Button onClick={handleNext} disabled={!uploadedImage}>
                    Continue to Style <ArrowRight size={18} />
                  </Button>
                </motion.div>
              )}

              {activeStage === 'style' && (
                <motion.div 
                  key="style"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="h-full p-12 space-y-8"
                >
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h3 className="text-2xl font-bold tracking-tight">Select Aesthetic</h3>
                      <p className="text-sm text-neutral-500">Choose the artistic direction for your 3D sculpt.</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={handleBack}><ChevronLeft size={16} /></Button>
                      <Button size="sm" onClick={handleNext} disabled={!selectedStyleId}>Next Step <ChevronRight size={16} /></Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto max-h-[600px] pr-2 no-scrollbar">
                    {STYLE_DATA.templates.map(t => (
                      <button 
                        key={t.id}
                        onClick={() => setSelectedStyleId(t.id)}
                        className={cn(
                          "group p-4 rounded-[2rem] border transition-all text-left space-y-4 bg-white dark:bg-black",
                          selectedStyleId === t.id ? "border-commerce ring-4 ring-commerce/10 shadow-xl" : "border-black/5 dark:border-white/5 hover:border-commerce"
                        )}
                      >
                        <div className="aspect-square rounded-2xl overflow-hidden relative">
                          <img src={t.thumbnailUrl || undefined} alt={t.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                          {selectedStyleId === t.id && (
                            <div className="absolute inset-0 bg-commerce/20 flex items-center justify-center">
                              <div className="w-10 h-10 rounded-full bg-white text-commerce flex items-center justify-center shadow-lg">
                                <Check size={20} />
                              </div>
                            </div>
                          )}
                        </div>
                        <div>
                          <h4 className="font-bold text-sm leading-tight">{t.name}</h4>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mt-1">{t.aiWorkflowSpec.inputPolicy.subject}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeStage === 'refine' && (
                <motion.div 
                  key="refine"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="h-full flex flex-col"
                >
                  <div className="p-12 pb-6 flex items-center justify-between">
                    <div className="space-y-1">
                      <h3 className="text-2xl font-bold tracking-tight">Refine & Validate</h3>
                      <p className="text-sm text-neutral-500">Review AI analysis and configure physical details.</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={handleBack}><ChevronLeft size={16} /></Button>
                      <Button size="sm" onClick={handleNext}>
                        {useAI ? 'Preview AI' : 'Skip to Preview'} <Sparkles size={16} />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex-1 p-12 pt-0 grid grid-cols-1 lg:grid-cols-2 gap-12 overflow-y-auto no-scrollbar">
                    <div className="space-y-8">
                      {/* AI Validation Status */}
                      <div className={cn(
                        "p-6 rounded-3xl border-2 flex gap-4 items-start transition-all",
                        validationStatus.status === 'valid' ? "bg-emerald-50/50 border-emerald-100 dark:bg-emerald-500/5 dark:border-emerald-500/20" :
                        validationStatus.status === 'warning' ? "bg-amber-50/50 border-amber-100 dark:bg-amber-500/5 dark:border-amber-500/20" :
                        "bg-red-50/50 border-red-100 dark:bg-red-500/5 dark:border-red-500/20"
                      )}>
                        <div className={cn(
                          "w-10 h-10 rounded-2xl flex items-center justify-center shrink-0",
                          validationStatus.status === 'valid' ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20" :
                          validationStatus.status === 'warning' ? "bg-amber-100 text-amber-600 dark:bg-amber-500/20" :
                          "bg-red-100 text-red-600 dark:bg-red-500/20"
                        )}>
                          {validationStatus.status === 'valid' ? <Check size={20} /> : <Info size={20} />}
                        </div>
                        <div className="space-y-1">
                          <h4 className={cn(
                            "text-sm font-bold uppercase tracking-widest",
                            validationStatus.status === 'valid' ? "text-emerald-700 dark:text-emerald-400" :
                            validationStatus.status === 'warning' ? "text-amber-700 dark:text-amber-400" :
                            "text-red-700 dark:text-red-400"
                          )}>
                            AI Analysis: {validationStatus.status}
                          </h4>
                          <p className="text-xs text-neutral-500 leading-relaxed">
                            {validationStatus.message}
                          </p>
                        </div>
                      </div>

                      {/* User Choices */}
                      <div className="space-y-4">
                        <label className="text-xs font-bold uppercase tracking-widest text-neutral-400">Workflow Choice</label>
                        <div className="grid grid-cols-1 gap-3">
                          <button
                            onClick={() => setUseAI(true)}
                            disabled={validationStatus.status === 'error'}
                            className={cn(
                              "p-4 rounded-2xl border text-left transition-all flex items-center justify-between group",
                              useAI ? "border-commerce bg-commerce/5 ring-4 ring-commerce/5" : "border-black/5 dark:border-white/5 bg-white dark:bg-black hover:border-commerce",
                              validationStatus.status === 'error' && "opacity-50 cursor-not-allowed grayscale"
                            )}
                          >
                            <div className="flex items-center gap-4">
                              <div className={cn(
                                "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                                useAI ? "bg-commerce text-white" : "bg-neutral-100 dark:bg-neutral-900 text-neutral-400 group-hover:text-commerce"
                              )}>
                                <Sparkles size={20} />
                              </div>
                              <div>
                                <p className="text-sm font-bold">Use AI Reconstruction</p>
                                <p className="text-[10px] text-neutral-500">Automated 3D prep with -10% discount</p>
                              </div>
                            </div>
                            {useAI && <Check size={16} className="text-commerce" />}
                          </button>

                          <button
                            onClick={() => setUseAI(false)}
                            className={cn(
                              "p-4 rounded-2xl border text-left transition-all flex items-center justify-between group",
                              !useAI ? "border-commerce bg-commerce/5 ring-4 ring-commerce/5" : "border-black/5 dark:border-white/5 bg-white dark:bg-black hover:border-commerce"
                            )}
                          >
                            <div className="flex items-center gap-4">
                              <div className={cn(
                                "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                                !useAI ? "bg-commerce text-white" : "bg-neutral-100 dark:bg-neutral-900 text-neutral-400 group-hover:text-commerce"
                              )}>
                                <User size={20} />
                              </div>
                              <div>
                                <p className="text-sm font-bold">Direct Order (Artist Only)</p>
                                <p className="text-[10px] text-neutral-500">Skip AI, direct to master sculptor</p>
                              </div>
                            </div>
                            {!useAI && <Check size={16} className="text-commerce" />}
                          </button>

                          <button
                            onClick={() => setActiveStage('upload')}
                            className="p-4 rounded-2xl border border-black/5 dark:border-white/5 bg-white dark:bg-black hover:border-red-500/50 hover:bg-red-50/50 dark:hover:bg-red-500/5 transition-all flex items-center gap-4 group"
                          >
                            <div className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-900 text-neutral-400 group-hover:text-red-500 flex items-center justify-center transition-colors">
                              <Camera size={20} />
                            </div>
                            <div>
                              <p className="text-sm font-bold group-hover:text-red-600 transition-colors">Change Reference</p>
                              <p className="text-[10px] text-neutral-500">Reset flow and upload new photo</p>
                            </div>
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-8">
                      <div className="aspect-square rounded-[2.5rem] overflow-hidden border border-black/5 dark:border-white/5 bg-neutral-100 dark:bg-neutral-900">
                        <ModelViewer />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeStage === 'preview' && (
                <motion.div 
                  key="preview"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="h-full flex flex-col"
                >
                  <div className="p-12 pb-6 flex items-center justify-between">
                    <div className="space-y-1">
                      <h3 className="text-2xl font-bold tracking-tight">AI Reconstruction</h3>
                      <p className="text-sm text-neutral-500">
                        Simulated preview of the AI-generated physical model.
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={handleBack}><ChevronLeft size={16} /></Button>
                      <Button size="sm" onClick={handleNext}>Continue to Checkout <ArrowRight size={16} /></Button>
                    </div>
                  </div>

                  <div className="flex-1 p-12 pt-0 space-y-8">
                    <div className="relative aspect-video rounded-[3rem] overflow-hidden border border-black/5 dark:border-white/5 shadow-2xl">
                      <ModelViewer />
                      <div className="absolute inset-0 bg-commerce/5 backdrop-blur-[1px] flex items-center justify-center pointer-events-none">
                        <div className="px-6 py-3 bg-white/90 dark:bg-black/90 backdrop-blur-md rounded-full shadow-2xl flex items-center gap-3 border border-white/20">
                          <Sparkles size={18} className="text-commerce animate-pulse" />
                          <span className="text-[10px] font-bold uppercase tracking-widest">AI Synthesis Active</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-6">
                      {[
                        { label: 'Reference', img: uploadedImage },
                        { label: 'AI Mesh', img: 'https://picsum.photos/seed/mesh/400/400' },
                        { label: 'Final Sculpt', img: 'https://picsum.photos/seed/final/400/400' }
                      ].map((t, i) => (
                        <div key={t.label} className="space-y-3">
                          <div className="aspect-square bg-neutral-100 dark:bg-neutral-900 rounded-3xl border border-black/5 dark:border-white/5 overflow-hidden">
                            <img src={t.img || undefined} alt={t.label} className="w-full h-full object-cover" />
                          </div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-center text-neutral-500">{t.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeStage === 'checkout' && (
                <motion.div 
                  key="checkout"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="h-full flex flex-col p-12 space-y-12 overflow-y-auto no-scrollbar"
                >
                  {/* Row 1: Header & Workflow Summary */}
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 p-8 bg-white dark:bg-black rounded-[2.5rem] border border-black/5 dark:border-white/5 shadow-sm">
                    <div className="flex items-center gap-6">
                      <div className="relative w-24 h-24 rounded-2xl overflow-hidden border border-black/5 dark:border-white/5 group shrink-0">
                        <img src={uploadedImage || undefined} alt="Reference" className="w-full h-full object-cover" />
                        <button 
                          onClick={() => setIsImageModalOpen(true)}
                          className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                        >
                          <Camera size={16} />
                        </button>
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-2xl font-bold tracking-tight">Finalize Your Order</h3>
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">ID:</span>
                          <span className="text-xs font-mono font-bold text-commerce">{creationName}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-neutral-50 dark:bg-neutral-900 rounded-2xl border border-black/5 dark:border-white/5">
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center",
                        useAI ? "bg-commerce text-white" : "bg-neutral-100 dark:bg-neutral-900 text-neutral-400"
                      )}>
                        {useAI ? <Sparkles size={20} /> : <User size={20} />}
                      </div>
                      <div>
                        <p className="text-sm font-bold">{useAI ? 'AI + Artist Flow' : 'Artist Flow Only'}</p>
                        <p className="text-[10px] text-neutral-500">
                          {useAI ? 'Neural synthesis + human refinement' : '100% manual master craftsmanship'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Row 2: Configurator & Payment */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Left: Configurator */}
                    <div className="space-y-10">
                      <div className="space-y-6">
                        <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-400">Physical Configurator</h4>
                        <div className="space-y-8">
                          <div className="space-y-3">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Model Size</label>
                            <div className="grid grid-cols-3 gap-3">
                              {['10cm', '15cm', '20cm'].map(size => (
                                <button 
                                  key={size} 
                                  onClick={() => setSelectedSize(size)}
                                  className={cn(
                                    "py-3 rounded-2xl text-xs font-bold border transition-all",
                                    selectedSize === size ? "border-commerce bg-commerce/5 text-commerce shadow-lg" : "border-black/5 dark:border-white/5 bg-white dark:bg-black hover:border-commerce"
                                  )}
                                >
                                  {size}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-3">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Material Finish</label>
                            <div className="grid grid-cols-1 gap-2">
                              {[
                                { id: 'matte', name: 'Matte Resin (Standard)' },
                                { id: 'premium', name: 'Polished Premium Resin' },
                                { id: 'painted', name: 'Hand-Painted Detail' }
                              ].map(m => (
                                <button
                                  key={m.id}
                                  onClick={() => setMaterial(m.name)}
                                  className={cn(
                                    "w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between text-xs",
                                    material === m.name ? "border-commerce bg-white dark:bg-black font-bold" : "border-black/5 dark:border-white/5 bg-white dark:bg-black hover:border-commerce"
                                  )}
                                >
                                  {m.name}
                                  {material === m.name && <Check size={16} className="text-commerce" />}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center justify-between p-6 bg-white dark:bg-black rounded-[2rem] border border-black/5 dark:border-white/5 shadow-sm">
                            <div className="space-y-1">
                              <p className="text-xs font-bold uppercase tracking-widest">Priority Sculpting</p>
                              <p className="text-[10px] text-neutral-500">Compress timeline by 2 weeks</p>
                            </div>
                            <button 
                              onClick={() => setIsPriority(!isPriority)}
                              className={cn(
                                "w-10 h-6 rounded-full transition-colors relative",
                                isPriority ? "bg-commerce" : "bg-neutral-200 dark:bg-neutral-800"
                              )}
                            >
                              <div className={cn(
                                "absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm",
                                isPriority ? "left-5" : "left-1"
                              )} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right: Payment & Actions */}
                    <div className="space-y-8">
                      <div className="p-8 bg-commerce/5 rounded-[2.5rem] border border-commerce/10 space-y-8 shadow-sm">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold uppercase tracking-widest text-commerce">Payment Breakdown</h4>
                          <div className="px-2 py-1 bg-commerce text-white rounded text-[8px] font-bold uppercase tracking-widest">Secure</div>
                        </div>
                        
                        <div className="space-y-4">
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-neutral-500">Base Sculpt</span>
                            <span className="font-mono font-bold">${selectedStyle ? 129 : 0}</span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-neutral-500">Size Upgrade ({selectedSize})</span>
                            <span className="font-mono font-bold">+${selectedSize === '20cm' ? 40 : selectedSize === '15cm' ? 20 : 0}</span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-neutral-500">Material Upgrade</span>
                            <span className="font-mono font-bold">+${material.includes('Premium') ? 15 : material.includes('Painted') ? 50 : 0}</span>
                          </div>
                          {isPriority && (
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-neutral-500">Priority Sculpting</span>
                              <span className="font-mono font-bold">+$40</span>
                            </div>
                          )}

                          {useAI && selectedStyle && (
                            <div className="mt-4 p-4 bg-white/50 dark:bg-black/50 rounded-2xl border border-black/5 dark:border-white/5 space-y-2">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Sparkles size={12} className="text-commerce" />
                                  <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">AI Task Info</span>
                                </div>
                                <span className="text-[10px] font-mono text-neutral-500">Informational Only</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] text-neutral-500">AI Synthesis Cost</span>
                                <span className="text-[10px] font-mono font-bold">{selectedStyle.aiCoinCost} Coins</span>
                              </div>
                            </div>
                          )}

                          <div className="pt-6 border-t border-commerce/10 flex justify-between items-center">
                            <div className="space-y-1">
                              <span className="font-bold">Grand Total</span>
                              <p className="text-[10px] text-neutral-400">Includes all physical production costs</p>
                            </div>
                            <div className="text-right">
                              <p className="text-3xl font-bold font-mono text-commerce">${calculateTotal()}</p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <Button className="w-full py-6 rounded-2xl shadow-xl shadow-commerce/20">
                            Complete Purchase <ArrowRight size={18} />
                          </Button>
                          <button className="w-full py-4 bg-white dark:bg-black border border-black/10 dark:border-white/10 rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all flex items-center justify-center gap-2">
                            <MessageSquare size={14} /> Contact Sales
                          </button>
                        </div>
                      </div>

                      <div className="p-6 bg-neutral-100 dark:bg-neutral-900 rounded-3xl border border-black/5 dark:border-white/5 flex gap-4 items-start">
                        <Info size={16} className="text-neutral-400 shrink-0 mt-0.5" />
                        <p className="text-[10px] text-neutral-500 leading-relaxed">
                          By completing this purchase, you agree to our terms of service. AI coins used for the preview phase are non-refundable once the synthesis task has been initiated.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Side: Sidebar Panel */}
        <aside className="lg:col-span-4">
          <div className="sticky top-24 space-y-6">
            {useAI === null && activeStage !== 'checkout' ? (
              <div className="p-8 bg-neutral-50 dark:bg-neutral-950 rounded-[2.5rem] border border-black/5 dark:border-white/5 space-y-8">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-400">Process Guide</h3>
                    <div className="px-2 py-1 bg-commerce/10 text-commerce rounded text-[8px] font-bold uppercase tracking-widest">Educational</div>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-xl bg-commerce/10 flex items-center justify-center text-commerce shrink-0 font-bold text-xs">1</div>
                      <div className="space-y-1">
                        <p className="text-xs font-bold">Reference Analysis</p>
                        <p className="text-[10px] text-neutral-500 leading-relaxed">Our system analyzes your photo for depth, subject type, and artistic compatibility.</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-xl bg-commerce/10 flex items-center justify-center text-commerce shrink-0 font-bold text-xs">2</div>
                      <div className="space-y-1">
                        <p className="text-xs font-bold">Aesthetic Mapping</p>
                        <p className="text-[10px] text-neutral-500 leading-relaxed">We map your subject to the selected artistic style using advanced neural synthesis.</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-xl bg-commerce/10 flex items-center justify-center text-commerce shrink-0 font-bold text-xs">3</div>
                      <div className="space-y-1">
                        <p className="text-xs font-bold">Workflow Selection</p>
                        <p className="text-[10px] text-neutral-500 leading-relaxed">Choose between high-speed AI reconstruction or traditional master artist hand-sculpting.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-white dark:bg-black rounded-3xl border border-black/5 dark:border-white/5 space-y-3">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Expectations</p>
                  <p className="text-[10px] text-neutral-500 leading-relaxed">
                    Physical scuplts typically take 4-6 weeks for production and shipping. AI-assisted orders benefit from a faster digital preparation phase.
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-8 bg-neutral-50 dark:bg-neutral-950 rounded-[2.5rem] border border-black/5 dark:border-white/5 space-y-8">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-400">Order Summary</h3>
                    <div className="px-2 py-1 bg-commerce/10 text-commerce rounded text-[8px] font-bold uppercase tracking-widest">Draft</div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-white dark:bg-black rounded-2xl border border-black/5 dark:border-white/5">
                      <div className="w-12 h-12 rounded-xl bg-neutral-100 dark:bg-neutral-900 overflow-hidden shrink-0">
                        {selectedStyle ? (
                          <img src={selectedStyle.thumbnailUrl || undefined} alt={selectedStyle.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-neutral-300">
                            <Palette size={20} />
                          </div>
                        )}
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-bold">{selectedStyle?.name || 'No Style Selected'}</p>
                        <p className="text-[10px] text-neutral-500 uppercase tracking-widest">{selectedStyle?.aiWorkflowSpec.inputPolicy.subject || 'Subject'}</p>
                      </div>
                    </div>

                    <div className="space-y-3 px-2">
                      <div className="flex justify-between items-center text-xs text-neutral-500">
                        <span>Base Sculpt</span>
                        <span className="font-mono">${selectedStyle ? 129 : 0}</span>
                      </div>

                      <div className="space-y-2 pt-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Model Size</label>
                        <div className="grid grid-cols-3 gap-2">
                          {['10cm', '15cm', '20cm'].map(size => (
                            <button 
                              key={size} 
                              onClick={() => setSelectedSize(size)}
                              className={cn(
                                "py-2 rounded-xl text-[10px] font-bold border transition-all",
                                selectedSize === size ? "border-commerce bg-commerce/5 text-commerce" : "border-black/5 dark:border-white/5 bg-white dark:bg-black hover:border-commerce"
                              )}
                            >
                              {size}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2 pt-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Material Finish</label>
                        <div className="space-y-1">
                          {[
                            { id: 'matte', name: 'Matte Resin (Standard)' },
                            { id: 'premium', name: 'Polished Premium Resin' },
                            { id: 'painted', name: 'Hand-Painted Detail' }
                          ].map(m => (
                            <button
                              key={m.id}
                              onClick={() => setMaterial(m.name)}
                              className={cn(
                                "w-full p-2 rounded-lg border text-left transition-all flex items-center justify-between text-[10px]",
                                material === m.name ? "border-commerce bg-white dark:bg-black font-bold" : "border-transparent text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-900"
                              )}
                            >
                              {m.name}
                              {material === m.name && <Check size={12} className="text-commerce" />}
                            </button>
                          ))}
                        </div>
                      </div>

                      {useAI && selectedStyle && (
                        <div className="mt-6 p-4 bg-commerce/5 rounded-2xl border border-commerce/10 space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Sparkles size={14} className="text-commerce" />
                              <span className="text-[10px] font-bold uppercase tracking-widest">AI Coin Balance</span>
                            </div>
                            <span className="text-xs font-mono font-bold">{aiCoinBalance} Coins</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] text-neutral-500">Task Cost</span>
                            <span className="text-xs font-mono text-commerce font-bold">-{selectedStyle.aiCoinCost} Coins</span>
                          </div>
                          {aiCoinBalance < selectedStyle.aiCoinCost && (
                            <button className="w-full py-2 bg-commerce text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-commerce/90 transition-all shadow-lg shadow-commerce/20">
                              Purchase Coins
                            </button>
                          )}
                        </div>
                      )}

                      <div className="flex justify-between items-center text-xs text-neutral-500 pt-4">
                        <span>Size Upgrade</span>
                        <span className="font-mono">+${selectedSize === '20cm' ? 40 : selectedSize === '15cm' ? 20 : 0}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs text-neutral-500">
                        <span>Material Upgrade</span>
                        <span className="font-mono">+${material.includes('Premium') ? 15 : material.includes('Painted') ? 50 : 0}</span>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 bg-white dark:bg-black rounded-2xl border border-black/5 dark:border-white/5 mt-4">
                        <div className="space-y-1">
                          <p className="text-[10px] font-bold uppercase tracking-widest">Priority Sculpting</p>
                          <p className="text-[8px] text-neutral-500">Compress timeline by 2 weeks</p>
                        </div>
                        <button 
                          onClick={() => setIsPriority(!isPriority)}
                          className={cn(
                            "w-8 h-5 rounded-full transition-colors relative",
                            isPriority ? "bg-commerce" : "bg-neutral-200 dark:bg-neutral-800"
                          )}
                        >
                          <div className={cn(
                            "absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all shadow-sm",
                            isPriority ? "left-3.5" : "left-0.5"
                          )} />
                        </button>
                      </div>

                      <div className="flex justify-between items-center pt-4 border-t border-black/5 dark:border-white/5">
                        <span className="font-bold">Total Estimate</span>
                        <span className="text-2xl font-bold font-mono text-commerce">${calculateTotal()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button 
                    onClick={() => activeStage === 'checkout' ? navigate('/checkout') : handleNext()}
                    className="w-full py-6 rounded-2xl shadow-xl shadow-commerce/20"
                  >
                    {activeStage === 'checkout' ? 'Complete Purchase' : 'Next Step'} <ArrowRight size={18} />
                  </Button>
                  
                  <button className="w-full py-4 bg-white dark:bg-black border border-black/10 dark:border-white/10 rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all">
                    Save Draft
                  </button>
                </div>
              </div>
            )}

            <div className="p-6 bg-neutral-50 dark:bg-neutral-950 rounded-[2rem] border border-black/5 dark:border-white/5 flex gap-4 items-start">
              <Info size={16} className="text-commerce shrink-0 mt-0.5" />
              <p className="text-[10px] text-neutral-500 leading-relaxed">
                Final pricing may vary slightly based on the complexity of the artist's refinement phase. You will be notified of any adjustments before production begins.
              </p>
            </div>

            <button className="w-full py-4 flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest text-neutral-400 hover:text-commerce transition-colors">
              <MessageSquare size={14} />
              Contact Artist for Advice
            </button>
          </div>
        </aside>
      </div>

      {/* Image Modal */}
      <AnimatePresence>
        {isImageModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-12"
            onClick={() => setIsImageModalOpen(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-5xl w-full aspect-square rounded-[3rem] overflow-hidden shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <img src={uploadedImage || undefined} alt="Full Reference" className="w-full h-full object-contain" />
              <button 
                onClick={() => setIsImageModalOpen(false)}
                className="absolute top-8 right-8 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md text-white flex items-center justify-center hover:bg-white/20 transition-all"
              >
                <Check size={24} className="rotate-45" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
