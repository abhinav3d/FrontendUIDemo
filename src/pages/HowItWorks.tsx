import React from 'react';
import { Camera, Box, Printer, Truck, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import SectionHeader from '../components/ui/SectionHeader';
import Card from '../components/ui/Card';

const StepItem = ({ step, index }: any) => (
  <motion.div 
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.1 }}
    className="relative md:pl-24 flex flex-col md:flex-row gap-12"
  >
    {/* Icon Bubble */}
    <div className="absolute left-0 top-0 w-16 h-16 rounded-full bg-white dark:bg-black border border-black/10 dark:border-white/10 flex items-center justify-center text-commerce z-10 hidden md:flex">
      {step.icon}
    </div>

    <div className="flex-grow space-y-6">
      <div className="space-y-2">
        <h3 className="text-3xl font-bold tracking-tight">{step.title}</h3>
        <p className="text-neutral-500 dark:text-neutral-400 max-w-xl leading-relaxed">
          {step.desc}
        </p>
      </div>
      
      <div className="flex flex-wrap gap-4">
        {step.details.map((detail: string) => (
          <div key={detail} className="px-4 py-2 rounded-full bg-neutral-100 dark:bg-neutral-900 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
            <CheckCircle2 size={12} className="text-commerce" />
            {detail}
          </div>
        ))}
      </div>
    </div>

    <div className="w-full md:w-80 h-48 bg-neutral-100 dark:bg-neutral-900 rounded-3xl overflow-hidden border border-black/5 dark:border-white/5">
      <div className="w-full h-full flex items-center justify-center text-neutral-300 dark:text-neutral-700 font-mono text-xs uppercase tracking-widest">
        Visual Reference
      </div>
    </div>
  </motion.div>
);

export default function HowItWorks() {
  const steps = [
    {
      icon: <Camera size={24} />,
      title: "01. Upload Reference",
      desc: "Provide a clear, well-lit photo of your subject. Our AI validates the image for detail and anatomical clarity.",
      details: ["Front-facing preferred", "Natural lighting", "High resolution"]
    },
    {
      icon: <Box size={24} />,
      title: "02. Digital Sculpting",
      desc: "Our artists use your photo to build a custom 3D mesh. You'll receive a digital preview to review and approve.",
      details: ["Artist-refined", "1 round of revisions", "AI-assisted prep"]
    },
    {
      icon: <Printer size={24} />,
      title: "03. Physical Production",
      desc: "Once approved, your model is printed in high-resolution resin and finished by hand in our London studio.",
      details: ["8K Resin printing", "Manual finishing", "Quality inspection"]
    },
    {
      icon: <Truck size={24} />,
      title: "04. Secure Shipping",
      desc: "Your masterpiece is carefully packed and shipped globally with full tracking and insurance.",
      details: ["Global tracking", "Insured delivery", "Premium packaging"]
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-24 space-y-24">
      <SectionHeader 
        title="From Photo"
        highlight="To Physical"
        subtitle="The journey of a Base44 sculpt takes 5-6 weeks from initial upload to final delivery. Here is how we ensure perfection at every stage."
      />

      <div className="relative">
        {/* Connection Line */}
        <div className="absolute left-8 top-0 bottom-0 w-[1px] bg-neutral-200 dark:bg-neutral-800 hidden md:block"></div>

        <div className="space-y-24">
          {steps.map((step, index) => (
            <StepItem key={step.title} step={step} index={index} />
          ))}
        </div>
      </div>

      {/* Timeline Summary */}
      <Card variant="dark" className="p-12 space-y-8 text-center">
        <h2 className="text-3xl font-bold tracking-tight uppercase italic">Production Timeline</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: "Week 1-2", val: "Analysis & Prep" },
            { label: "Week 3-4", val: "Digital Sculpting" },
            { label: "Week 5", val: "Printing & QA" },
            { label: "Week 6", val: "Global Shipping" }
          ].map(item => (
            <div key={item.label} className="space-y-2">
              <div className="text-commerce font-mono text-xs uppercase tracking-widest">{item.label}</div>
              <div className="text-lg font-bold">{item.val}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
