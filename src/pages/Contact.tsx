import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Mail, 
  MessageSquare, 
  MapPin, 
  Send, 
  Clock,
  Globe
} from 'lucide-react';
import SectionHeader from '../components/ui/SectionHeader';
import Card from '../components/ui/Card';
import { Input, Select, Textarea } from '../components/ui/Forms';

const ContactMethod = ({ icon, title, description, value, delay }: any) => (
  <motion.div 
    initial={{ opacity: 0, x: 20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ delay }}
    className="flex gap-6 p-6 bg-white dark:bg-black rounded-[2rem] border border-black/5 dark:border-white/5 hover:border-commerce transition-colors group"
  >
    <div className="w-12 h-12 rounded-2xl bg-commerce/5 flex items-center justify-center group-hover:bg-commerce/10 transition-colors">
      {icon}
    </div>
    <div className="space-y-1">
      <h4 className="font-bold">{title}</h4>
      <p className="text-xs text-neutral-500">{description}</p>
      <p className="text-sm font-bold text-commerce pt-1">{value}</p>
    </div>
  </motion.div>
);

const StudioHours = () => (
  <Card variant="accent" className="p-8 space-y-6 bg-neutral-900 text-white">
    <div className="flex items-center gap-3">
      <Clock size={20} className="text-commerce" />
      <h4 className="font-bold uppercase tracking-widest text-xs">Studio Hours</h4>
    </div>
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-neutral-400">Monday — Friday</span>
        <span>09:00 - 18:00 GMT</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-neutral-400">Saturday</span>
        <span>10:00 - 14:00 GMT</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-neutral-400">Sunday</span>
        <span className="text-commerce">Closed</span>
      </div>
    </div>
    <div className="pt-4 border-t border-white/10 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-neutral-500">
      <Globe size={12} /> Global Support Available 24/7
    </div>
  </Card>
);

export default function Contact() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Message sent! We will get back to you within 24 hours.');
  };

  const contactMethods = [
    {
      icon: <Mail className="text-commerce" size={24} />,
      title: "Email Us",
      description: "For general inquiries and support.",
      value: "hello@base44.studio"
    },
    {
      icon: <MessageSquare className="text-commerce" size={24} />,
      title: "Artist Chat",
      description: "Direct line for active productions.",
      value: "Available in Workspace"
    },
    {
      icon: <MapPin className="text-commerce" size={24} />,
      title: "Studio",
      description: "Our physical production house.",
      value: "London, United Kingdom"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-24 space-y-24">
      <SectionHeader 
        title="Get in"
        highlight="Touch"
        subtitle="Whether you have a question about a custom sculpt, need technical support, or just want to say hi, our team is here to help."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-7">
          <Card variant="muted" className="p-12 space-y-8">
            <h3 className="text-2xl font-bold tracking-tight">Send a Message</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="Full Name" placeholder="John Doe" required />
                <Input label="Email Address" type="email" placeholder="john@example.com" required />
              </div>
              <Select 
                label="Subject" 
                options={[
                  { label: 'General Inquiry', value: 'general' },
                  { label: 'Technical Support', value: 'support' },
                  { label: 'Custom Commission', value: 'commission' },
                  { label: 'Partnership', value: 'partnership' }
                ]} 
              />
              <Textarea label="Message" rows={6} placeholder="How can we help you?" required />
              <button 
                type="submit"
                className="w-full py-4 bg-commerce text-white rounded-2xl font-bold uppercase tracking-widest text-sm hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
              >
                Send Message <Send size={16} />
              </button>
            </form>
          </Card>
        </div>

        <div className="lg:col-span-5 space-y-12">
          <div className="space-y-8">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-400">Contact Methods</h3>
            <div className="space-y-6">
              {contactMethods.map((method, idx) => (
                <ContactMethod key={idx} {...method} delay={idx * 0.1} />
              ))}
            </div>
          </div>
          <StudioHours />
        </div>
      </div>
    </div>
  );
}
