'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { 
  HiOutlineDocumentText, 
  HiOutlineLightningBolt, 
  HiOutlineSparkles,
  HiOutlineCheckCircle
} from 'react-icons/hi';

export default function Home() {
  const { data: session } = useSession();

  const features = [
    {
      name: 'AI-Powered Generation',
      description: 'Our advanced AI analyzes your skills and experience to generate professional, tailored resume content in seconds.',
      icon: HiOutlineSparkles,
    },
    {
      name: 'ATS-Optimized Templates',
      description: 'Beat the bots. Our templates are specifically designed to pass through Applicant Tracking Systems with flying colors.',
      icon: HiOutlineDocumentText,
    },
    {
      name: 'Lightning Fast',
      description: 'Stop staring at a blank page. Go from zero to a fully-formatted, interview-ready resume in less than 5 minutes.',
      icon: HiOutlineLightningBolt,
    },
  ];

  const steps = [
    { title: 'Enter Your Details', description: 'Fill in your basic information, skills, and work history.' },
    { title: 'AI Magic', description: 'Our AI engine drafts tailored, professional descriptions and bullet points.' },
    { title: 'Customize & Export', description: 'Tweak the content, choose a stunning template, and download as PDF.' },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32 sm:pt-32 sm:pb-40 lg:pb-48">
        {/* Abstract Blob Background */}
        <div className="absolute top-0 inset-x-0 h-full overflow-hidden flex items-center justify-center pointer-events-none">
          <div className="blob bg-blue-400 w-96 h-96 rounded-full mix-blend-multiply opacity-30 animate-blob"></div>
          <div className="blob bg-purple-400 w-96 h-96 rounded-full mix-blend-multiply opacity-30 animate-blob animation-delay-2000 ml-20 mt-20"></div>
          <div className="blob bg-pink-400 w-96 h-96 rounded-full mix-blend-multiply opacity-30 animate-blob animation-delay-4000 -ml-20 mt-40"></div>
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center z-10">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-8"
          >
            Build professional <br className="hidden md:block" />
            <span className="text-gradient">AI-powered</span> resumes
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto max-w-2xl text-lg md:text-xl text-slate-600 dark:text-slate-300 mb-10"
          >
            Don&apos;t waste hours formatting and writing. Let our AI craft your perfect, ATS-friendly resume in seconds. Land your dream job faster.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            {session ? (
              <Link
                href="/dashboard"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full text-lg font-bold transition-all hover-lift shadow-lg shadow-blue-500/30"
              >
                Go to Dashboard
              </Link>
            ) : (
              <Link
                href="/register"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full text-lg font-bold transition-all hover-lift shadow-lg shadow-blue-500/30"
              >
                Create Free Resume
              </Link>
            )}
            <Link
              href="#how-it-works"
              className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 px-8 py-4 rounded-full text-lg font-medium transition-all hover-lift"
            >
              See How It Works
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Everything you need to <span className="text-gradient">get hired</span>
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              We&apos;ve combined stunning design with cutting-edge AI to give you the ultimate unfair advantage in your job search.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {features.map((feature, index) => (
              <motion.div
                key={feature.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm border border-slate-100 dark:border-slate-700 hover-lift"
              >
                <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-6 text-blue-600 dark:text-blue-400">
                  <feature.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{feature.name}</h3>
                <p className="text-slate-600 dark:text-slate-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-24 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="md:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6">
                Three simple steps to your <span className="text-gradient">perfect resume</span>
              </h2>
              <div className="space-y-8 mt-10">
                {steps.map((step, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.2 }}
                    className="flex"
                  >
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-600 text-white font-bold text-xl shadow-md border-4 border-blue-100 dark:border-blue-900">
                        {index + 1}
                      </div>
                    </div>
                    <div className="ml-6">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">{step.title}</h3>
                      <p className="mt-2 text-slate-600 dark:text-slate-400">{step.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            
            <div className="md:w-1/2 w-full">
              {/* Mockup UI representation */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-4 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 relative z-10"
              >
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                  <div className="border-b border-slate-200 dark:border-slate-700 p-4 flex items-center space-x-2 bg-slate-50 dark:bg-slate-900/50">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    <div className="ml-4 text-xs font-medium text-slate-500">CVGenius AI Generator</div>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3 mb-6 animate-pulse"></div>
                    <div className="space-y-3">
                      <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-full animate-pulse"></div>
                      <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-5/6 animate-pulse"></div>
                      <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-4/6 animate-pulse"></div>
                    </div>
                    <div className="py-4 border-t border-b border-slate-100 dark:border-slate-700 my-4">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                          <HiOutlineSparkles className="text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="h-3 bg-blue-200 dark:bg-blue-800 rounded w-1/4 animate-pulse"></div>
                      </div>
                      <div className="h-20 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4 border border-blue-100 dark:border-blue-800">
                        <div className="h-2 bg-blue-200 dark:bg-blue-800 rounded w-full mb-2"></div>
                        <div className="h-2 bg-blue-200 dark:bg-blue-800 rounded w-2/3 mb-2"></div>
                        <div className="h-2 bg-blue-200 dark:bg-blue-800 rounded w-1/2"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Simple, transparent <span className="text-gradient">pricing</span>
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Start building your resume for free. Upgrade when you need more power.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-sm border border-slate-200 dark:border-slate-700 hover-lift relative flex flex-col"
            >
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Free Plan</h3>
              <p className="text-slate-500 mb-6">Perfect for trying out the platform.</p>
              <div className="mb-8">
                <span className="text-5xl font-extrabold text-slate-900 dark:text-white">$0</span>
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
                href="/register"
                className="w-full block text-center bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-900 dark:text-white py-4 rounded-xl font-bold transition-colors"
              >
                Get Started Free
              </Link>
            </motion.div>

            {/* Pro Plan */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-slate-900 dark:bg-slate-950 rounded-3xl p-8 shadow-2xl border border-blue-500 relative flex flex-col transform md:-translate-y-4 hover-lift"
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
                  <span>Unlimited AI resumes</span>
                </li>
                <li className="flex items-center text-slate-200">
                  <HiOutlineCheckCircle className="h-6 w-6 text-blue-400 mr-3 flex-shrink-0" />
                  <span>Premium, ATS-optimized templates</span>
                </li>
                <li className="flex items-center text-slate-200">
                  <HiOutlineCheckCircle className="h-6 w-6 text-blue-400 mr-3 flex-shrink-0" />
                  <span>Priority AI generation processing</span>
                </li>
                <li className="flex items-center text-slate-200">
                  <HiOutlineCheckCircle className="h-6 w-6 text-blue-400 mr-3 flex-shrink-0" />
                  <span>Exclusive cover letter generator</span>
                </li>
              </ul>
              <Link
                href="/pricing"
                className="w-full block text-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/25"
              >
                Upgrade to Pro
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-600"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 opacity-90"></div>
        <div className="relative max-w-4xl mx-auto px-4 text-center z-10">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Ready to land your dream job?</h2>
          <p className="text-xl text-blue-100 mb-10">Join thousands of job seekers who successfully found their next role using CVGenius AI.</p>
          <Link
            href="/register"
            className="inline-block bg-white text-blue-600 px-10 py-5 rounded-full text-xl font-bold transition-all hover-lift shadow-2xl"
          >
            Create Your Resume Now
          </Link>
        </div>
      </section>
    </div>
  );
}
