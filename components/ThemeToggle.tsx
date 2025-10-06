"use client";

import { MoonIcon, SunIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { useTheme } from './ThemeProvider';
import { useState, useEffect } from 'react';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return a placeholder during SSR with same dimensions
    return (
      <div className="relative p-2 rounded-lg border border-white/10 dark:bg-slate-800/50 light:bg-white/80">
        <div className="h-5 w-5" />
      </div>
    );
  }

  return (
    <motion.button
      onClick={toggleTheme}
      className="relative p-2 rounded-lg border border-white/10 dark:bg-slate-800/50 light:bg-white/80 hover:bg-slate-700/50 dark:hover:bg-slate-700/70 light:hover:bg-gray-100 transition-all"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Toggle theme"
    >
      <motion.div
        initial={false}
        animate={{ rotate: theme === 'dark' ? 0 : 180 }}
        transition={{ duration: 0.3 }}
      >
        {theme === 'dark' ? (
          <SunIcon className="h-5 w-5 text-yellow-300" />
        ) : (
          <MoonIcon className="h-5 w-5 text-indigo-600" />
        )}
      </motion.div>
    </motion.button>
  );
}
