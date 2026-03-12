import React, { useState } from 'react';
import { User, MapPin, CreditCard, Bell, Globe, LogOut, Settings, Plus } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../utils';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Input, Select } from '../components/ui/Forms';

const AccountSidebar = ({ tabs, activeTab, onTabChange }: any) => (
  <aside className="w-full md:w-64 space-y-2">
    {tabs.map((tab: any) => (
      <button
        key={tab.id}
        onClick={() => onTabChange(tab.id)}
        className={cn(
          "w-full flex items-center gap-3 px-6 py-3.5 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all",
          activeTab === tab.id 
            ? "bg-neutral-100 dark:bg-neutral-900 text-commerce" 
            : "text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
        )}
      >
        {tab.icon}
        {tab.label}
      </button>
    ))}
    <div className="pt-8 mt-8 border-t border-black/5 dark:border-white/5">
      <button className="w-full flex items-center gap-3 px-6 py-3.5 rounded-2xl text-xs font-bold uppercase tracking-widest text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all">
        <LogOut size={16} />
        Logout
      </button>
    </div>
  </aside>
);

export default function Account() {
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <User size={16} /> },
    { id: 'shipping', label: 'Shipping', icon: <MapPin size={16} /> }
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
      <div className="flex flex-col md:flex-row gap-12">
        <AccountSidebar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="flex-grow space-y-12">
          <motion.div 
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Card className="p-12 space-y-12">
              {activeTab === 'profile' && (
                <div className="space-y-8">
                  <div className="flex items-center gap-6">
                    <div className="w-24 h-24 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center text-neutral-400">
                      <User size={48} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold tracking-tight">Abhinav</h3>
                      <p className="text-sm text-neutral-500">abhinav@my3dmeta.com</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Input label="Full Name" defaultValue="Abhinav" />
                    <Input label="Email Address" type="email" defaultValue="abhinav@my3dmeta.com" />
                  </div>
                  <div className="flex justify-end">
                    <Button>Save Changes</Button>
                  </div>
                </div>
              )}

              {activeTab === 'shipping' && (
                <div className="space-y-8">
                  <h3 className="text-2xl font-bold tracking-tight">Shipping Addresses</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="p-6 border-commerce shadow-lg shadow-commerce/5 space-y-4 relative">
                      <div className="absolute top-6 right-6 px-2 py-1 bg-commerce/10 text-commerce rounded text-[8px] font-bold uppercase tracking-widest">Default</div>
                      <div className="space-y-1">
                        <p className="text-sm font-bold">Primary Residence</p>
                        <p className="text-xs text-neutral-500 leading-relaxed">
                          Abhinav<br />
                          123 Sculpting Way, Apt 4B<br />
                          New York, NY 10001<br />
                          United States
                        </p>
                      </div>
                      <button className="text-[10px] font-bold uppercase tracking-widest text-commerce hover:underline">Edit Address</button>
                    </Card>
                    <button className="p-6 bg-white dark:bg-black rounded-[2rem] border border-dashed border-neutral-200 dark:border-neutral-800 flex flex-col items-center justify-center text-center gap-2 group hover:border-commerce transition-colors">
                      <div className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center text-neutral-400 group-hover:text-commerce transition-colors">
                        <Plus size={16} />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Add New Address</span>
                    </button>
                  </div>
                </div>
              )}
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
