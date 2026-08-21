import React from "react";
import { AlertTriangle } from "lucide-react";
import Modal from "./Modal.jsx";

const ConfirmDialog = ({ open, onClose, onConfirm, title, description, confirmLabel = "Confirm", loading }) => (
  <Modal open={open} onClose={onClose} title={title} maxWidth="max-w-sm">
    <div className="flex items-start gap-3 mb-6">
      <span className="w-9 h-9 rounded-lg bg-signal-rose/10 border border-signal-rose/25 flex items-center justify-center shrink-0">
        <AlertTriangle size={16} className="text-rose-400" />
      </span>
      <p className="text-sm text-slate-400 leading-relaxed">{description}</p>
    </div>
    <div className="flex gap-3 justify-end">
      <button onClick={onClose} className="btn-secondary">
        Cancel
      </button>
      <button onClick={onConfirm} disabled={loading} className="btn-danger">
        {loading ? "Working..." : confirmLabel}
      </button>
    </div>
  </Modal>
);

export default ConfirmDialog;
