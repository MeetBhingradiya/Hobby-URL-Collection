import '../styles/globals.css';
import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from '@/components/ThemeProvider';
import ThemeToggle from '@/components/ThemeToggle';
import MobileMenu from '@/components/MobileMenu';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const poppins = Poppins({ 
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins'
});

export const metadata: Metadata = {
  title: 'The Urlist - Share Your Lists of URLs',
  description: 'Create, manage, and share collections of URLs with custom links',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${poppins.variable} font-sans transition-colors duration-300`}>
        <ThemeProvider>
          <Toaster position="top-center" toastOptions={{
            className: 'dark:bg-gray-800 dark:text-white glass',
          }} />
          <div className="flex flex-col min-h-screen overflow-hidden">
            <header className="backdrop-blur-lg sticky top-0 z-50 border-b dark:border-gray-800 bg-white/70 dark:bg-gray-900/70">              <div className="container mx-auto px-4">
                <nav className="flex justify-between items-center h-16">
                  <Link href="/" className="text-2xl font-bold font-poppins bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                    The Urlist
                  </Link>                  <div className="hidden md:flex items-center space-x-6">
                    <Link href="/" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors">
                      Home
                    </Link>
                    <Link href="/lists" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors">
                      My Lists
                    </Link>
                    <Link href="/pricing" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors">
                      Pricing
                    </Link>
                    <ThemeToggle />
                  </div>
                  <div className="md:hidden flex items-center">
                    <MobileMenu />
                  </div>
                </nav>
              </div>
            </header>
            <main className="flex-grow container mx-auto px-4 py-8">
              {children}
            </main>            <footer className="mt-auto border-t dark:border-gray-800 glass dark:bg-gray-900/30 py-6">
              <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center">
                  <p className="dark:text-gray-400 text-gray-600 mb-4 md:mb-0">
                    © {new Date().getFullYear()} The Urlist. All rights reserved.
                  </p>
                  <div className="flex space-x-6">
                    <Link 
                      href="/privacy" 
                      className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
                    >
                      Privacy Policy
                    </Link>
                    <Link 
                      href="/terms" 
                      className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
                    >
                      Terms of Service
                    </Link>
                    <Link 
                      href="/sitemap" 
                      className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
                    >
                      Sitemap
                    </Link>
                  </div>
                </div>
              </div>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
