"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, Send, Sparkles, X } from "lucide-react";
import { answerConcierge } from "@/lib/concierge";

interface Message {
  id: number;
  role: "bot" | "user";
  text: string;
}

const QUICK_PROMPTS = [
  "Best 7-seater SUV under ₹35 Lakhs?",
  "Check GJ-06 RTO tax & insurance on EVs",
  "What documents are needed for instant car loan?",
  "Book a doorstep test drive this Sunday",
];

interface AIConciergeProps {
  onBook: () => void;
  onCalculate: () => void;
}

const GREETING: Message = {
  id: 0,
  role: "bot",
  text: "Namaste! I'm the Apex AI Auto Advisor. Ask about SUVs, EVs, Gujarat RTO costs, loan documents or booking a test drive.",
};

export function AIConcierge({ onBook, onCalculate }: AIConciergeProps) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([GREETING]);
  const idRef = useRef(1);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  const ask = (question: string) => {
    const text = question.trim();
    if (!text || typing) return;
    const userMsg: Message = { id: idRef.current++, role: "user", text };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setTyping(true);
    const reply = answerConcierge(text);
    window.setTimeout(() => {
      setMessages((m) => [...m, { id: idRef.current++, role: "bot", text: reply.text }]);
      setTyping(false);
      if (reply.action === "book") onBook();
      if (reply.action === "calculator") onCalculate();
    }, 550);
  };

  return (
    <div className="fixed bottom-5 right-5 z-[75] flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            className="flex h-[min(540px,72vh)] w-[min(92vw,380px)] flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#211C17]/90 shadow-[0_25px_60px_rgba(0,0,0,0.7)] backdrop-blur-2xl"
          >
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-[#E10600] to-[#E10600]">
                  <Sparkles className="h-4 w-4 text-[#13100E]" />
                </div>
                <div>
                  <p className="font-display text-xs font-bold uppercase tracking-[0.12em] text-[#F1EBE0]">Apex AI Auto Advisor</p>
                  <p className="flex items-center gap-1.5 font-mono text-[10px] text-[#E10600]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#E10600]" /> Online 24/7
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close advisor"
                className="grid h-8 w-8 place-items-center rounded-full text-[#9E9484] hover:text-[#F1EBE0]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {messages.map((m) => (
                <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[88%] whitespace-pre-line rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                      m.role === "user"
                        ? "rounded-br-sm bg-[#E10600] text-[#13100E]"
                        : "rounded-bl-sm border border-white/10 bg-white/[0.04] text-[#F1EBE0]"
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
              {typing && (
                <div className="flex justify-start">
                  <div className="rounded-2xl rounded-bl-sm border border-white/10 bg-white/[0.04] px-4 py-3">
                    <span className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <span
                          key={i}
                          className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#E10600]"
                          style={{ animationDelay: `${i * 0.15}s` }}
                        />
                      ))}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2 border-t border-white/10 px-4 py-3">
              <div className="flex flex-wrap gap-1.5">
                {QUICK_PROMPTS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => ask(p)}
                    disabled={typing}
                    className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-left text-[10px] font-medium text-[#9E9484] transition hover:border-[#E10600]/50 hover:text-[#F1EBE0] disabled:opacity-40"
                  >
                    {p}
                  </button>
                ))}
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  ask(input);
                }}
                className="flex items-center gap-2"
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about any car, RTO or loan…"
                  aria-label="Message the advisor"
                  className="flex-1 rounded-full border border-white/15 bg-[#13100E] px-4 py-2.5 text-xs text-[#F1EBE0] outline-none placeholder:text-[#9E9484]/60 focus:border-[#E10600]"
                />
                <button
                  type="submit"
                  aria-label="Send"
                  disabled={!input.trim() || typing}
                  className="grid h-10 w-10 place-items-center rounded-full bg-[#E10600] text-[#13100E] transition disabled:opacity-40"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close Apex AI Auto Advisor" : "Open Apex AI Auto Advisor"}
        className="group relative grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-[#E10600] to-[#9E0300] text-[#13100E] shadow-[0_15px_40px_rgba(225,6,0,0.5)] transition hover:scale-105"
      >
        <span className="absolute inset-0 animate-ping rounded-full bg-[#E10600]/30" />
        {open ? <X className="relative h-6 w-6" /> : <MessageCircle className="relative h-6 w-6" />}
      </button>
    </div>
  );
}
