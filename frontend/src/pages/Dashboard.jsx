import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaLaptopCode,
  FaArrowRight,
  FaClipboardList,
  FaPlus,
  FaSearch,
  FaCheckCircle,
  FaPlayCircle,
  FaChartPie,
  FaBrain,
  FaLayerGroup,
} from "react-icons/fa";

import API from "../services/api";
import Navbar from "../components/Navbar";
import AuroraBackground from "../components/AuroraBackground";
import GlassCard from "../components/GlassCard";
import GradientButton from "../components/GradientButton";

function Dashboard() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all"); // 'all', 'completed', 'pending'

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    setLoading(true);
    try {
      const res = await API.get("/interviews");
      setInterviews(res.data.interviews || []);
    } catch (error) {
      console.log("Error fetching interviews:", error);
    } finally {
      setLoading(false);
    }
  };

  // Calculations
  const completedCount = interviews.filter((i) => i.submission?.status === "completed").length;
  const pendingCount = interviews.length - completedCount;

  const totalScoreSum = interviews.reduce((acc, curr) => {
    if (curr.submission?.status === "completed" && curr.submission?.evaluation?.overallScore) {
      return acc + curr.submission.evaluation.overallScore;
    }
    return acc;
  }, 0);

  const avgScore = completedCount > 0 ? Math.round(totalScoreSum / completedCount) : 0;

  // Filtered interviews
  const filteredInterviews = interviews.filter((item) => {
    const matchesSearch =
      item.jobRole.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.techStack.some((tech) => tech.toLowerCase().includes(searchQuery.toLowerCase()));

    const status = item.submission?.status || "pending";

    if (selectedStatus === "completed") return matchesSearch && status === "completed";
    if (selectedStatus === "pending") return matchesSearch && status === "pending";
    return matchesSearch;
  });

  return (
    <AuroraBackground>
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Header Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-3">
              <FaBrain className="animate-pulse" />
              Gemini 2.0 Flash Intelligence Active
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
              Candidate Dashboard
            </h1>
            <p className="text-gray-300 mt-2 text-base md:text-lg">
              Manage your AI mock interviews, practice live, and track your evaluation scores.
            </p>
          </div>

          <Link to="/create-interview">
            <button className="flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 text-white font-semibold shadow-[0_0_30px_rgba(0,255,255,0.35)] hover:scale-105 active:scale-95 transition-all duration-300">
              <FaPlus />
              Create AI Interview
            </button>
          </Link>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
          <GlassCard>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm font-medium">Total Interviews</p>
                <h2 className="text-3xl font-extrabold text-white mt-1">{interviews.length}</h2>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                <FaClipboardList size={24} />
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm font-medium">Completed Mock Tests</p>
                <h2 className="text-3xl font-extrabold text-emerald-400 mt-1">{completedCount}</h2>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <FaCheckCircle size={24} />
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm font-medium">Average Performance</p>
                <h2 className="text-3xl font-extrabold text-purple-400 mt-1">
                  {completedCount > 0 ? `${avgScore}%` : "N/A"}
                </h2>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
                <FaChartPie size={24} />
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm font-medium">Pending Practice</p>
                <h2 className="text-3xl font-extrabold text-amber-400 mt-1">{pendingCount}</h2>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <FaPlayCircle size={24} />
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Search and Filters Bar */}
        <div className="mt-12 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400" />
            <input
              type="text"
              placeholder="Search by job role or tech stack..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/5 border border-white/20 text-white placeholder-gray-400 outline-none focus:border-cyan-400 focus:shadow-[0_0_20px_rgba(0,255,255,0.2)] transition"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
            <button
              onClick={() => setSelectedStatus("all")}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                selectedStatus === "all"
                  ? "bg-cyan-500 text-white shadow-[0_0_15px_rgba(0,255,255,0.4)]"
                  : "bg-white/5 text-gray-300 hover:bg-white/10"
              }`}
            >
              All ({interviews.length})
            </button>
            <button
              onClick={() => setSelectedStatus("completed")}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                selectedStatus === "completed"
                  ? "bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                  : "bg-white/5 text-gray-300 hover:bg-white/10"
              }`}
            >
              Completed ({completedCount})
            </button>
            <button
              onClick={() => setSelectedStatus("pending")}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                selectedStatus === "pending"
                  ? "bg-amber-500 text-white shadow-[0_0_15px_rgba(245,158,11,0.4)]"
                  : "bg-white/5 text-gray-300 hover:bg-white/10"
              }`}
            >
              Pending ({pendingCount})
            </button>
          </div>
        </div>

        {/* Interviews Section */}
        <h2 className="text-2xl font-bold text-white mt-8 mb-6 flex items-center gap-3">
          <FaLayerGroup className="text-cyan-400" />
          Your AI Interviews
        </h2>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-64 rounded-3xl bg-white/5 border border-white/10 animate-pulse p-6" />
            ))}
          </div>
        ) : filteredInterviews.length === 0 ? (
          <GlassCard>
            <div className="text-center py-16">
              <FaClipboardList size={60} className="mx-auto text-cyan-400/50 mb-4" />
              <h3 className="text-2xl font-bold text-white">No Interviews Found</h3>
              <p className="text-gray-300 mt-2 max-w-md mx-auto text-sm">
                {searchQuery
                  ? "No mock interviews match your search criteria. Try clearing search or filters."
                  : "Generate your first personalized AI interview to start practicing right now."}
              </p>

              <div className="mt-6 flex justify-center">
                <Link to="/create-interview">
                  <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold hover:scale-105 transition">
                    Create New Interview
                  </button>
                </Link>
              </div>
            </div>
          </GlassCard>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInterviews.map((interview) => {
              const isCompleted = interview.submission?.status === "completed";
              const score = interview.submission?.evaluation?.overallScore;

              return (
                <motion.div
                  key={interview._id}
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <GlassCard>
                    <div className="flex flex-col justify-between h-full">
                      <div>
                        {/* Status & Difficulty Badge */}
                        <div className="flex items-center justify-between mb-4">
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-cyan-300 border border-cyan-500/30">
                            {interview.difficulty || "Mid-Level"}
                          </span>

                          {isCompleted ? (
                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center gap-1.5">
                              <FaCheckCircle size={12} />
                              {score !== undefined ? `${score}% Score` : "Completed"}
                            </span>
                          ) : (
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1.5">
                              <FaPlayCircle size={12} />
                              Ready for Practice
                            </span>
                          )}
                        </div>

                        {/* Role Title */}
                        <h3 className="text-2xl font-bold text-white line-clamp-1 mb-2">
                          {interview.jobRole}
                        </h3>

                        {/* Tech Stack Chips */}
                        <div className="flex flex-wrap gap-1.5 my-3">
                          {interview.techStack.map((tech, idx) => (
                            <span
                              key={idx}
                              className="px-2.5 py-0.5 rounded-md text-xs font-medium bg-cyan-500/10 text-cyan-300 border border-cyan-500/20"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>

                        {/* Info details */}
                        <div className="mt-4 space-y-1.5 text-xs text-gray-300">
                          <p className="flex justify-between">
                            <span className="text-gray-400">Experience:</span>
                            <span className="text-white font-medium">{interview.experience}</span>
                          </p>
                          <p className="flex justify-between">
                            <span className="text-gray-400">Questions:</span>
                            <span className="text-white font-medium">{interview.numberOfQuestions || interview.questions?.length} Questions</span>
                          </p>
                          <p className="flex justify-between">
                            <span className="text-gray-400">Type:</span>
                            <span className="text-white font-medium">{interview.interviewType || "Technical"}</span>
                          </p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between gap-3">
                        <Link
                          to={`/interview/${interview._id}`}
                          className="text-xs font-semibold text-gray-300 hover:text-cyan-300 transition"
                        >
                          View Details
                        </Link>

                        <Link to={`/interview/${interview._id}/start`}>
                          <button
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white transition ${
                              isCompleted
                                ? "bg-white/10 hover:bg-cyan-500/30 border border-cyan-500/30"
                                : "bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 shadow-md shadow-cyan-500/20"
                            }`}
                          >
                            {isCompleted ? "Retake Practice" : "Start Interview"}
                            <FaArrowRight size={10} />
                          </button>
                        </Link>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </AuroraBackground>
  );
}

export default Dashboard;