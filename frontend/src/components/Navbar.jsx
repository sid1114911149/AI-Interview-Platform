import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaRobot,
  FaPlusCircle,
  FaThLarge,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaUserCircle,
} from "react-icons/fa";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-[#020617]/80 backdrop-blur-xl border-b border-cyan-500/20 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/dashboard" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 flex items-center justify-center shadow-[0_0_20px_rgba(0,255,255,0.4)] group-hover:scale-105 transition-transform duration-300">
            <FaRobot className="text-white text-xl" />
          </div>
          <div>
            <span className="text-xl font-bold bg-gradient-to-r from-white via-cyan-200 to-cyan-400 bg-clip-text text-transparent">
              AI Interview Lab
            </span>
            <span className="block text-[10px] uppercase tracking-widest text-cyan-400 font-semibold -mt-1">
              Next-Gen Mock Platform
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            to="/dashboard"
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
              isActive("/dashboard")
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_15px_rgba(0,255,255,0.2)]"
                : "text-gray-300 hover:text-white hover:bg-white/5"
            }`}
          >
            <FaThLarge className="text-cyan-400" />
            Dashboard
          </Link>

          <Link
            to="/create-interview"
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
              isActive("/create-interview")
                ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_20px_rgba(0,255,255,0.4)]"
                : "bg-white/10 text-cyan-300 hover:bg-cyan-500/20 border border-cyan-500/30"
            }`}
          >
            <FaPlusCircle />
            New Interview
          </Link>
        </nav>

        {/* User Profile & Logout */}
        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-300 text-sm">
            <FaUserCircle className="text-cyan-400 text-lg" />
            <span>Candidate</span>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-red-400 hover:text-white hover:bg-red-500/20 border border-red-500/30 transition-all duration-300 active:scale-95"
            title="Logout"
          >
            <FaSignOutAlt />
            Logout
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-cyan-300 text-2xl p-2 focus:outline-none"
        >
          {mobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#020617]/95 border-b border-cyan-500/20 px-6 py-4 space-y-3"
          >
            <Link
              to="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 p-3 rounded-xl text-gray-200 bg-white/5 border border-white/10"
            >
              <FaThLarge className="text-cyan-400" />
              Dashboard
            </Link>

            <Link
              to="/create-interview"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 p-3 rounded-xl text-white bg-gradient-to-r from-cyan-500 to-purple-600 font-semibold"
            >
              <FaPlusCircle />
              Create Interview
            </Link>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleLogout();
              }}
              className="w-full flex items-center gap-3 p-3 rounded-xl text-red-400 bg-red-500/10 border border-red-500/30"
            >
              <FaSignOutAlt />
              Logout
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Navbar;