import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaBriefcase,
  FaCode,
  FaLaptopCode,
  FaListOl,
  FaArrowRight,
  FaMagic,
  FaLayerGroup,
  FaCheck,
  FaFire,
} from "react-icons/fa";
import { toast } from "sonner";

import API from "../services/api";
import Navbar from "../components/Navbar";
import AuroraBackground from "../components/AuroraBackground";
import GlassCard from "../components/GlassCard";
import GradientButton from "../components/GradientButton";
import InputField from "../components/InputField";

const ROLE_PRESETS = [
  {
    title: "Frontend Engineer",
    role: "Frontend Engineer",
    exp: "2-4 Years",
    type: "Technical",
    diff: "Mid-Level",
    tech: ["React", "TypeScript", "Tailwind CSS", "Next.js", "State Management"],
  },
  {
    title: "Backend Specialist",
    role: "Backend Node.js Developer",
    exp: "3-5 Years",
    type: "Technical",
    diff: "Senior",
    tech: ["Node.js", "Express", "MongoDB", "Redis", "JWT Auth", "REST APIs"],
  },
  {
    title: "Fullstack Architect",
    role: "Fullstack Software Engineer",
    exp: "3+ Years",
    type: "Mixed",
    diff: "Senior",
    tech: ["React", "Node.js", "PostgreSQL", "Docker", "GraphQL", "System Design"],
  },
  {
    title: "AI & ML Engineer",
    role: "AI & Machine Learning Engineer",
    exp: "2-5 Years",
    type: "Technical",
    diff: "Senior",
    tech: ["Python", "PyTorch", "LLMs", "RAG", "Vector Databases", "Prompting"],
  },
  {
    title: "System Design Lead",
    role: "Staff Infrastructure Engineer",
    exp: "5+ Years",
    type: "System Design",
    diff: "Lead",
    tech: ["Microservices", "Kafka", "Kubernetes", "AWS", "Caching", "Load Balancing"],
  },
  {
    title: "Behavioral & Leadership",
    role: "Engineering Manager / Lead",
    exp: "5+ Years",
    type: "Behavioral",
    diff: "Lead",
    tech: ["Agile Delivery", "Conflict Resolution", "Team Mentorship", "Stakeholders"],
  },
];

const COMMON_TAGS = [
  "React",
  "Node.js",
  "TypeScript",
  "Python",
  "Next.js",
  "MongoDB",
  "PostgreSQL",
  "Docker",
  "System Design",
  "AWS",
  "GraphQL",
  "Git",
];

