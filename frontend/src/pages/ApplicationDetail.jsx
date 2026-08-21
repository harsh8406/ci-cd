import React, { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Rocket, ChevronDown, Terminal, Github, Layers, Clock, History } from "lucide-react";
import api from "../api/axios.js";
import { useToast } from "../context/ToastContext.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import PipelineStages from "../components/PipelineStages.jsx";
import EmptyState from "../components/EmptyState.jsx";
import LoadingScreen from "../components/LoadingScreen.jsx";
import PageTransition from "../components/PageTransition.jsx";

const DeploymentRow = ({ deployment, defaultOpen, onRollback, rollingBack }) => {
  const [open, setOpen] = useState(defaultOpen);
  const isActive = deployment.status === "in_progress";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel overflow-hidden"
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-white/[0.02] transition-colors"
      >
        <StatusBadge status={deployment.status} />
        <span className="badge border-white/10 bg-white/[0.03] text-slate-400 shrink-0">
          v{deployment.version}
        </span>
        {deployment.triggerType === "rollback" && (
          <span className="badge border-signal-amber/20 bg-signal-amber/10 text-signal-amber shrink-0">
            <History size={11} />
            rollback
          </span>
        )}
        <div className="hidden md:block">
          <PipelineStages stages={deployment.stages} />
        </div>
        <span className="ml-auto flex items-center gap-1.5 text-xs text-slate-500 shrink-0">
          <Clock size={12} />
          {new Date(deployment.createdAt).toLocaleString()}
        </span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={16} className="text-slate-500" />
        </motion.span>
      </button>

      <div className="md:hidden px-5 pb-4">
        <PipelineStages stages={deployment.stages} />
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-white/[0.06]"
          >
            <div className="px-5 py-4">
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Terminal size={12} />
                  Pipeline logs
                </div>
                {deployment.status === "success" && (
                  <button
                    onClick={() => onRollback(deployment)}
                    disabled={rollingBack}
                    className="btn-secondary !py-1.5 text-xs flex items-center gap-1.5"
                    title={`Redeploy v${deployment.version}`}
                  >
                    <History size={12} />
                    {rollingBack ? "Rolling back..." : `Rollback to v${deployment.version}`}
                  </button>
                )}
              </div>
              <div className="terminal p-4 max-h-56 overflow-y-auto space-y-1">
                {deployment.logs.map((log, idx) => (
                  <div key={idx}>
                    <span className="text-slate-600">[{new Date(log.timestamp).toLocaleTimeString()}]</span>{" "}
                    <span
                      className={
                        /fail|error|crash/i.test(log.message)
                          ? "text-rose-300"
                          : /success|complete/i.test(log.message)
                          ? "text-primary-300"
                          : "text-slate-300"
                      }
                    >
                      {log.message}
                    </span>
                  </div>
                ))}
                {isActive && (
                  <div className="text-slate-500 animate-pulse">pipeline running...</div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const ApplicationDetail = () => {
  const { id } = useParams();
  const [application, setApplication] = useState(null);
  const [deployments, setDeployments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [triggering, setTriggering] = useState(false);
  const [rollingBackId, setRollingBackId] = useState(null);
  const pollRef = useRef(null);
  const toast = useToast();

  const fetchData = async ({ silent = false } = {}) => {
    try {
      const [appRes, deployRes] = await Promise.all([
        api.get(`/applications/${id}`),
        api.get(`/deployments/${id}`),
      ]);
      setApplication(appRes.data);
      setDeployments(deployRes.data);
    } catch (err) {
      if (!silent) {
        toast.error(err.response?.data?.message || "Failed to load application details");
      }
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Poll while a pipeline runs so stage progress updates live in the UI
  const stopPolling = () => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  };

  useEffect(() => stopPolling, []);

  const startPolling = () => {
    stopPolling();
    pollRef.current = setInterval(() => fetchData({ silent: true }), 1000);
  };

  const handleTrigger = async () => {
    setTriggering(true);
    startPolling();
    try {
      await api.post(`/deployments/${id}/trigger`);
      toast.success("Pipeline finished running");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to trigger deployment");
    } finally {
      stopPolling();
      setTriggering(false);
      fetchData({ silent: true });
    }
  };

  const handleRollback = async (deployment) => {
    setRollingBackId(deployment._id);
    startPolling();
    try {
      await api.post(`/deployments/${id}/rollback/${deployment._id}`);
      toast.success(`Rolled back to v${deployment.version}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to roll back");
    } finally {
      stopPolling();
      setRollingBackId(null);
      fetchData({ silent: true });
    }
  };

  if (loading) return <LoadingScreen label="Loading application..." />;
  if (!application) return null;

  return (
    <PageTransition className="max-w-5xl mx-auto px-6 py-10">
      <Link
        to="/applications"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-300 transition-colors mb-5"
      >
        <ArrowLeft size={14} />
        Back to Applications
      </Link>

      <div className="glass-panel p-6 mb-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-3 mb-1.5">
              <h1 className="text-2xl font-display font-semibold text-slate-100">{application.name}</h1>
              <StatusBadge status={application.deploymentStatus} />
            </div>
            <p className="text-slate-500 text-sm mb-3">{application.description || "No description"}</p>
            <div className="flex flex-wrap items-center gap-2">
              <span className="badge border-accent-500/20 bg-accent-500/10 text-accent-300">
                <Layers size={11} />
                {application.environment}
              </span>
              <span className="badge border-white/10 bg-white/[0.03] text-slate-400">{application.department}</span>
              {application.repoUrl && (
                <a
                  href={application.repoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="badge border-white/10 bg-white/[0.03] text-slate-400 hover:text-slate-200 transition-colors"
                >
                  <Github size={11} />
                  Repository
                </a>
              )}
            </div>
          </div>

          <button onClick={handleTrigger} disabled={triggering} className="btn-primary shrink-0">
            {triggering ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-ink-950/40 border-t-ink-950 rounded-full animate-spin" />
                Running pipeline...
              </>
            ) : (
              <>
                <Rocket size={15} />
                Trigger New Deployment
              </>
            )}
          </button>
        </div>
      </div>

      <h2 className="font-semibold text-slate-200 text-sm mb-3 flex items-center gap-2">
        Deployment History
        <span className="text-slate-600 font-normal">({deployments.length})</span>
      </h2>

      {deployments.length === 0 ? (
        <EmptyState icon={Rocket} title="No deployments yet" description="Trigger a deployment above to see pipeline runs here." />
      ) : (
        <div className="space-y-3">
          {deployments.map((d, i) => (
            <DeploymentRow
              key={d._id}
              deployment={d}
              defaultOpen={i === 0}
              onRollback={handleRollback}
              rollingBack={rollingBackId !== null}
            />
          ))}
        </div>
      )}
    </PageTransition>
  );
};

export default ApplicationDetail;
