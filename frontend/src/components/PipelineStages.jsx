import React from "react";
import { motion } from "framer-motion";
import { GitCommitHorizontal, Hammer, FlaskConical, Rocket, Check, X } from "lucide-react";

const STAGE_META = {
  commit: { label: "Commit", icon: GitCommitHorizontal },
  build: { label: "Build", icon: Hammer },
  test: { label: "Test", icon: FlaskConical },
  deploy: { label: "Deploy", icon: Rocket },
};

/**
 * Renders the Commit -> Build -> Test -> Deploy chain from the stage results
 * recorded by the backend. All four stages are real backend stages now - no
 * client-side stubs. Stages that never ran because an earlier stage failed
 * are rendered as skipped (dashed/idle with a "skipped" caption).
 */
const PipelineStages = ({ stages = [] }) => {
  const byName = Object.fromEntries(stages.map((s) => [s.stage, s]));
  const order = ["commit", "build", "test", "deploy"];

  let blocked = false;
  const resolved = order.map((key) => {
    const stage = byName[key];
    if (blocked || !stage) return { key, status: "skipped", durationMs: null };
    if (stage.status === "failed") blocked = true;
    return { key, status: stage.status, durationMs: stage.durationMs, message: stage.message };
  });

  return (
    <div className="flex items-center">
      {resolved.map((stage, idx) => {
        const meta = STAGE_META[stage.key];
        const Icon = meta.icon;
        const isSuccess = stage.status === "success";
        const isFailed = stage.status === "failed";
        const isSkipped = stage.status === "skipped";

        return (
          <React.Fragment key={stage.key}>
            <div className="flex flex-col items-center gap-1.5 relative">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: idx * 0.08, type: "spring", stiffness: 300, damping: 20 }}
                className={`relative w-10 h-10 rounded-xl flex items-center justify-center border
                  ${isSuccess ? "bg-primary-500/15 border-primary-500/40 text-primary-300" : ""}
                  ${isFailed ? "bg-signal-rose/15 border-signal-rose/40 text-rose-300" : ""}
                  ${isSkipped ? "bg-white/[0.03] border-dashed border-white/10 text-slate-600" : ""}`}
              >
                <Icon size={17} />
                {isSuccess && (
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-primary-500 flex items-center justify-center">
                    <Check size={10} className="text-ink-950" strokeWidth={3} />
                  </span>
                )}
                {isFailed && (
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-signal-rose flex items-center justify-center">
                    <X size={10} className="text-ink-950" strokeWidth={3} />
                  </span>
                )}
              </motion.div>
              <span
                className={`text-[11px] font-medium ${isSkipped ? "text-slate-600" : "text-slate-400"}`}
              >
                {meta.label}
              </span>
              {isSkipped ? (
                <span className="text-[10px] text-slate-600">skipped</span>
              ) : (
                stage.durationMs != null && (
                  <span className="text-[10px] text-slate-600">{stage.durationMs}ms</span>
                )
              )}
            </div>

            {idx < order.length - 1 && (
              <div className="flex-1 h-px mx-1 min-w-[16px] relative top-[-14px] overflow-hidden">
                <div
                  className={`h-full w-full ${
                    isFailed || isSkipped
                      ? "bg-white/10"
                      : "bg-gradient-to-r from-primary-500/60 to-primary-500/10"
                  }`}
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default PipelineStages;
