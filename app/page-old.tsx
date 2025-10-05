"use client";

import { DemoConsole } from "@/components/DemoConsole";
import { Dialog, Transition } from "@headlessui/react";
import {
    ArrowDownIcon,
    ArrowRightIcon,
    CheckBadgeIcon,
    HeartIcon,
    PlayCircleIcon,
    ShieldCheckIcon,
    SparklesIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { FormEvent, Fragment, useEffect, useMemo, useState } from "react";

const features = [
  {
    title: "Evidence-first responses",
    description:
      "Blend LLM reasoning with curated clinical sources, citations, and clear disclaimers for every answer.",
    icon: ShieldCheckIcon,
  },
  {
    title: "Guided triage workflows",
    description:
      "Automate intake questionnaires and risk stratification while preserving human oversight at every step.",
    icon: CheckBadgeIcon,
  },
  {
    title: "Care team orchestration",
    description:
      "Route insights to nurses, physicians, or administrators instantly with rich context and follow-up actions.",
    icon: HeartIcon,
  },
];

const metrics = [
  {
    label: "Faster clinical research",
    value: "73%",
    helper: "reduction in time to synthesize care guidelines",
  },
  {
    label: "Safety approved",
    value: "5.0",
    helper: "average clinician rating across pilot deployments",
  },
  {
    label: "Realtime insights",
    value: "< 3s",
    helper: "average latency for structured recommendations",
  },
];

const workflow = [
  {
    title: "Ingest",
    description: "Securely connect EHR notes, imaging summaries, and guideline repositories via compliant APIs.",
  },
  {
    title: "Reason",
    description: "Mediverse blends domain-specific agents with guardrails to generate action-ready insights.",
  },
  {
    title: "Deliver",
    description: "Surface tailored briefs in clinician inboxes, patient portals, or your existing triage tools.",
  },
];

const testimonials = [
  {
    quote:
      "Mediverse feels like a digital fellow: it cross-checks guidelines, clarifies clinical nuance, and keeps the team aligned.",
    author: "Dr. Emily Navarro",
    role: "Chief Medical Information Officer, Northbridge Health",
  },
  {
    quote:
      "Our care managers now resolve complex patient questions in minutes, not hours, without sacrificing safety.",
    author: "Jordan Patel",
    role: "Director of Care Coordination, Horizon Clinics",
  },
  {
    quote:
      "From security review to pilot launch, Mediverse partnered with us at every step. The result is game-changing.",
    author: "Lena Cho",
    role: "VP of Innovation, Starlab Biotech",
  },
];

const faqs = [
  {
    question: "Is Mediverse HIPAA compliant?",
    answer:
      "Yes. Mediverse runs in secure, audit-ready environments with encryption in transit and at rest. No PHI is stored outside of your cloud or Supabase Postgres tenancy.",
  },
  {
    question: "Can clinicians override recommendations?",
    answer:
      "Absolutely. Every response includes confidence scores, citations, and one-click escalation paths, keeping humans firmly in the loop.",
  },
  {
    question: "Which LLM providers do you support?",
    answer:
      "Choose between Google Gemini, OpenRouter multi-model orchestration, or bring your own endpoint. Switching is a configuration change, not a rewrite.",
  },
  {
    question: "How fast can we launch?",
    answer:
      "Teams typically activate a pilot within two weeks after security review. Our deployment scripts, Docker images, and integrations are production-ready.",
  },
];

const partners = [
  "Mayo Clinic",
  "Cleveland Clinic",
  "Medsphere",
  "World Health Organization",
  "NHS Digital",
  "Cedars-Sinai",
];

type BookingForm = {
  fullname: string;
  email: string;
  organization: string;
  message: string;
};

const initialBookingState: BookingForm = {
  fullname: "",
  email: "",
  organization: "",
  message: "",
};

export default function Page() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [booking, setBooking] = useState<BookingForm>(initialBookingState);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev: number) => (prev + 1) % testimonials.length);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const activeTestimonial = useMemo(() => testimonials[currentTestimonial], [currentTestimonial]);

  const openModal = () => {
    setBooking(initialBookingState);
    setBookingSuccess(false);
    setIsModalOpen(true);
  };

  const handleBookingSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBookingSuccess(true);
    // In a production deployment this would invoke an API or CRM webhook.
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="relative overflow-hidden">
        <motion.div
          className="pointer-events-none absolute inset-0 -z-10 opacity-80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.75 }}
          transition={{ duration: 1.2 }}
        >
          <div className="absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-gradient-to-r from-blue-600/40 via-purple-600/40 to-indigo-500/30 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-96 w-96 translate-x-1/2 bg-gradient-to-br from-sky-400/20 via-blue-500/30 to-transparent blur-3xl" />
        </motion.div>

        <motion.header 
          className="sticky top-0 z-40 border-b border-white/10 backdrop-blur-2xl bg-slate-950/60"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        >
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <motion.div 
              className="flex items-center gap-3"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500/30 to-purple-500/20 shadow-glow-sm">
                <SparklesIcon className="h-6 w-6 text-blue-300 animate-pulse-glow" />
              </span>
              <div>
                <p className="text-lg font-semibold">Mediverse</p>
                <p className="text-xs text-slate-400">Clinical AI operating layer</p>
              </div>
            </motion.div>
            <nav className="hidden items-center gap-6 text-sm font-medium text-slate-200 md:flex">
              <button onClick={() => scrollToSection("features")} className="transition-smooth hover:text-white hover:scale-105">
                Capabilities
              </button>
              <button onClick={() => scrollToSection("workflow")} className="transition-smooth hover:text-white hover:scale-105">
                Workflow
              </button>
              <button onClick={() => scrollToSection("demo")} className="transition-smooth hover:text-white hover:scale-105">
                Live demo
              </button>
              <button onClick={() => scrollToSection("faq")} className="transition-smooth hover:text-white hover:scale-105">
                FAQ
              </button>
            </nav>
            <div className="flex items-center gap-3">
              <button onClick={() => scrollToSection("contact")} className="secondary hidden sm:inline-flex">
                Talk to sales
              </button>
              <button onClick={openModal} className="primary inline-flex items-center gap-2 group">
                Book discovery call
                <ArrowRightIcon className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </motion.header>

        <main>
          <section id="hero" className="section pt-20">
            <div className="mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-2 lg:items-center lg:gap-16">
              <div className="space-y-8">
                <motion.div
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-widest text-blue-200 shadow-glow-sm"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(59, 130, 246, 0.4)" }}
                >
                  <SparklesIcon className="h-4 w-4 text-blue-300 animate-shimmer" />
                  Introducing Mediverse v1.0
                </motion.div>

                <motion.h1
                  className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.1 }}
                  style={{
                    background: "linear-gradient(135deg, #ffffff 0%, #e0e7ff 40%, #c7d2fe 100%)",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    WebkitTextFillColor: "transparent"
                  }}
                >
                  Clinical intelligence that keeps your care teams ahead of every patient question.
                </motion.h1>

                <motion.p
                  className="text-lg text-slate-300 leading-relaxed"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                >
                  Mediverse orchestrates multiple large language models, structured medical search, and policy guardrails to deliver instant, responsible answers across your organization.
                </motion.p>

                <motion.div
                  className="flex flex-wrap items-center gap-3"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.3 }}
                >
                  <button onClick={() => scrollToSection("demo")} className="primary flex items-center gap-2 group">
                    Explore live demo
                    <PlayCircleIcon className="h-5 w-5 transition-transform group-hover:scale-110" />
                  </button>
                  <button onClick={() => scrollToSection("features")} className="secondary flex items-center gap-2 group">
                    Discover capabilities
                    <ArrowDownIcon className="h-5 w-5 transition-transform group-hover:translate-y-1" />
                  </button>
                </motion.div>

                <motion.div
                  className="grid grid-cols-1 gap-4 sm:grid-cols-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.4 }}
                >
                  {metrics.map((item, idx) => (
                    <motion.div 
                      key={item.label} 
                      className="card p-5 group hover:shadow-glow-md"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.5 + idx * 0.1 }}
                      whileHover={{ y: -4, transition: { duration: 0.2 } }}
                    >
                      <p className="text-3xl font-semibold bg-gradient-to-r from-blue-200 to-purple-200 bg-clip-text text-transparent">
                        {item.value}
                      </p>
                      <p className="mt-1 text-xs uppercase tracking-widest text-blue-300/70">{item.label}</p>
                      <p className="mt-2 text-sm text-slate-300/80">{item.helper}</p>
                    </motion.div>
                  ))}
                </motion.div>
              </div>

              <motion.div
                className="relative"
                initial={{ opacity: 0, scale: 0.95, x: 50 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="card relative overflow-hidden shadow-glow-lg">
                  <Image
                    src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80"
                    alt="Clinician collaborating with Mediverse"
                    width={1200}
                    height={900}
                    className="h-full w-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/60 to-transparent" />
                  <motion.div 
                    className="absolute bottom-0 left-0 right-0 p-6 text-sm"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                  >
                    <p className="font-semibold text-white">Built with clinicians, for clinicians</p>
                    <p className="mt-2 text-slate-300/80">
                      Mediverse aggregates guideline updates, medication safety notices, and your proprietary knowledge base into a single trusted assistant.
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </section>

          <section id="features" className="section border-y border-white/10 bg-slate-950/40 backdrop-blur-sm">
            <div className="mx-auto max-w-6xl px-6">
              <motion.div 
                className="max-w-2xl"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="section-heading">Everything your care teams need in one operating layer.</h2>
                <p className="section-subtitle">
                  Modular agents, configurable guardrails, and battle-tested integrations accelerate safe deployment across clinical and operational teams.
                </p>
              </motion.div>

              <div className="mt-12 grid gap-6 md:grid-cols-3">
                {features.map((feature, idx) => (
                  <motion.div
                    key={feature.title}
                    className="card p-6 group hover:shadow-glow-lg"
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    whileHover={{ y: -6, transition: { duration: 0.3 } }}
                  >
                    <motion.div
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.6, ease: "easeInOut" }}
                    >
                      <feature.icon className="h-10 w-10 text-blue-300" />
                    </motion.div>
                    <h3 className="mt-6 text-xl font-semibold text-white">{feature.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-slate-300/80">{feature.description}</p>
                    <button
                      className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-blue-200 transition-all hover:text-blue-100 hover:gap-3 group/link"
                      onClick={() => scrollToSection("demo")}
                    >
                      See it live
                      <ArrowRightIcon className="h-4 w-4 transition-transform group-hover/link:translate-x-1" />
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          <section id="workflow" className="section">
            <div className="mx-auto max-w-6xl px-6">
              <motion.div 
                className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div>
                  <h2 className="section-heading">Deploy in days, not months.</h2>
                  <p className="section-subtitle">
                    Mediverse provides a battle-tested workflow from secure ingestion to decision support. Follow the path or remix it for your stack.
                  </p>
                </div>
                <button onClick={openModal} className="secondary self-start">
                  Request onboarding guide
                </button>
              </motion.div>

              <div className="grid gap-6 md:grid-cols-3">
                {workflow.map((step, index) => (
                  <motion.div
                    key={step.title}
                    className="card relative p-6 overflow-hidden group hover:shadow-glow-md"
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.5, delay: index * 0.15 }}
                    whileHover={{ y: -4 }}
                  >
                    {/* Animated scan line effect */}
                    <motion.div 
                      className="absolute inset-0 h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent"
                      initial={{ top: "-100%" }}
                      animate={{ top: "200%" }}
                      transition={{ 
                        duration: 3, 
                        repeat: Infinity, 
                        repeatDelay: 2,
                        delay: index * 0.5 
                      }}
                    />
                    <div className="gradient-border absolute -top-6 left-6">
                      <span className="px-4 py-1 text-sm font-semibold text-blue-200">Step {index + 1}</span>
                    </div>
                    <h3 className="mt-6 text-xl font-semibold text-white">{step.title}</h3>
                    <p className="mt-4 text-sm leading-relaxed text-slate-300/80">{step.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          <section className="section border-t border-white/10 bg-slate-950/60" id="demo">
            <div className="mx-auto grid max-w-6xl gap-10 px-6 lg:grid-cols-[1.1fr_0.9fr]">
              <div>
                <h2 className="section-heading">Live demo: orchestrate Gemini and OpenRouter instantly.</h2>
                <p className="section-subtitle">
                  Toggle providers without redeploying. Mediverse handles orchestration, caching, and clinical safety validations for you.
                </p>

                <div className="mt-8 space-y-4 text-sm text-slate-300/80">
                  <p className="flex items-center gap-3">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/10">
                      <SparklesIcon className="h-5 w-5 text-blue-300" />
                    </span>
                    Provider-agnostic orchestration with automatic fallback.
                  </p>
                  <p className="flex items-center gap-3">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-purple-500/10">
                      <ShieldCheckIcon className="h-5 w-5 text-purple-300" />
                    </span>
                    Real-time medication checks, contraindication flags, and disclaimers.
                  </p>
                  <p className="flex items-center gap-3">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-sky-500/10">
                      <CheckBadgeIcon className="h-5 w-5 text-sky-300" />
                    </span>
                    Redis caching keeps responses snappy across teams.
                  </p>
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-4 text-xs uppercase tracking-widest text-slate-400/80">
                  {partners.map((partner) => (
                    <span key={partner} className="rounded-full border border-white/10 px-4 py-1">
                      {partner}
                    </span>
                  ))}
                </div>
              </div>

              <DemoConsole />
            </div>
          </section>

          <section className="section">
            <div className="mx-auto max-w-5xl px-6 text-center">
              <motion.blockquote
                className="card mx-auto max-w-3xl p-10"
                key={activeTestimonial.author}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <p className="text-xl font-medium text-slate-100">“{activeTestimonial.quote}”</p>
                <footer className="mt-6 text-sm text-slate-400">
                  <span className="font-semibold text-white">{activeTestimonial.author}</span>
                  <span className="mx-2 text-slate-600">•</span>
                  {activeTestimonial.role}
                </footer>
                <div className="mt-8 flex items-center justify-center gap-2">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      aria-label={`Go to testimonial ${index + 1}`}
                      className={`h-3 w-3 rounded-full transition ${
                        index === currentTestimonial ? "bg-blue-400" : "bg-slate-600/70 hover:bg-slate-500"
                      }`}
                      onClick={() => setCurrentTestimonial(index)}
                    />
                  ))}
                </div>
              </motion.blockquote>
            </div>
          </section>

          <section id="faq" className="section border-y border-white/10 bg-slate-950/60">
            <div className="mx-auto max-w-5xl px-6">
              <h2 className="section-heading text-center">Answers to common questions</h2>
              <p className="section-subtitle text-center">
                Still curious? Book a call and we’ll tailor a white-glove deployment plan for your team.
              </p>

              <div className="mt-12 space-y-4">
                {faqs.map((item, index) => (
                  <motion.details
                    key={item.question}
                    className="card overflow-hidden"
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.45, delay: index * 0.05 }}
                  >
                    <summary className="flex cursor-pointer items-center justify-between gap-4 p-6 text-left text-lg font-semibold text-white">
                      {item.question}
                      <ArrowRightIcon className="h-5 w-5 text-blue-200 transition group-open:rotate-90" />
                    </summary>
                    <p className="border-t border-white/5 bg-slate-950/40 p-6 text-sm leading-relaxed text-slate-300/80">
                      {item.answer}
                    </p>
                  </motion.details>
                ))}
              </div>
            </div>
          </section>

          <section id="contact" className="section">
            <div className="mx-auto max-w-5xl rounded-3xl border border-white/10 bg-slate-950/70 px-6 py-10 backdrop-blur-xl sm:px-10">
              <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
                <div className="space-y-6">
                  <h2 className="section-heading">Ready to transform clinical workflows?</h2>
                  <p className="section-subtitle">
                    Share your information and we’ll prepare a personalized playbook, including architecture diagrams, security notes, and rollout milestones.
                  </p>

                  <div className="space-y-4 text-sm text-slate-300/80">
                    <p className="flex items-center gap-3">
                      <SparklesIcon className="h-5 w-5 text-blue-300" />
                      Dedicated deployment engineers for every engagement.
                    </p>
                    <p className="flex items-center gap-3">
                      <ShieldCheckIcon className="h-5 w-5 text-blue-300" />
                      SOC 2 Type II and HIPAA-ready infrastructure.
                    </p>
                    <p className="flex items-center gap-3">
                      <CheckBadgeIcon className="h-5 w-5 text-blue-300" />
                      Integrates with Epic, Cerner, Salesforce Health Cloud, and more.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleBookingSubmit} className="card space-y-5 p-6">
                  <div>
                    <label htmlFor="fullname" className="text-sm font-medium text-slate-100">
                      Full name
                    </label>
                    <input
                      id="fullname"
                      type="text"
                      required
                      value={booking.fullname}
                      onChange={(event) => setBooking((prev) => ({ ...prev, fullname: event.target.value }))}
                      className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/60 p-3 text-sm text-slate-100 outline-none transition focus:border-blue-400"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="text-sm font-medium text-slate-100">
                      Work email
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={booking.email}
                      onChange={(event) => setBooking((prev) => ({ ...prev, email: event.target.value }))}
                      className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/60 p-3 text-sm text-slate-100 outline-none transition focus:border-blue-400"
                    />
                  </div>

                  <div>
                    <label htmlFor="organization" className="text-sm font-medium text-slate-100">
                      Organization
                    </label>
                    <input
                      id="organization"
                      type="text"
                      required
                      value={booking.organization}
                      onChange={(event) => setBooking((prev) => ({ ...prev, organization: event.target.value }))}
                      className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/60 p-3 text-sm text-slate-100 outline-none transition focus:border-blue-400"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="text-sm font-medium text-slate-100">
                      What are you hoping to solve?
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      value={booking.message}
                      onChange={(event) => setBooking((prev) => ({ ...prev, message: event.target.value }))}
                      className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/60 p-3 text-sm text-slate-100 outline-none transition focus:border-blue-400"
                      placeholder="Share current workflows, target launch timelines, and success metrics."
                    />
                  </div>

                  <button type="submit" className="primary flex w-full items-center justify-center gap-2">
                    Submit & schedule intro
                    <ArrowRightIcon className="h-5 w-5" />
                  </button>

                  {bookingSuccess && (
                    <p className="rounded-2xl border border-green-500/20 bg-green-500/10 p-3 text-sm text-green-200">
                      Thanks! A Mediverse specialist will reach out within one business day.
                    </p>
                  )}
                </form>
              </div>
            </div>
          </section>
        </main>

        <footer className="border-t border-white/10 bg-slate-950/80 py-10">
          <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-6 md:flex-row md:items-center">
            <div>
              <p className="text-lg font-semibold text-white">Mediverse</p>
              <p className="mt-2 text-sm text-slate-400/80">Made for global health innovators.</p>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400/70">
              <Link href="#features" className="transition hover:text-white">
                Capabilities
              </Link>
              <Link href="#workflow" className="transition hover:text-white">
                Deployment
              </Link>
              <Link href="#demo" className="transition hover:text-white">
                Live demo
              </Link>
              <Link href="#contact" className="transition hover:text-white">
                Contact
              </Link>
            </div>
            <p className="text-xs text-slate-500">© {new Date().getFullYear()} Mediverse. All rights reserved.</p>
          </div>
        </footer>
      </div>

      <Transition.Root show={isModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={setIsModalOpen}>
          <Transition.Child
            as={Fragment}
            enter="duration-200 ease-out"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="duration-150 ease-in"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center px-4 pb-12 pt-8 text-center sm:items-center sm:pt-16">
              <Transition.Child
                as={Fragment}
                enter="duration-200 ease-out"
                enterFrom="opacity-0 translate-y-6 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="duration-150 ease-in"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-6 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="card w-full max-w-lg space-y-5 p-8 text-left">
                  <Dialog.Title className="text-2xl font-semibold text-white">Book a discovery session</Dialog.Title>
                  <p className="text-sm text-slate-300/80">
                    Choose a 30-minute slot with our clinical AI architects. We’ll cover integration paths, security review, and success milestones tailored to your organization.
                  </p>
                  <div className="space-y-4 text-sm text-slate-100">
                    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-900/60 p-4">
                      <div>
                        <p className="font-semibold">Architecture deep dive</p>
                        <p className="text-xs text-slate-400">Gemini, OpenRouter, and custom model orchestration</p>
                      </div>
                      <Link href="#contact" className="primary">
                        Reserve
                      </Link>
                    </div>
                    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-900/60 p-4">
                      <div>
                        <p className="font-semibold">Security workshop</p>
                        <p className="text-xs text-slate-400">SOC 2, HIPAA, and data residency walkthrough</p>
                      </div>
                      <Link href="#contact" className="secondary">
                        Request brief
                      </Link>
                    </div>
                    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-900/60 p-4">
                      <div>
                        <p className="font-semibold">Pilot activation</p>
                        <p className="text-xs text-slate-400">Configure triage flows & clinician onboarding</p>
                      </div>
                      <Link href="#contact" className="secondary">
                        Start now
                      </Link>
                    </div>
                  </div>
                  <button onClick={() => setIsModalOpen(false)} className="secondary w-full">
                    Close window
                  </button>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
}
