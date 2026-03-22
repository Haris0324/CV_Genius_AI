'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiOutlineUser, 
  HiOutlineBriefcase, 
  HiOutlineAcademicCap, 
  HiOutlineLightningBolt,
  HiChevronRight,
  HiChevronLeft,
  HiSparkles
} from 'react-icons/hi';

export default function ResumeBuilder() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    personalInfo: { name: '', email: '', phone: '', location: '' },
    targetJob: '',
    experience: '',
    education: '',
    skills: ''
  });

  const handleNext = () => setStep((prev) => Math.min(prev + 1, 4));
  const handleBack = () => setStep((prev) => Math.max(prev - 1, 1));

  const generateResume = async () => {
    setIsGenerating(true);
    setError('');
    
    try {
      const res = await fetch('/api/resume/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (res.ok) {
        const data = await res.json();
        // Here you would redirect to the editor with the generated ID
        router.push(`/dashboard`); // Going to dashboard for demo
      } else {
        const data = await res.json();
        setError(data.message || 'Generation failed');
      }
    } catch (err) {
      setError('An error occurred during generation.');
    } finally {
      setIsGenerating(false);
    }
  };

  const steps = [
    { num: 1, title: 'Basics', icon: HiOutlineUser },
    { num: 2, title: 'Experience', icon: HiOutlineBriefcase },
    { num: 3, title: 'Education', icon: HiOutlineAcademicCap },
    { num: 4, title: 'Skills & Target', icon: HiOutlineLightningBolt },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Progress Stepper */}
        <div className="mb-12">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-slate-200 dark:bg-slate-800 -z-10 rounded-full"></div>
            <div 
              className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-blue-600 -z-10 rounded-full transition-all duration-500 ease-in-out"
              style={{ width: `${((step - 1) / 3) * 100}%` }}
            ></div>
            
            {steps.map((s) => (
              <div key={s.num} className="flex flex-col items-center">
                <div 
                  className={`w-12 h-12 rounded-full flex items-center justify-center border-4 transition-colors duration-300 ${
                    step >= s.num 
                      ? 'bg-blue-600 border-blue-100 dark:border-blue-900 text-white' 
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400'
                  }`}
                >
                  <s.icon className="w-6 h-6" />
                </div>
                <span className={`mt-2 text-sm font-medium ${step >= s.num ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500'}`}>
                  {s.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-200 dark:border-slate-800 relative overflow-hidden">
          {error && (
            <div className="mb-6 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm">
              {error}
            </div>
          )}

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Personal Information</h2>
                  <p className="text-slate-500 mb-8">Let&apos;s start with the basics. This will be the header of your resume.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Full Name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      value={formData.personalInfo.name}
                      onChange={(e) => setFormData({...formData, personalInfo: {...formData.personalInfo, name: e.target.value}})}
                      placeholder="Jane Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email</label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      value={formData.personalInfo.email}
                      onChange={(e) => setFormData({...formData, personalInfo: {...formData.personalInfo, email: e.target.value}})}
                      placeholder="jane@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Phone</label>
                    <input
                      type="tel"
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      value={formData.personalInfo.phone}
                      onChange={(e) => setFormData({...formData, personalInfo: {...formData.personalInfo, phone: e.target.value}})}
                      placeholder="(555) 123-4567"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Location</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      value={formData.personalInfo.location}
                      onChange={(e) => setFormData({...formData, personalInfo: {...formData.personalInfo, location: e.target.value}})}
                      placeholder="New York, NY"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Work Experience</h2>
                  <p className="text-slate-500 mb-6">Don&apos;t worry about formatting. Just dump your rough experience, our AI will polish it into professional bullet points.</p>
                </div>
                <div>
                  <textarea
                    rows="8"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="E.g. Software Engineer at TechCorp (2020-2023). Built react applications. Increased speed by 20%. Managed a small team."
                    value={formData.experience}
                    onChange={(e) => setFormData({...formData, experience: e.target.value})}
                  ></textarea>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Education History</h2>
                  <p className="text-slate-500 mb-6">List your degrees, schools, and any relevant certifications or achievements.</p>
                </div>
                <div>
                  <textarea
                    rows="6"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="E.g. BS Computer Science from State University, 2019. GPA 3.8. AWS Certified Solutions Architect."
                    value={formData.education}
                    onChange={(e) => setFormData({...formData, education: e.target.value})}
                  ></textarea>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Target Role & Skills</h2>
                  <p className="text-slate-500 mb-6">Tell us what job you are aiming for, and drop a list of your skills. The AI will optimize the resume for this context.</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Target Job Title</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 mb-6 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    value={formData.targetJob}
                    onChange={(e) => setFormData({...formData, targetJob: e.target.value})}
                    placeholder="E.g. Senior Frontend Developer"
                  />
                  
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Skills (comma separated)</label>
                  <textarea
                    rows="4"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="React, TypeScript, Next.js, Team Leadership, Agile"
                    value={formData.skills}
                    onChange={(e) => setFormData({...formData, skills: e.target.value})}
                  ></textarea>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="mt-10 pt-6 border-t border-slate-200 dark:border-slate-800 flex justify-between">
            <button
              onClick={handleBack}
              disabled={step === 1 || isGenerating}
              className={`flex items-center px-6 py-3 rounded-xl font-medium transition-all ${
                step === 1 
                  ? 'opacity-50 cursor-not-allowed text-slate-400' 
                  : 'text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 hover-lift'
              }`}
            >
              <HiChevronLeft className="mr-2" /> Back
            </button>
            
            {step < 4 ? (
              <button
                onClick={handleNext}
                className="flex items-center px-6 py-3 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all hover-lift"
              >
                Next <HiChevronRight className="ml-2" />
              </button>
            ) : (
              <button
                onClick={generateResume}
                disabled={isGenerating}
                className={`flex items-center px-8 py-3 rounded-xl font-bold text-white transition-all shadow-lg hover-lift ${
                  isGenerating 
                    ? 'bg-indigo-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-indigo-500/30'
                }`}
              >
                {isGenerating ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating Magic...
                  </>
                ) : (
                  <>
                    <HiSparkles className="mr-2 h-5 w-5" /> Generate Resume
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
