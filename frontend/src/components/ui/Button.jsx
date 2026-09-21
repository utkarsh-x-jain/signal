function Button({
  children,
  href,
  variant = "primary",
  className = "",
}) {
  const base =
    "inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium transition-all duration-300";

  const variants = {
    primary:
      "bg-white text-black hover:scale-[1.03] hover:bg-white/90",
    secondary:
      "border border-white/10 text-white/70 hover:border-white/20 hover:bg-white/[0.03] hover:text-white",
  };

  const classes = `${base} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }

  return (
    <button type="button" className={classes}>
      {children}
    </button>
  );
}

export default Button;