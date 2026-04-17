import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { NextAuthProvider } from '@/components/Providers'

export const metadata = {
  title: 'CVGenius AI | Build professional AI-powered resumes in seconds',
  description: 'AI-powered resume builder SaaS platform. Create ATS-friendly professional resumes instantly using artificial intelligence.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body suppressHydrationWarning className="antialiased min-h-screen flex flex-col bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50">
        <NextAuthProvider>
          <Navbar />
          <main className="flex-1 pt-20">
            {children}
          </main>
          <Footer />
        </NextAuthProvider>
      </body>
    </html>
  )
}
