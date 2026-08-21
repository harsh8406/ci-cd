import React from "react";
import { motion } from "framer-motion";

const EmptyState = ({ icon: Icon, title, description, action }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="glass-panel flex flex-col items-center justify-center text-center py-16 px-6"
  >
    {Icon && (
      <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center mb-4 animate-float">
        <Icon size={26} className="text-primary-400" />
      </div>
    )}
    <h3 className="text-slate-200 font-semibold text-base mb-1">{title}</h3>
    {description && <p className="text-slate-500 text-sm max-w-sm mb-5">{description}</p>}
    {action}
  </motion.div>
);

export default EmptyState;
