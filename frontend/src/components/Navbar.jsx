import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { GitBranch, LayoutDashboard, Boxes, LogOut, User } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

const NAV_LINKS = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/applications", label: "Applications", icon: Boxes },
];

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-ink-950/80 backdrop-blur-xl border-b border-white/[0.06]" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center shadow-glow">
            <GitBranch size={16} className="text-ink-950" strokeWidth={2.5} />
          </span>
          <span className="font-display font-semibold text-slate-100 tracking-tight text-[15px]">
            Enterprise <span className="gradient-text">CI/CD</span>
          </span>
        </Link>

        {user && (
          <div className="flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const active = location.pathname.startsWith(link.to);
              const Icon = link.icon;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className="relative px-3.5 py-2 text-sm font-medium flex items-center gap-2 rounded-lg transition-colors"
                >
                  <span className={`flex items-center gap-2 relative z-10 ${active ? "text-slate-100" : "text-slate-400 hover:text-slate-200"}`}>
                    <Icon size={15} />
                    {link.label}
                  </span>
                  {active && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 bg-white/[0.06] border border-white/[0.08] rounded-lg"
                      transition={{ type: "spring", stiffness: 500, damping: 35 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>
        )}

        {user && (
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 pl-3 pr-1 py-1 rounded-full bg-white/[0.03] border border-white/[0.06]">
              <span className="w-6 h-6 rounded-full bg-gradient-to-br from-accent-400 to-primary-400 flex items-center justify-center">
                <User size={12} className="text-ink-950" />
              </span>
              <span className="text-xs text-slate-300 font-medium pr-2">{user.name}</span>
            </div>
            <button
              onClick={handleLogout}
              className="text-slate-400 hover:text-rose-300 transition-colors p-2 rounded-lg hover:bg-white/[0.04]"
              title="Log out"
            >
              <LogOut size={16} />
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
