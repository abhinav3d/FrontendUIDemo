import React from 'react';
import { motion } from 'motion/react';
import SectionHeader from '../components/ui/SectionHeader';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const GalleryItem = ({ item, index }: any) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.95 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.1 }}
    className="group space-y-6"
  >
    <div className="aspect-[4/5] bg-neutral-100 dark:bg-neutral-900 rounded-[2.5rem] overflow-hidden border border-black/5 dark:border-white/5 relative">
      <div className="absolute inset-0 opacity-80 group-hover:opacity-100 transition-opacity">
        <img 
          src={item.image || undefined} 
          alt={item.title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          referrerPolicy="no-referrer"
        />
      </div>
      <div className="absolute bottom-6 left-6 right-6 p-6 bg-white/80 dark:bg-black/80 backdrop-blur rounded-2xl border border-black/5 dark:border-white/5 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-bold uppercase tracking-widest text-commerce">{item.style}</span>
          <span className="text-[10px] font-mono text-neutral-400">#{item.id}</span>
        </div>
        <h3 className="text-lg font-bold tracking-tight mt-1">{item.title}</h3>
        <div className="flex gap-4 mt-4 text-[10px] font-bold uppercase tracking-widest text-neutral-500">
          <span>{item.size}</span>
          <span>{item.material}</span>
        </div>
      </div>
    </div>
  </motion.div>
);

export default function Gallery() {
  const galleryItems = [
    { id: 1, title: "Realistic Portrait", style: "Realistic", size: "15cm", material: "Matte Resin", image: "https://picsum.photos/seed/sculpt1/800/1000" },
    { id: 2, title: "Chibi Character", style: "Chibi", size: "10cm", material: "Polished Resin", image: "https://picsum.photos/seed/sculpt2/800/1000" },
    { id: 3, title: "Anime Sculpt", style: "Anime", size: "20cm", material: "Hand-Painted", image: "https://picsum.photos/seed/sculpt3/800/1000" },
    { id: 4, title: "Memorial Piece", style: "Realistic", size: "15cm", material: "Matte Resin", image: "https://picsum.photos/seed/sculpt4/800/1000" },
    { id: 5, title: "Gift Sculpt", style: "Chibi", size: "10cm", material: "Matte Resin", image: "https://picsum.photos/seed/sculpt5/800/1000" },
    { id: 6, title: "Artistic Bust", style: "Stylized", size: "20cm", material: "Polished Resin", image: "https://picsum.photos/seed/sculpt6/800/1000" }
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-24 space-y-24">
      <SectionHeader 
        title="The"
        highlight="Collection"
        subtitle="Explore our portfolio of completed scuplts. Each piece represents a unique transformation from a single photograph to a physical masterpiece."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {galleryItems.map((item, index) => (
          <GalleryItem key={item.id} item={item} index={index} />
        ))}
      </div>

      <Card variant="muted" className="text-center space-y-8 p-12">
        <h2 className="text-3xl font-bold tracking-tight uppercase italic">Ready to start yours?</h2>
        <p className="text-neutral-500 dark:text-neutral-400 max-w-xl mx-auto leading-relaxed">
          Every sculpt begins with a single photo. Our artists are ready to transform your memory into a physical masterpiece.
        </p>
        <div className="flex justify-center">
          <Button size="lg">
            Start Creation
          </Button>
        </div>
      </Card>
    </div>
  );
}
