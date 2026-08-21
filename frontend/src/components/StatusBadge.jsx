import React from "react";
import { CheckCircle2, XCircle, Loader2, CircleDashed } from "lucide-react";

const CONFIG = {
  success: { label: "Success", icon: CheckCircle2, cls: "border-primary-500/30 bg-primary-500/10 text-primary-300" },
  failed: { label: "Failed", icon: XCircle, cls: "border-signal-rose/30 bg-signal-rose/10 text-rose-300" },
  in_progress: {
    label: "In progress",
    icon: Loader2,
    cls: "border-signal-amber/30 bg-signal-amber/10 text-amber-300",
  },
  not_deployed: {
    label: "Not deployed",
    icon: CircleDashed,
    cls: "border-white/10 bg-white/[0.04] text-slate-400",
  },
};

const StatusBadge = ({ status, size = "md" }) => {
  const cfg = CONFIG[status] || CONFIG.not_deployed;
  const Icon = cfg.icon;
  const isSpinning = status === "in_progress";
  const sizeCls = size === "sm" ? "text-[11px] px-2 py-0.5" : "text-xs px-2.5 py-1";

  return (
    <span className={`badge ${cfg.cls} ${sizeCls}`}>
      <Icon size={size === "sm" ? 11 : 13} className={isSpinning ? "animate-spin" : ""} />
      {cfg.label}
    </span>
  );
};

export default StatusBadge;
