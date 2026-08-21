import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { GitBranch, Mail, Lock, User, Building2, ArrowRight, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import Background3D from "../components/Background3D.jsx";
import PageTransition from "../components/PageTransition.jsx";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [department, setDepartment] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(name, email, password, department);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
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
            Bring your whole team <span className="gradient-text">onto one pipeline.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 }}
            className="text-slate-400 text-sm"
          >
            Create your account and start tracking builds, tests, and deployments in minutes.
          </motion.p>
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
          <h1 className="text-2xl font-display font-semibold text-slate-100 mb-1">Create an account</h1>
          <p className="text-slate-500 text-sm mb-7">Join your team's deployment platform</p>

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
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Full name</label>
              <div className="relative">
                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-field pl-10"
                  placeholder="Jane Doe"
                />
              </div>
            </div>

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
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Department</label>
              <div className="relative">
                <Building2 size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="input-field pl-10"
                  placeholder="Engineering"
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
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-10"
                  placeholder="At least 6 characters"
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
              {loading ? "Creating account..." : "Create account"}
              {!loading && <ArrowRight size={15} />}
            </button>
          </form>

          <p className="text-sm text-slate-500 mt-6 text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-primary-400 font-medium hover:text-primary-300 transition-colors">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default Register;
