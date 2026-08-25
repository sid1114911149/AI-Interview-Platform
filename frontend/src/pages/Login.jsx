import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaRobot, FaEnvelope, FaLock, FaArrowRight } from "react-icons/fa";
import { motion } from "framer-motion";
import { toast } from "sonner";

import API from "../services/api";
import AuroraBackground from "../components/AuroraBackground";
import GlassCard from "../components/GlassCard";
import GradientButton from "../components/GradientButton";
import InputField from "../components/InputField";

import useAuth from "../hooks/useAuth";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const res = await API.post("/users/login", form);

      login(res.data.token);

      toast.success("Login Successful");

      navigate("/dashboard");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        error.message ||
        "Login Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuroraBackground>
      <div className="min-h-screen flex items-center justify-center px-5">

        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          className="w-full max-w-xl"
        >
          <GlassCard>

            {/* Logo */}

            <div className="flex justify-center">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center shadow-[0_0_40px_rgba(0,255,255,.35)]">
                <FaRobot className="text-white text-5xl" />
              </div>
            </div>

            {/* Heading */}

            <h1 className="text-white text-5xl font-bold text-center mt-8">
              AI Interview Platform
            </h1>

            <p className="text-gray-300 text-center mt-3 text-lg">
              Welcome back! Login to continue
            </p>

            {/* Divider */}

            <div className="flex items-center justify-center mt-8 mb-8">
              <div className="h-[2px] w-24 bg-cyan-500"></div>

              <div className="w-3 h-3 rounded-full bg-cyan-400 mx-4"></div>

              <div className="h-[2px] w-24 bg-purple-500"></div>
            </div>

            {/* Form */}

            <form onSubmit={handleSubmit} className="space-y-6">

              <div>
                <label className="text-white mb-2 block font-medium">
                  Email
                </label>

                <InputField
                  icon={FaEnvelope}
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="text-white mb-2 block font-medium">
                  Password
                </label>

                <InputField
                  icon={FaLock}
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                />
              </div>

              <div className="text-right">
                <button
                  type="button"
                  className="text-cyan-300 hover:text-cyan-200 transition"
                >
                  Forgot Password?
                </button>
              </div>

              <GradientButton
                type="submit"
                disabled={loading}
              >
                <div className="flex justify-center items-center gap-3">
                  {loading ? "Logging in..." : "Login"}

                  {!loading && <FaArrowRight />}
                </div>
              </GradientButton>

            </form>

            <p className="text-center text-gray-300 mt-10">
              Don't have an account?

              <Link
                to="/register"
                className="text-cyan-300 ml-2 hover:text-cyan-200 transition"
              >
                Create Account
              </Link>
            </p>

          </GlassCard>
        </motion.div>

      </div>
    </AuroraBackground>
  );
}

export default Login;