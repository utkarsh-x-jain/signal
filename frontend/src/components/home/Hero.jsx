import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  BrainCircuit,
  Activity,
  ShieldAlert,
} from "lucide-react";

import { getAsset } from "../../services/assetService";

function getRiskStatus(score) {
  if (score >= 70) return "High";
  if (score >= 40) return "Medium";
  return "Low";
}

function getRiskClasses(status) {
  if (status === "High") {
    return {
      text: "text-red-400",
      bg: "bg-red-400",
      glow: "shadow-[0_0_35px_rgba(248,113,113,0.45)]",
    };
  }

  if (status === "Medium") {
    return {
      text: "text-amber-400",
      bg: "bg-amber-400",
      glow: "shadow-[0_0_35px_rgba(251,191,36,0.45)]",
    };
  }

  return {
    text: "text-emerald-400",
    bg: "bg-emerald-400",
    glow: "shadow-[0_0_35px_rgba(52,211,153,0.45)]",
  };
}

function Hero() {
  const [asset, setAsset] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadHeroAsset() {
      try {
        setLoading(true);
        setError("");

        const data = await getAsset("SG-042");

        if (!data || data.detail) {
          throw new Error(
            data?.detail || "Unable to load live risk signal."
          );
        }

        setAsset(data);
      } catch (err) {
        console.error(err);
        setError("Live signal unavailable");
      } finally {
        setLoading(false);
      }
    }

    loadHeroAsset();
  }, []);

  const ruleRisk = Number(
    asset?.calculated_risk ?? asset?.risk ?? 0
  );

  const mlRisk = Number(
    asset?.ml_risk ?? ruleRisk
  );

  const riskStatus = getRiskStatus(ruleRisk);
  const riskClasses = getRiskClasses(riskStatus);

  const riskDelta = Number(
    (mlRisk - ruleRisk).toFixed(1)
  );

  return (
    <section
      id="overview"
      className="relative min-h-[calc(100vh-72px)] overflow-hidden"
    >
      {/* ================================================== */}
      {/* BACKGROUND */}
      {/* ================================================== */}

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[48%] top-[18%] h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-emerald-400/[0.025] blur-[120px]" />

        <div className="absolute right-[-10%] top-[10%] h-[500px] w-[500px] rounded-full bg-violet-400/[0.02] blur-[140px]" />
      </div>

      <div className="relative mx-auto grid min-h-[calc(100vh-72px)] max-w-[1500px] items-center gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[1fr_0.9fr] lg:px-10 lg:py-20">

        {/* ================================================== */}
        {/* LEFT CONTENT */}
        {/* ================================================== */}

        <div className="max-w-3xl">

          {/* Eyebrow */}

          <motion.div
            initial={{
              opacity: 0,
              y: 12,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.6,
            }}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.02] px-3 py-1.5"
          >
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />

            <span className="text-[10px] uppercase tracking-[0.2em] text-white/40">
              Infrastructure intelligence
            </span>
          </motion.div>

          {/* Heading */}

          <motion.h1
            initial={{
              opacity: 0,
              y: 25,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.8,
              delay: 0.08,
            }}
            className="mt-8 text-[clamp(4rem,9vw,8.5rem)] font-semibold leading-[0.88] tracking-[-0.07em]"
          >
            Detect the
            <br />
            warning
            <br />
            <span className="text-white/25">
              before failure.
            </span>
          </motion.h1>

          {/* Description */}

          <motion.p
            initial={{
              opacity: 0,
              y: 18,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.7,
              delay: 0.2,
            }}
            className="mt-8 max-w-2xl text-base leading-7 text-white/40 sm:text-lg"
          >
            Signal combines complaints, maintenance records,
            inspections and emerging risk patterns to identify
            infrastructure that needs attention before a small
            warning becomes a major failure.
          </motion.p>

          {/* Actions */}

          <motion.div
            initial={{
              opacity: 0,
              y: 18,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.7,
              delay: 0.3,
            }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <Link
              to="/dashboard"
              className="group inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-black transition hover:scale-[1.03]"
            >
              View risk intelligence

              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>

            <a
              href="#how-it-works"
              className="rounded-full border border-white/10 px-5 py-3 text-sm text-white/60 transition hover:border-white/20 hover:text-white"
            >
              See how it works
            </a>
          </motion.div>

          {/* Metrics */}

          <motion.div
            initial={{
              opacity: 0,
              y: 18,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.7,
              delay: 0.4,
            }}
            className="mt-12 grid max-w-2xl grid-cols-3 divide-x divide-white/10 border-y border-white/5 py-5"
          >
            <div className="pr-5">
              <p className="text-2xl font-semibold tracking-tight sm:text-3xl">
                24/7
              </p>

              <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-white/25">
                Risk monitoring
              </p>
            </div>

            <div className="px-5">
              <p className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Rule
              </p>

              <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-white/25">
                Explainable engine
              </p>
            </div>

            <div className="pl-5">
              <p className="text-2xl font-semibold tracking-tight sm:text-3xl">
                ML
              </p>

              <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-white/25">
                Risk intelligence
              </p>
            </div>
          </motion.div>
        </div>

        {/* ================================================== */}
        {/* LIVE RISK VISUAL */}
        {/* ================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            x: 35,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            duration: 0.9,
            delay: 0.2,
          }}
          className="relative"
        >
          <div className="relative aspect-square overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.018] shadow-2xl">

            {/* radar background */}

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="absolute h-[82%] w-[82%] rounded-full border border-white/[0.08]" />

              <div className="absolute h-[62%] w-[62%] rounded-full border border-white/[0.08]" />

              <div className="absolute h-[42%] w-[42%] rounded-full border border-white/[0.08]" />

              <div className="absolute h-[22%] w-[22%] rounded-full border border-white/[0.08]" />
            </div>

            {/* radar lines */}

            <div className="absolute left-1/2 top-[8%] h-[84%] w-px -translate-x-1/2 bg-white/[0.06]" />

            <div className="absolute left-[8%] top-1/2 h-px w-[84%] -translate-y-1/2 bg-white/[0.06]" />

            <div className="absolute left-[17%] top-[18%] h-px w-[66%] rotate-[35deg] bg-white/[0.06]" />

            <div className="absolute left-[17%] top-[18%] h-px w-[66%] rotate-[-35deg] bg-white/[0.06]" />

            {/* outer rotating ring */}

            <motion.div
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 18,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute inset-[11%] rounded-full border border-white/[0.05]"
            />

            {/* nodes */}

            <div className="absolute left-[23%] top-[29%] h-2 w-2 rounded-full bg-white/25" />

            <div className="absolute right-[23%] top-[26%] h-2 w-2 rounded-full bg-white/25" />

            <div className="absolute right-[18%] top-[48%] h-2 w-2 rounded-full bg-white/25" />

            <div className="absolute left-[31%] bottom-[24%] h-2 w-2 rounded-full bg-white/25" />

            <div className="absolute right-[30%] bottom-[27%] h-2 w-2 rounded-full bg-white/25" />

            {/* signal node */}

            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <motion.div
                animate={{
                  scale: [1, 1.18, 1],
                  opacity: [0.25, 0.5, 0.25],
                }}
                transition={{
                  duration: 2.2,
                  repeat: Infinity,
                }}
                className={`absolute -inset-5 rounded-full ${riskClasses.bg}`}
              />

              <div
                className={`relative flex h-4 w-4 items-center justify-center rounded-full ${riskClasses.bg} ${riskClasses.glow}`}
              />
            </div>

            {/* connection paths */}

            <svg
              viewBox="0 0 600 600"
              className="absolute inset-0 h-full w-full"
              fill="none"
            >
              <path
                d="M138 180 L300 300 L470 150"
                stroke="rgba(255,255,255,0.12)"
                strokeWidth="1"
              />

              <path
                d="M300 300 L190 430"
                stroke="rgba(255,255,255,0.12)"
                strokeWidth="1"
              />

              <path
                d="M300 300 L448 406"
                stroke="rgba(255,255,255,0.12)"
                strokeWidth="1"
              />

              <path
                d="M300 300 L520 286"
                stroke="rgba(255,255,255,0.12)"
                strokeWidth="1"
              />
            </svg>

            {/* loading */}

            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[2px]">
                <div className="text-center">
                  <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-white/10 border-t-white" />

                  <p className="mt-3 text-[10px] uppercase tracking-[0.16em] text-white/25">
                    Loading live signal
                  </p>
                </div>
              </div>
            )}

            {/* live signal card */}

            <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/10 bg-black/65 p-5 shadow-2xl backdrop-blur-xl sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-white/30">
                    Live risk signal
                  </p>

                  <p className="mt-2 text-sm text-white/45">
                    {asset
                      ? `${asset.name} · ${asset.id}`
                      : "Infrastructure asset"}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />

                  <span className="text-[9px] uppercase tracking-[0.16em] text-emerald-400">
                    Active
                  </span>
                </div>
              </div>

              <div className="mt-6 flex items-end justify-between gap-5">
                <div>
                  <p
                    className={`text-5xl font-semibold tracking-[-0.05em] ${
                      loading
                        ? "text-white/20"
                        : riskClasses.text
                    }`}
                  >
                    {loading
                      ? "—"
                      : `${ruleRisk.toFixed(1)}%`}
                  </p>

                  <p className="mt-1 text-xs text-white/30">
                    Calculated infrastructure risk
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-[10px] uppercase tracking-[0.14em] text-white/25">
                    Priority
                  </p>

                  <p
                    className={`mt-1 text-sm font-medium ${
                      loading
                        ? "text-white/20"
                        : riskClasses.text
                    }`}
                  >
                    {loading
                      ? "—"
                      : riskStatus}
                  </p>
                </div>
              </div>

              {/* risk bar */}

              <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  initial={{
                    width: 0,
                  }}
                  animate={{
                    width: `${Math.min(
                      ruleRisk,
                      100
                    )}%`,
                  }}
                  transition={{
                    duration: 1,
                    delay: 0.4,
                  }}
                  className={`h-full rounded-full ${
                    loading
                      ? "bg-white/10"
                      : riskClasses.bg
                  }`}
                />
              </div>

              {/* ML row */}

              <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-4">
                <div className="flex items-center gap-2">
                  <BrainCircuit className="h-3.5 w-3.5 text-violet-400" />

                  <span className="text-[10px] uppercase tracking-[0.14em] text-white/25">
                    ML prediction
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-violet-300">
                    {loading
                      ? "—"
                      : `${mlRisk.toFixed(1)}%`}
                  </span>

                  {!loading && (
                    <span className="text-[10px] text-white/20">
                      {riskDelta > 0
                        ? `+${riskDelta}`
                        : riskDelta}
                      %
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* bottom icon */}

            <div className="absolute left-5 top-5 flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-black/30 backdrop-blur-xl">
              {loading ? (
                <Activity className="h-4 w-4 text-emerald-400" />
              ) : (
                <ShieldAlert
                  className={`h-4 w-4 ${riskClasses.text}`}
                />
              )}
            </div>
          </div>

          {error && (
            <p className="mt-3 text-right text-[10px] text-red-400/70">
              {error}
            </p>
          )}
        </motion.div>
      </div>
    </section>
  );
}

export default Hero;