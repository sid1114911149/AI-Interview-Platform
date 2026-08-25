function InputField({ icon: Icon, ...props }) {
  return (
    <div
      className="
      flex
      items-center
      rounded-2xl
      bg-white/5
      border
      border-white/20
      px-5
      py-4
      transition-all
      duration-300
      focus-within:border-cyan-400
      focus-within:shadow-[0_0_20px_rgba(0,255,255,.3)]
      "
    >
      <Icon className="text-cyan-300 text-xl mr-4" />

      <input
        {...props}
        className="
        flex-1
        bg-transparent
        outline-none
        text-white
        placeholder:text-gray-400
        "
      />
    </div>
  );
}

export default InputField;