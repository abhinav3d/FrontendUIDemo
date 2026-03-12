import React from 'react';
import { useLocation } from 'react-router-dom';

export default function Legal() {
  const location = useLocation();
  const type = location.pathname.split('/').pop() || 'terms';

  const content = {
    'privacy': {
      title: 'Privacy Policy',
      desc: 'How we handle your data and reference photos.',
      sections: [
        { title: 'Data Collection', content: 'We collect your uploaded photos solely for the purpose of 3D reconstruction and sculpting. Your photos are stored securely and are only accessible by our AI engine and assigned artists.' },
        { title: 'Data Retention', content: 'Reference photos are retained for the duration of the production cycle (5-6 weeks) plus 30 days post-delivery for quality assurance. After this period, photos are permanently deleted from our primary storage.' },
        { title: 'Third Parties', content: 'We do not sell your data. We use industry-standard cloud providers for storage and processing, ensuring your data remains private and secure.' }
      ]
    },
    'terms': {
      title: 'Terms of Service',
      desc: 'The rules of engagement for Base44 Studio.',
      sections: [
        { title: 'Custom Nature', content: 'By placing an order, you acknowledge that each sculpt is a custom, handcrafted piece of art. Minor variations from the digital preview are expected and part of the artistic process.' },
        { title: 'Intellectual Property', content: 'You retain ownership of your source photos. Base44 Studio retains ownership of the digital 3D mesh created during the process, unless otherwise agreed upon.' },
        { title: 'Production Timeline', content: 'Our standard production timeline is 5-6 weeks. While we strive for precision, external factors may occasionally cause delays. We will communicate any significant changes to your timeline.' }
      ]
    },
    'refund-policy': {
      title: 'Refund Policy',
      desc: 'Our policy on custom handcrafted scuplts.',
      sections: [
        { title: 'Custom Work', content: 'Due to the highly personalized nature of our products, we do not offer full refunds once sculpting has commenced. Each piece is made specifically for you.' },
        { title: 'Cancellation', content: 'Orders can be cancelled for a full refund within 24 hours of placement. After 24 hours, a 20% processing fee will apply if sculpting has not yet started.' },
        { title: 'Quality Guarantee', content: 'If your physical model arrives damaged or with significant structural defects, we will provide a replacement at no additional cost. Please contact support within 48 hours of delivery.' }
      ]
    }
  };

  const active = content[type as keyof typeof content] || content['terms'];

  return (
    <div className="max-w-4xl mx-auto px-6 py-24 space-y-12">
      <div className="space-y-4">
        <span className="text-xs font-bold uppercase tracking-[0.3em] text-commerce">Legal Suite</span>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter uppercase italic leading-[0.9]">
          {active.title}
        </h1>
        <p className="text-lg text-neutral-500 dark:text-neutral-400 leading-relaxed">
          {active.desc}
        </p>
      </div>

      <div className="space-y-12">
        {active.sections.map((section, i) => (
          <div key={i} className="space-y-4">
            <h3 className="text-xl font-bold tracking-tight">{section.title}</h3>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
              {section.content}
            </p>
          </div>
        ))}
      </div>

      <div className="pt-12 border-t border-black/5 dark:border-white/5">
        <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Last updated: March 2024</p>
      </div>
    </div>
  );
}
