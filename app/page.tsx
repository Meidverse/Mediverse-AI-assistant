"use client";

import { ChatInterface } from "@/components/ChatInterface";
import {
    ClockIcon,
    CpuChipIcon,
    PhotoIcon,
    ShieldCheckIcon,
    SparklesIcon
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import Link from "next/link";

const capabilities = [
  {
    title: "X-Ray Analysis",
    description: "Detect fractures, pneumonia, and abnormalities in chest X-rays with AI precision",
    icon: PhotoIcon,
  },
  {
    title: "CT Scan Interpretation",
    description: "Analyze CT scans for tumors, bleeding, and structural abnormalities",
    icon: CpuChipIcon,
  },
  {
    title: "MRI Diagnostics",
    description: "Identify lesions, tissue damage, and neurological conditions from MRI scans",
    icon: SparklesIcon,
  },
];

const features = [
  {
    title: "Instant Analysis",
    description: "Get AI-powered diagnostic insights in seconds",
    icon: ClockIcon,
  },
  {
    title: "HIPAA Compliant",
    description: "Your medical data is encrypted and secure",
    icon: ShieldCheckIcon,
  },
  {
    title: "Multimodal AI",
    description: "Powered by advanced vision models (GPT-4V, Gemini Pro Vision)",
    icon: CpuChipIcon,
  },
];

const stats = [
  { value: "95%+", label: "Accuracy Rate" },
  { value: "< 5s", label: "Analysis Time" },
  { value: "24/7", label: "Availability" },
];

export default function HomePage() {
  const scrollToDemo = () => {
    const demoSection = document.getElementById('demo');
    if (demoSection) {
      demoSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Background effects */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <motion.div
          className="absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-gradient-to-r from-blue-600/40 via-purple-600/40 to-indigo-500/30 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-0 right-0 h-96 w-96 translate-x-1/2 bg-gradient-to-br from-sky-400/20 via-blue-500/30 to-transparent blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 10, repeat: Infinity, delay: 1 }}
        />
      </div>

      {/* Header */}
      <motion.header
        className="sticky top-0 z-40 border-b border-white/10 backdrop-blur-2xl bg-slate-950/60"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <motion.div
            className="flex items-center gap-3"
            whileHover={{ scale: 1.02 }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/30 blur-xl rounded-full" />
              <span className="relative inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500/30 to-purple-500/20 shadow-glow-sm border border-white/10">
                <SparklesIcon className="h-6 w-6 text-blue-300 animate-pulse-glow" />
              </span>
            </div>
            <div>
              <p className="text-lg font-semibold">Mediverse AI</p>
              <p className="text-xs text-slate-400">Medical Imaging Diagnostics</p>
            </div>
          </motion.div>

          <nav className="hidden items-center gap-6 text-sm font-medium text-slate-200 md:flex">
            <a href="#features" className="transition-smooth hover:text-white hover:scale-105">
              Features
            </a>
            <a href="#demo" className="transition-smooth hover:text-white hover:scale-105">
              Try Demo
            </a>
            <a href="#how-it-works" className="transition-smooth hover:text-white hover:scale-105">
              How It Works
            </a>
          </nav>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={scrollToDemo}
            className="primary"
          >
            Get Started
          </motion.button>
        </div>
      </motion.header>

      <main>
        {/* Hero Section */}
        <section className="section pt-20 pb-32">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                className="space-y-8"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <motion.div
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-widest text-blue-200 shadow-glow-sm"
                  whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(59, 130, 246, 0.4)" }}
                >
                  <SparklesIcon className="h-4 w-4 text-blue-300" />
                  AI-Powered Medical Imaging
                </motion.div>

                <h1
                  className="text-5xl font-bold leading-tight lg:text-6xl"
                  style={{
                    background: "linear-gradient(135deg, #ffffff 0%, #e0e7ff 40%, #c7d2fe 100%)",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Upload. Analyze. Diagnose.
                </h1>

                <p className="text-lg text-slate-300 leading-relaxed">
                  Harness the power of advanced AI to analyze X-rays, CT scans, and MRIs instantly. 
                  Get preliminary diagnostic insights in seconds with Mediverse&apos;s multimodal vision AI.
                </p>

                <div className="flex flex-wrap gap-4">
                  <motion.a
                    href="#demo"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="primary inline-flex items-center gap-2"
                  >
                    Try Live Demo
                    <SparklesIcon className="h-5 w-5" />
                  </motion.a>
                  <motion.a
                    href="#features"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="secondary inline-flex items-center gap-2"
                  >
                    Learn More
                  </motion.a>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 pt-8">
                  {stats.map((stat, idx) => (
                    <motion.div
                      key={stat.label}
                      className="text-center"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + idx * 0.1 }}
                    >
                      <p className="text-3xl font-bold bg-gradient-to-r from-blue-200 to-purple-200 bg-clip-text text-transparent">
                        {stat.value}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">{stat.label}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Hero Image/Demo Preview */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, x: 50 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl blur-3xl" />
                <div className="relative card p-6 shadow-glow-xl">
                  <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-slate-800/60 to-slate-900/60 border border-white/10 flex items-center justify-center overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1559757175-0eb30cd8c063?auto=format&fit=crop&w=800&q=80"
                      alt="Medical imaging AI analysis"
                      className="w-full h-full object-cover opacity-80"
                    />
                  </div>
                  <div className="mt-4 flex items-center gap-3">
                    <div className="flex-1 h-2 rounded-full bg-slate-800/60 overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                        initial={{ width: "0%" }}
                        animate={{ width: "95%" }}
                        transition={{ duration: 2, delay: 1 }}
                      />
                    </div>
                    <span className="text-xs text-slate-400">95% Confidence</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Capabilities Section */}
        <section id="features" className="section border-y border-white/10 bg-slate-950/40">
          <div className="mx-auto max-w-7xl px-6">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="section-heading">Advanced Diagnostic Capabilities</h2>
              <p className="section-subtitle max-w-2xl mx-auto">
                Our AI analyzes multiple imaging modalities to provide comprehensive diagnostic support
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {capabilities.map((capability, idx) => (
                <motion.div
                  key={capability.title}
                  className="card p-8 group hover:shadow-glow-lg"
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ y: -6 }}
                >
                  <motion.div
                    className="mb-6"
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10">
                      <capability.icon className="h-8 w-8 text-blue-300" />
                    </div>
                  </motion.div>
                  <h3 className="text-xl font-semibold text-white mb-3">{capability.title}</h3>
                  <p className="text-sm text-slate-300/80 leading-relaxed">{capability.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="section">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid md:grid-cols-3 gap-6">
              {features.map((feature, idx) => (
                <motion.div
                  key={feature.title}
                  className="flex items-start gap-4"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <div className="flex-shrink-0 p-3 rounded-xl bg-blue-500/10 border border-blue-400/20">
                    <feature.icon className="h-6 w-6 text-blue-300" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">{feature.title}</h3>
                    <p className="text-sm text-slate-400">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Live Demo Section */}
        <section id="demo" className="section border-y border-white/10 bg-slate-950/40">
          <div className="mx-auto max-w-7xl px-6">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="section-heading">Try Mediverse AI Now</h2>
              <p className="section-subtitle max-w-2xl mx-auto">
                Upload a medical scan and describe the symptoms to get instant AI-powered analysis
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-5xl mx-auto"
            >
              <ChatInterface />
            </motion.div>

            <motion.p
              className="text-center text-xs text-yellow-300/70 mt-8 max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              ⚠️ <strong>Medical Disclaimer:</strong> Mediverse AI provides preliminary analysis for educational and informational 
              purposes only. Always consult qualified healthcare professionals for accurate diagnosis and treatment decisions. 
              This tool does not replace professional medical advice.
            </motion.p>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="section">
          <div className="mx-auto max-w-7xl px-6">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="section-heading">How It Works</h2>
              <p className="section-subtitle">Three simple steps to get AI diagnostic insights</p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { step: "1", title: "Upload Scan", desc: "Drag & drop X-ray, CT, or MRI image" },
                { step: "2", title: "Describe Symptoms", desc: "Provide clinical context via chat" },
                { step: "3", title: "Get Analysis", desc: "Receive AI-powered diagnostic insights" },
              ].map((item, idx) => (
                <motion.div
                  key={item.step}
                  className="relative"
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.2 }}
                >
                  <div className="card p-8 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10 mb-6">
                      <span className="text-2xl font-bold bg-gradient-to-r from-blue-200 to-purple-200 bg-clip-text text-transparent">
                        {item.step}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-3">{item.title}</h3>
                    <p className="text-sm text-slate-300/70">{item.desc}</p>
                  </div>
                  {idx < 2 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-blue-400/50 to-transparent" />
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-slate-950/80 py-10">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-lg font-semibold text-white">Mediverse AI</p>
              <p className="text-sm text-slate-400/80 mt-1">Advancing medical diagnostics with AI</p>
            </div>
            <div className="flex gap-6 text-sm text-slate-400">
              <Link href="#" className="hover:text-white transition">Privacy</Link>
              <Link href="#" className="hover:text-white transition">Terms</Link>
              <Link href="#" className="hover:text-white transition">Contact</Link>
            </div>
            <p className="text-xs text-slate-500" suppressHydrationWarning>© {new Date().getFullYear()} Mediverse. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
