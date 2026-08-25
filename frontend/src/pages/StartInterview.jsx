import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaMicrophone,
  FaMicrophoneSlash,
  FaVideo,
  FaVideoSlash,
  FaVolumeUp,
  FaVolumeMute,
  FaLightbulb,
  FaArrowLeft,
  FaArrowRight,
  FaCheckCircle,
  FaClock,
  FaBrain,
  FaPaperPlane,
} from "react-icons/fa";
import { toast } from "sonner";

import api from "../services/api";
import Navbar from "../components/Navbar";
import AuroraBackground from "../components/AuroraBackground";
import ScorecardModal from "../components/ScorecardModal";

function StartInterview() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [interview, setInterview] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showHint, setShowHint] = useState(false);

  // Audio / Video Media Stream States
  const videoRef = useRef(null);
  const [cameraOn, setCameraOn] = useState(false);
  const [micOn, setMicOn] = useState(true);
  const [stream, setStream] = useState(null);

  // Speech Recognition (Speech-to-Text) State
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  // Text-to-Speech (AI Voice) State
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Timer State
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  // Submission & Scorecard States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [evaluationData, setEvaluationData] = useState(null);
  const [scorecardOpen, setScorecardOpen] = useState(false);

  useEffect(() => {
    fetchInterview();
    initializeCamera();

    const timer = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);

    return () => {
      clearInterval(timer);
      stopCameraStream();
      stopSpeechSynthesis();
      stopSpeechRecognition();
    };
  }, [id]);

  // Fetch Interview Details
  const fetchInterview = async () => {
    try {
      const res = await api.get(`/interviews/${id}`);
      const fetched = res.data.interview;
      setInterview(fetched);

      // If already submitted, pre-populate evaluation
      if (fetched.submission?.status === "completed" && fetched.submission?.evaluation) {
        setAnswers(fetched.submission.userAnswers || {});
        setEvaluationData(fetched.submission.evaluation);
        setScorecardOpen(true);
      }
    } catch (err) {
      console.error(err);
      toast.error("Unable to load interview details");
      navigate("/dashboard");
    }
  };

  // Webcam Setup
  const initializeCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setStream(mediaStream);
      setCameraOn(true);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.warn("Camera/Microphone access not granted or unavailable:", err);
      setCameraOn(false);
    }
  };

  const toggleCamera = async () => {
    if (cameraOn && stream) {
      stream.getVideoTracks().forEach((track) => (track.enabled = false));
      setCameraOn(false);
    } else {
      if (!stream) {
        await initializeCamera();
      } else {
        stream.getVideoTracks().forEach((track) => (track.enabled = true));
        setCameraOn(true);
      }
    }
  };

  const toggleMic = () => {
    if (stream) {
      stream.getAudioTracks().forEach((track) => (track.enabled = !micOn));
      setMicOn(!micOn);
    }
  };

  const stopCameraStream = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
  };

  // Speech-to-Text (Voice Dictation)
  const toggleSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      toast.error("Speech Recognition is not supported in this browser. Try Chrome or Edge.");
      return;
    }

    if (isListening) {
      stopSpeechRecognition();
      setIsListening(false);
      toast.info("Voice input paused.");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onstart = () => {
        setIsListening(true);
        toast.success("Listening... Speak your answer!");
      };

      recognition.onresult = (event) => {
        let currentTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setAnswers((prev) => ({
          ...prev,
          [currentIndex]: currentTranscript,
        }));
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error(err);
      setIsListening(false);
    }
  };

  const stopSpeechRecognition = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
  };

  // Text-to-Speech (AI Question Reader)
  const speakQuestionText = (text) => {
    if (!("speechSynthesis" in window)) {
      toast.error("Text-to-speech not supported in this browser.");
      return;
    }

    if (isSpeaking) {
      stopSpeechSynthesis();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeechSynthesis = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const handleAnswerChange = (e) => {
    setAnswers({
      ...answers,
      [currentIndex]: e.target.value,
    });
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleNext = () => {
    stopSpeechSynthesis();
    setShowHint(false);
    if (currentIndex < (interview?.questions?.length || 0) - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    stopSpeechSynthesis();
    setShowHint(false);
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  // Submit Interview to Backend for AI Evaluation
  const handleSubmitInterview = async () => {
    stopSpeechRecognition();
    stopSpeechSynthesis();

    setIsSubmitting(true);
    toast.loading("Analyzing your answers with Gemini AI...");

    try {
      const res = await api.post(`/interviews/${id}/submit`, {
        userAnswers: answers,
      });

      toast.dismiss();
      toast.success("AI Evaluation Complete!");
      setEvaluationData(res.data.evaluation);
      setScorecardOpen(true);
    } catch (err) {
      console.error(err);
      toast.dismiss();
      toast.error(err.response?.data?.message || "Evaluation failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!interview) {
    return (
      <AuroraBackground>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center text-white space-y-4">
            <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto" />
            <h2 className="text-2xl font-semibold">Loading Virtual Interview Room...</h2>
          </div>
        </div>
      </AuroraBackground>
    );
  }

  const questions = interview.questions || [];
  const currentQuestion = questions[currentIndex] || { question: "No question text available." };

  return (
    <AuroraBackground>
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 min-h-[calc(100vh-80px)] flex flex-col justify-between">
        {/* Top Control Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-md mb-6">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl md:text-2xl font-bold text-white">{interview.jobRole}</h1>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                {interview.difficulty || "Mid-Level"}
              </span>
            </div>
            <p className="text-gray-400 text-xs mt-1">
              Tech Focus: {interview.techStack?.join(" • ")}
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Live Timer */}
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-black/40 border border-white/15 text-cyan-300 text-sm font-mono font-bold">
              <FaClock className="text-cyan-400" />
              <span>{formatTimer(secondsElapsed)}</span>
            </div>

            {/* Progress Badge */}
            <div className="text-xs font-semibold text-gray-300 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
              Question {currentIndex + 1} of {questions.length}
            </div>

            {/* Submit Button Header Shortcut */}
            <button
              onClick={handleSubmitInterview}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-400 hover:to-cyan-500 shadow-md shadow-emerald-500/20 active:scale-95 transition"
            >
              <FaPaperPlane /> Finish & Submit
            </button>
          </div>
        </div>

        {/* Main Grid: Left Webcam/AI Room & Right Q&A Canvas */}
        <div className="grid lg:grid-cols-12 gap-6 flex-1 items-stretch">
          {/* Left Column: Virtual Camera Preview & Mic Audio Monitor (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="relative rounded-3xl bg-black/60 border border-cyan-500/30 overflow-hidden flex flex-col items-center justify-center min-h-[300px] shadow-[0_0_40px_rgba(0,255,255,0.15)] flex-1">
              {cameraOn ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover rounded-3xl transform -scale-x-100"
                />
              ) : (
                <div className="text-center p-8 space-y-3">
                  <div className="w-20 h-20 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto">
                    <FaVideoSlash className="text-cyan-400 text-3xl" />
                  </div>
                  <p className="text-gray-300 text-sm font-medium">Camera Feed Paused</p>
                  <p className="text-xs text-gray-500">Click below to toggle webcam preview</p>
                </div>
              )}

              {/* Status Indicators */}
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-black/60 backdrop-blur-md text-emerald-400 border border-emerald-500/30">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  REC ACTIVE
                </span>
                {isListening && (
                  <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-red-500/20 backdrop-blur-md text-red-300 border border-red-500/40 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                    Listening...
                  </span>
                )}
              </div>

              {/* Audio Waveform Simulation Bar */}
              {micOn && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1 px-4 py-2 rounded-full bg-black/60 backdrop-blur-md border border-white/10">
                  {[40, 75, 50, 90, 60, 80, 45].map((h, i) => (
                    <motion.div
                      key={i}
                      animate={{ height: isListening ? [8, h / 3, 8] : 8 }}
                      transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.1 }}
                      className="w-1 bg-cyan-400 rounded-full"
                      style={{ height: 8 }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Video & Mic Toggle Controls */}
            <div className="flex items-center justify-center gap-4 bg-white/5 border border-white/10 p-3 rounded-2xl">
              <button
                onClick={toggleCamera}
                className={`p-3.5 rounded-xl border font-semibold text-sm flex items-center gap-2 transition ${
                  cameraOn
                    ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40"
                    : "bg-red-500/20 text-red-300 border-red-500/40"
                }`}
              >
                {cameraOn ? <FaVideo /> : <FaVideoSlash />}
                <span>{cameraOn ? "Camera On" : "Camera Off"}</span>
              </button>

              <button
                onClick={toggleMic}
                className={`p-3.5 rounded-xl border font-semibold text-sm flex items-center gap-2 transition ${
                  micOn
                    ? "bg-purple-500/20 text-purple-300 border-purple-500/40"
                    : "bg-gray-500/20 text-gray-400 border-gray-500/40"
                }`}
              >
                {micOn ? <FaMicrophone /> : <FaMicrophoneSlash />}
                <span>{micOn ? "Mic On" : "Muted"}</span>
              </button>
            </div>
          </div>

          {/* Right Column: Interactive Q&A Canvas (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between gap-4 bg-white/10 backdrop-blur-xl p-6 md:p-8 rounded-3xl border border-cyan-500/30 shadow-[0_0_50px_rgba(0,255,255,0.2)]">
            <div>
              {/* Question Header */}
              <div className="flex items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center text-white font-extrabold text-sm">
                    {currentIndex + 1}
                  </span>
                  <span className="text-cyan-300 text-xs uppercase tracking-wider font-semibold">
                    {currentQuestion.category || "Technical Competency"}
                  </span>
                </div>

                {/* AI Voice Question Reader Button */}
                <button
                  onClick={() => speakQuestionText(currentQuestion.question)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                    isSpeaking
                      ? "bg-purple-500 text-white border-purple-400 animate-pulse"
                      : "bg-white/10 text-cyan-300 hover:bg-cyan-500/20 border-cyan-500/30"
                  }`}
                >
                  {isSpeaking ? <FaVolumeMute /> : <FaVolumeUp />}
                  <span>{isSpeaking ? "Stop Voice" : "AI Voice Reader"}</span>
                </button>
              </div>

              {/* Question Box */}
              <div className="bg-white/5 border border-white/15 p-5 rounded-2xl mb-4">
                <h3 className="text-lg md:text-xl font-semibold text-white leading-relaxed">
                  {currentQuestion.question}
                </h3>
              </div>

              {/* AI Hints Collapsible */}
              {currentQuestion.hints && (
                <div className="mb-4">
                  <button
                    onClick={() => setShowHint(!showHint)}
                    className="flex items-center gap-2 text-xs font-semibold text-amber-400 hover:text-amber-300 transition"
                  >
                    <FaLightbulb />
                    {showHint ? "Hide AI Hint" : "Need a Hint?"}
                  </button>

                  {showHint && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs leading-relaxed"
                    >
                      <span className="font-bold">AI Hint: </span>
                      {currentQuestion.hints}
                    </motion.div>
                  )}
                </div>
              )}

              {/* Answer Box Header Controls */}
              <div className="flex items-center justify-between mb-2">
                <label className="text-white text-xs font-semibold flex items-center gap-2">
                  <FaBrain className="text-cyan-400" />
                  Your Response (Type or Dictate below):
                </label>

                {/* Speech Recognition Dictation Button */}
                <button
                  onClick={toggleSpeechRecognition}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition border ${
                    isListening
                      ? "bg-red-500 text-white border-red-400 animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.5)]"
                      : "bg-cyan-500/20 text-cyan-300 border-cyan-500/40 hover:bg-cyan-500/30"
                  }`}
                >
                  <FaMicrophone />
                  <span>{isListening ? "Stop Speech Input" : "Click to Speak Answer"}</span>
                </button>
              </div>

              {/* Textarea Input */}
              <textarea
                className="w-full h-44 p-4 rounded-2xl bg-black/40 border border-white/20 text-white placeholder-gray-400 outline-none focus:border-cyan-400 focus:shadow-[0_0_25px_rgba(0,255,255,0.25)] transition font-sans text-sm md:text-base leading-relaxed"
                placeholder="Type your structured answer here, or click 'Click to Speak Answer' to dictate live..."
                value={answers[currentIndex] || ""}
                onChange={handleAnswerChange}
              />
            </div>

            {/* Pagination & Next/Finish Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-white/10 mt-4">
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-semibold disabled:opacity-30 transition"
              >
                <FaArrowLeft />
                Previous
              </button>

              {currentIndex === questions.length - 1 ? (
                <button
                  onClick={handleSubmitInterview}
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-400 hover:to-cyan-500 text-white font-bold text-sm shadow-lg shadow-emerald-500/30 active:scale-95 transition"
                >
                  {isSubmitting ? "Evaluating with AI..." : "Finish & Submit"}
                  <FaCheckCircle />
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white text-sm font-bold shadow-lg shadow-cyan-500/25 active:scale-95 transition"
                >
                  Next Question
                  <FaArrowRight />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Evaluation Results Scorecard Modal */}
      <ScorecardModal
        isOpen={scorecardOpen}
        onClose={() => {
          setScorecardOpen(false);
          navigate("/dashboard");
        }}
        interview={interview}
        evaluation={evaluationData}
        onRetake={() => {
          setScorecardOpen(false);
          setCurrentIndex(0);
          setAnswers({});
          setEvaluationData(null);
          setSecondsElapsed(0);
        }}
      />
    </AuroraBackground>
  );
}

export default StartInterview;