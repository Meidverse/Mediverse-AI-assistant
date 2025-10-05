"use client";

import {
    BoltIcon,
    ChevronRightIcon,
    CloudArrowDownIcon,
    SparklesIcon,
} from "@heroicons/react/24/outline";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

const DEFAULT_QUERY = "Summarize the latest hypertension management guidelines";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

type DemoState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; payload: string; confidence: number }
  | { status: "error"; message: string };

export function DemoConsole() {
  const [prompt, setPrompt] = useState(DEFAULT_QUERY);
  const [state, setState] = useState<DemoState>({ status: "idle" });
  const [displayedText, setDisplayedText] = useState("");

  const helperCopy = useMemo(() => {
    if (state.status === "loading") {
      return "Consulting Mediverse clinical intelligence";
    }

    if (state.status === "success") {
      return "Mediverse found evidence-based guidance";
    }

    if (state.status === "error") {
      return state.message;
    }

    return "Ask Mediverse anything about clinical workflows";
  }, [state]);

  // Typing animation effect for success responses
  useEffect(() => {
    if (state.status === "success") {
      const fullText = state.payload;
      let currentIndex = 0;
      setDisplayedText("");

      const interval = setInterval(() => {
        if (currentIndex < fullText.length) {
          setDisplayedText(fullText.substring(0, currentIndex + 1));
          currentIndex++;
        } else {
          clearInterval(interval);
        }
      }, 15); // Typing speed

      return () => clearInterval(interval);
    }
  }, [state]);

  const handleDemo = async () => {
    if (!prompt.trim()) {
      setState({ status: "error", message: "Enter a clinical question to continue." });
      return;
    }

    setState({ status: "loading" });

    try {
      const response = await fetch(`${API_BASE}/api/v1/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: prompt,
          include_sources: true,
          language: "en",
        }),
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const data = await response.json();
      setState({
        status: "success",
        payload: data.response ?? "No response received.",
        confidence: data.confidence_score ?? 0,
      });
    } catch (error) {
      setState({
        status: "error",
        message:
          error instanceof Error ? error.message : "Something went wrong while contacting Mediverse.",
      });
    }
  };

  return (
    <motion.div 
      className="card border border-white/10 bg-slate-900/40 p-6 sm:p-8 group hover:shadow-glow-lg"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-widest text-blue-300/80 flex items-center gap-2">
            <SparklesIcon className="h-4 w-4 animate-pulse-glow" />
            Live sandbox
          </p>
          <h3 className="mt-2 text-2xl font-semibold text-white">See Mediverse in action</h3>
        </div>
        <motion.div
          whileHover={{ rotate: 180, scale: 1.1 }}
          transition={{ duration: 0.3 }}
        >
          <BoltIcon className="h-8 w-8 text-blue-400" />
        </motion.div>
      </div>

      <motion.p 
        className="mt-4 text-sm text-slate-300/80"
        key={helperCopy}
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {helperCopy}
      </motion.p>

      <div className="mt-6 space-y-4">
        <label className="block text-sm font-medium text-slate-100" htmlFor="demo-prompt">
          Clinical question
        </label>
        <textarea
          id="demo-prompt"
          className="w-full rounded-2xl border border-white/10 bg-slate-950/60 p-4 text-sm text-slate-100 shadow-inner outline-none transition-all duration-300 focus:border-blue-400 focus:shadow-glow-sm focus:ring-2 focus:ring-blue-500/40"
          rows={4}
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          placeholder="Ask about dosing strategies, care pathways, or triage protocols..."
        />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleDemo}
          className="primary flex items-center gap-2 group/btn"
          disabled={state.status === "loading"}
        >
          <span>{state.status === "loading" ? "Consulting" : "Generate Response"}</span>
          <ChevronRightIcon className="h-5 w-5 transition-transform group-hover/btn:translate-x-1" />
        </button>
        <button
          type="button"
          onClick={() => {
            setPrompt(DEFAULT_QUERY);
            setState({ status: "idle" });
          }}
          className="secondary flex items-center gap-2"
        >
          <CloudArrowDownIcon className="h-5 w-5" />
          <span>Reset example</span>
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={state.status}
          className="mt-6 rounded-2xl border border-white/10 bg-slate-950/70 p-5 text-left shadow-lg"
          initial={{ opacity: 0, y: 12, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -12, scale: 0.98 }}
          transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
        >
          {state.status === "idle" && (
            <motion.p 
              className="text-sm text-slate-300/70"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Mediverse responds with structured clinical recommendations, citations, and clear disclaimers.
            </motion.p>
          )}

          {state.status === "loading" && (
            <motion.div 
              className="flex items-center gap-3 text-sm text-blue-100/80"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.span 
                className="h-3 w-3 rounded-full border-2 border-blue-200 border-t-transparent"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <motion.span
                initial={{ opacity: 0.6 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
              >
                Gathering evidence from trusted medical sources...
              </motion.span>
            </motion.div>
          )}

          {state.status === "success" && (
            <motion.div 
              className="space-y-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <p className="text-sm leading-relaxed text-slate-100">
                {displayedText}
                {displayedText.length < state.payload.length && (
                  <motion.span
                    className="inline-block w-1 h-4 ml-0.5 bg-blue-400"
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                  />
                )}
              </p>
              <motion.p 
                className="text-xs text-slate-400"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                Confidence score:{" "}
                <motion.span 
                  className="font-semibold text-blue-300"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
                >
                  {(state.confidence * 100).toFixed(1)}%
                </motion.span>
              </motion.p>
              <motion.p 
                className="text-xs text-yellow-300/80 flex items-start gap-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <span className="text-sm">⚠️</span>
                <span>
                  Disclaimer: Mediverse assists clinicians and is not a substitute for licensed medical professionals.
                </span>
              </motion.p>
            </motion.div>
          )}

          {state.status === "error" && (
            <motion.p 
              className="text-sm text-red-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              Unable to complete the demo right now. {state.message} Try again when the API is reachable.
            </motion.p>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
