import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaRobot,
  FaUser,
  FaEnvelope,
  FaLock,
  FaArrowRight,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { toast } from "sonner";

import API from "../services/api";

import AuroraBackground from "../components/AuroraBackground";
import GlassCard from "../components/GlassCard";
import GradientButton from "../components/GradientButton";
import InputField from "../components/InputField";

function Register() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.name ||
      !form.email ||
      !form.password ||
      !form.confirmPassword
    ) {
      return toast.error("Please fill all fields");
    }

    if (form.password !== form.confirmPassword) {
      return toast.error("Passwords do not match");
    }

    setLoading(true);

    try {
      const res = await API.post("/users/register", {
        name: form.name,
        email: form.email,
        password: form.password,
      });

      toast.success(res.data.message);

      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Registration Failed"
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
              Create Account
            </h1>

            <p className="text-gray-300 text-center mt-3 text-lg">
              Join AI Interview Platform
            </p>

            {/* Divider */}

            <div className="flex items-center justify-center mt-8 mb-8">
              <div className="h-[2px] w-24 bg-cyan-500"></div>

              <div className="w-3 h-3 rounded-full bg-cyan-400 mx-4"></div>

              <div className="h-[2px] w-24 bg-purple-500"></div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">

              <div>
                <label className="text-white mb-2 block font-medium">
                  Full Name
                </label>

                <InputField
                  icon={FaUser}
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={form.name}
                  onChange={handleChange}
                />
              </div>

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

              <div>
                <label className="text-white mb-2 block font-medium">
                  Confirm Password
                </label>

                <InputField
                  icon={FaLock}
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                />
              </div>

              <GradientButton
                type="submit"
                disabled={loading}
              >
                <div className="flex justify-center items-center gap-3">
                  {loading ? "Creating Account..." : "Create Account"}

                  {!loading && <FaArrowRight />}
                </div>
              </GradientButton>

            </form>

            <p className="text-center text-gray-300 mt-10">
              Already have an account?

              <Link
                to="/"
                className="text-cyan-300 ml-2 hover:text-cyan-200 transition"
              >
                Login
              </Link>
            </p>

          </GlassCard>

        </motion.div>

      </div>
    </AuroraBackground>
  );
}

export default Register;