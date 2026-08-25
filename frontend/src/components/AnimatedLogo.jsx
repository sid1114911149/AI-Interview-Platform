import { motion } from "framer-motion";
import { FaRobot } from "react-icons/fa";

function AnimatedLogo() {
  return (
    <motion.div
      animate={{
        y: [0, -10, 0],
        rotate: [0, 2, -2, 0],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-600 shadow-[0_0_60px_rgba(34,211,238,0.45)]"
    >
      <FaRobot className="text-5xl text-white" />
    </motion.div>
  );
}

export default AnimatedLogo;