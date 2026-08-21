import React from "react";
import { motion } from "framer-motion";

const LoadingScreen = ({ label = "Loading..." }) => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
    <div className="relative w-12 h-12">
      <motion.span
        className="absolute inset-0 rounded-xl border-2 border-primary-500/70"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1.1, ease: "linear" }}
        style={{ borderTopColor: "transparent", borderRightColor: "transparent" }}
      />
      <span className="absolute inset-3 rounded-md bg-primary-500/20 animate-pulse" />
    </div>
    <p className="text-sm text-slate-500 tracking-wide">{label}</p>
  </div>
);

export default LoadingScreen;
