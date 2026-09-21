import { motion } from "framer-motion";
import ScrollReveal from "../ui/ScrollReveal";

const assets = [
  {
    id: "SG-042",
    name: "Central Bridge",
    location: "North District",
    risk: 78,
    level: "High",
    color: "amber",
  },
  {
    id: "SG-017",
    name: "Water Main 17",
    location: "West District",
    risk: 61,
    level: "Medium",
    color: "yellow",
  },
  {
    id: "SG-091",
    name: "Grid Junction",
    location: "South District",
    risk: 34,
    level: "Low",
    color: "emerald",
  },
];

function getRiskText(level) {
  if (level === "High") return "text-red-400";
  if (level === "Medium") return "text-amber-400";
  return "text-emerald-400";
}

function RiskPreview() {
  return (
    <section
      id="intelligence"
      className="border-t border-white/5 px-6 py-32"
    >
      <div className="mx-auto max-w-7xl">
        <ScrollReveal>
          <p className="text-sm uppercase tracking-[0.2em] text-white/35">
            Risk intelligence
          </p>

          <h2 className="mt-4 max-w-3xl text-4xl font-semibold tracking-[-0.04em] text-white sm:text-6xl">
            Know what needs attention before it becomes urgent.
          </h2>

          <p className="mt-6 max-w-2xl text-base leading-7 text-white/40 sm:text-lg">
            Signal converts fragmented infrastructure data into a clear,
            prioritized view of risk.
          </p>
        </ScrollReveal>

        <ScrollReveal className="mt-16">
          <div className="grid gap-5 lg:grid-cols-[1.45fr_0.55fr]">
            {/* Main panel */}
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.02] p-6 sm:p-8">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(255,255,255,0.06),transparent_48%)]" />

              <div className="relative">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-white/30">
                      Regional overview
                    </p>

                    <h3 className="mt-2 text-2xl font-medium tracking-tight text-white">
                      Infrastructure risk
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 self-start rounded-full border border-emerald-400/15 bg-emerald-400/[0.06] px-3 py-1.5">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                    <span className="text-[10px] uppercase tracking-[0.16em] text-emerald-400">
                      Live monitoring
                    </span>
                  </div>
                </div>

                {/* Visualization */}
                <div className="relative mt-8 min-h-[420px] overflow-hidden rounded-3xl border border-white/5 bg-black/30">
                  {/* Grid */}
                  <div
                    className="absolute inset-0 opacity-30"
                    style={{
                      backgroundImage:
                        "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
                      backgroundSize: "48px 48px",
                    }}
                  />

                  {/* District shapes */}
                  <div className="absolute left-[10%] top-[15%] h-28 w-36 rotate-[-8deg] rounded-[35%] border border-white/10 bg-white/[0.02]" />
                  <div className="absolute left-[38%] top-[24%] h-36 w-44 rotate-[8deg] rounded-[40%] border border-white/10 bg-white/[0.02]" />
                  <div className="absolute right-[8%] top-[18%] h-24 w-32 rotate-[-12deg] rounded-[35%] border border-white/10 bg-white/[0.02]" />
                  <div className="absolute left-[18%] bottom-[10%] h-28 w-40 rotate-[10deg] rounded-[40%] border border-white/10 bg-white/[0.02]" />
                  <div className="absolute right-[20%] bottom-[12%] h-32 w-44 rotate-[-6deg] rounded-[40%] border border-white/10 bg-white/[0.02]" />

                  {/* Connections */}
                  <svg
                    className="absolute inset-0 h-full w-full"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                  >
                    <line
                      x1="21"
                      y1="30"
                      x2="47"
                      y2="47"
                      stroke="rgba(255,255,255,0.12)"
                      strokeWidth="0.35"
                    />
                    <line
                      x1="47"
                      y1="47"
                      x2="70"
                      y2="27"
                      stroke="rgba(255,255,255,0.10)"
                      strokeWidth="0.35"
                    />
                    <line
                      x1="47"
                      y1="47"
                      x2="76"
                      y2="65"
                      stroke="rgba(255,255,255,0.12)"
                      strokeWidth="0.35"
                    />
                    <line
                      x1="47"
                      y1="47"
                      x2="29"
                      y2="71"
                      stroke="rgba(255,255,255,0.10)"
                      strokeWidth="0.35"
                    />
                  </svg>

                  {/* Risk nodes */}
                  <div className="absolute left-[21%] top-[30%]">
                    <span className="absolute inset-0 animate-ping rounded-full bg-amber-400/30" />
                    <span className="relative block h-3 w-3 rounded-full bg-amber-400 shadow-[0_0_25px_rgba(251,191,36,0.65)]" />
                  </div>

                  <div className="absolute left-[47%] top-[47%]">
                    <span className="absolute inset-0 animate-ping rounded-full bg-red-400/30" />
                    <span className="relative block h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-400 shadow-[0_0_30px_rgba(248,113,113,0.7)]" />
                  </div>

                  <div className="absolute left-[70%] top-[27%]">
                    <span className="relative block h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.5)]" />
                  </div>

                  <div className="absolute left-[76%] top-[65%]">
                    <span className="relative block h-2.5 w-2.5 rounded-full bg-amber-300 shadow-[0_0_20px_rgba(251,191,36,0.45)]" />
                  </div>

                  <div className="absolute left-[29%] top-[71%]">
                    <span className="relative block h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.45)]" />
                  </div>

                  {/* Central focus card */}
                  <motion.div
                    animate={{ y: [0, -4, 0] }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="absolute left-1/2 top-1/2 w-[210px] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/10 bg-black/65 p-4 shadow-2xl backdrop-blur-xl"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase tracking-[0.16em] text-white/30">
                        Priority asset
                      </span>

                      <span className="rounded-full bg-red-400/10 px-2 py-1 text-[10px] text-red-400">
                        HIGH
                      </span>
                    </div>

                    <p className="mt-4 text-lg font-medium text-white">
                      Central Bridge
                    </p>

                    <p className="mt-1 text-xs text-white/35">
                      Asset SG-042
                    </p>

                    <div className="mt-4 flex items-end justify-between">
                      <div>
                        <span className="text-4xl font-semibold tracking-tight text-white">
                          78%
                        </span>
                        <p className="mt-1 text-[11px] text-white/30">
                          Failure risk
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-xs text-white/30">
                          Confidence
                        </span>
                        <p className="mt-1 text-sm text-white">91%</p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Legend */}
                  <div className="absolute bottom-5 left-5 flex flex-wrap gap-4 rounded-full border border-white/10 bg-black/50 px-4 py-2.5 backdrop-blur-xl">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-red-400" />
                      <span className="text-[10px] uppercase tracking-[0.14em] text-white/40">
                        High
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-amber-400" />
                      <span className="text-[10px] uppercase tracking-[0.14em] text-white/40">
                        Medium
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-400" />
                      <span className="text-[10px] uppercase tracking-[0.14em] text-white/40">
                        Low
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Side panel */}
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.02] p-6 sm:p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-white/30">
                    Priority queue
                  </p>

                  <h3 className="mt-2 text-2xl font-medium text-white">
                    Assets at risk
                  </h3>
                </div>

                <span className="text-xs text-white/25">03</span>
              </div>

              <div className="mt-8 space-y-3">
                {assets.map((asset, index) => (
                  <motion.div
                    key={asset.id}
                    initial={{ opacity: 0, x: 10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.5,
                      delay: index * 0.08,
                    }}
                    className="rounded-2xl border border-white/5 bg-black/20 p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-medium text-white">
                          {asset.name}
                        </p>

                        <p className="mt-1 text-xs text-white/30">
                          {asset.location}
                        </p>
                      </div>

                      <span
                        className={`text-sm font-medium ${getRiskText(
                          asset.level
                        )}`}
                      >
                        {asset.risk}%
                      </span>
                    </div>

                    <div className="mt-4 h-1 overflow-hidden rounded-full bg-white/5">
                      <div
                        className={`h-full rounded-full ${
                          asset.level === "High"
                            ? "bg-red-400"
                            : asset.level === "Medium"
                            ? "bg-amber-400"
                            : "bg-emerald-400"
                        }`}
                        style={{ width: `${asset.risk}%` }}
                      />
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <span className="font-mono text-[10px] text-white/20">
                        {asset.id}
                      </span>

                      <span
                        className={`text-[10px] uppercase tracking-[0.14em] ${getRiskText(
                          asset.level
                        )}`}
                      >
                        {asset.level}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-5 rounded-2xl border border-white/5 bg-white/[0.02] p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/30">
                    Active signals
                  </span>

                  <span className="text-sm font-medium text-white">17</span>
                </div>

                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs text-white/30">
                    Requiring action
                  </span>

                  <span className="text-sm font-medium text-amber-400">
                    4
                  </span>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

export default RiskPreview;