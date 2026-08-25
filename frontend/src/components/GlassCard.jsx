function GlassCard({ children }) {
  return (
    <div
      className="
      backdrop-blur-3xl
      bg-white/10
      border
      border-cyan-300/40
      rounded-[35px]
      shadow-[0_0_80px_rgba(0,255,255,.25)]
      p-10
      transition-all
      duration-500
      hover:shadow-[0_0_120px_rgba(0,255,255,.45)]
      hover:scale-[1.01]
      "
    >
      {children}
    </div>
  );
}

export default GlassCard;