const navItems = [
  { label: "Overview", href: "#overview" },
  { label: "Problem", href: "#problem" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Intelligence", href: "#intelligence" },
];

function Header() {
  return (
    <header className="fixed left-0 right-0 top-0 z-50 px-6 py-5">
      <div className="mx-auto flex max-w-7xl items-center justify-between rounded-full border border-white/10 bg-black/35 px-5 py-3 backdrop-blur-xl">
        
        <a
          href="#"
          className="text-lg font-semibold tracking-[-0.03em] text-white"
        >
          signal<span className="text-white/35">.</span>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-sm text-white/55 transition hover:text-white"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <a
          href="#dashboard"
          className="rounded-full border border-white/15 bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-white/90"
        >
          Explore platform
        </a>
      </div>
    </header>
  );
}

export default Header;