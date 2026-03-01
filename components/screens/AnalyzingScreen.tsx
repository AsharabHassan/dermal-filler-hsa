"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { useApp } from "@/lib/store";

export default function AnalyzingScreen() {
  const { state, dispatch } = useApp();

  useEffect(() => {
    if (!state.imageDataUrl) {
      dispatch({ type: "SET_SCREEN", screen: "capture" });
      return;
    }

    async function analyze() {
      try {
        const res = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageDataUrl: state.imageDataUrl }),
        });
        const data = await res.json();
        if (data.result) {
          dispatch({ type: "SET_ANALYSIS", result: data.result });
          dispatch({ type: "SET_SCREEN", screen: "gate" });
        } else {
          alert("Analysis failed. Please try again.");
          dispatch({ type: "SET_SCREEN", screen: "capture" });
        }
      } catch {
        alert("Analysis failed. Please try again.");
        dispatch({ type: "SET_SCREEN", screen: "capture" });
      }
    }

    analyze();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="screen items-center justify-center text-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center gap-8"
      >
        {/* Pulsing gold ring */}
        <div className="relative w-24 h-24">
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-gold"
            animate={{ scale: [1, 1.3, 1], opacity: [1, 0, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.div
            className="absolute inset-3 rounded-full border-2 border-gold/50"
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-gold text-2xl font-serif">HSW</span>
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="font-serif text-2xl text-white">Analyzing Your Facial Structure</h2>
          <p className="text-sm text-white/50">
            Our AI is assessing 6 facial zones...
          </p>
        </div>

        {/* Zone progress indicators */}
        <div className="flex gap-2">
          {["Forehead", "Temples", "Eyes", "Cheeks", "Lips", "Jaw"].map(
            (zone, i) => (
              <motion.div
                key={zone}
                className="w-1.5 h-1.5 rounded-full bg-gold"
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
              />
            )
          )}
        </div>
      </motion.div>
    </div>
  );
}
