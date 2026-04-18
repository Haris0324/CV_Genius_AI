'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineCheckCircle } from 'react-icons/hi';
import Link from 'next/link';

export default function Pricing() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // We reuse the basic design from the landing page but with actual Checkout logic
  const handleSubscribe = async (planId) => {
    if (!session) {
      router.push('/login');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.message || 'Something went wrong');
      }
    } catch (err) {
      alert('Error initiating checkout');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-20 text-slate-900 dark:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Choose your <span className="text-gradient">Advantage</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto"
          >
            Unlock unlimited AI capabilities and premium templates. Cancel anytime.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col"
          >
            <h3 className="text-2xl font-bold mb-2">Free Plan</h3>
            <p className="text-slate-500 mb-6">Perfect for trying out the platform.</p>
            <div className="mb-8">
              <span className="text-5xl font-extrabold">$0</span>
              <span className="text-slate-500">/ forever</span>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-center text-slate-700 dark:text-slate-300">
                <HiOutlineCheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                <span>3 AI resumes per month</span>
              </li>
              <li className="flex items-center text-slate-700 dark:text-slate-300">
                <HiOutlineCheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                <span>Basic templates</span>
              </li>
              <li className="flex items-center text-slate-700 dark:text-slate-300">
                <HiOutlineCheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                <span>PDF Download</span>
              </li>
            </ul>
            <Link
              href="/dashboard"
              className="w-full text-center bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white py-4 rounded-xl font-bold transition-colors"
            >
              {session?.user?.subscription === 'PRO' ? 'Dashboard' : 'Current Plan'}
            </Link>
          </motion.div>

          {/* Pro Plan */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-slate-900 dark:bg-slate-950 rounded-3xl p-8 shadow-2xl border border-blue-500 relative flex flex-col"
          >
            <div className="absolute top-0 inset-x-0 transform -translate-y-1/2 flex justify-center">
              <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
                Most Popular
              </span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Pro Plan</h3>
            <p className="text-slate-400 mb-6">For serious job seekers.</p>
            <div className="mb-8">
              <span className="text-5xl font-extrabold text-white">$9</span>
              <span className="text-slate-400">/ month</span>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-center text-slate-200">
                <HiOutlineCheckCircle className="h-6 w-6 text-blue-400 mr-3 flex-shrink-0" />
                <span>20 AI resumes per month</span>
              </li>
              <li className="flex items-center text-slate-200">
                <HiOutlineCheckCircle className="h-6 w-6 text-blue-400 mr-3 flex-shrink-0" />
                <span>Premium, ATS-optimized templates</span>
              </li>
              <li className="flex items-center text-slate-200">
                <HiOutlineCheckCircle className="h-6 w-6 text-blue-400 mr-3 flex-shrink-0" />
                <span>Priority AI generation processing</span>
              </li>
            </ul>
            
            {session?.user?.subscription === 'PRO' ? (
              <div className="w-full py-4 rounded-xl font-bold text-slate-300 border border-slate-700 text-center bg-slate-800/50">
                Current Plan
              </div>
            ) : (
              <button
                onClick={() => handleSubscribe('price_demo_pro_id')}
                disabled={isLoading}
                className={`w-full py-4 rounded-xl font-bold text-white transition-all shadow-lg hover-lift ${isLoading ? 'opacity-70 cursor-not-allowed bg-blue-800' : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'}`}
              >
                {isLoading ? 'Processing...' : 'Upgrade to Pro'}
              </button>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
