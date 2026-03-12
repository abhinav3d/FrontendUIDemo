import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Box, Shield, Zap, Sparkles, Globe, Layers, MoveRight, User, Dog, Wand2, Palette } from 'lucide-react';
import { motion } from 'motion/react';
import ModelViewer from '../components/ModelViewer';
import TransformationCarousel from '../components/TransformationCarousel';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import SectionHeader from '../components/ui/SectionHeader';
import { STYLE_DATA } from '../data/styleData';

const Hero = () => (
  <section className="relative h-[90vh] flex items-center overflow-hidden">
    <div className="absolute inset-0 z-0">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-white dark:via-black/50 dark:to-black z-10 pointer-events-none" />
      <div className="w-full h-full opacity-60 dark:opacity-40 pointer-events-auto">
        <ModelViewer autoRotate />
      </div>
    </div>

    <div className="max-w-7xl mx-auto px-6 relative z-20 w-full">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-2xl space-y-8"
      >
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-commerce/10 text-commerce rounded-full text-[10px] font-bold uppercase tracking-widest"
          >
            <Sparkles size={14} /> Handcrafted Precision
          </motion.div>
          
          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter leading-[0.9] uppercase italic">
            Photo to <br />
            <span className="text-commerce">3D Sculpt</span>
          </h1>
          <p className="text-lg text-neutral-500 dark:text-neutral-400 max-w-lg leading-relaxed">
            We transform your most cherished memories into museum-grade 3D physical models. AI-assisted preparation, artist-sculpted perfection.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link to="/configurator">
            <Button size="lg">
              Start Your Creation <ArrowRight size={18} />
            </Button>
          </Link>
          <Link to="/gallery">
            <Button variant="outline" size="lg">
              View Gallery
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  </section>
);

const FeatureCard = ({ icon: Icon, title, description, delay }: any) => (
  <Card variant="muted" delay={delay} className="p-10 space-y-6 group hover:border-commerce transition-colors">
    <div className="w-12 h-12 rounded-2xl bg-commerce/10 flex items-center justify-center text-commerce group-hover:scale-110 transition-transform">
      <Icon size={24} />
    </div>
    <div className="space-y-2">
      <h3 className="text-xl font-bold tracking-tight">{title}</h3>
      <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
        {description}
      </p>
    </div>
  </Card>
);

const PromotedGroupCard = ({ group, index }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    viewport={{ once: true }}
  >
    <Link to={`/styles?group=${group.id}`} className="block group">
      <Card className="p-0 overflow-hidden border-none aspect-[4/5] relative">
        <img 
          src={group.thumbnailUrl || undefined} 
          alt={group.name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8 space-y-2">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-commerce">
            {group.slug === 'pets' ? <Dog size={12} /> : <User size={12} />}
            Promoted Subject
          </div>
          <h4 className="text-2xl font-bold text-white tracking-tight">{group.name}</h4>
          <p className="text-xs text-white/60 leading-relaxed line-clamp-2">
            {group.description}
          </p>
          <div className="pt-4 flex items-center gap-2 text-white text-[10px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
            Explore Styles <MoveRight size={14} />
          </div>
        </div>
      </Card>
    </Link>
  </motion.div>
);

export default function Home() {
  const features = [
    { icon: Zap, title: "AI-Assisted Prep", description: "Our proprietary engine analyzes your photos to create a perfect 3D reconstruction reference for our artists." },
    { icon: Box, title: "Artist Sculpted", description: "Every model is refined by human hands to ensure emotional resonance and anatomical precision." },
    { icon: Shield, title: "Museum Quality", description: "Printed in high-resolution resin with professional finishing. Built to last generations." }
  ];

  const promotedGroups = STYLE_DATA.groups.filter(g => g.slug === 'pets' || g.slug === 'humans');

  return (
    <div className="space-y-32 pb-32">
      <Hero />

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {features.map((feature, idx) => (
            <FeatureCard key={idx} {...feature} delay={idx * 0.1} />
          ))}
        </div>
      </section>

      {/* Transformation & Promoted Groups */}
      <section className="max-w-7xl mx-auto px-6 py-24 bg-neutral-50 dark:bg-neutral-950 rounded-[3rem] border border-black/5 dark:border-white/5 overflow-hidden">
        <div className="space-y-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="space-y-12 p-8 lg:p-12">
              <SectionHeader 
                title="The"
                highlight="Transformation"
                subtitle="Experience the synergy of cutting-edge AI and master craftsmanship. We bridge the gap between digital memory and physical presence."
              />
              
              <div className="space-y-12">
                <div className="flex gap-6 group">
                  <div className="w-12 h-12 rounded-2xl bg-commerce/10 flex items-center justify-center text-commerce shrink-0">
                    <Wand2 size={24} />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-xl font-bold tracking-tight">AI Rough Visualization</h4>
                    <p className="text-sm text-neutral-500 leading-relaxed">
                      Our proprietary AI instantly analyzes your 2D photos to generate a high-fidelity 3D reference, allowing you to visualize the potential of your sculpture in seconds.
                    </p>
                  </div>
                </div>

                <div className="flex gap-6 group">
                  <div className="w-12 h-12 rounded-2xl bg-commerce/10 flex items-center justify-center text-commerce shrink-0">
                    <Palette size={24} />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-xl font-bold tracking-tight">Artist-Perfected Mastery</h4>
                    <p className="text-sm text-neutral-500 leading-relaxed">
                      Master sculptors then take the AI reference and refine every curve, texture, and expression by hand, ensuring your physical model is a true work of art in your chosen style.
                    </p>
                  </div>
                </div>

                <div className="pt-6">
                  <Link to="/configurator">
                    <Button size="lg" className="w-full sm:w-auto">
                      Create Your Masterpiece <ArrowRight size={18} />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            <div className="relative aspect-square pointer-events-auto p-4 lg:p-12">
              <Card className="w-full h-full p-0 overflow-hidden border-none shadow-2xl bg-neutral-200 dark:bg-neutral-800">
                <TransformationCarousel />
              </Card>
              <motion.div 
                initial={{ rotate: 0, scale: 0.9 }}
                whileInView={{ rotate: 12, scale: 1 }}
                className="absolute -top-6 -right-6 w-32 h-32 bg-commerce rounded-full flex items-center justify-center text-white font-bold text-xs uppercase tracking-widest text-center p-4 shadow-2xl z-10"
              >
                Artist Perfected
              </motion.div>
            </div>
          </div>

          {/* Promoted Subjects Grid */}
          <div className="px-8 lg:px-12 space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-commerce">Curated Collections</span>
                <h3 className="text-4xl font-bold tracking-tight uppercase italic">Promoted <span className="text-commerce">Subjects</span></h3>
              </div>
              <Link to="/styles">
                <Button variant="outline" size="sm">Explore All Styles <ArrowRight size={16} className="ml-2" /></Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {promotedGroups.map((group, idx) => (
                <PromotedGroupCard key={group.id} group={group} index={idx} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-6 text-center space-y-12">
        <Card variant="accent" className="py-24 space-y-8">
          <h2 className="text-5xl md:text-6xl font-bold tracking-tighter uppercase italic leading-tight">
            Ready to see yourself <br /> in three dimensions?
          </h2>
          <div className="flex justify-center gap-4">
            <Link to="/configurator">
              <Button variant="secondary" size="lg">
                Create Now <ArrowRight size={18} />
              </Button>
            </Link>
          </div>
        </Card>
      </section>
    </div>
  );
}
