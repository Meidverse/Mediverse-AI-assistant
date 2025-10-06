"use client";

import {
    EnvelopeIcon,
    HeartIcon,
    ShieldCheckIcon,
    SparklesIcon,
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { name: 'Features', href: '#features' },
      { name: 'How It Works', href: '#how-it-works' },
      { name: 'Try Demo', href: '#demo' },
      { name: 'Pricing', href: '#pricing' },
    ],
    company: [
      { name: 'About Us', href: '#about' },
      { name: 'Blog', href: '#blog' },
      { name: 'Careers', href: '#careers' },
      { name: 'Contact', href: '#contact' },
    ],
    legal: [
      { name: 'Privacy Policy', href: '#privacy' },
      { name: 'Terms of Service', href: '#terms' },
      { name: 'Cookie Policy', href: '#cookies' },
      { name: 'HIPAA Compliance', href: '#hipaa' },
    ],
    resources: [
      { name: 'Documentation', href: '#docs' },
      { name: 'API Reference', href: '#api' },
      { name: 'Support', href: '#support' },
      { name: 'Status', href: '#status' },
    ],
  };

  return (
    <footer className="border-t border-white/10 dark:border-white/10 light:border-gray-200 dark:bg-slate-950/80 light:bg-white/95 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-6">
        {/* Main Footer Content */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <motion.div
              className="flex items-center gap-3 mb-4"
              whileHover={{ scale: 1.02 }}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500/30 blur-xl rounded-full" />
                <span className="relative inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500/30 to-purple-500/20 shadow-glow-sm border border-white/10">
                  <SparklesIcon className="h-6 w-6 text-blue-300" />
                </span>
              </div>
              <div>
                <p className="text-lg font-bold dark:text-white light:text-gray-900">Mediverse AI</p>
                <p className="text-xs dark:text-slate-400 light:text-gray-600">Medical Imaging Diagnostics</p>
              </div>
            </motion.div>
            
            <p className="text-sm dark:text-slate-300 light:text-gray-600 leading-relaxed mb-6">
              Advancing medical diagnostics with state-of-the-art AI technology. 
              Empowering healthcare professionals with instant, accurate insights.
            </p>

            {/* Social Links */}
            <div className="flex gap-3">
              {['twitter', 'linkedin', 'github', 'youtube'].map((social) => (
                <motion.a
                  key={social}
                  href={`#${social}`}
                  className="p-2 rounded-lg dark:bg-slate-800/50 light:bg-gray-100 border border-white/10 dark:border-white/10 light:border-gray-200 dark:hover:bg-slate-700/70 light:hover:bg-gray-200 transition-all"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={social}
                >
                  <div className="h-5 w-5 dark:text-slate-400 light:text-gray-600" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          <div>
            <h3 className="font-semibold dark:text-white light:text-gray-900 mb-4">Product</h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm dark:text-slate-400 light:text-gray-600 dark:hover:text-white light:hover:text-gray-900 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold dark:text-white light:text-gray-900 mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm dark:text-slate-400 light:text-gray-600 dark:hover:text-white light:hover:text-gray-900 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold dark:text-white light:text-gray-900 mb-4">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm dark:text-slate-400 light:text-gray-600 dark:hover:text-white light:hover:text-gray-900 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold dark:text-white light:text-gray-900 mb-4">Resources</h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm dark:text-slate-400 light:text-gray-600 dark:hover:text-white light:hover:text-gray-900 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="border-t dark:border-white/10 light:border-gray-200 py-8">
          <div className="flex flex-wrap items-center justify-center gap-8">
            <motion.div
              className="flex items-center gap-2 text-sm dark:text-slate-400 light:text-gray-600"
              whileHover={{ scale: 1.05 }}
            >
              <ShieldCheckIcon className="h-5 w-5 text-green-500" />
              <span>HIPAA Compliant</span>
            </motion.div>
            <motion.div
              className="flex items-center gap-2 text-sm dark:text-slate-400 light:text-gray-600"
              whileHover={{ scale: 1.05 }}
            >
              <ShieldCheckIcon className="h-5 w-5 text-blue-500" />
              <span>ISO 27001 Certified</span>
            </motion.div>
            <motion.div
              className="flex items-center gap-2 text-sm dark:text-slate-400 light:text-gray-600"
              whileHover={{ scale: 1.05 }}
            >
              <ShieldCheckIcon className="h-5 w-5 text-purple-500" />
              <span>SOC 2 Type II</span>
            </motion.div>
            <motion.div
              className="flex items-center gap-2 text-sm dark:text-slate-400 light:text-gray-600"
              whileHover={{ scale: 1.05 }}
            >
              <HeartIcon className="h-5 w-5 text-red-500" />
              <span>FDA Reviewed</span>
            </motion.div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="border-t dark:border-white/10 light:border-gray-200 py-8">
          <div className="max-w-md mx-auto text-center">
            <h3 className="font-semibold dark:text-white light:text-gray-900 mb-2">Stay Updated</h3>
            <p className="text-sm dark:text-slate-400 light:text-gray-600 mb-4">
              Get the latest updates on AI medical diagnostics
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-lg dark:bg-slate-800/50 light:bg-gray-100 border dark:border-white/10 light:border-gray-300 dark:text-white light:text-gray-900 placeholder:dark:text-slate-500 placeholder:light:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium hover:shadow-glow-lg transition-all"
              >
                <EnvelopeIcon className="h-5 w-5" />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t dark:border-white/10 light:border-gray-200 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm dark:text-slate-500 light:text-gray-500">
            <p suppressHydrationWarning>
              © {currentYear} Mediverse AI. All rights reserved.
            </p>
            <p className="text-xs max-w-2xl text-center">
              <strong>Medical Disclaimer:</strong> This tool provides preliminary analysis for educational purposes only. 
              Always consult qualified healthcare professionals for diagnosis and treatment.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
