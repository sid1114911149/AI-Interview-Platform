import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  FaBriefcase,
  FaLaptopCode,
  FaCode,
  FaQuestionCircle,
  FaTrash,
  FaPlayCircle,
  FaCheckCircle,
  FaTrophy,
  FaArrowLeft,
  FaLightbulb,
  FaTag,
} from "react-icons/fa";
import { toast } from "sonner";

import api from "../services/api";
import Navbar from "../components/Navbar";
import AuroraBackground from "../components/AuroraBackground";
import GlassCard from "../components/GlassCard";
import ScorecardModal from "../components/ScorecardModal";

function InterviewDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [interview, setInterview] = useState(null);
  const [scorecardOpen, setScorecardOpen] = useState(false);

  useEffect(() => {
    fetchInterview();
  }, [id]);

  const fetchInterview = async () => {
    try {
      const res = await api.get(`/interviews/${id}`);
      setInterview(res.data.interview);
    } catch (error) {
      console.log(error);
      toast.error("Interview not found");
      navigate("/dashboard");
    }
  };

  const deleteInterview = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this interview?");
    if (!confirmDelete) return;

    try {
      await api.delete(`/interviews/${id}`);
      toast.success("Interview deleted successfully");
      navigate("/dashboard");
    } catch (error) {
      console.log(error);
      toast.error("Unable to delete interview");
    }
  };

  if (!interview) {
    return (
      <AuroraBackground>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center text-white space-y-4">
            <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto" />
            <h2 className="text-2xl font-semibold">Loading Interview Details...</h2>
          </div>
        </div>
      </AuroraBackground>
    );
  }

  const isCompleted = interview.submission?.status === "completed";
  const evaluation = interview.submission?.evaluation;

  return (
    <AuroraBackground>
      <Navbar />

      <div className="min-h-screen py-10 px-6 flex justify-center">
        <div className="w-full max-w-5xl">
          {/* Back button */}
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-semibold mb-6 transition"
          >
            <FaArrowLeft /> Back to Dashboard
          </Link>

          <GlassCard>
            {/* Header Header Info */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl md:text-5xl font-extrabold text-white">
                    {interview.jobRole}
                  </h1>
                  <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                    {interview.difficulty || "Mid-Level"}
                  </span>
                </div>
                <p className="text-gray-400 text-sm md:text-base">
                  AI Generated Practice Suite • {interview.interviewType || "Technical"} Interview
                </p>
              </div>

              {/* Start/View Scorecard Button */}
              <div className="flex items-center gap-3">
                {isCompleted && (
                  <button
                    onClick={() => setScorecardOpen(true)}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 font-semibold text-sm transition"
                  >
                    <FaTrophy /> View AI Scorecard ({evaluation?.overallScore}%)
                  </button>
                )}

                <Link to={`/interview/${interview._id}/start`}>
                  <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold text-sm shadow-lg shadow-cyan-500/30 active:scale-95 transition">
                    <FaPlayCircle /> {isCompleted ? "Retake Practice" : "Start Live Interview"}
                  </button>
                </Link>
              </div>
            </div>

            {/* Quick Metadata Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                <span className="text-xs text-gray-400 font-medium uppercase tracking-wider block mb-1">
                  Experience
                </span>
                <p className="text-white font-bold text-base flex items-center gap-2">
                  <FaLaptopCode className="text-cyan-400" />
                  {interview.experience}
                </p>
              </div>

              <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                <span className="text-xs text-gray-400 font-medium uppercase tracking-wider block mb-1">
                  Total Questions
                </span>
                <p className="text-white font-bold text-base flex items-center gap-2">
                  <FaQuestionCircle className="text-purple-400" />
                  {interview.numberOfQuestions || interview.questions?.length} Questions
                </p>
              </div>

              <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                <span className="text-xs text-gray-400 font-medium uppercase tracking-wider block mb-1">
                  Interview Type
                </span>
                <p className="text-white font-bold text-base flex items-center gap-2">
                  <FaTag className="text-amber-400" />
                  {interview.interviewType || "Technical"}
                </p>
              </div>

              <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                <span className="text-xs text-gray-400 font-medium uppercase tracking-wider block mb-1">
                  Status
                </span>
                <p className="font-bold text-base flex items-center gap-2">
                  {isCompleted ? (
                    <span className="text-emerald-400 flex items-center gap-1.5">
                      <FaCheckCircle /> Completed
                    </span>
                  ) : (
                    <span className="text-amber-400 flex items-center gap-1.5">
                      <FaPlayCircle /> Ready
                    </span>
                  )}
                </p>
              </div>
            </div>

            {/* Tech Stack Section */}
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10 mb-10">
              <div className="flex items-center gap-2 text-cyan-400 font-semibold mb-3 text-sm uppercase tracking-wider">
                <FaCode /> Target Tech Stack & Focus Topics
              </div>
              <div className="flex flex-wrap gap-2">
                {interview.techStack.map((tech, index) => (
                  <span
                    key={index}
                    className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Questions List */}
            <h2 className="text-2xl font-bold text-white mb-6">Generated AI Question Bank</h2>

            <div className="space-y-4 mb-10">
              {interview.questions.map((item, index) => (
                <div
                  key={index}
                  className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-cyan-400/40 transition-all duration-300"
                >
                  <div className="flex items-center justify-between gap-4 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                        {index + 1}
                      </div>
                      <span className="text-cyan-300 text-xs uppercase tracking-wider font-semibold">
                        {item.category || "Question"}
                      </span>
                    </div>

                    {item.hints && (
                      <span className="text-xs text-amber-400 flex items-center gap-1">
                        <FaLightbulb /> Has Hint
                      </span>
                    )}
                  </div>

                  <p className="text-gray-200 font-medium text-base md:text-lg leading-relaxed mb-3">
                    {item.question}
                  </p>

                  {item.expectedConcepts?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      <span className="text-xs text-gray-400 mr-1">Expected Concepts:</span>
                      {item.expectedConcepts.map((c, i) => (
                        <span key={i} className="px-2 py-0.5 rounded text-[11px] bg-white/10 text-gray-300">
                          {c}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-6 border-t border-white/10">
              <button
                onClick={deleteInterview}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-red-500/40 bg-red-500/10 text-red-400 text-sm font-semibold hover:bg-red-500 hover:text-white transition active:scale-95"
              >
                <FaTrash /> Delete Interview
              </button>

              <Link to={`/interview/${interview._id}/start`}>
                <button className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-bold shadow-md hover:scale-105 transition">
                  <FaPlayCircle /> Start Interview Room
                </button>
              </Link>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Scorecard Modal */}
      <ScorecardModal
        isOpen={scorecardOpen}
        onClose={() => setScorecardOpen(false)}
        interview={interview}
        evaluation={evaluation}
        onRetake={() => {
          setScorecardOpen(false);
          navigate(`/interview/${interview._id}/start`);
        }}
      />
    </AuroraBackground>
  );
}

export default InterviewDetails;