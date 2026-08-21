import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { GitBranch, Mail, Lock, ArrowRight, AlertCircle, Rocket, ShieldCheck, GaugeCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import Background3D from "../components/Background3D.jsx";
import PageTransition from "../components/PageTransition.jsx";

const PERKS = [
  { icon: Rocket, text: "Trigger builds, tests, and deploys in one click" },
  { icon: GaugeCircle, text: "Live pipeline status across every environment" },
  { icon: ShieldCheck, text: "Full audit trail of every deployment run" },
];

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition className="min-h-[calc(100vh-64px)] grid lg:grid-cols-2">
      <div className="relative hidden lg:flex flex-col justify-between overflow-hidden border-r border-white/[0.06] px-12 py-14">
        <Background3D className="absolute inset-0 -z-0" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink-950/20 via-transparent to-ink-950 pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 flex items-center gap-2.5"
        >
          <span className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center shadow-glow">
            <GitBranch size={17} className="text-ink-950" strokeWidth={2.5} />
          </span>
          <span className="font-display font-semibold text-slate-100 text-lg">Enterprise CI/CD</span>
        </motion.div>

        <div className="relative z-10 max-w-md">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl font-display font-semibold text-slate-50 leading-tight mb-4"
          >
            Ship with confidence, <span className="gradient-text">every commit.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 }}
            className="text-slate-400 text-sm mb-8"
          >
            One dashboard to build, test, and deploy every application your team owns.
          </motion.p>

          <div className="space-y-3">
            {PERKS.map((perk, i) => (
              <motion.div
                key={perk.text}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.26 + i * 0.08 }}
                className="flex items-center gap-3 text-sm text-slate-300"
              >
                <span className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/10 flex items-center justify-center shrink-0">
                  <perk.icon size={15} className="text-primary-400" />
                </span>
                {perk.text}
              </motion.div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-xs text-slate-600">© {new Date().getFullYear()} Enterprise CI/CD Platform</div>
      </div>

      <div className="flex items-center justify-center px-6 py-14">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-sm glass-panel p-8"
        >
          <h1 className="text-2xl font-display font-semibold text-slate-100 mb-1">Welcome back</h1>
          <p className="text-slate-500 text-sm mb-7">Sign in to manage your deployments</p>

          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mb-4 flex items-start gap-2 p-3 bg-signal-rose/10 text-rose-300 text-sm rounded-lg border border-signal-rose/25"
            >
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Email</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field pl-10"
                  placeholder="you@company.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-10"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
              {loading ? "Signing in..." : "Sign in"}
              {!loading && <ArrowRight size={15} />}
            </button>
          </form>

          <p className="text-sm text-slate-500 mt-6 text-center">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary-400 font-medium hover:text-primary-300 transition-colors">
              Register
            </Link>
          </p>
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default Login;
