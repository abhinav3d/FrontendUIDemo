import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, History, Layers, MessageSquare, Package, Search, Truck, ArrowRight, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../utils';
import Tabs from '../components/ui/Tabs';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const OrderCard = ({ order }: any) => (
  <Card className="group hover:border-commerce transition-colors grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
    <div className="lg:col-span-3 aspect-square bg-neutral-100 dark:bg-neutral-900 rounded-3xl border border-black/5 dark:border-white/5 overflow-hidden">
      <img 
        src={`https://picsum.photos/seed/order${order.id}/400/400`} 
        alt={order.name}
        className="w-full h-full object-cover"
        referrerPolicy="no-referrer"
      />
    </div>
    
    <div className="lg:col-span-6 space-y-6">
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <h3 className="text-2xl font-bold tracking-tight">{order.name}</h3>
          <span className="px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-[10px] font-mono text-neutral-500">{order.id}</span>
        </div>
        <p className="text-sm text-neutral-500">Style: {order.style} • Last update: {order.lastUpdate}</p>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-end">
          <span className="text-xs font-bold uppercase tracking-widest text-commerce">{order.stage}</span>
          <span className="text-[10px] font-mono text-neutral-400">Est. {order.eta}</span>
        </div>
        <div className="h-2 w-full bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${order.progress}%` }}
            className="h-full bg-commerce"
          />
        </div>
        <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-neutral-400">
          <span>Sculpting</span>
          <span>Review</span>
          <span>Print</span>
          <span>Ship</span>
        </div>
      </div>
    </div>

    <div className="lg:col-span-3 flex flex-col gap-3">
      <Link to={`/production/${order.id.replace('#', '')}`}>
        <Button className="w-full" size="lg">
          View Dashboard
        </Button>
      </Link>
      <Button variant="outline" className="w-full" size="lg">
        <MessageSquare size={14} /> Artist Chat
      </Button>
    </div>
  </Card>
);

const DraftCard = ({ draft }: any) => (
  <Card className="aspect-[4/5] flex flex-col justify-between group hover:border-commerce transition-colors">
    <div className="space-y-4">
      <div className="aspect-square bg-neutral-100 dark:bg-neutral-900 rounded-2xl overflow-hidden">
        <img 
          src={`https://picsum.photos/seed/${draft.id}/400/400`} 
          alt={draft.name} 
          className="w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-opacity" 
          referrerPolicy="no-referrer"
        />
      </div>
      <div>
        <h4 className="font-bold">{draft.name}</h4>
        <p className="text-[10px] text-neutral-500 uppercase tracking-widest">{draft.style} • Draft</p>
      </div>
    </div>
    <Link to="/configurator" className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-commerce group-hover:translate-x-1 transition-transform">
      Continue Editing <ArrowRight size={14} />
    </Link>
  </Card>
);

export default function Workspace() {
  const [activeTab, setActiveTab] = useState('orders');

  const tabs = [
    { id: 'creations', label: 'Creations', icon: <Layers size={16} /> },
    { id: 'orders', label: 'Orders', icon: <Package size={16} /> },
    { id: 'collection', label: 'Collection', icon: <History size={16} /> }
  ];

  const orders = [
    { 
      id: '#4401', 
      name: 'Realistic Portrait', 
      style: 'Realistic', 
      stage: 'Sculpting', 
      progress: 35, 
      eta: 'Week 6',
      lastUpdate: '2 days ago'
    },
    { 
      id: '#4382', 
      name: 'Chibi Gift', 
      style: 'Chibi', 
      stage: 'Shipping', 
      progress: 90, 
      eta: 'Tomorrow',
      lastUpdate: '1 hour ago'
    }
  ];

  const drafts = [
    { id: 'D-992', name: 'Anime Concept', style: 'Anime', date: 'Oct 12' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Production Workspace</h1>
          <p className="text-neutral-500 dark:text-neutral-400">Manage your custom scuplts and track production progress.</p>
        </div>
        
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'orders' && (
          <motion.div 
            key="orders"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 gap-6"
          >
            {orders.length > 0 ? (
              orders.map(order => <OrderCard key={order.id} order={order} />)
            ) : (
              <Card variant="muted" className="py-24 text-center space-y-6">
                <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-900 rounded-full flex items-center justify-center mx-auto text-neutral-300">
                  <Package size={32} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">No active orders</h3>
                  <p className="text-sm text-neutral-500 max-w-xs mx-auto">Start your first 3D transformation to see production progress here.</p>
                </div>
                <Link to="/create">
                  <Button size="lg">
                    Start Creation <Plus size={18} />
                  </Button>
                </Link>
              </Card>
            )}
          </motion.div>
        )}

        {activeTab === 'creations' && (
          <motion.div 
            key="creations"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <Link to="/create" className="group">
              <Card variant="muted" className="aspect-[4/5] border-2 border-dashed border-neutral-200 dark:border-neutral-800 flex flex-col items-center justify-center text-center p-8 group hover:border-commerce transition-colors cursor-pointer">
                <div className="w-12 h-12 rounded-full bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center mb-4 group-hover:bg-commerce/10 transition-colors">
                  <Plus className="text-neutral-400 group-hover:text-commerce transition-colors" />
                </div>
                <h3 className="font-bold mb-1">New Creation</h3>
                <p className="text-xs text-neutral-500">Start a new 3D transformation</p>
              </Card>
            </Link>

            {drafts.map(draft => <DraftCard key={draft.id} draft={draft} />)}
          </motion.div>
        )}

        {activeTab === 'collection' && (
          <motion.div 
            key="collection"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col items-center justify-center py-24 text-center space-y-4"
          >
            <div className="w-16 h-16 rounded-full bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center text-neutral-300">
              <History size={32} />
            </div>
            <h3 className="text-xl font-bold tracking-tight">No items in collection</h3>
            <p className="text-sm text-neutral-500 max-w-xs">Once your scuplts are delivered, they will appear here in your digital vault.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
