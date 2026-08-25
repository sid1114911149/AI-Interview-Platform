import { motion } from "framer-motion";

function AuroraBackground({ children }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#020617]">

      {/* ================= Aurora 1 ================= */}

      <motion.div
        animate={{
          x: [0, 80, -50, 0],
          y: [0, -40, 30, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -left-40 top-0 h-[650px] w-[650px] rounded-full bg-cyan-500 blur-[170px] opacity-25"
      />

      {/* ================= Aurora 2 ================= */}

      <motion.div
        animate={{
          x: [0, -60, 70, 0],
          y: [0, 60, -40, 0],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute right-0 top-20 h-[700px] w-[700px] rounded-full bg-purple-600 blur-[180px] opacity-25"
      />

      {/* ================= Aurora 3 ================= */}

      <motion.div
        animate={{
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-0 left-1/2 h-[500px] w-[500px] rounded-full bg-blue-500 blur-[170px] opacity-20"
      />

      {/* ================= Stars ================= */}

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,.18)_1px,transparent_1px)] bg-[length:28px_28px] opacity-25"></div>

      {/* ================= Floating Particles ================= */}

      <div className="absolute inset-0 overflow-hidden">

        {[...Array(60)].map((_, index) => (

          <motion.div
            key={index}
            animate={{
              y: [-20, 20, -20],
              opacity: [0.2, 0.7, 0.2],
            }}
            transition={{
              duration: 4 + Math.random() * 6,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
            className="absolute rounded-full bg-cyan-300"
            style={{
              width: Math.random() * 6 + 2,
              height: Math.random() * 6 + 2,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
          />

        ))}

      </div>

      {/* ================= Bottom Glow ================= */}

      <div className="absolute bottom-0 left-0 w-full h-56 bg-gradient-to-t from-cyan-500/20 via-purple-500/10 to-transparent blur-3xl"></div>

      {/* ================= Page Content ================= */}

      <div className="relative z-10">
        {children}
      </div>

    </div>
  );
}

export default AuroraBackground;