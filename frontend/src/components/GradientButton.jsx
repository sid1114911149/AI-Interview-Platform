function GradientButton({ children, ...props }) {
  return (
    <button
      {...props}
      className="
      w-full
      py-4
      rounded-2xl
      font-semibold
      text-xl
      text-white
      bg-gradient-to-r
      from-cyan-500
      via-blue-500
      to-purple-600
      transition-all
      duration-500
      hover:scale-105
      hover:shadow-[0_0_40px_rgba(0,255,255,.5)]
      active:scale-95
      "
    >
      {children}
    </button>
  );
}

export default GradientButton;