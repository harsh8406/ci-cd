import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

const Modal = ({ open, onClose, title, children, maxWidth = "max-w-lg" }) => (
  <AnimatePresence>
    {open && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[90] flex items-center justify-center px-4"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-ink-950/70 backdrop-blur-sm"
        />
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.97 }}
          transition={{ type: "spring", stiffness: 380, damping: 32 }}
          className={`relative w-full ${maxWidth} glass-panel p-6 max-h-[85vh] overflow-y-auto`}
        >
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-display font-semibold text-slate-100">{title}</h3>
            <button
              onClick={onClose}
              className="text-slate-500 hover:text-slate-300 p-1.5 rounded-lg hover:bg-white/[0.06] transition-colors"
            >
              <X size={17} />
            </button>
          </div>
          {children}
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default Modal;
