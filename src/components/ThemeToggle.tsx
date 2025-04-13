'use client';

import { useTheme } from '@/components/ThemeProvider';
import { FiSun, FiMoon } from 'react-icons/fi';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full transition-colors backdrop-blur-sm 
                 dark:bg-gray-800/40 dark:hover:bg-gray-700/60
                 light:bg-white/40 light:hover:bg-white/60
                 border border-gray-200 dark:border-gray-700"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
    >
      {theme === 'dark' ? (
        <FiSun className="h-5 w-5 text-yellow-300" />
      ) : (
        <FiMoon className="h-5 w-5 text-blue-600" />
      )}
    </button>
  );
}
