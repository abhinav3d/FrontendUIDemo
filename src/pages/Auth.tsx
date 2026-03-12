import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ShieldCheck, ExternalLink, MoveRight } from 'lucide-react';
import { cn } from '../utils';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

export default function Auth() {
  const [agreed, setAgreed] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const navigate = useNavigate();

  const handleContinue = () => {
    if (isRedirecting) return;
    setIsRedirecting(true);
    // Simulate redirect delay
    setTimeout(() => {
      navigate('/workspace');
    }, 1500);
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-6 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl space-y-10"
      >
        {/* Header */}
        <header className="text-center space-y-5">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest bg-neutral-100 dark:bg-neutral-900 text-neutral-500">
            <ShieldCheck size={14} className="text-commerce" /> Secure Authentication
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight uppercase italic">
            Sign in to <br />
            <span className="text-commerce">Your Account</span>
          </h1>
          <p className="text-sm text-neutral-500 max-w-md mx-auto leading-relaxed">
            We use <strong>Shopify Identity</strong> to securely manage customer accounts and protect your personal information.
          </p>
        </header>

        {/* Dual Brand Card */}
        <Card className="p-10 space-y-10">
          {/* Brand → Shopify Identity */}
          <div className="flex items-center justify-center gap-8 md:gap-12">
            <div className="text-center space-y-1">
              <div className="text-lg font-bold tracking-tight">Base44</div>
              <div className="text-[10px] text-neutral-400 font-mono uppercase tracking-widest">base44.studio</div>
            </div>
            
            <div className="text-neutral-300 dark:text-neutral-700">
              <MoveRight size={32} strokeWidth={1} />
            </div>

            <div className="text-center space-y-1">
              <div className="text-lg font-bold tracking-tight text-commerce">Shopify</div>
              <div className="text-[10px] text-neutral-400 font-mono uppercase tracking-widest">shopify.com</div>
            </div>
          </div>

          {/* Explanation */}
          <div className="text-sm text-neutral-500 text-center leading-relaxed max-w-sm mx-auto">
            When you continue, you will be securely redirected to Shopify’s authentication portal.
            <br /><br />
            Shopify handles password security and identity verification. Your password is <strong>never stored on our servers</strong>.
          </div>

          {/* Consent & Action */}
          <div className="space-y-6">
            <label className="flex items-start gap-4 text-left cursor-pointer group">
              <div className="relative flex items-center mt-1">
                <input 
                  type="checkbox" 
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="w-5 h-5 rounded border-neutral-300 text-commerce focus:ring-commerce transition-all cursor-pointer"
                />
              </div>
              <span className="text-xs text-neutral-500 leading-relaxed group-hover:text-neutral-700 dark:group-hover:text-neutral-300 transition-colors">
                I agree to the <Link to="/legal" className="text-commerce hover:underline font-bold">Terms of Service</Link> and <Link to="/legal" className="text-commerce hover:underline font-bold">Privacy Policy</Link>.
              </span>
            </label>

            <div className="space-y-4">
              <Button 
                size="lg" 
                className="w-full"
                disabled={!agreed || isRedirecting}
                onClick={handleContinue}
              >
                {isRedirecting ? 'Redirecting to Shopify...' : 'Continue to Shopify'}
                {!isRedirecting && <ExternalLink size={16} className="ml-2" />}
              </Button>
              
              <p className="text-[10px] text-neutral-400 uppercase tracking-widest text-center">
                You will be redirected to Shopify’s secure login page
              </p>
            </div>
          </div>
        </Card>

        {/* Footer */}
        <footer className="text-center">
          <Link 
            to="/" 
            className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 hover:text-commerce transition-colors"
          >
            Cancel and return home
          </Link>
        </footer>
      </motion.div>
    </div>
  );
}
