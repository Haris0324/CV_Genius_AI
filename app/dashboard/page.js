'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  HiOutlineDocumentReport, 
  HiOutlineSparkles, 
  HiOutlineClock, 
  HiOutlinePlusCircle,
  HiOutlineDownload,
  HiOutlinePencilAlt,
  HiOutlineTrash
} from 'react-icons/hi';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  // Real Data
  const [stats, setStats] = useState({
    totalResumes: 0,
    plan: 'FREE',
    resumesLeft: 3 // Default, would come from user session ideally
  });

  const [resumes, setResumes] = useState([]);
  const [isLoadingResumes, setIsLoadingResumes] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchResumes();
      
      // Update plan based on session if available
      setStats(prev => ({
        ...prev,
        plan: session?.user?.subscription || 'FREE'
      }));
    }
  }, [status, session]);

  const fetchResumes = async () => {
    setIsLoadingResumes(true);
    try {
      const res = await fetch('/api/resume');
      if (res.ok) {
        const data = await res.json();
        setResumes(data.resumes);
        setStats(prev => ({ 
          ...prev, 
          totalResumes: data.resumes.length,
          resumesLeft: Math.max(0, 3 - (data.limitsUsed || 0)) 
        }));
      }
    } catch (error) {
      console.error('Failed to fetch resumes:', error);
    } finally {
      setIsLoadingResumes(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this resume?')) return;
    
    try {
      const res = await fetch(`/api/resume/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setResumes(prev => prev.filter(r => r._id !== id));
        setStats(prev => ({ ...prev, totalResumes: prev.totalResumes - 1 }));
      } else {
        alert('Failed to delete resume');
      }
    } catch (error) {
      console.error('Error deleting:', error);
    }
  };

  if (status === 'loading') {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Hello, <span className="text-gradient">{session?.user?.name || 'User'}</span> 👋
            </h1>
            <p className="mt-1 text-slate-600 dark:text-slate-400">
              Welcome to your resume control center.
            </p>
          </div>
          <Link
            href="/resume"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-semibold rounded-xl text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all hover-lift"
          >
            <HiOutlinePlusCircle className="mr-2 -ml-1 h-5 w-5" />
            Create New Resume
          </Link>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 flex items-center hover-lift"
          >
            <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/30 mr-4">
              <HiOutlineDocumentReport className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Resumes</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{stats.totalResumes}</h3>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 flex items-center hover-lift"
          >
            <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-900/30 mr-4">
              <HiOutlineSparkles className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Current Plan</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{stats.plan}</h3>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-6 shadow-lg border border-blue-500 flex items-center justify-between text-white hover-lift relative overflow-hidden"
          >
            <div className="absolute -right-4 -top-4 bg-white/10 w-24 h-24 rounded-full blur-xl"></div>
            <div>
              <p className="text-sm font-medium text-blue-100">AI Limit</p>
              <h3 className="text-2xl font-bold flex items-end">
                {stats.resumesLeft} <span className="text-sm font-normal ml-2 opacity-80 mb-1">resumes left this month</span>
              </h3>
            </div>
            {stats.plan === 'FREE' && (
              <Link href="/pricing" className="ml-4 bg-white text-blue-600 text-sm font-bold px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors z-10">
                Upgrade
              </Link>
            )}
          </motion.div>
        </div>

        {/* Resumes List */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center">
              <HiOutlineClock className="mr-2 h-5 w-5 text-slate-500" />
              Recent Resumes
            </h3>
          </div>
          
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {isLoadingResumes ? (
              <div className="px-6 py-12 text-center text-slate-500">
                <div className="animate-pulse flex flex-col items-center">
                  <div className="h-6 w-32 bg-slate-200 dark:bg-slate-700 rounded mb-4"></div>
                  <div className="h-4 w-48 bg-slate-200 dark:bg-slate-700 rounded"></div>
                </div>
              </div>
            ) : resumes.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <p className="text-slate-500 dark:text-slate-400">No resumes created yet.</p>
                <Link href="/resume" className="mt-4 text-blue-600 hover:text-blue-700 font-medium inline-block">
                  Create your first resume &rarr;
                </Link>
              </div>
            ) : (
              resumes.map((resume) => (
                <div key={resume._id} className="p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center w-full sm:w-auto">
                    <div className="h-16 w-12 bg-slate-200 dark:bg-slate-700 rounded mr-4 flex-shrink-0 relative overflow-hidden border border-slate-300 dark:border-slate-600">
                      <div className="absolute top-2 left-2 right-2 h-1 bg-slate-300 dark:bg-slate-500 rounded-full"></div>
                      <div className="absolute top-4 left-2 right-2 h-[2px] bg-slate-300 dark:bg-slate-500 opacity-50"></div>
                      <div className="absolute top-5 left-2 right-2 h-[2px] bg-slate-300 dark:bg-slate-500 opacity-50"></div>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-slate-900 dark:text-white truncate">
                        {resume.title}
                      </h4>
                      <div className="text-sm text-slate-500 dark:text-slate-400 flex items-center mt-1">
                        <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-xs mr-2 capitalize">
                          {resume.template || 'Modern'}
                        </span>
                        <span>Updated {new Date(resume.updatedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
                    <Link href={`/resume/${resume._id}`} className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors" title="View">
                      <HiOutlineDocumentReport className="h-5 w-5" />
                    </Link>
                    <Link href={`/resume/${resume._id}`} className="p-2 text-slate-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg transition-colors" title="Download PDF">
                      <HiOutlineDownload className="h-5 w-5" />
                    </Link>
                    <button onClick={() => handleDelete(resume._id)} className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors" title="Delete">
                      <HiOutlineTrash className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
