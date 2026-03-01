"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useApp } from "@/lib/store";

export default function LandingScreen() {
  const { dispatch } = useApp();

  return (
    <div className="screen items-center justify-center text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center gap-8"
      >
        {/* Logo */}
        <Image src="/logo.svg" alt="Harley Street Aesthetics" width={120} height={60} priority />

        {/* Divider */}
        <div className="w-16 h-px bg-gold" />

        {/* Headline */}
        <div className="space-y-3">
          <h1 className="font-serif text-3xl font-normal leading-tight text-white">
            Discover Your Personalized<br />Aesthetic Treatment Plan
          </h1>
          <p className="text-sm text-white/60 tracking-wider">
            AI-POWERED FACIAL ANALYSIS IN UNDER 60 SECONDS
          </p>
        </div>

        {/* Feature list */}
        <ul className="text-sm text-white/70 space-y-2 text-left">
          {[
            "Facial structure analysis",
            "Personalized zone recommendations",
            "Complimentary consultation offer",
          ].map((item) => (
            <li key={item} className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>

        {/* CTA */}
        <button
          className="btn-gold w-full mt-4"
          onClick={() => dispatch({ type: "SET_SCREEN", screen: "capture" })}
        >
          Start My Free Analysis
        </button>

        <p className="text-xs text-white/30 mt-2">
          Private &amp; secure — your photo is never stored
        </p>
      </motion.div>
    </div>
  );
}
