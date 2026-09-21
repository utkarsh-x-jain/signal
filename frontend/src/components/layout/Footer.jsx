function Footer() {
  return (
    <footer className="border-t border-white/5 px-6 py-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-lg font-semibold tracking-tight text-white">
            signal<span className="text-white/30">.</span>
          </p>

          <p className="mt-1 text-sm text-white/30">
            Infrastructure intelligence before failure.
          </p>
        </div>

        <div className="flex items-center gap-6 text-sm text-white/40">
          <a className="transition hover:text-white" href="#overview">
            Overview
          </a>

          <a className="transition hover:text-white" href="#how-it-works">
            How it works
          </a>

          <a className="transition hover:text-white" href="#intelligence">
            Intelligence
          </a>
        </div>
      </div>

      <div className="mx-auto mt-10 flex max-w-7xl items-center justify-between border-t border-white/5 pt-5 text-xs text-white/20">
        <span>© 2026 Signal</span>
        <span>Built for smarter infrastructure.</span>
      </div>
    </footer>
  );
}

export default Footer;