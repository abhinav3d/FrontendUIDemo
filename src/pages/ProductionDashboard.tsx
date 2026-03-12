import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  MessageSquare, 
  Send, 
  CheckCircle2, 
  Truck, 
  Camera,
  Info,
  Search,
  Box,
  Layers
} from 'lucide-react';
import { cn } from '../utils';
import ModelViewer from '../components/ModelViewer';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const StageTracker = ({ stages }: any) => (
  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
    {stages.map((stage: any, index: number) => (
      <div key={stage.id} className="relative">
        <div className={cn(
          "p-6 rounded-3xl border transition-all space-y-3",
          stage.status === 'complete' ? "bg-commerce/5 border-commerce/20" : 
          stage.status === 'active' ? "bg-white dark:bg-black border-commerce shadow-lg shadow-commerce/10" : 
          "bg-neutral-50 dark:bg-neutral-950 border-black/5 dark:border-white/5 opacity-50"
        )}>
          <div className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center",
            stage.status === 'complete' ? "bg-commerce text-white" : 
            stage.status === 'active' ? "bg-commerce/10 text-commerce" : 
            "bg-neutral-200 dark:bg-neutral-800 text-neutral-400"
          )}>
            {stage.status === 'complete' ? <CheckCircle2 size={20} /> : stage.icon}
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Stage {index + 1}</p>
            <p className="text-sm font-bold">{stage.label}</p>
          </div>
        </div>
        {index < stages.length - 1 && (
          <div className="hidden md:block absolute top-1/2 -right-2 w-4 h-[1px] bg-neutral-200 dark:bg-neutral-800 z-0" />
        )}
      </div>
    ))}
  </div>
);

const ChatThread = ({ messages, message, setMessage }: any) => (
  <aside className="lg:col-span-4 h-[700px] flex flex-col bg-neutral-50 dark:bg-neutral-950 rounded-[3rem] border border-black/5 dark:border-white/5 overflow-hidden">
    <div className="p-6 border-b border-black/5 dark:border-white/5 bg-white dark:bg-black">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-commerce/10 flex items-center justify-center text-commerce">
          <MessageSquare size={20} />
        </div>
        <div>
          <h4 className="font-bold">Production Thread</h4>
          <p className="text-[10px] text-neutral-500 uppercase tracking-widest">Artist: Alex</p>
        </div>
      </div>
    </div>

    <div className="flex-grow overflow-y-auto p-6 space-y-6">
      {messages.map((msg: any) => (
        <div key={msg.id} className={cn(
          "flex flex-col",
          msg.type === 'user' ? "items-end" : msg.type === 'system' ? "items-center" : "items-start"
        )}>
          {msg.type === 'system' ? (
            <div className="px-4 py-1.5 bg-neutral-100 dark:bg-neutral-900 rounded-full text-[10px] font-bold uppercase tracking-widest text-neutral-400">
              {msg.text}
            </div>
          ) : (
            <div className="max-w-[85%] space-y-1">
              <div className={cn(
                "p-4 rounded-2xl text-sm",
                msg.type === 'user' 
                  ? "bg-commerce text-white rounded-tr-none" 
                  : "bg-white dark:bg-black border border-black/5 dark:border-white/5 rounded-tl-none"
              )}>
                {msg.text}
              </div>
              <p className="text-[10px] text-neutral-400 px-1">{msg.sender} • {msg.time}</p>
            </div>
          )}
        </div>
      ))}
    </div>

    <div className="p-6 bg-white dark:bg-black border-t border-black/5 dark:border-white/5">
      <div className="relative">
        <input 
          type="text" 
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="w-full p-4 pr-12 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-black/5 dark:border-white/5 text-sm outline-none focus:border-commerce transition-colors"
        />
        <button className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-commerce text-white rounded-xl flex items-center justify-center hover:scale-110 transition-transform">
          <Send size={14} />
        </button>
      </div>
    </div>
  </aside>
);

