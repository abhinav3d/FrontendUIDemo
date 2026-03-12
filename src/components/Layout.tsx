import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Sun, Moon, User, Bell, Menu, X, LogOut, ChevronDown, ShieldCheck } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { Preload } from '@react-three/drei';
import { useTheme } from '../hooks/useTheme';
import { cn } from '../utils';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Mock auth state
  const containerRef = useRef<HTMLDivElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Styles', path: '/styles' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'How it works', path: '/how-it-works' },
  ];

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (accountRef.current && !accountRef.current.contains(event.target as Node)) {
        setIsAccountOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsAccountOpen(false);
    navigate('/');
  };

  return (
    <div ref={containerRef} className="min-h-screen flex flex-col bg-white dark:bg-black text-neutral-900 dark:text-neutral-100 transition-colors duration-300">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 border-b border-black/5 dark:border-white/5 bg-white/80 dark:bg-black/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="text-xl font-bold tracking-tighter uppercase italic hover:opacity-80 transition-opacity">
              Base44
            </Link>
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-500 dark:text-neutral-400">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    "hover:text-black dark:hover:text-white transition-colors",
                    location.pathname === link.path && "text-black dark:text-white"
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            
            <div className="relative">
              <button 
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors relative"
              >
                <Bell size={18} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-commerce rounded-full"></span>
              </button>
              
              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-neutral-900 border border-black/5 dark:border-white/5 rounded-2xl shadow-2xl p-4 z-50">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-4">Notifications</h3>
                  <div className="space-y-4">
                    <div className="flex gap-3 items-start p-2 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors cursor-pointer">
                      <div className="w-2 h-2 mt-1.5 bg-commerce rounded-full shrink-0"></div>
                      <div>
                        <p className="text-sm font-bold">Preview Ready</p>
                        <p className="text-xs text-neutral-500">Your AI preview for Draft #4401 is ready for review.</p>
                      </div>
                    </div>
                    <div className="flex gap-3 items-start p-2 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors cursor-pointer">
                      <div className="w-2 h-2 mt-1.5 bg-commerce rounded-full shrink-0"></div>
                      <div>
                        <p className="text-sm font-bold">Support Reply</p>
                        <p className="text-xs text-neutral-500">Artist Alex replied to your inquiry about Draft #4401.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="h-4 w-[1px] bg-black/10 dark:bg-white/10 mx-1 md:mx-2"></div>
            
            {isLoggedIn ? (
              <div className="relative" ref={accountRef}>
                <button 
                  onClick={() => setIsAccountOpen(!isAccountOpen)}
                  className="flex items-center gap-2 text-sm font-medium px-2 md:px-3 py-1.5 rounded-full border border-black/10 dark:border-white/10 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-commerce/10 flex items-center justify-center text-commerce">
                    <User size={14} />
                  </div>
                  <span className="hidden sm:inline">Abhinav</span>
                  <ChevronDown size={14} className={cn("transition-transform", isAccountOpen && "rotate-180")} />
                </button>

                {isAccountOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-neutral-900 border border-black/5 dark:border-white/5 rounded-2xl shadow-2xl overflow-hidden z-50">
                    <div className="p-2">
                      <Link 
                        to="/account" 
                        onClick={() => setIsAccountOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest text-neutral-500 hover:text-commerce hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all"
                      >
                        <User size={14} />
                        Profile
                      </Link>
                      <Link 
                        to="/workspace" 
                        onClick={() => setIsAccountOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest text-neutral-500 hover:text-commerce hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all"
                      >
                        <ShieldCheck size={14} />
                        Workspace
                      </Link>
                      <div className="h-[1px] bg-black/5 dark:bg-white/5 my-1 mx-2"></div>
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all"
                      >
                        <LogOut size={14} />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link 
                to="/auth"
                className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full bg-commerce text-white hover:scale-105 transition-transform"
              >
                Sign In | Create
              </Link>
            )}

            <button 
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white dark:bg-black border-b border-black/5 dark:border-white/5 p-6 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="block text-lg font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow pt-16">
        {children}
      </main>

      {/* Global Canvas for Views */}
      <Canvas
        style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: 40 }}
        eventSource={containerRef}
      >
        <Preload all />
      </Canvas>

      {/* Footer */}
      <footer className="border-t border-black/5 dark:border-white/5 bg-neutral-50 dark:bg-neutral-950 py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-4">
            <h2 className="text-xl font-bold tracking-tighter uppercase italic">Base44</h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
              Premium AI-assisted 3D sculpting and physical model production service. Handcrafted in London.
            </p>
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-6">Discovery</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/styles" className="hover:text-commerce transition-colors">Styles</Link></li>
              <li><Link to="/gallery" className="hover:text-commerce transition-colors">Gallery</Link></li>
              <li><Link to="/how-it-works" className="hover:text-commerce transition-colors">Process</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-6">Support</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/contact" className="hover:text-commerce transition-colors">Contact</Link></li>
              <li><Link to="/faq" className="hover:text-commerce transition-colors">FAQ</Link></li>
              <li><Link to="/refund-policy" className="hover:text-commerce transition-colors">Refunds</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-6">Legal</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/privacy" className="hover:text-commerce transition-colors">Privacy</Link></li>
              <li><Link to="/terms" className="hover:text-commerce transition-colors">Terms</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-black/5 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">© 2024 Base44 Studio. All rights reserved.</p>
          <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-neutral-400">
            <span>Currency: USD</span>
            <span>Region: Global</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
