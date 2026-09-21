import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  ArrowUpRight,
  Building2,
  Clock3,
  MapPin,
  ShieldCheck,
  Activity,
  Search,
  SlidersHorizontal,
  BrainCircuit,
  BellRing,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  ChevronDown,
} from "lucide-react";

import {
  getAssets,
  getInspectionTasks,
  updateInspectionTaskStatus,
  getAlerts,
  resolveAlert,
} from "../services/assetService";

const statusClasses = {
  High: "text-red-400 bg-red-400/10 border-red-400/15",
  Medium: "text-amber-400 bg-amber-400/10 border-amber-400/15",
  Low: "text-emerald-400 bg-emerald-400/10 border-emerald-400/15",
};

const filterOptions = ["All", "High", "Medium", "Low"];

function getRiskScore(asset) {
  return Number(
    asset.calculatedRisk ??
      asset.calculated_risk ??
      asset.risk ??
      0
  );
}

function getRiskStatus(score) {
  if (score >= 70) return "High";
  if (score >= 40) return "Medium";
  return "Low";
}

function Dashboard() {
  const [assets, setAssets] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [tasks, setTasks] = useState([]);

  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState("All");
  const [filterOpen, setFilterOpen] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [resolvingAlertId, setResolvingAlertId] =
    useState(null);

  const [updatingTaskId, setUpdatingTaskId] =
    useState(null);

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        setError("");

        const [
          assetResponse,
          taskResponse,
          alertResponse,
        ] = await Promise.all([
          getAssets(),
          getInspectionTasks(),
          getAlerts(false),
        ]);

        const enrichedAssets = (
          assetResponse?.assets ?? []
        ).map((asset) => ({
          ...asset,
          calculatedRisk:
            asset.calculated_risk ?? asset.risk ?? 0,
        }));

        setAssets(enrichedAssets);
        setTasks(taskResponse?.tasks ?? []);
        setAlerts(alertResponse?.alerts ?? []);
      } catch (err) {
        console.error(err);
        setError(
          "Unable to load infrastructure dashboard."
        );
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  const filteredAssets = useMemo(() => {
    const query = search.toLowerCase().trim();

    const sortedAssets = [...assets]
      .sort(
        (a, b) =>
          getRiskScore(b) - getRiskScore(a)
      )
      .filter((asset) => {
        if (riskFilter === "All") {
          return true;
        }

        return (
          getRiskStatus(getRiskScore(asset)) ===
          riskFilter
        );
      });

    if (!query) {
      return sortedAssets;
    }

    return sortedAssets.filter((asset) =>
      `${asset.name} ${asset.id} ${asset.type} ${asset.location}`
        .toLowerCase()
        .includes(query)
    );
  }, [assets, search, riskFilter]);

  const highRiskCount = assets.filter(
    (asset) =>
      getRiskStatus(getRiskScore(asset)) === "High"
  ).length;

  const mediumRiskCount = assets.filter(
    (asset) =>
      getRiskStatus(getRiskScore(asset)) === "Medium"
  ).length;

  const lowRiskCount = assets.filter(
    (asset) =>
      getRiskStatus(getRiskScore(asset)) === "Low"
  ).length;

  const activeSignals = assets.filter(
    (asset) => getRiskScore(asset) >= 50
  ).length;

  const mlAnalyzedCount = assets.filter(
    (asset) =>
      asset.ml_risk !== undefined &&
      asset.ml_risk !== null
  ).length;

  const averageRisk =
    assets.length > 0
      ? (
          assets.reduce(
            (sum, asset) =>
              sum + getRiskScore(asset),
            0
          ) / assets.length
        ).toFixed(1)
      : "0.0";

  const networkHealth = Math.max(
    0,
    100 - Number(averageRisk)
  );

  async function handleResolveAlert(alertId) {
    try {
      setResolvingAlertId(alertId);

      await resolveAlert(alertId);

      setAlerts((current) =>
        current.filter(
          (alert) => alert.id !== alertId
        )
      );
    } catch (err) {
      console.error(err);
      setError("Unable to resolve the alert.");
    } finally {
      setResolvingAlertId(null);
    }
  }

  async function handleTaskStatusChange(
    taskId,
    status
  ) {
    try {
      setUpdatingTaskId(taskId);

      const updated =
        await updateInspectionTaskStatus(
          taskId,
          status
        );

      const updatedTask =
        updated?.task ?? updated;

      setTasks((current) =>
        current.map((task) =>
          task.id === taskId
            ? {
                ...task,
                ...updatedTask,
                status,
              }
            : task
        )
      );
    } catch (err) {
      console.error(err);
      setError(
        "Unable to update inspection task status."
      );
    } finally {
      setUpdatingTaskId(null);
    }
  }

  function handleExportReport() {
    const previousTitle = document.title;

    document.title = "Signal-Network-Report";

    window.print();

    setTimeout(() => {
      document.title = previousTitle;
    }, 1000);
  }

  return (
    <>
      <style>{`
        @media print {
          @page {
            size: A4;
            margin: 12mm;
          }

          html,
          body {
            background: #ffffff !important;
            color: #111111 !important;
          }

          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          .print-root {
            background: #ffffff !important;
            color: #111111 !important;
          }

          .print-card {
            background: #ffffff !important;
            color: #111111 !important;
            border-color: #d9d9d9 !important;
            box-shadow: none !important;
          }

          .print-muted {
            color: #555555 !important;
          }

          .print-hide {
            display: none !important;
          }

          .print-section {
            break-inside: avoid;
            page-break-inside: avoid;
          }

          table {
            color: #111111 !important;
          }

          th,
          td {
            color: #333333 !important;
            border-color: #dddddd !important;
          }
        }
      `}</style>

      <main className="print-root min-h-screen bg-[#0a0a0a] px-5 py-5 text-white sm:px-8 lg:px-10">
        <div className="mx-auto max-w-[1600px]">

          {/* ================================================== */}
          {/* TOP NAV */}
          {/* ================================================== */}

          <header className="print-hide flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.02] px-5 py-4 backdrop-blur-xl">
            <div>
              <Link
                to="/"
                className="text-lg font-semibold tracking-tight"
              >
                signal
                <span className="text-white/30">.</span>
              </Link>

              <p className="mt-0.5 text-[11px] uppercase tracking-[0.18em] text-white/25">
                Intelligence dashboard
              </p>
            </div>

            <div className="hidden items-center gap-3 sm:flex">
              <div className="flex items-center gap-2 rounded-full border border-emerald-400/15 bg-emerald-400/[0.05] px-3 py-1.5">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />

                <span className="text-[10px] uppercase tracking-[0.14em] text-emerald-400">
                  System active
                </span>
              </div>

              <button
                type="button"
                onClick={handleExportReport}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs text-white/55 transition hover:border-white/20 hover:text-white"
              >
                <FileText className="h-3.5 w-3.5" />
                Export report
              </button>
            </div>
          </header>

          {/* ================================================== */}
          {/* PAGE HEADING */}
          {/* ================================================== */}

          <section className="mt-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-white/30 print-muted">
                  Overview
                </p>

                <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] sm:text-6xl">
                  Infrastructure command center.
                </h1>

                <p className="mt-4 max-w-2xl text-sm leading-6 text-white/40 print-muted sm:text-base">
                  Monitor infrastructure health, investigate
                  emerging signals and prioritize assets that
                  need attention.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs text-white/30 print-muted">
                <Clock3 className="h-4 w-4" />
                Live backend data
              </div>
            </div>
          </section>

          {/* ERROR */}

          {error && (
            <div className="print-hide mt-6 rounded-2xl border border-red-400/15 bg-red-400/[0.05] px-5 py-4 text-sm text-red-300">
              {error}
            </div>
          )}

          {/* ================================================== */}
          {/* KPI CARDS */}
          {/* ================================================== */}

          <section className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-5">

            {/* Assets */}

            <motion.div
              whileHover={{ y: -3 }}
              className="print-card rounded-3xl border border-white/10 bg-white/[0.02] p-6 print-section"
            >
              <div className="flex items-center justify-between">
                <Building2 className="h-5 w-5 text-white/35" />

                <span className="text-xs text-emerald-400">
                  Live
                </span>
              </div>

              <p className="mt-8 text-4xl font-semibold tracking-tight">
                {loading ? "—" : assets.length}
              </p>

              <p className="mt-2 text-[10px] uppercase tracking-[0.14em] text-white/25 print-muted">
                Assets monitored
              </p>
            </motion.div>

            {/* Active signals */}

            <motion.div
              whileHover={{ y: -3 }}
              className="print-card rounded-3xl border border-white/10 bg-white/[0.02] p-6 print-section"
            >
              <div className="flex items-center justify-between">
                <AlertTriangle className="h-5 w-5 text-amber-400/60" />

                <span className="text-xs text-amber-400">
                  Risk ≥ 50%
                </span>
              </div>

              <p className="mt-8 text-4xl font-semibold tracking-tight">
                {loading ? "—" : activeSignals}
              </p>

              <p className="mt-2 text-[10px] uppercase tracking-[0.14em] text-white/25 print-muted">
                Active signals
              </p>
            </motion.div>

            {/* High risk */}

            <motion.div
              whileHover={{ y: -3 }}
              className="print-card rounded-3xl border border-white/10 bg-white/[0.02] p-6 print-section"
            >
              <div className="flex items-center justify-between">
                <ShieldCheck className="h-5 w-5 text-red-400/70" />

                <span className="text-xs text-red-400">
                  Needs review
                </span>
              </div>

              <p className="mt-8 text-4xl font-semibold tracking-tight">
                {loading ? "—" : highRiskCount}
              </p>

              <p className="mt-2 text-[10px] uppercase tracking-[0.14em] text-white/25 print-muted">
                High-risk assets
              </p>
            </motion.div>

            {/* Network health */}

            <motion.div
              whileHover={{ y: -3 }}
              className="print-card rounded-3xl border border-white/10 bg-white/[0.02] p-6 print-section"
            >
              <div className="flex items-center justify-between">
                <Activity className="h-5 w-5 text-emerald-400/70" />

                <span className="text-xs text-emerald-400">
                  Calculated
                </span>
              </div>

              <p className="mt-8 text-4xl font-semibold tracking-tight">
                {loading
                  ? "—"
                  : `${networkHealth.toFixed(1)}%`}
              </p>

              <p className="mt-2 text-[10px] uppercase tracking-[0.14em] text-white/25 print-muted">
                Network health
              </p>
            </motion.div>

            {/* ML */}

            <motion.div
              whileHover={{ y: -3 }}
              className="print-card rounded-3xl border border-white/10 bg-white/[0.02] p-6 print-section"
            >
              <div className="flex items-center justify-between">
                <BrainCircuit className="h-5 w-5 text-violet-400/70" />

                <span className="text-xs text-violet-300">
                  ML live
                </span>
              </div>

              <p className="mt-8 text-4xl font-semibold tracking-tight">
                {loading
                  ? "—"
                  : `${mlAnalyzedCount}/${assets.length}`}
              </p>

              <p className="mt-2 text-[10px] uppercase tracking-[0.14em] text-white/25 print-muted">
                ML analyzed
              </p>
            </motion.div>
          </section>

          {/* ================================================== */}
          {/* MAP + PRIORITY */}
          {/* ================================================== */}

          <section className="mt-5 grid gap-5 xl:grid-cols-[1.35fr_0.65fr]">

            {/* MAP */}

            <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.02] print-card print-section">
              <div className="flex items-center justify-between border-b border-white/5 px-6 py-5">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-white/25 print-muted">
                    Spatial overview
                  </p>

                  <h2 className="mt-1 text-xl font-medium">
                    Risk distribution
                  </h2>
                </div>

                <button
                  type="button"
                  className="print-hide rounded-full border border-white/10 p-2 text-white/35 transition hover:border-white/20 hover:text-white"
                >
                  <ArrowUpRight className="h-4 w-4" />
                </button>
              </div>

              <div className="relative min-h-[520px] overflow-hidden">

                <div
                  className="absolute inset-0 opacity-30"
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
                    backgroundSize: "56px 56px",
                  }}
                />

                <div className="absolute left-[10%] top-[22%] h-px w-[75%] rotate-[16deg] bg-white/[0.06]" />

                <div className="absolute left-[18%] top-[58%] h-px w-[70%] rotate-[-11deg] bg-white/[0.06]" />

                <div className="absolute left-[48%] top-[8%] h-[84%] w-px rotate-[8deg] bg-white/[0.06]" />

                <div className="absolute left-[11%] top-[18%] h-32 w-44 rotate-[-8deg] rounded-[40%] border border-white/[0.08] bg-white/[0.015]" />

                <div className="absolute left-[37%] top-[34%] h-40 w-48 rotate-[6deg] rounded-[40%] border border-white/[0.08] bg-white/[0.015]" />

                <div className="absolute right-[8%] top-[19%] h-28 w-40 rotate-[-8deg] rounded-[40%] border border-white/[0.08] bg-white/[0.015]" />

                <div className="absolute right-[15%] bottom-[15%] h-36 w-52 rotate-[10deg] rounded-[40%] border border-white/[0.08] bg-white/[0.015]" />

                {!loading &&
                  assets.map((asset, index) => {
                    const positions = [
                      {
                        left: "27%",
                        top: "34%",
                      },
                      {
                        left: "53%",
                        top: "45%",
                      },
                      {
                        left: "71%",
                        top: "30%",
                      },
                      {
                        left: "38%",
                        top: "70%",
                      },
                    ];

                    const position =
                      positions[
                        index % positions.length
                      ];

                    const riskScore =
                      getRiskScore(asset);

                    const riskStatus =
                      getRiskStatus(riskScore);

                    return (
                      <Link
                        key={asset.id}
                        to={`/asset/${asset.id}`}
                        className="absolute"
                        style={position}
                        title={asset.name}
                      >
                        <span
                          className={`relative block h-3 w-3 rounded-full ${
                            riskStatus === "High"
                              ? "bg-red-400 shadow-[0_0_25px_rgba(248,113,113,0.8)]"
                              : riskStatus === "Medium"
                              ? "bg-amber-400 shadow-[0_0_22px_rgba(251,191,36,0.7)]"
                              : "bg-emerald-400 shadow-[0_0_18px_rgba(52,211,153,0.6)]"
                          }`}
                        />
                      </Link>
                    );
                  })}

                {assets.length > 0 && (
                  <Link
                    to={`/asset/${assets[0].id}`}
                    className="absolute left-[27%] top-[34%] ml-5 mt-4 w-48 rounded-2xl border border-white/10 bg-black/65 p-4 shadow-2xl backdrop-blur-xl transition hover:border-white/20 print-card"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase tracking-[0.15em] text-white/25 print-muted">
                        Selected asset
                      </span>

                      <span className="text-[10px] text-amber-400">
                        {getRiskStatus(
                          getRiskScore(
                            assets[0]
                          )
                        )}
                      </span>
                    </div>

                    <p className="mt-3 text-sm font-medium">
                      {assets[0].name}
                    </p>

                    <p className="mt-1 text-xs text-white/30 print-muted">
                      {assets[0].id}
                    </p>

                    <p className="mt-4 text-3xl font-semibold tracking-tight">
                      {getRiskScore(
                        assets[0]
                      )}
                      %
                    </p>

                    <p className="mt-1 text-[10px] text-white/25 print-muted">
                      Failure risk
                    </p>
                  </Link>
                )}

                <div className="absolute bottom-5 left-5 flex items-center gap-4 rounded-full border border-white/10 bg-black/50 px-4 py-2.5 backdrop-blur-xl print-card">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-red-400" />

                    <span className="text-[10px] uppercase tracking-[0.12em] text-white/35 print-muted">
                      High
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-amber-400" />

                    <span className="text-[10px] uppercase tracking-[0.12em] text-white/35 print-muted">
                      Medium
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />

                    <span className="text-[10px] uppercase tracking-[0.12em] text-white/35 print-muted">
                      Low
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* PRIORITY QUEUE */}

            <div className="rounded-[2rem] border border-white/10 bg-white/[0.02] print-card print-section">
              <div className="flex items-center justify-between border-b border-white/5 px-6 py-5">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-white/25 print-muted">
                    Priority queue
                  </p>

                  <h2 className="mt-1 text-xl font-medium">
                    Assets at risk
                  </h2>
                </div>

                {/* REAL FILTER */}

                <div className="relative print-hide">
                  <button
                    type="button"
                    onClick={() =>
                      setFilterOpen(
                        (current) => !current
                      )
                    }
                    className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs transition ${
                      riskFilter !== "All"
                        ? "border-white/20 bg-white/[0.05] text-white"
                        : "border-white/10 text-white/40 hover:border-white/20 hover:text-white"
                    }`}
                  >
                    <SlidersHorizontal className="h-3.5 w-3.5" />

                    {riskFilter}

                    <ChevronDown
                      className={`h-3.5 w-3.5 transition-transform ${
                        filterOpen
                          ? "rotate-180"
                          : ""
                      }`}
                    />
                  </button>

                  {filterOpen && (
                    <div className="absolute right-0 top-11 z-30 w-36 overflow-hidden rounded-2xl border border-white/10 bg-[#101010] p-1.5 shadow-2xl">
                      {filterOptions.map(
                        (option) => {
                          const active =
                            riskFilter ===
                            option;

                          return (
                            <button
                              key={option}
                              type="button"
                              onClick={() => {
                                setRiskFilter(
                                  option
                                );
                                setFilterOpen(
                                  false
                                );
                              }}
                              className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-xs transition ${
                                active
                                  ? "bg-white text-black"
                                  : "text-white/45 hover:bg-white/[0.05] hover:text-white"
                              }`}
                            >
                              <span>
                                {option}
                              </span>

                              {option ===
                                "High" && (
                                <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                              )}

                              {option ===
                                "Medium" && (
                                <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                              )}

                              {option ===
                                "Low" && (
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                              )}
                            </button>
                          );
                        }
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* SEARCH */}

              <div className="border-b border-white/5 px-6 py-4 print-hide">
                <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-black/20 px-3 py-2.5">
                  <Search className="h-4 w-4 text-white/20" />

                  <input
                    type="text"
                    value={search}
                    onChange={(event) =>
                      setSearch(
                        event.target.value
                      )
                    }
                    placeholder="Search assets..."
                    className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/20"
                  />
                </div>

                {(search ||
                  riskFilter !== "All") && (
                  <div className="mt-3 flex items-center justify-between">
                    <p className="text-[10px] uppercase tracking-[0.12em] text-white/20">
                      {filteredAssets.length} result
                      {filteredAssets.length !== 1
                        ? "s"
                        : ""}
                    </p>

                    <button
                      type="button"
                      onClick={() => {
                        setSearch("");
                        setRiskFilter("All");
                      }}
                      className="text-[10px] text-white/30 transition hover:text-white"
                    >
                      Clear filters
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-2 p-4">
                {loading ? (
                  <div className="rounded-2xl border border-white/5 bg-black/15 p-5 text-sm text-white/30">
                    Loading infrastructure data...
                  </div>
                ) : filteredAssets.length === 0 ? (
                  <div className="rounded-2xl border border-white/5 bg-black/15 p-6 text-center">
                    <Search className="mx-auto h-5 w-5 text-white/15" />

                    <p className="mt-3 text-sm text-white/35">
                      No matching assets.
                    </p>

                    <p className="mt-1 text-xs text-white/20">
                      Try another search or risk filter.
                    </p>
                  </div>
                ) : (
                  filteredAssets.map(
                    (asset) => {
                      const riskScore =
                        getRiskScore(
                          asset
                        );

                      const riskStatus =
                        getRiskStatus(
                          riskScore
                        );

                      return (
                        <Link
                          key={asset.id}
                          to={`/asset/${asset.id}`}
                          className="block w-full rounded-2xl border border-white/5 bg-black/15 p-4 text-left transition duration-300 hover:translate-x-1 hover:border-white/10 hover:bg-white/[0.025] print-card"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-sm font-medium">
                                {asset.name}
                              </p>

                              <p className="mt-1 text-xs text-white/30 print-muted">
                                {asset.type} ·{" "}
                                {asset.location}
                              </p>
                            </div>

                            <span
                              className={`rounded-full border px-2 py-1 text-[9px] uppercase tracking-[0.12em] ${statusClasses[riskStatus]}`}
                            >
                              {riskStatus}
                            </span>
                          </div>

                          <div className="mt-4 flex items-center justify-between">
                            <span className="text-2xl font-semibold tracking-tight">
                              {riskScore}%
                            </span>

                            <span className="text-[10px] text-white/20 print-muted">
                              Updated{" "}
                              {asset.updated}
                            </span>
                          </div>

                          <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/5">
                            <div
                              className={`h-full rounded-full ${
                                riskStatus ===
                                "High"
                                  ? "bg-red-400"
                                  : riskStatus ===
                                    "Medium"
                                  ? "bg-amber-400"
                                  : "bg-emerald-400"
                              }`}
                              style={{
                                width: `${Math.min(
                                  riskScore,
                                  100
                                )}%`,
                              }}
                            />
                          </div>
                        </Link>
                      );
                    }
                  )
                )}
              </div>
            </div>
          </section>

          {/* ================================================== */}
          {/* ACTIVE ALERTS */}
          {/* ================================================== */}

          <section className="mt-5 rounded-[2rem] border border-white/10 bg-white/[0.02] print-card print-section">
            <div className="flex items-center justify-between border-b border-white/5 px-6 py-5">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-white/25 print-muted">
                  Monitoring
                </p>

                <h2 className="mt-1 text-xl font-medium">
                  Active alerts
                </h2>

                <p className="mt-2 text-sm text-white/30 print-muted">
                  Risk events requiring attention.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <BellRing className="h-4 w-4 text-red-400/70" />

                <span className="text-[10px] uppercase tracking-[0.14em] text-white/30 print-muted">
                  {alerts.length} active
                </span>
              </div>
            </div>

            <div className="p-4">
              {alerts.length === 0 ? (
                <div className="flex items-center gap-4 rounded-2xl border border-emerald-400/10 bg-emerald-400/[0.025] p-5">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />

                  <div>
                    <p className="text-sm font-medium">
                      No active alerts
                    </p>

                    <p className="mt-1 text-xs text-white/30 print-muted">
                      The monitoring layer has no unresolved
                      risk events.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  {alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="flex flex-col gap-4 rounded-2xl border border-red-400/10 bg-red-400/[0.025] p-5 lg:flex-row lg:items-center lg:justify-between print-card print-section"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-red-400/10 bg-red-400/[0.04]">
                          <AlertTriangle className="h-4 w-4 text-red-400" />
                        </div>

                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[10px] uppercase tracking-[0.14em] text-white/25 print-muted">
                              {alert.asset_id}
                            </span>

                            <span className="text-[10px] uppercase tracking-[0.14em] text-red-400">
                              {alert.severity}
                            </span>

                            <span className="text-[10px] uppercase tracking-[0.14em] text-white/25 print-muted">
                              {alert.alert_type}
                            </span>
                          </div>

                          <p className="mt-2 text-sm font-medium">
                            {alert.message}
                          </p>

                          <p className="mt-2 text-xs text-white/30 print-muted">
                            Previous{" "}
                            {alert.previous_risk}%
                            {" · "}
                            Current{" "}
                            {alert.current_risk}%
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          handleResolveAlert(
                            alert.id
                          )
                        }
                        disabled={
                          resolvingAlertId ===
                          alert.id
                        }
                        className="print-hide shrink-0 rounded-full border border-white/10 px-4 py-2 text-xs text-white/55 transition hover:border-white/20 hover:text-white disabled:opacity-50"
                      >
                        {resolvingAlertId ===
                        alert.id
                          ? "Resolving..."
                          : "Resolve"}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* ================================================== */}
          {/* INSPECTION TASKS */}
          {/* ================================================== */}

          <section className="mt-5 rounded-[2rem] border border-white/10 bg-white/[0.02] print-card print-section">
            <div className="flex items-center justify-between border-b border-white/5 px-6 py-5">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-white/25 print-muted">
                  Action queue
                </p>

                <h2 className="mt-1 text-xl font-medium">
                  Inspection tasks
                </h2>

                <p className="mt-2 text-sm text-white/30 print-muted">
                  Recommended actions generated from infrastructure
                  risk signals.
                </p>
              </div>

              <ClipboardCheck className="h-5 w-5 text-white/30" />
            </div>

            <div className="space-y-3 p-4">
              {tasks.length === 0 ? (
                <div className="rounded-2xl border border-white/5 bg-black/20 p-5 text-sm text-white/30">
                  No inspection tasks have been created.
                </div>
              ) : (
                tasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex flex-col gap-4 rounded-2xl border border-white/5 bg-black/20 p-5 lg:flex-row lg:items-center lg:justify-between print-card print-section"
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] uppercase tracking-[0.14em] text-white/25 print-muted">
                          Task #{task.id}
                        </span>

                        <span
                          className={`text-[10px] uppercase tracking-[0.14em] ${
                            task.priority ===
                            "High"
                              ? "text-red-400"
                              : task.priority ===
                                "Medium"
                              ? "text-amber-400"
                              : "text-emerald-400"
                          }`}
                        >
                          {task.priority}
                        </span>

                        <span className="text-[10px] uppercase tracking-[0.14em] text-white/25 print-muted">
                          {task.asset_id}
                        </span>
                      </div>

                      <p className="mt-2 text-sm font-medium">
                        {task.title}
                      </p>

                      <p className="mt-2 text-xs leading-5 text-white/30 print-muted">
                        {task.reason}
                      </p>

                      {task.created_at && (
                        <p className="mt-3 text-[10px] text-white/20 print-muted">
                          Created{" "}
                          {new Date(
                            task.created_at
                          ).toLocaleDateString(
                            "en-IN",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }
                          )}
                        </p>
                      )}
                    </div>

                    <select
                      value={task.status}
                      onChange={(event) =>
                        handleTaskStatusChange(
                          task.id,
                          event.target.value
                        )
                      }
                      disabled={
                        updatingTaskId ===
                        task.id
                      }
                      className="print-hide rounded-full border border-white/10 bg-black/30 px-4 py-2 text-xs text-white outline-none transition hover:border-white/20 disabled:opacity-50"
                    >
                      <option value="Open">
                        Open
                      </option>

                      <option value="In Progress">
                        In Progress
                      </option>

                      <option value="Completed">
                        Completed
                      </option>
                    </select>

                    <div className="hidden print:block text-xs text-black">
                      Status: {task.status}
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* ================================================== */}
          {/* ASSET SUMMARY */}
          {/* ================================================== */}

          <section className="mt-5 rounded-[2rem] border border-white/10 bg-white/[0.02] p-6 sm:p-8 print-card print-section">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-white/25 print-muted">
                Network analysis
              </p>

              <h2 className="mt-1 text-2xl font-medium">
                Asset risk summary
              </h2>
            </div>

            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[850px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-white/5 text-[10px] uppercase tracking-[0.14em] text-white/20">
                    <th className="pb-4 pr-6">
                      Asset
                    </th>

                    <th className="pb-4 pr-6">
                      Type
                    </th>

                    <th className="pb-4 pr-6">
                      Rule Risk
                    </th>

                    <th className="pb-4 pr-6">
                      ML Risk
                    </th>

                    <th className="pb-4 pr-6">
                      Status
                    </th>

                    <th className="pb-4">
                      Updated
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredAssets.map((asset) => {
                    const ruleRisk =
                      getRiskScore(asset);

                    const mlRisk = Number(
                      asset.ml_risk ??
                        ruleRisk
                    );

                    const status =
                      getRiskStatus(ruleRisk);

                    return (
                      <tr
                        key={asset.id}
                        className="border-b border-white/5 last:border-0"
                      >
                        <td className="py-4 pr-6 text-sm font-medium">
                          {asset.name}

                          <span className="ml-2 text-[10px] text-white/25 print-muted">
                            {asset.id}
                          </span>
                        </td>

                        <td className="py-4 pr-6 text-sm text-white/35 print-muted">
                          {asset.type}
                        </td>

                        <td className="py-4 pr-6 text-sm">
                          {ruleRisk.toFixed(1)}%
                        </td>

                        <td className="py-4 pr-6 text-sm text-violet-300">
                          {mlRisk.toFixed(1)}%
                        </td>

                        <td
                          className={`py-4 pr-6 text-xs uppercase ${
                            status === "High"
                              ? "text-red-400"
                              : status ===
                                "Medium"
                              ? "text-amber-400"
                              : "text-emerald-400"
                          }`}
                        >
                          {status}
                        </td>

                        <td className="py-4 text-sm text-white/30 print-muted">
                          {asset.updated}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          {/* ================================================== */}
          {/* FOOTER */}
          {/* ================================================== */}

          <footer className="mt-6 border-t border-white/5 py-8 text-center">
            <p className="text-[10px] uppercase tracking-[0.18em] text-white/20 print-muted">
              Signal · Infrastructure intelligence platform
            </p>

            <p className="mt-2 text-xs text-white/15 print-muted">
              Generated from live dashboard data.
            </p>
          </footer>
        </div>
      </main>
    </>
  );
}

export default Dashboard;