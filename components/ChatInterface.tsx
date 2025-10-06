"use client";

import { cn } from "@/lib/utils";
import {
  PaperAirplaneIcon,
  PhotoIcon,
  SparklesIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ImageUpload } from "./ImageUpload";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  image?: string;
  timestamp: Date;
  confidence?: number;
  sources?: Array<{ title: string; url: string; score: number }>;
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

// Custom hook to prevent hydration mismatch for timestamps
function useHydrated() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);
  return hydrated;
}

export function ChatInterface() {
  const hydrated = useHydrated();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hello! I'm Mediverse AI. Choose a mode below and ask me anything or upload medical scans for analysis.",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<{ file: File; preview: string } | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [selectedMode, setSelectedMode] = useState<"quick" | "image" | "deep_search" | "expert">("quick");
  const [showSources, setShowSources] = useState(true); // Toggle for sources display
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleImageUpload = (file: File, preview: string) => {
    setUploadedImage({ file, preview });
    setShowUpload(false);
  };

  const handleRemoveImage = () => {
    setUploadedImage(null);
  };

  const handleSend = async () => {
    if (!input.trim() && !uploadedImage) return;

    // Store input value before clearing
    const queryText = input.trim();

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: queryText,
      image: uploadedImage?.preview,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");  // Clear input field
    setIsLoading(true);

    try {
      // Always use FormData for the /analyze endpoint
      const formData = new FormData();
      formData.append("query", queryText);  // Use stored value
      formData.append("mode", selectedMode);
      
      if (uploadedImage) {
        formData.append("image", uploadedImage.file);
      }

      const response = await fetch(`${API_BASE}/api/v1/analyze`, {
        method: "POST",
        body: formData,
        // Don't set Content-Type header - browser will set it correctly with boundary
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const data = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response ?? "I apologize, but I couldn't analyze that scan. Please try again or consult a healthcare professional.",
        confidence: data.confidence_score,
        sources: data.sources || [],
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setUploadedImage(null);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I'm having trouble connecting to the analysis service. Please ensure the backend is running and try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full max-h-[800px] rounded-3xl border border-white/10 bg-slate-900/40 backdrop-blur-2xl overflow-hidden shadow-glow-xl">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-6 border-b border-white/10 bg-gradient-to-r from-slate-900/60 to-slate-900/40">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500/30 blur-xl rounded-full" />
            <div className="relative p-2 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10">
              <SparklesIcon className="h-6 w-6 text-blue-300 animate-pulse-glow" />
            </div>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Mediverse AI Diagnostics</h2>
            <p className="text-xs text-slate-400">Medical Imaging Analysis Assistant</p>
          </div>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowUpload(!showUpload)}
          className={cn(
            "p-2 rounded-xl border transition-all",
            showUpload
              ? "bg-blue-500/20 border-blue-400/40 text-blue-300"
              : "bg-slate-800/60 border-white/10 text-slate-300 hover:bg-slate-800/80"
          )}
        >
          <PhotoIcon className="h-5 w-5" />
        </motion.button>
      </div>

      {/* Upload Panel */}
      <AnimatePresence>
        {showUpload && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-b border-white/10 bg-slate-950/40 overflow-hidden"
          >
            <div className="p-6">
              <ImageUpload
                onImageUpload={handleImageUpload}
                onRemove={handleRemoveImage}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
        <AnimatePresence initial={false}>
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className={cn(
                "flex gap-3",
                message.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              {message.role === "assistant" && (
                <div className="flex-shrink-0">
                  <div className="p-2 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10">
                    <SparklesIcon className="h-5 w-5 text-blue-300" />
                  </div>
                </div>
              )}

              <div
                className={cn(
                  "max-w-[75%] rounded-2xl px-5 py-3 backdrop-blur-xl",
                  message.role === "user"
                    ? "bg-gradient-to-br from-blue-600/30 to-purple-600/30 border border-blue-400/20 text-white"
                    : "bg-slate-800/40 border border-white/10 text-slate-100"
                )}
              >
                {message.image && (
                  <div className="mb-3 rounded-xl overflow-hidden border border-white/10">
                    <img
                      src={message.image}
                      alt="Uploaded scan"
                      className="w-full h-auto max-h-64 object-contain bg-slate-950/60"
                    />
                  </div>
                )}
                
                {message.role === "assistant" ? (
                  <div className="prose prose-invert prose-sm max-w-none">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        // Custom styles for markdown elements
                        p: ({ children }) => (
                          <p className="text-sm leading-relaxed mb-3 last:mb-0">{children}</p>
                        ),
                        h1: ({ children }) => (
                          <h1 className="text-xl font-bold text-blue-300 mb-3 mt-4 first:mt-0">{children}</h1>
                        ),
                        h2: ({ children }) => (
                          <h2 className="text-lg font-semibold text-blue-300 mb-2 mt-3">{children}</h2>
                        ),
                        h3: ({ children }) => (
                          <h3 className="text-base font-semibold text-blue-400 mb-2 mt-2">{children}</h3>
                        ),
                        ul: ({ children }) => (
                          <ul className="list-disc list-inside space-y-1 mb-3 text-sm">{children}</ul>
                        ),
                        ol: ({ children }) => (
                          <ol className="list-decimal list-inside space-y-1 mb-3 text-sm">{children}</ol>
                        ),
                        li: ({ children }) => (
                          <li className="text-slate-200 ml-2">{children}</li>
                        ),
                        strong: ({ children }) => (
                          <strong className="font-semibold text-blue-200">{children}</strong>
                        ),
                        em: ({ children }) => (
                          <em className="italic text-slate-300">{children}</em>
                        ),
                        code: ({ children, className }) => {
                          const isInline = !className;
                          return isInline ? (
                            <code className="bg-slate-800 px-1.5 py-0.5 rounded text-xs text-blue-300 font-mono">
                              {children}
                            </code>
                          ) : (
                            <code className="block bg-slate-800 p-3 rounded-lg text-xs text-blue-300 font-mono overflow-x-auto my-2">
                              {children}
                            </code>
                          );
                        },
                        blockquote: ({ children }) => (
                          <blockquote className="border-l-4 border-blue-500 pl-4 italic text-slate-300 my-3">
                            {children}
                          </blockquote>
                        ),
                        a: ({ href, children }) => (
                          <a 
                            href={href} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 underline"
                          >
                            {children}
                          </a>
                        ),
                        table: ({ children }) => (
                          <div className="overflow-x-auto my-3">
                            <table className="min-w-full border border-slate-700 text-xs">
                              {children}
                            </table>
                          </div>
                        ),
                        th: ({ children }) => (
                          <th className="border border-slate-700 px-3 py-2 bg-slate-800 font-semibold text-left">
                            {children}
                          </th>
                        ),
                        td: ({ children }) => (
                          <td className="border border-slate-700 px-3 py-2">
                            {children}
                          </td>
                        ),
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </p>
                )}
                
                {message.sources && message.sources.length > 0 && showSources && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <p className="text-xs font-semibold text-blue-300 mb-2">
                      📚 Sources ({message.sources.length}):
                    </p>
                    <div className="space-y-2">
                      {message.sources.map((source, idx) => (
                        <a
                          key={idx}
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block p-2 rounded-lg bg-slate-900/40 border border-white/5 hover:border-blue-400/30 hover:bg-slate-900/60 transition-all group"
                        >
                          <p className="text-xs font-medium text-blue-300 group-hover:text-blue-200 line-clamp-1">
                            {source.title}
                          </p>
                          <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                            {source.url}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex-1 h-1 bg-slate-800 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                                style={{ width: `${source.score * 100}%` }}
                              />
                            </div>
                            <span className="text-xs text-slate-400">
                              {(source.score * 100).toFixed(0)}%
                            </span>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
                
                {message.confidence !== undefined && (
                  <div className="mt-3 pt-3 border-t border-white/10">
                    <p className="text-xs text-slate-400">
                      Confidence:{" "}
                      <span className="font-semibold text-blue-300">
                        {(message.confidence * 100).toFixed(1)}%
                      </span>
                    </p>
                  </div>
                )}
                
                <p className="mt-2 text-xs text-slate-500" suppressHydrationWarning>
                  {hydrated && message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>

              {message.role === "user" && (
                <div className="flex-shrink-0">
                  <div className="p-2 rounded-full bg-slate-700/40 border border-white/10">
                    <UserCircleIcon className="h-5 w-5 text-slate-300" />
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3"
          >
            <div className="flex-shrink-0">
              <div className="p-2 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10">
                <SparklesIcon className="h-5 w-5 text-blue-300 animate-pulse" />
              </div>
            </div>
            <div className="bg-slate-800/40 border border-white/10 rounded-2xl px-5 py-3 backdrop-blur-xl">
              <div className="flex items-center gap-2">
                <motion.div
                  className="h-2 w-2 rounded-full bg-blue-400"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
                />
                <motion.div
                  className="h-2 w-2 rounded-full bg-blue-400"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                />
                <motion.div
                  className="h-2 w-2 rounded-full bg-blue-400"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
                />
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-white/10 bg-slate-950/60">
        {/* Mode Selection */}
        <div className="mb-4 flex flex-wrap gap-2 items-center">
          <button
            onClick={() => setSelectedMode("quick")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all",
              selectedMode === "quick"
                ? "bg-gradient-to-r from-blue-500/30 to-purple-500/30 border-2 border-blue-400/50 text-white shadow-glow-sm"
                : "bg-slate-800/40 border border-white/10 text-slate-300 hover:border-blue-400/30"
            )}
          >
            <SparklesIcon className="h-4 w-4" />
            Quick Consult
          </button>
          
          <button
            onClick={() => {
              setSelectedMode("image");
              setShowUpload(true);
            }}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all",
              selectedMode === "image"
                ? "bg-gradient-to-r from-blue-500/30 to-purple-500/30 border-2 border-blue-400/50 text-white shadow-glow-sm"
                : "bg-slate-800/40 border border-white/10 text-slate-300 hover:border-blue-400/30"
            )}
          >
            <PhotoIcon className="h-4 w-4" />
            Image Analysis
          </button>
          
          <button
            onClick={() => setSelectedMode("deep_search")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all",
              selectedMode === "deep_search"
                ? "bg-gradient-to-r from-blue-500/30 to-purple-500/30 border-2 border-blue-400/50 text-white shadow-glow-sm"
                : "bg-slate-800/40 border border-white/10 text-slate-300 hover:border-blue-400/30"
            )}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Deep Search
          </button>
          
          <button
            onClick={() => setSelectedMode("expert")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all",
              selectedMode === "expert"
                ? "bg-gradient-to-r from-blue-500/30 to-purple-500/30 border-2 border-blue-400/50 text-white shadow-glow-sm"
                : "bg-slate-800/40 border border-white/10 text-slate-300 hover:border-blue-400/30"
            )}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            Expert Mode
          </button>

          {/* Sources Toggle - only show for deep search */}
          {selectedMode === "deep_search" && (
            <div className="ml-auto flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800/40 border border-white/10">
              <span className="text-xs text-slate-400">Show Sources</span>
              <button
                onClick={() => setShowSources(!showSources)}
                className={cn(
                  "relative w-11 h-6 rounded-full transition-all",
                  showSources 
                    ? "bg-gradient-to-r from-blue-500 to-purple-500" 
                    : "bg-slate-700"
                )}
              >
                <motion.div
                  animate={{ x: showSources ? 20 : 2 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-lg"
                />
              </button>
            </div>
          )}
        </div>

        {uploadedImage && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-3 p-3 rounded-xl bg-slate-800/40 border border-white/10 flex items-center gap-3"
          >
            <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border border-white/10">
              <img
                src={uploadedImage.preview}
                alt="Selected scan"
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-sm text-slate-300 flex-1">Image attached</p>
            <button
              onClick={handleRemoveImage}
              className="p-1 rounded-lg hover:bg-red-500/20 transition-colors"
            >
              <svg className="h-5 w-5 text-red-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </motion.div>
        )}

        <div className="flex gap-3">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe symptoms or ask about the scan..."
              rows={1}
              className="w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 pr-12 text-sm text-white placeholder-slate-400 outline-none transition-all resize-none focus:border-blue-400/50 focus:shadow-glow-sm backdrop-blur-xl"
              style={{ minHeight: "48px", maxHeight: "120px" }}
            />
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSend}
            disabled={isLoading || (!input.trim() && !uploadedImage)}
            className="primary p-3 rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed h-12 w-12 flex items-center justify-center"
          >
            <PaperAirplaneIcon className="h-5 w-5" />
          </motion.button>
        </div>

        <p className="mt-3 text-xs text-center text-slate-500">
          ⚠️ For informational purposes only. Always consult healthcare professionals for diagnosis.
        </p>
      </div>
    </div>
  );
}