function CreateInterview() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState("");

  const [form, setForm] = useState({
    jobRole: "Frontend React Developer",
    experience: "2-4 Years",
    difficulty: "Mid-Level",
    interviewType: "Technical",
    techStack: "React, JavaScript, CSS, REST API",
    numberOfQuestions: 5,
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleApplyPreset = (preset) => {
    setForm({
      jobRole: preset.role,
      experience: preset.exp,
      difficulty: preset.diff,
      interviewType: preset.type,
      techStack: preset.tech.join(", "),
      numberOfQuestions: 5,
    });
    toast.success(`Applied ${preset.title} Preset!`);
  };

  const toggleTechTag = (tag) => {
    const currentList = form.techStack
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    let updated;
    if (currentList.includes(tag)) {
      updated = currentList.filter((t) => t !== tag);
    } else {
      updated = [...currentList, tag];
    }

    setForm({
      ...form,
      techStack: updated.join(", "),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.jobRole || !form.techStack) {
      toast.error("Please specify job role and tech stack!");
      return;
    }

    setLoading(true);
    setLoadingStep("Connecting to Gemini AI Engine...");

    try {
      setTimeout(() => setLoadingStep("Crafting personalized questions & hints..."), 1500);

      const res = await API.post("/interviews", {
        jobRole: form.jobRole,
        experience: form.experience,
        difficulty: form.difficulty,
        interviewType: form.interviewType,
        techStack: form.techStack.split(",").map((item) => item.trim()),
        numberOfQuestions: Number(form.numberOfQuestions),
      });

      toast.success("AI Interview Generated Successfully!");
      navigate(`/interview/${res.data.interview._id}`);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to create interview");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuroraBackground>
      <Navbar />

      <div className="min-h-screen max-w-5xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-3">
              <FaMagic className="animate-spin text-cyan-400" style={{ animationDuration: "6s" }} />
              AI Prompt Generator
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white">
              Create Custom AI Interview
            </h1>
            <p className="text-gray-300 text-base md:text-lg mt-2 max-w-2xl mx-auto">
              Choose a role preset or customize questions, tech stack, and difficulty level for instant mock practice.
            </p>
          </div>

          {/* Preset Selection Grid */}
          <div className="mb-10">
            <h3 className="text-sm uppercase tracking-wider text-cyan-400 font-semibold mb-4 flex items-center gap-2">
              <FaFire className="text-amber-400" /> Popular Role Presets (1-Click Fill)
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {ROLE_PRESETS.map((preset, idx) => {
                const isSelected = form.jobRole === preset.role;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleApplyPreset(preset)}
                    className={`p-3.5 rounded-2xl border text-left transition-all duration-300 ${
                      isSelected
                        ? "bg-cyan-500/20 border-cyan-400 text-white shadow-[0_0_20px_rgba(0,255,255,0.25)]"
                        : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:border-cyan-500/30"
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold text-sm text-white mb-1">
                      <span>{preset.title}</span>
                      {isSelected && <FaCheck className="text-cyan-400 text-xs" />}
                    </div>
                    <p className="text-xs text-gray-400 line-clamp-1">{preset.tech.join(" • ")}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form Card */}
          <GlassCard>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Job Role */}
              <div>
                <label className="text-white text-sm font-semibold mb-2 block flex items-center justify-between">
                  <span>Job Role / Target Position</span>
                  <span className="text-xs text-gray-400 font-normal">e.g. Senior React Engineer</span>
                </label>
                <InputField
                  icon={FaBriefcase}
                  name="jobRole"
                  placeholder="e.g. Frontend Developer, Fullstack Lead"
                  value={form.jobRole}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Experience & Difficulty Row */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="text-white text-sm font-semibold mb-2 block">Experience Level</label>
                  <InputField
                    icon={FaLaptopCode}
                    name="experience"
                    placeholder="Fresher / 2-4 Years / 5+ Years"
                    value={form.experience}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label className="text-white text-sm font-semibold mb-2 block">Interview Difficulty</label>
                  <div className="grid grid-cols-3 gap-2">
                    {["Junior", "Mid-Level", "Senior"].map((diff) => (
                      <button
                        key={diff}
                        type="button"
                        onClick={() => setForm({ ...form, difficulty: diff })}
                        className={`py-3 rounded-xl text-xs font-semibold border transition ${
                          form.difficulty === diff
                            ? "bg-purple-500/20 border-purple-400 text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.3)]"
                            : "bg-white/5 border-white/10 text-gray-400 hover:text-white"
                        }`}
                      >
                        {diff}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Interview Type Tabs */}
              <div>
                <label className="text-white text-sm font-semibold mb-2 block">Interview Type & Focus</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {["Technical", "Behavioral", "System Design", "Mixed"].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setForm({ ...form, interviewType: type })}
                      className={`py-3 rounded-xl text-xs font-semibold border transition ${
                        form.interviewType === type
                          ? "bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                          : "bg-white/5 border-white/10 text-gray-400 hover:text-white"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tech Stack */}
              <div>
                <label className="text-white text-sm font-semibold mb-2 block">
                  Tech Stack & Core Topics (Comma Separated)
                </label>
                <InputField
                  icon={FaCode}
                  name="techStack"
                  placeholder="React, Node.js, MongoDB, System Design"
                  value={form.techStack}
                  onChange={handleChange}
                  required
                />

                {/* Quick Add Tag Chips */}
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="text-xs text-gray-400 flex items-center gap-1 mr-1">
                    <FaLayerGroup /> Quick Tags:
                  </span>
                  {COMMON_TAGS.map((tag) => {
                    const active = form.techStack.toLowerCase().includes(tag.toLowerCase());
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTechTag(tag)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition ${
                          active
                            ? "bg-cyan-500 text-white border-cyan-400 shadow-sm"
                            : "bg-white/5 border-white/15 text-gray-300 hover:bg-white/10"
                        }`}
                      >
                        {active ? `✓ ${tag}` : `+ ${tag}`}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Number of Questions */}
              <div>
                <label className="text-white text-sm font-semibold mb-2 block">Number of Questions</label>
                <div className="flex items-center gap-3">
                  {[3, 5, 8, 10].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setForm({ ...form, numberOfQuestions: num })}
                      className={`flex-1 py-3 rounded-xl text-sm font-bold border transition ${
                        Number(form.numberOfQuestions) === num
                          ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-cyan-400 shadow-md"
                          : "bg-white/5 border-white/10 text-gray-400 hover:text-white"
                      }`}
                    >
                      {num} Questions
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <GradientButton type="submit" disabled={loading}>
                  <div className="flex justify-center items-center gap-3">
                    {loading ? (
                      <>
                        <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                        <span>{loadingStep || "Generating AI Questions..."}</span>
                      </>
                    ) : (
                      <>
                        <span>Generate AI Interview Room</span>
                        <FaArrowRight />
                      </>
                    )}
                  </div>
                </GradientButton>
              </div>
            </form>
          </GlassCard>
        </motion.div>
      </div>
    </AuroraBackground>
  );
}

export default CreateInterview;