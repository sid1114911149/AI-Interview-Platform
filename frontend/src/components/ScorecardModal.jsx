import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaTrophy,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimes,
  FaChevronDown,
  FaChevronUp,
  FaLightbulb,
  FaChartLine,
  FaRedo,
} from "react-icons/fa";

function ScorecardModal({ isOpen, onClose, interview, evaluation, onRetake }) {
  const [expandedIndex, setExpandedIndex] = useState(null);

  if (!isOpen || !evaluation) return null;

  const {
    overallScore = 0,
    technicalScore = 0,
    communicationScore = 0,
    summary = "",
    strengths = [],
    improvements = [],
    questionEvaluations = [],
  } = evaluation;

  const getScoreColor = (score) => {
    if (score >= 80) return "text-emerald-400 border-emerald-500/40 bg-emerald-500/10";
    if (score >= 60) return "text-amber-400 border-amber-500/40 bg-amber-500/10";
    return "text-red-400 border-red-500/40 bg-red-500/10";
  };

  const getScoreBadge = (score) => {
    if (score >= 85) return { text: "Outstanding", color: "bg-emerald-500" };
    if (score >= 70) return { text: "Strong Candidate", color: "bg-cyan-500" };
    if (score >= 50) return { text: "Developing", color: "bg-amber-500" };
    return { text: "Needs Improvement", color: "bg-red-500" };
  };

  const badge = getScoreBadge(overallScore);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#0f172a]/95 border border-cyan-500/30 p-6 md:p-8 text-white shadow-[0_0_80px_rgba(0,255,255,0.25)]"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition"
          >
            <FaTimes size={18} />
          </button>

          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-yellow-400 via-amber-500 to-orange-500 flex items-center justify-center shadow-[0_0_30px_rgba(251,191,36,0.4)]">
              <FaTrophy className="text-white text-2xl" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white via-cyan-200 to-cyan-400 bg-clip-text text-transparent">
                  AI Interview Scorecard
                </h2>
                <span className={`px-3 py-1 text-xs font-bold rounded-full text-white ${badge.color}`}>
                  {badge.text}
                </span>
              </div>
              <p className="text-gray-400 text-sm mt-1">
                {interview?.jobRole} • {interview?.experience} Experience
              </p>
            </div>
          </div>

          {/* Score Overview Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className={`p-5 rounded-2xl border ${getScoreColor(overallScore)} flex flex-col items-center justify-center text-center`}>
              <span className="text-xs uppercase tracking-wider text-gray-400 font-medium">Overall Score</span>
              <div className="text-5xl font-extrabold my-2">{overallScore}%</div>
              <div className="w-full bg-white/10 rounded-full h-2 mt-1">
                <div
                  className="bg-cyan-400 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${overallScore}%` }}
                />
              </div>
            </div>

            <div className={`p-5 rounded-2xl border ${getScoreColor(technicalScore)} flex flex-col items-center justify-center text-center`}>
              <span className="text-xs uppercase tracking-wider text-gray-400 font-medium">Technical Depth</span>
              <div className="text-5xl font-extrabold my-2">{technicalScore}%</div>
              <div className="w-full bg-white/10 rounded-full h-2 mt-1">
                <div
                  className="bg-purple-400 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${technicalScore}%` }}
                />
              </div>
            </div>

            <div className={`p-5 rounded-2xl border ${getScoreColor(communicationScore)} flex flex-col items-center justify-center text-center`}>
              <span className="text-xs uppercase tracking-wider text-gray-400 font-medium">Communication</span>
              <div className="text-5xl font-extrabold my-2">{communicationScore}%</div>
              <div className="w-full bg-white/10 rounded-full h-2 mt-1">
                <div
                  className="bg-blue-400 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${communicationScore}%` }}
                />
              </div>
            </div>
          </div>

          {/* AI Summary */}
          {summary && (
            <div className="mb-8 p-5 rounded-2xl bg-white/5 border border-white/10">
              <h3 className="text-cyan-400 font-semibold mb-2 flex items-center gap-2">
                <FaChartLine /> Executive AI Feedback Summary
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">{summary}</p>
            </div>
          )}

          {/* Strengths & Improvements */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Strengths */}
            <div className="p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20">
              <h4 className="text-emerald-400 font-semibold mb-3 flex items-center gap-2">
                <FaCheckCircle /> Demonstrated Strengths
              </h4>
              <ul className="space-y-2">
                {strengths.length > 0 ? (
                  strengths.map((item, i) => (
                    <li key={i} className="text-gray-300 text-sm flex items-start gap-2">
                      <span className="text-emerald-400 mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-gray-400 text-sm italic">Good effort demonstrated across all sections.</li>
                )}
              </ul>
            </div>

            {/* Improvements */}
            <div className="p-5 rounded-2xl bg-amber-500/5 border border-amber-500/20">
              <h4 className="text-amber-400 font-semibold mb-3 flex items-center gap-2">
                <FaExclamationTriangle /> Key Improvement Areas
              </h4>
              <ul className="space-y-2">
                {improvements.length > 0 ? (
                  improvements.map((item, i) => (
                    <li key={i} className="text-gray-300 text-sm flex items-start gap-2">
                      <span className="text-amber-400 mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-gray-400 text-sm italic">Keep polishing your answers with edge-case code samples.</li>
                )}
              </ul>
            </div>
          </div>

          {/* Question Breakdown */}
          <h3 className="text-xl font-bold text-white mb-4">Detailed Question Breakdown</h3>

          <div className="space-y-4 mb-8">
            {interview?.questions?.map((q, idx) => {
              const qEval = questionEvaluations.find((item) => item.questionIndex === idx) || {};
              const isExpanded = expandedIndex === idx;
              const qScore = qEval.score || 70;

              return (
                <div
                  key={idx}
                  className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden transition-all duration-300 hover:border-cyan-500/30"
                >
                  {/* Accordion Header */}
                  <div
                    onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                    className="p-4 flex items-center justify-between cursor-pointer select-none bg-white/[0.02] hover:bg-white/10"
                  >
                    <div className="flex items-center gap-3 pr-4">
                      <span className="w-7 h-7 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-bold flex items-center justify-center flex-shrink-0">
                        Q{idx + 1}
                      </span>
                      <span className="text-white text-sm font-medium line-clamp-1">{q.question}</span>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getScoreColor(qScore)}`}>
                        {qScore}%
                      </span>
                      {isExpanded ? <FaChevronUp className="text-gray-400" /> : <FaChevronDown className="text-gray-400" />}
                    </div>
                  </div>

                  {/* Accordion Content */}
                  {isExpanded && (
                    <div className="p-5 border-t border-white/10 bg-black/20 space-y-4">
                      <div>
                        <h5 className="text-xs uppercase tracking-wider text-cyan-400 font-semibold mb-1">
                          Question Prompt ({q.category || "Technical"})
                        </h5>
                        <p className="text-gray-200 text-sm">{q.question}</p>
                      </div>

                      {qEval.feedback && (
                        <div>
                          <h5 className="text-xs uppercase tracking-wider text-emerald-400 font-semibold mb-1">
                            AI Evaluator Feedback
                          </h5>
                          <p className="text-gray-300 text-sm bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl">
                            {qEval.feedback}
                          </p>
                        </div>
                      )}

                      {qEval.keyMissingConcepts?.length > 0 && (
                        <div>
                          <h5 className="text-xs uppercase tracking-wider text-amber-400 font-semibold mb-1">
                            Missing Key Concepts
                          </h5>
                          <div className="flex flex-wrap gap-2">
                            {qEval.keyMissingConcepts.map((tag, tIdx) => (
                              <span
                                key={tIdx}
                                className="px-2.5 py-1 rounded-md text-xs bg-amber-500/20 text-amber-300 border border-amber-500/30"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {qEval.modelAnswer && (
                        <div>
                          <h5 className="text-xs uppercase tracking-wider text-purple-400 font-semibold mb-1 flex items-center gap-1">
                            <FaLightbulb /> Ideal Model Answer
                          </h5>
                          <p className="text-gray-300 text-sm bg-purple-500/10 border border-purple-500/20 p-3 rounded-xl font-mono text-xs leading-relaxed">
                            {qEval.modelAnswer}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Footer Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10 pt-6">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition"
            >
              Return to Dashboard
            </button>

            {onRetake && (
              <button
                onClick={onRetake}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-semibold shadow-lg shadow-cyan-500/25 transition active:scale-95"
              >
                <FaRedo /> Retake Interview
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default ScorecardModal;
