'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { HiOutlineDownload, HiOutlineArrowLeft } from 'react-icons/hi';

export default function ResumeViewer() {
  const { id } = useParams();
  const router = useRouter();
  const { status } = useSession();
  
  const [resume, setResume] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    const fetchResume = async () => {
      if (!id || status !== 'authenticated') return;
      
      try {
        const res = await fetch(`/api/resume/${id}`);
        if (res.ok) {
          const data = await res.json();
          setResume(data.resume);
        } else {
          setError('Failed to fetch resume.');
        }
      } catch (err) {
        setError('Error connecting to server.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchResume();
  }, [id, status]);

  if (isLoading || status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !resume) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 text-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Resume Not Found</h2>
        <p className="text-slate-500 mb-6">{error || "The resume you're looking for doesn't exist or you don't have access."}</p>
        <Link href="/dashboard" className="px-6 py-3 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 transition">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const { content } = resume;

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 py-10 print:bg-white print:py-0">
      <div className="max-w-4xl mx-auto px-4 print:px-0">
        
        {/* Controls - Hidden when printing */}
        <div className="mb-6 flex justify-between items-center print:hidden">
          <Link href="/dashboard" className="flex items-center text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition">
            <HiOutlineArrowLeft className="mr-2" /> Back to Dashboard
          </Link>
        </div>

        {/* The Resume Document */}
        <div className="bg-white shadow-xl min-h-[1056px] w-full p-10 sm:p-14 print:shadow-none print:p-0">
          <header className="border-b-2 border-slate-800 pb-6 mb-6">
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight uppercase">
               {resume.title.replace(' Resume', '')}
            </h1>
            <div className="mt-2 text-slate-600 flex flex-wrap gap-4 text-sm font-medium">
              <span>Optimized by CVGenius AI</span>
              {content.personalInfo?.email && <span>• {content.personalInfo.email}</span>}
            </div>
          </header>

          <main className="space-y-8 text-slate-800">
            {content.summary && (
              <section>
                <h2 className="text-lg font-bold uppercase tracking-wider text-slate-900 mb-3 border-b border-slate-200 pb-1">Professional Summary</h2>
                <p className="text-sm leading-relaxed">{content.summary}</p>
              </section>
            )}

            {content.experience && content.experience.length > 0 && (
              <section>
                <h2 className="text-lg font-bold uppercase tracking-wider text-slate-900 mb-4 border-b border-slate-200 pb-1">Experience</h2>
                <div className="space-y-6">
                  {content.experience.map((exp, i) => (
                    <div key={i}>
                      <div className="flex justify-between items-baseline mb-1">
                        <h3 className="font-bold text-slate-900">{exp.role}</h3>
                        <span className="text-sm font-medium text-slate-600">{exp.duration}</span>
                      </div>
                      <div className="text-sm font-medium text-slate-700 mb-2">{exp.company}</div>
                      <ul className="list-disc list-outside ml-4 text-sm space-y-1 text-slate-700">
                        {exp.description && exp.description.map((bullet, j) => (
                          <li key={j} className="leading-relaxed">{bullet}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {content.education && content.education.length > 0 && (
                <section>
                  <h2 className="text-lg font-bold uppercase tracking-wider text-slate-900 mb-4 border-b border-slate-200 pb-1">Education</h2>
                  <div className="space-y-4">
                    {content.education.map((edu, i) => (
                      <div key={i}>
                        <div className="font-bold text-slate-900 text-sm">{edu.degree}</div>
                        <div className="text-sm text-slate-700">{edu.institution}</div>
                        <div className="text-sm text-slate-500 italic">{edu.year}</div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {content.skills && content.skills.length > 0 && (
                <section>
                  <h2 className="text-lg font-bold uppercase tracking-wider text-slate-900 mb-4 border-b border-slate-200 pb-1">Core Skills</h2>
                  <ul className="flex flex-wrap gap-2">
                    {content.skills.map((skill, i) => (
                      <li key={i} className="text-sm bg-slate-100 border border-slate-200 px-3 py-1 rounded text-slate-800">
                        {skill}
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>
          </main>
        </div>

      </div>
    </div>
  );
}