export default function ProductionDashboard() {
  const { id } = useParams();
  const [message, setMessage] = useState('');
  
  const stages = [
    { id: 'analysis', label: 'Analysis', icon: <Search size={16} />, status: 'complete' },
    { id: 'sculpting', label: 'Sculpting', icon: <Box size={16} />, status: 'active' },
    { id: 'review', label: 'Review', icon: <CheckCircle2 size={16} />, status: 'pending' },
    { id: 'printing', label: 'Printing', icon: <Layers size={16} />, status: 'pending' },
    { id: 'shipping', label: 'Shipping', icon: <Truck size={16} />, status: 'pending' },
  ];

  const messages = [
    { id: 1, sender: 'Artist Alex', text: 'I have started the initial digital sculpt. The facial features are coming along well.', time: '10:30 AM', type: 'artist' },
    { id: 2, sender: 'System', text: 'Production stage updated to: Sculpting', time: '11:00 AM', type: 'system' },
    { id: 3, sender: 'You', text: 'Looks great! Can we make sure the hair texture is prominent?', time: '11:15 AM', type: 'user' },
    { id: 4, sender: 'Artist Alex', text: 'Absolutely. I will add more definition to the hair strands in the next iteration.', time: '11:45 AM', type: 'artist' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <Link to="/workspace" className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-neutral-400 hover:text-commerce transition-colors">
            <ArrowLeft size={14} /> Back to Workspace
          </Link>
          <h1 className="text-4xl font-bold tracking-tight">Order {id || '#4401'}</h1>
          <p className="text-neutral-500 dark:text-neutral-400">Realistic Portrait • Matte Resin • 15cm</p>
        </div>
        
        <div className="flex gap-3">
          <Button variant="secondary">
            Download Invoice
          </Button>
          <Button>
            Order Support
          </Button>
        </div>
      </div>

      <StageTracker stages={stages} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Active Stage Panel */}
        <div className="lg:col-span-8 space-y-8">
          <Card className="p-8 space-y-8">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <h3 className="text-2xl font-bold tracking-tight">Current Progress: Digital Sculpting</h3>
                <p className="text-sm text-neutral-500">Estimated completion for this stage: March 12, 2026</p>
              </div>
              <div className="px-4 py-2 bg-commerce/10 text-commerce rounded-full text-[10px] font-bold uppercase tracking-widest animate-pulse">
                In Progress
              </div>
            </div>

            <div className="aspect-video bg-neutral-100 dark:bg-neutral-900 rounded-[2rem] overflow-hidden border border-black/5 dark:border-white/5 relative group">
              <ModelViewer autoRotate />
              <div className="absolute top-6 left-6 px-4 py-2 bg-black/50 backdrop-blur rounded-full text-[10px] font-bold uppercase tracking-widest text-white">
                Live Sculpt Preview
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card variant="muted" className="p-6 space-y-4">
                <div className="flex items-center gap-3 text-commerce">
                  <Info size={18} />
                  <h4 className="font-bold">Artist Notes</h4>
                </div>
                <p className="text-sm text-neutral-500 leading-relaxed">
                  Working on the fine details of the facial structure. The reference photo provided excellent lighting data for the cheekbones and jawline.
                </p>
              </Card>
              <Card variant="muted" className="p-6 space-y-4">
                <div className="flex items-center gap-3 text-commerce">
                  <Camera size={18} />
                  <h4 className="font-bold">Reference Sync</h4>
                </div>
                <div className="flex gap-2">
                  <div className="w-12 h-12 bg-neutral-100 dark:bg-neutral-900 rounded-lg overflow-hidden">
                    <img src="https://picsum.photos/seed/ref1/100/100" alt="Ref" className="w-full h-full object-cover" />
                  </div>
                  <div className="w-12 h-12 bg-neutral-100 dark:bg-neutral-900 rounded-lg overflow-hidden">
                    <img src="https://picsum.photos/seed/ref2/100/100" alt="Ref" className="w-full h-full object-cover" />
                  </div>
                </div>
              </Card>
            </div>
          </Card>
        </div>

        <ChatThread messages={messages} message={message} setMessage={setMessage} />
      </div>
    </div>
  );
}
