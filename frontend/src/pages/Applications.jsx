import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, Rocket, ExternalLink, Trash2, Boxes, Github, Layers } from "lucide-react";
import api from "../api/axios.js";
import { useToast } from "../context/ToastContext.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import EmptyState from "../components/EmptyState.jsx";
import Modal from "../components/Modal.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import PageTransition from "../components/PageTransition.jsx";
import { CardSkeleton } from "../components/Skeletons.jsx";

const ENV_STYLES = {
  development: "text-accent-300 bg-accent-500/10 border-accent-500/20",
  staging: "text-signal-amber bg-signal-amber/10 border-signal-amber/20",
  production: "text-rose-300 bg-signal-rose/10 border-signal-rose/20",
};

const emptyForm = { name: "", description: "", repoUrl: "", environment: "development", slackWebhookUrl: "" };

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [triggeringId, setTriggeringId] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const toast = useToast();

  const fetchApplications = async () => {
    try {
      const response = await api.get("/applications");
      setApplications(response.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/applications", form);
      setForm(emptyForm);
      setShowForm(false);
      toast.success(`"${form.name}" was created`);
      fetchApplications();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create application");
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      await api.delete(`/applications/${pendingDelete._id}`);
      setApplications((prev) => prev.filter((app) => app._id !== pendingDelete._id));
      toast.success(`"${pendingDelete.name}" was deleted`);
      setPendingDelete(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete application");
    } finally {
      setDeleting(false);
    }
  };

  const handleTrigger = async (id, name) => {
    setTriggeringId(id);
    try {
      await api.post(`/deployments/${id}/trigger`);
      toast.success(`Pipeline finished for "${name}"`);
      fetchApplications();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to trigger deployment");
    } finally {
      setTriggeringId(null);
    }
  };

  return (
    <PageTransition className="max-w-7xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-display font-semibold text-slate-100">Applications</h1>
          <p className="text-slate-500 text-sm mt-1">Connect a repository and ship it in one click.</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary">
          <Plus size={16} />
          New Application
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : applications.length === 0 ? (
        <EmptyState
          icon={Boxes}
          title="No applications yet"
          description="Create your first application to connect a repo and start deploying."
          action={
            <button onClick={() => setShowForm(true)} className="btn-primary">
              <Plus size={16} />
              New Application
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {applications.map((app, i) => (
            <motion.div
              key={app._id}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -4 }}
              className="glass-panel p-5 flex flex-col"
            >
              <div className="flex items-start justify-between mb-2">
                <Link
                  to={`/applications/${app._id}`}
                  className="font-semibold text-slate-100 hover:text-primary-300 transition-colors flex items-center gap-1.5 min-w-0"
                >
                  <span className="truncate">{app.name}</span>
                </Link>
                <StatusBadge status={app.deploymentStatus} size="sm" />
              </div>

              <p className="text-sm text-slate-500 mb-4 line-clamp-2 min-h-[2.5rem]">
                {app.description || "No description provided"}
              </p>

              <div className="flex flex-wrap items-center gap-2 mb-5">
                <span className={`badge border ${ENV_STYLES[app.environment] || ENV_STYLES.development}`}>
                  <Layers size={11} />
                  {app.environment}
                </span>
                <span className="badge border-white/10 bg-white/[0.03] text-slate-400">{app.department}</span>
                {app.repoUrl && (
                  <a
                    href={app.repoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="badge border-white/10 bg-white/[0.03] text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    <Github size={11} />
                    Repo
                  </a>
                )}
              </div>

              <div className="flex items-center gap-2 mt-auto">
                <button
                  onClick={() => handleTrigger(app._id, app.name)}
                  disabled={triggeringId === app._id}
                  className="btn-primary flex-1 !py-2 text-sm"
                >
                  {triggeringId === app._id ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-ink-950/40 border-t-ink-950 rounded-full animate-spin" />
                      Running...
                    </>
                  ) : (
                    <>
                      <Rocket size={14} />
                      Deploy
                    </>
                  )}
                </button>
                <Link
                  to={`/applications/${app._id}`}
                  className="btn-secondary !py-2 text-sm px-3"
                  title="View logs"
                >
                  <ExternalLink size={14} />
                </Link>
                <button
                  onClick={() => setPendingDelete(app)}
                  className="btn-danger !py-2 px-3"
                  title="Delete application"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <Modal open={showForm} onClose={() => setShowForm(false)} title="New application">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Application name</label>
            <input
              type="text"
              required
              placeholder="payments-service"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Repository URL</label>
            <input
              type="text"
              placeholder="https://github.com/org/repo"
              value={form.repoUrl}
              onChange={(e) => setForm({ ...form, repoUrl: e.target.value })}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">
              Slack/Teams Webhook URL <span className="text-slate-600">(optional - deployment notifications)</span>
            </label>
            <input
              type="text"
              placeholder="https://hooks.slack.com/services/..."
              value={form.slackWebhookUrl}
              onChange={(e) => setForm({ ...form, slackWebhookUrl: e.target.value })}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Description</label>
            <textarea
              placeholder="What does this service do?"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="input-field resize-none"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Environment</label>
            <select
              value={form.environment}
              onChange={(e) => setForm({ ...form, environment: e.target.value })}
              className="input-field"
            >
              <option value="development">Development</option>
              <option value="staging">Staging</option>
              <option value="production">Production</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="btn-primary">
              {submitting ? "Creating..." : "Create application"}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!pendingDelete}
        onClose={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
        loading={deleting}
        title="Delete application"
        description={`This permanently deletes "${pendingDelete?.name}" and all of its deployment history. This cannot be undone.`}
        confirmLabel="Delete application"
      />
    </PageTransition>
  );
};

export default Applications;
