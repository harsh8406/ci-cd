import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Boxes, Rocket, CheckCircle2, XCircle, TrendingUp, Activity } from "lucide-react";
import api from "../api/axios.js";
import { useToast } from "../context/ToastContext.jsx";
import CountUp from "../components/CountUp.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import EmptyState from "../components/EmptyState.jsx";
import LoadingScreen from "../components/LoadingScreen.jsx";
import PageTransition from "../components/PageTransition.jsx";
import { StatCardSkeleton } from "../components/Skeletons.jsx";

const StatCard = ({ label, value, icon: Icon, accentClass, delay = 0, suffix = "" }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    whileHover={{ y: -3 }}
    className="glass-panel p-5 group cursor-default"
  >
    <div className="flex items-start justify-between mb-4">
      <p className="text-xs font-medium text-slate-500 uppercase tracking-wider leading-normal">
        {label}
      </p>
      <span className={`w-8 h-8 rounded-lg flex items-center justify-center ${accentClass}`}>
        <Icon size={15} />
      </span>
    </div>
    <p className="text-3xl font-display font-semibold text-slate-100 leading-[1.35] pb-0.5">
      <CountUp value={value} suffix={suffix} />
    </p>
  </motion.div>
);

// Dark-themed hover tooltip for the donut chart: status name in its own
// color (green/red) and the count in white, instead of Recharts' black default.
const ChartTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="px-3 py-2 rounded-lg border border-white/10 bg-[#0d1220] shadow-xl space-y-1">
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-2 text-xs">
          <span className="w-2 h-2 rounded-full shrink-0" style={{ background: entry.payload.color }} />
          <span style={{ color: entry.payload.color }}>{entry.name}</span>
          <span className="ml-auto pl-4 font-semibold text-slate-100">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

const CircularProgress = ({ value }) => {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative w-32 h-32 shrink-0">
      <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={radius} stroke="rgba(255,255,255,0.06)" strokeWidth="10" fill="none" />
        <motion.circle
          cx="60"
          cy="60"
          r={radius}
          stroke="url(#successGradient)"
          strokeWidth="10"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        />
        <defs>
          <linearGradient id="successGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#35cba1" />
            <stop offset="100%" stopColor="#5b7cfa" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-display font-semibold text-slate-100">
          <CountUp value={value} suffix="%" />
        </span>
        <span className="text-[10px] text-slate-500 uppercase tracking-wide">Success rate</span>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get("/deployments/stats/dashboard");
        setStats(response.data);
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to load dashboard stats");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="skeleton h-8 w-64 mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <StatCardSkeleton key={i} />
          ))}
        </div>
        <LoadingScreen label="Crunching deployment stats..." />
      </div>
    );
  }

  if (!stats) return null;

  const pieData = [
    { name: "Successful", value: stats.successfulDeployments, color: "#35cba1" },
    { name: "Failed", value: stats.failedDeployments, color: "#fb5a72" },
  ];
  const hasPieData = stats.successfulDeployments + stats.failedDeployments > 0;

  return (
    <PageTransition className="max-w-7xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-display font-semibold text-slate-100">Deployment Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">A live view of every pipeline your team runs.</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-300 text-xs font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-pulse" />
          Live
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Applications"
          value={stats.totalApplications}
          icon={Boxes}
          accentClass="bg-accent-500/10 text-accent-400"
          delay={0}
        />
        <StatCard
          label="Total Deployments"
          value={stats.totalDeployments}
          icon={Rocket}
          accentClass="bg-white/[0.05] text-slate-300"
          delay={0.05}
        />
        <StatCard
          label="Successful"
          value={stats.successfulDeployments}
          icon={CheckCircle2}
          accentClass="bg-primary-500/10 text-primary-400"
          delay={0.1}
        />
        <StatCard
          label="Failed"
          value={stats.failedDeployments}
          icon={XCircle}
          accentClass="bg-signal-rose/10 text-rose-400"
          delay={0.15}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-panel p-6 flex items-center gap-6 lg:col-span-1"
        >
          <CircularProgress value={stats.successRate} />
          <div>
            <p className="text-sm text-slate-300 font-medium mb-1">Pipeline reliability</p>
            <p className="text-xs text-slate-500 leading-relaxed">
              {stats.successRate}% of {stats.totalDeployments} deployment{stats.totalDeployments === 1 ? "" : "s"} finished
              without a rollback-worthy failure.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="glass-panel p-6 lg:col-span-2 flex items-center gap-6"
        >
          <div className="w-36 h-36 shrink-0">
            {hasPieData ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    innerRadius={38}
                    outerRadius={62}
                    paddingAngle={4}
                    stroke="none"
                    animationDuration={900}
                  >
                    {pieData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<ChartTooltip />} cursor={false} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-600 text-xs">
                No data yet
              </div>
            )}
          </div>
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp size={14} className="text-primary-400" />
              <p className="text-slate-300 font-medium">Deployment outcomes</p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-primary-400" />
              <span className="text-slate-400">Successful</span>
              <span className="ml-auto text-slate-200 font-medium">{stats.successfulDeployments}</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-signal-rose" />
              <span className="text-slate-400">Failed</span>
              <span className="ml-auto text-slate-200 font-medium">{stats.failedDeployments}</span>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-panel overflow-hidden"
      >
        <div className="px-5 py-4 border-b border-white/[0.06] flex items-center gap-2">
          <Activity size={15} className="text-primary-400" />
          <h2 className="font-semibold text-slate-200 text-sm">Recent Deployment History</h2>
        </div>

        {stats.recentDeployments.length === 0 ? (
          <EmptyState
            icon={Rocket}
            title="No deployments yet"
            description="Trigger your first deployment from the Applications page to see activity here."
          />
        ) : (
          <div className="divide-y divide-white/[0.04]">
            {stats.recentDeployments.map((d, i) => (
              <motion.div
                key={d._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 + i * 0.04 }}
                className="flex items-center gap-4 px-5 py-3.5 hover:bg-white/[0.02] transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-200 truncate">{d.application?.name || "Unknown"}</p>
                  <p className="text-xs text-slate-500 capitalize">{d.application?.environment || "-"}</p>
                </div>
                <StatusBadge status={d.status} size="sm" />
                <span className="text-xs text-slate-500 hidden sm:block w-40 text-right">
                  {new Date(d.createdAt).toLocaleString()}
                </span>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </PageTransition>
  );
};

export default Dashboard;
