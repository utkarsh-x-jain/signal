import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Clock3,
  FileText,
  MapPin,
  ShieldAlert,
  Wrench,
  MessageSquareWarning,
  ClipboardCheck,
  Zap,
  BrainCircuit,
  Camera,
  Plus,
  Activity,
  TrendingUp,
  BarChart3,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";

import {
  getAsset,
  createInspectionTask,
  getRiskSnapshots,
  createRiskSnapshot,
} from "../services/assetService";

function SectionLabel({ children }) {
  return (
    <p className="text-[10px] uppercase tracking-[0.2em] text-white/25">
      {children}
    </p>
  );
}

function getRiskStatus(score) {
  if (score >= 70) return "High";
  if (score >= 40) return "Medium";
  return "Low";
}

function getRiskColor(score) {
  const status = getRiskStatus(score);

  if (status === "High") return "text-red-400";
  if (status === "Medium") return "text-amber-400";
  return "text-emerald-400";
}

function getRiskBar(score) {
  const status = getRiskStatus(score);

  if (status === "High") return "bg-red-400";
  if (status === "Medium") return "bg-amber-400";
  return "bg-emerald-400";
}

function getPriorityClasses(priority) {
  if (priority === "High") {
    return {
      text: "text-red-400",
      border: "border-red-400/10",
      bg: "bg-red-400/[0.025]",
    };
  }

  if (priority === "Medium") {
    return {
      text: "text-amber-400",
      border: "border-amber-400/10",
      bg: "bg-amber-400/[0.025]",
    };
  }

  return {
    text: "text-emerald-400",
    border: "border-emerald-400/10",
    bg: "bg-emerald-400/[0.025]",
  };
}

function formatSnapshotDate(value) {
  if (!value) return "Unknown";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown";
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  });
}

function AssetDetails() {
  const { assetId } = useParams();

  const [asset, setAsset] = useState(null);
  const [snapshots, setSnapshots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snapshotLoading, setSnapshotLoading] = useState(true);
  const [capturing, setCapturing] = useState(false);
  const [creatingTask, setCreatingTask] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setSnapshotLoading(true);
        setError("");
        setMessage("");

        const [assetData, snapshotData] = await Promise.all([
          getAsset(assetId),
          getRiskSnapshots(assetId),
        ]);

        if (!assetData || assetData.detail || assetData.error) {
          throw new Error(
            assetData?.detail ||
              assetData?.error ||
              "Asset not found"
          );
        }

        setAsset(assetData);

        const snapshotList =
          snapshotData?.snapshots ??
          (Array.isArray(snapshotData) ? snapshotData : []);

        setSnapshots(snapshotList);
      } catch (err) {
        console.error(err);
        setError(
          err.message || "Unable to load asset intelligence."
        );
      } finally {
        setLoading(false);
        setSnapshotLoading(false);
      }
    }

    loadData();
  }, [assetId]);

  const activity = useMemo(() => {
    if (!asset) return [];

    const items = [];

    asset.complaints?.forEach((item) => {
      items.push({
        type: "Complaint",
        title: item.category,
        description: item.description,
        age: item.reported_days_ago,
        icon: MessageSquareWarning,
        priority:
          item.severity >= 4
            ? "High"
            : item.severity >= 3
            ? "Medium"
            : "Low",
      });
    });

    asset.inspections?.forEach((item) => {
      items.push({
        type: "Inspection",
        title: `Condition score: ${item.condition_score}`,
        description: item.findings,
        age: item.inspection_days_ago,
        icon: ClipboardCheck,
        priority:
          item.condition_score < 50
            ? "High"
            : item.condition_score < 70
            ? "Medium"
            : "Low",
      });
    });

    asset.maintenance_events?.forEach((item) => {
      items.push({
        type: "Maintenance",
        title: item.event_type,
        description: item.description,
        age: item.maintenance_days_ago,
        icon: Wrench,
        priority: "Medium",
      });
    });

    asset.incidents?.forEach((item) => {
      items.push({
        type: "Incident",
        title: item.incident_type,
        description: item.impact,
        age: item.incident_days_ago,
        icon: Zap,
        priority: item.resolved ? "Medium" : "High",
      });
    });

    return items.sort((a, b) => a.age - b.age);
  }, [asset]);

  const riskScore = Number(
    asset?.calculated_risk ?? asset?.risk ?? 0
  );

  const mlRisk = Number(asset?.ml_risk ?? riskScore);

  const riskDelta = Number(
    (mlRisk - riskScore).toFixed(1)
  );

  const riskStatus = getRiskStatus(riskScore);
  const riskColor = getRiskColor(riskScore);
  const riskBar = getRiskBar(riskScore);

  const breakdownItems = [
    {
      label: "Complaints",
      score: Number(
        asset?.risk_breakdown?.components?.complaints ?? 0
      ),
      contribution: Number(
        asset?.risk_breakdown?.contributions?.complaints ?? 0
      ),
    },
    {
      label: "Inspections",
      score: Number(
        asset?.risk_breakdown?.components?.inspections ?? 0
      ),
      contribution: Number(
        asset?.risk_breakdown?.contributions?.inspections ?? 0
      ),
    },
    {
      label: "Maintenance",
      score: Number(
        asset?.risk_breakdown?.components?.maintenance ?? 0
      ),
      contribution: Number(
        asset?.risk_breakdown?.contributions?.maintenance ?? 0
      ),
    },
    {
      label: "Incidents",
      score: Number(
        asset?.risk_breakdown?.components?.incidents ?? 0
      ),
      contribution: Number(
        asset?.risk_breakdown?.contributions?.incidents ?? 0
      ),
    },
  ];

  const chartPoints = useMemo(() => {
    if (!snapshots.length) return [];

    const width = 1000;
    const height = 260;
    const paddingX = 30;
    const paddingY = 25;

    const values = snapshots.flatMap((item) => [
      Number(item.rule_risk ?? 0),
      Number(item.ml_risk ?? 0),
    ]);

    const minValue = Math.max(
      0,
      Math.min(...values) - 10
    );

    const maxValue = Math.min(
      100,
      Math.max(...values) + 10
    );

    const range = Math.max(
      1,
      maxValue - minValue
    );

    return snapshots.map((item, index) => {
      const x =
        snapshots.length === 1
          ? width / 2
          : paddingX +
            (index / (snapshots.length - 1)) *
              (width - paddingX * 2);

      const rule = Number(item.rule_risk ?? 0);
      const ml = Number(item.ml_risk ?? 0);

      const ruleY =
        height -
        paddingY -
        ((rule - minValue) / range) *
          (height - paddingY * 2);

      const mlY =
        height -
        paddingY -
        ((ml - minValue) / range) *
          (height - paddingY * 2);

      return {
        x,
        ruleY,
        mlY,
        rule,
        ml,
        date: formatSnapshotDate(item.captured_at),
      };
    });
  }, [snapshots]);

  const rulePath = chartPoints
    .map((point, index) => {
      return `${index === 0 ? "M" : "L"} ${point.x} ${point.ruleY}`;
    })
    .join(" ");

  const mlPath = chartPoints
    .map((point, index) => {
      return `${index === 0 ? "M" : "L"} ${point.x} ${point.mlY}`;
    })
    .join(" ");

  async function handleCaptureSnapshot() {
    try {
      setCapturing(true);
      setMessage("");

      const response = await createRiskSnapshot(asset.id);

      const newSnapshot = response?.snapshot;

      if (newSnapshot) {
        setSnapshots((current) => [
          ...current,
          newSnapshot,
        ]);
      } else {
        const refreshed =
          await getRiskSnapshots(asset.id);

        setSnapshots(
          refreshed?.snapshots ??
            (Array.isArray(refreshed)
              ? refreshed
              : [])
        );
      }

      setMessage(
        "Risk snapshot captured successfully."
      );
    } catch (err) {
      console.error(err);
      setMessage(
        err.message ||
          "Failed to capture risk snapshot."
      );
    } finally {
      setCapturing(false);
    }
  }

  async function handleCreateInspectionTask() {
    try {
      setCreatingTask(true);
      setMessage("");

      await createInspectionTask({
        asset_id: asset.id,
        title: `Inspection task for ${asset.name}`,
        priority: riskStatus,
        reason:
          "Current infrastructure signals are contributing significantly to the asset risk profile.",
        status: "Open",
      });

      setMessage(
        "Inspection task created successfully."
      );
    } catch (err) {
      console.error(err);
      setMessage(
        err.message ||
          "Failed to create inspection task."
      );
    } finally {
      setCreatingTask(false);
    }
  }

  function handleExportReport() {
    const previousTitle = document.title;

    document.title = `Signal-${asset.id}-Asset-Report`;

    window.print();

    setTimeout(() => {
      document.title = previousTitle;
    }, 1000);
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0a0a0a] px-6 text-white">
        <div className="text-center">
          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-2 border-white/10 border-t-white" />

          <p className="mt-4 text-sm text-white/35">
            Loading asset intelligence...
          </p>
        </div>
      </main>
    );
  }

  if (error || !asset) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0a0a0a] px-6 text-white">
        <div className="max-w-md text-center">
          <p className="text-[10px] uppercase tracking-[0.2em] text-red-400">
            Asset unavailable
          </p>

          <h1 className="mt-3 text-3xl font-semibold">
            We couldn't load this asset.
          </h1>

          <p className="mt-4 text-sm leading-6 text-white/35">
            {error ||
              "The requested asset could not be found."}
          </p>

          <Link
            to="/dashboard"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-black transition hover:scale-[1.02] print:hidden"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to dashboard
          </Link>
        </div>
      </main>
    );
  }

  return (
    <>
      <style>{`
        @media print {
          @page {
            size: A4;
            margin: 14mm;
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
            border-color: #d9d9d9 !important;
            color: #111111 !important;
            box-shadow: none !important;
          }

          .print-muted {
            color: #555555 !important;
          }

          .print-subtle {
            color: #777777 !important;
          }

          .print-accent {
            color: #111111 !important;
          }

          .print-border {
            border-color: #d9d9d9 !important;
          }

          .print-hide {
            display: none !important;
          }

          .print-break {
            break-inside: avoid;
            page-break-inside: avoid;
          }

          .print-section {
            break-inside: avoid;
            page-break-inside: avoid;
          }

          svg {
            break-inside: avoid;
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

      <main className="print-root min-h-screen bg-[#0a0a0a] px-4 py-4 text-white sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-[1600px]">

          {/* ================================================== */}
          {/* HEADER */}
          {/* ================================================== */}

          <header className="print-hide flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.02] px-5 py-4 backdrop-blur-xl">
            <Link
              to="/dashboard"
              className="group inline-flex items-center gap-2 text-sm text-white/45 transition hover:text-white"
            >
              <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-1" />
              Back to dashboard
            </Link>

            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />

              <span className="text-[10px] uppercase tracking-[0.16em] text-emerald-400">
                Live analysis
              </span>
            </div>
          </header>

          {/* ================================================== */}
          {/* REPORT HEADER */}
          {/* ================================================== */}

          <section className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.02] p-6 sm:p-8 print-card print-section">
            <div className="flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/25 print-muted">
                  Signal · Asset report
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-4">
                  <h1 className="text-4xl font-semibold tracking-[-0.05em] sm:text-6xl print-accent">
                    {asset.name}
                  </h1>

                  <span
                    className={`rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[10px] uppercase tracking-[0.14em] ${riskColor}`}
                  >
                    {riskStatus} risk
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-5 text-sm text-white/35 print-muted">
                  <span className="inline-flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {asset.location}
                  </span>

                  <span>{asset.type}</span>

                  <span>Asset ID · {asset.id}</span>

                  <span>Updated {asset.updated}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleExportReport}
                className="print-hide inline-flex items-center justify-center gap-2 rounded-full border border-white/10 px-5 py-3 text-sm text-white/60 transition hover:border-white/20 hover:text-white"
              >
                <FileText className="h-4 w-4" />
                Export asset report
              </button>
            </div>
          </section>

          {/* ================================================== */}
          {/* KPI ROW */}
          {/* ================================================== */}

          <section className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

            <motion.div
              whileHover={{ y: -3 }}
              className="print-card rounded-3xl border border-amber-400/10 bg-amber-400/[0.025] p-6 print-section"
            >
              <div className="flex items-center justify-between">
                <SectionLabel>Failure risk</SectionLabel>

                <ShieldAlert className="h-5 w-5 text-amber-400/70" />
              </div>

              <p
                className={`mt-7 text-5xl font-semibold tracking-[-0.05em] ${riskColor}`}
              >
                {riskScore.toFixed(1)}%
              </p>

              <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/10">
                <div
                  className={`h-full rounded-full ${riskBar}`}
                  style={{
                    width: `${Math.min(riskScore, 100)}%`,
                  }}
                />
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -3 }}
              className="print-card rounded-3xl border border-white/10 bg-white/[0.02] p-6 print-section"
            >
              <div className="flex items-center justify-between">
                <SectionLabel>Complaints</SectionLabel>

                <MessageSquareWarning className="h-5 w-5 text-amber-400/60" />
              </div>

              <p className="mt-7 text-5xl font-semibold tracking-tight">
                {asset.summary?.complaints ?? 0}
              </p>

              <p className="mt-2 text-xs text-white/30 print-muted">
                Recorded reports
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -3 }}
              className="print-card rounded-3xl border border-white/10 bg-white/[0.02] p-6 print-section"
            >
              <div className="flex items-center justify-between">
                <SectionLabel>Maintenance</SectionLabel>

                <Wrench className="h-5 w-5 text-white/40" />
              </div>

              <p className="mt-7 text-5xl font-semibold tracking-tight">
                {asset.summary?.maintenance_events ?? 0}
              </p>

              <p className="mt-2 text-xs text-white/30 print-muted">
                Recorded maintenance events
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -3 }}
              className="print-card rounded-3xl border border-white/10 bg-white/[0.02] p-6 print-section"
            >
              <div className="flex items-center justify-between">
                <SectionLabel>Incidents</SectionLabel>

                <AlertTriangle className="h-5 w-5 text-red-400/70" />
              </div>

              <p className="mt-7 text-5xl font-semibold tracking-tight">
                {asset.summary?.incidents ?? 0}
              </p>

              <p className="mt-2 text-xs text-white/30 print-muted">
                Historical incidents
              </p>
            </motion.div>
          </section>

          {/* ================================================== */}
          {/* RISK + ML */}
          {/* ================================================== */}

          <section className="print-card mt-5 rounded-[2rem] border border-white/10 bg-white/[0.02] p-6 sm:p-8 print-section">
            <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
              <div>
                <SectionLabel>Risk intelligence</SectionLabel>

                <h2 className="mt-2 text-2xl font-medium print-accent">
                  Rule engine vs ML prediction
                </h2>

                <p className="mt-3 max-w-3xl text-sm leading-6 text-white/35 print-muted">
                  Signal compares its explainable rule-based risk
                  score with the deployed machine-learning
                  prediction for this asset.
                </p>
              </div>

              <div className="rounded-2xl border border-white/5 bg-black/20 px-5 py-4 print-card">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-4 w-4 text-violet-400" />

                  <div>
                    <p className="text-[10px] uppercase tracking-[0.16em] text-white/25 print-muted">
                      Prediction delta
                    </p>

                    <p
                      className={`mt-1 text-xl font-semibold ${
                        riskDelta > 0
                          ? "text-violet-300"
                          : "text-emerald-300"
                      }`}
                    >
                      {riskDelta > 0 ? "+" : ""}
                      {riskDelta}%
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 grid gap-4 lg:grid-cols-2">

              <div className="print-card rounded-3xl border border-amber-400/10 bg-amber-400/[0.025] p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-400/10 bg-amber-400/[0.05]">
                      <ShieldAlert className="h-4 w-4 text-amber-400" />
                    </div>

                    <div>
                      <p className="text-[10px] uppercase tracking-[0.16em] text-white/25 print-muted">
                        Rule engine
                      </p>

                      <p className="mt-1 text-sm text-white/45 print-muted">
                        Explainable risk score
                      </p>
                    </div>
                  </div>

                  <span className={`text-xs ${riskColor}`}>
                    {riskStatus}
                  </span>
                </div>

                <p
                  className={`mt-8 text-5xl font-semibold tracking-[-0.05em] ${riskColor}`}
                >
                  {riskScore.toFixed(1)}%
                </p>

                <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/5">
                  <div
                    className={`h-full rounded-full ${riskBar}`}
                    style={{
                      width: `${Math.min(riskScore, 100)}%`,
                    }}
                  />
                </div>
              </div>

              <div className="print-card rounded-3xl border border-violet-400/10 bg-violet-400/[0.025] p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-400/10 bg-violet-400/[0.05]">
                      <BrainCircuit className="h-4 w-4 text-violet-400" />
                    </div>

                    <div>
                      <p className="text-[10px] uppercase tracking-[0.16em] text-white/25 print-muted">
                        ML prediction
                      </p>

                      <p className="mt-1 text-sm text-white/45 print-muted">
                        Machine-learning risk estimate
                      </p>
                    </div>
                  </div>

                  <span className="text-xs text-violet-300">
                    {getRiskStatus(mlRisk)}
                  </span>
                </div>

                <p className="mt-8 text-5xl font-semibold tracking-[-0.05em] text-violet-300">
                  {mlRisk.toFixed(1)}%
                </p>

                <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/5">
                  <div
                    className="h-full rounded-full bg-violet-400"
                    style={{
                      width: `${Math.min(mlRisk, 100)}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-white/5 bg-black/20 p-4 text-xs leading-5 text-white/30 print-card print-muted">
              The current ML model was trained on the project's
              bootstrap training dataset. Its prediction is shown as
              an additional intelligence signal and does not replace
              the explainable risk engine.
            </div>
          </section>

          {/* ================================================== */}
          {/* RISK HISTORY */}
          {/* ================================================== */}

          <section className="print-card mt-5 rounded-[2rem] border border-white/10 bg-white/[0.02] p-6 sm:p-8 print-section">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <SectionLabel>Risk history</SectionLabel>

                <h2 className="mt-2 text-2xl font-medium print-accent">
                  Risk trend
                </h2>

                <p className="mt-3 text-sm leading-6 text-white/35 print-muted">
                  Historical rule-based and ML risk snapshots
                  captured for this asset.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 print-hide">
                <div className="flex items-center gap-2 rounded-full border border-white/5 bg-black/20 px-3 py-2">
                  <span className="h-2 w-2 rounded-full bg-amber-400" />
                  <span className="text-[10px] uppercase tracking-[0.14em] text-white/35">
                    Rule engine
                  </span>
                </div>

                <div className="flex items-center gap-2 rounded-full border border-white/5 bg-black/20 px-3 py-2">
                  <span className="h-2 w-2 rounded-full bg-violet-400" />
                  <span className="text-[10px] uppercase tracking-[0.14em] text-white/35">
                    ML prediction
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleCaptureSnapshot}
                  disabled={capturing}
                  className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-xs font-medium text-black transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Camera className="h-3.5 w-3.5" />

                  {capturing
                    ? "Capturing..."
                    : "Capture risk snapshot"}
                </button>
              </div>
            </div>

            <div className="mt-8 rounded-3xl border border-white/5 bg-black/20 p-5 sm:p-7 print-card">
              {snapshotLoading ? (
                <div className="flex min-h-[300px] items-center justify-center">
                  <div className="h-7 w-7 animate-spin rounded-full border-2 border-white/10 border-t-white" />
                </div>
              ) : snapshots.length === 0 ? (
                <div className="flex min-h-[300px] flex-col items-center justify-center text-center">
                  <BarChart3 className="h-8 w-8 text-white/20" />

                  <p className="mt-4 text-sm text-white/40 print-muted">
                    No risk snapshots yet.
                  </p>

                  <p className="mt-2 text-xs text-white/20 print-muted">
                    Capture the first snapshot to begin trend
                    tracking.
                  </p>
                </div>
              ) : (
                <div>
                  <div className="relative overflow-hidden">
                    <svg
                      viewBox="0 0 1000 260"
                      className="h-[300px] w-full"
                      preserveAspectRatio="none"
                    >
                      {[25, 50, 75, 100].map(
                        (value) => {
                          const y =
                            260 -
                            25 -
                            (value / 100) * 210;

                          return (
                            <line
                              key={value}
                              x1="30"
                              x2="970"
                              y1={y}
                              y2={y}
                              stroke="rgba(255,255,255,0.06)"
                              strokeWidth="1"
                            />
                          );
                        }
                      )}

                      {rulePath && (
                        <motion.path
                          d={rulePath}
                          fill="none"
                          stroke="#fbbf24"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 1 }}
                        />
                      )}

                      {mlPath && (
                        <motion.path
                          d={mlPath}
                          fill="none"
                          stroke="#a78bfa"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{
                            duration: 1,
                            delay: 0.15,
                          }}
                        />
                      )}

                      {chartPoints.map(
                        (point, index) => (
                          <g key={index}>
                            <circle
                              cx={point.x}
                              cy={point.ruleY}
                              r="5"
                              fill="#fbbf24"
                            />

                            <circle
                              cx={point.x}
                              cy={point.mlY}
                              r="5"
                              fill="#a78bfa"
                            />
                          </g>
                        )
                      )}
                    </svg>

                    <div className="pointer-events-none absolute inset-y-0 left-0 flex flex-col justify-between py-3 text-[9px] text-white/15 print-muted">
                      <span>100</span>
                      <span>75</span>
                      <span>50</span>
                      <span>25</span>
                      <span>0</span>
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
                    {snapshots.map((snapshot) => (
                      <div
                        key={snapshot.id}
                        className="print-card rounded-xl border border-white/5 bg-white/[0.02] px-3 py-2"
                      >
                        <p className="text-[9px] uppercase tracking-[0.12em] text-white/20 print-muted">
                          {formatSnapshotDate(
                            snapshot.captured_at
                          )}
                        </p>

                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-xs text-amber-300">
                            {Number(
                              snapshot.rule_risk ?? 0
                            ).toFixed(1)}%
                          </span>

                          <span className="text-xs text-violet-300">
                            {Number(
                              snapshot.ml_risk ?? 0
                            ).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <div className="print-card rounded-2xl border border-amber-400/10 bg-amber-400/[0.025] p-4">
                      <p className="text-[10px] uppercase tracking-[0.16em] text-white/25 print-muted">
                        Latest rule risk
                      </p>

                      <p className="mt-2 text-2xl font-semibold text-amber-300">
                        {Number(
                          snapshots[snapshots.length - 1]
                            ?.rule_risk ?? riskScore
                        ).toFixed(1)}%
                      </p>

                      <p className="mt-1 text-[11px] text-white/20 print-muted">
                        Latest snapshot
                      </p>
                    </div>

                    <div className="print-card rounded-2xl border border-violet-400/10 bg-violet-400/[0.025] p-4">
                      <p className="text-[10px] uppercase tracking-[0.16em] text-white/25 print-muted">
                        Latest ML risk
                      </p>

                      <p className="mt-2 text-2xl font-semibold text-violet-300">
                        {Number(
                          snapshots[snapshots.length - 1]
                            ?.ml_risk ?? mlRisk
                        ).toFixed(1)}%
                      </p>

                      <p className="mt-1 text-[11px] text-white/20 print-muted">
                        Latest snapshot
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* ================================================== */}
          {/* INTELLIGENCE GRID */}
          {/* ================================================== */}

          <section className="mt-5 grid gap-5 xl:grid-cols-[1fr_1.05fr]">

            {/* LEFT */}

            <div className="space-y-5">

              {/* Risk overview */}

              <div className="print-card rounded-[2rem] border border-white/10 bg-white/[0.02] p-6 sm:p-8 print-section">
                <SectionLabel>Risk overview</SectionLabel>

                <h2 className="mt-2 text-2xl font-medium print-accent">
                  What Signal is seeing
                </h2>

                <p className="mt-3 text-sm leading-6 text-white/35 print-muted">
                  The current risk level is supported by the
                  infrastructure signals stored against this asset.
                </p>

                <div className="mt-7 grid gap-3 sm:grid-cols-2">
                  {[
                    {
                      label: "Complaints",
                      value:
                        asset.summary?.complaints ?? 0,
                      icon: MessageSquareWarning,
                    },
                    {
                      label: "Inspections",
                      value:
                        asset.summary?.inspections ?? 0,
                      icon: ClipboardCheck,
                    },
                    {
                      label: "Maintenance events",
                      value:
                        asset.summary?.maintenance_events ?? 0,
                      icon: Wrench,
                    },
                    {
                      label: "Historical incidents",
                      value:
                        asset.summary?.incidents ?? 0,
                      icon: AlertTriangle,
                    },
                  ].map((item) => {
                    const Icon = item.icon;

                    return (
                      <div
                        key={item.label}
                        className="print-card flex items-center justify-between rounded-2xl border border-white/5 bg-black/20 px-4 py-4"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/5 bg-white/[0.02]">
                            <Icon className="h-4 w-4 text-white/40" />
                          </div>

                          <span className="text-sm text-white/55 print-muted">
                            {item.label}
                          </span>
                        </div>

                        <span className="text-xl font-semibold">
                          {item.value}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="print-card mt-5 rounded-2xl border border-amber-400/10 bg-amber-400/[0.025] p-5">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />

                    <div>
                      <p className="text-sm font-medium print-accent">
                        Current classification: {riskStatus}
                      </p>

                      <p className="mt-2 text-xs leading-5 text-white/35 print-muted">
                        This classification is based on the
                        calculated risk score generated from the
                        asset's supporting infrastructure signals.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Risk breakdown */}

              <div className="print-card rounded-[2rem] border border-white/10 bg-white/[0.02] p-6 sm:p-8 print-section">
                <div className="flex items-end justify-between">
                  <div>
                    <SectionLabel>Risk breakdown</SectionLabel>

                    <h2 className="mt-2 text-2xl font-medium print-accent">
                      How the score was built
                    </h2>
                  </div>

                  <span
                    className={`text-2xl font-semibold ${riskColor}`}
                  >
                    {riskScore.toFixed(1)}%
                  </span>
                </div>

                <div className="mt-7 space-y-5">
                  {breakdownItems.map((item) => (
                    <div key={item.label}>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-white/45 print-muted">
                          {item.label}
                        </span>

                        <span className="text-white/55 print-muted">
                          {item.score.toFixed(1)} · +
                          {item.contribution.toFixed(1)}
                        </span>
                      </div>

                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/5">
                        <div
                          className={`h-full rounded-full ${
                            item.score >= 70
                              ? "bg-red-400"
                              : item.score >= 40
                              ? "bg-amber-400"
                              : "bg-emerald-400"
                          }`}
                          style={{
                            width: `${Math.min(
                              item.score,
                              100
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 border-t border-white/5 pt-4 text-[11px] text-white/25 print-muted">
                  Score · weighted contribution to final risk
                </div>
              </div>

              {/* Recommendations */}

              <div className="print-card rounded-[2rem] border border-white/10 bg-white/[0.02] p-6 sm:p-8 print-section">
                <div className="flex items-center justify-between">
                  <div>
                    <SectionLabel>
                      Recommended actions
                    </SectionLabel>

                    <h2 className="mt-2 text-2xl font-medium print-accent">
                      What should happen next
                    </h2>
                  </div>

                  <span className="rounded-full border border-white/5 bg-white/[0.02] px-3 py-1.5 text-[10px] text-white/30 print-muted">
                    {asset.recommendations?.length ?? 0} actions
                  </span>
                </div>

                <div className="mt-6 space-y-3">
                  {asset.recommendations?.length ? (
                    asset.recommendations.map(
                      (recommendation, index) => {
                        const styles =
                          getPriorityClasses(
                            recommendation.priority
                          );

                        const Icon =
                          recommendation.priority === "High"
                            ? AlertTriangle
                            : recommendation.priority ===
                              "Medium"
                            ? ShieldAlert
                            : CheckCircle2;

                        return (
                          <motion.div
                            key={`${recommendation.action}-${index}`}
                            initial={{
                              opacity: 0,
                              y: 8,
                            }}
                            animate={{
                              opacity: 1,
                              y: 0,
                            }}
                            transition={{
                              duration: 0.3,
                              delay: index * 0.05,
                            }}
                            className={`print-card rounded-2xl border ${styles.border} ${styles.bg} p-4 print-break`}
                          >
                            <div className="flex items-start gap-3">
                              <Icon
                                className={`mt-0.5 h-5 w-5 shrink-0 ${styles.text}`}
                              />

                              <div>
                                <span
                                  className={`text-[10px] uppercase tracking-[0.14em] ${styles.text}`}
                                >
                                  {recommendation.priority}
                                </span>

                                <p className="mt-2 text-sm font-medium print-accent">
                                  {recommendation.action}
                                </p>

                                <p className="mt-2 text-xs leading-5 text-white/35 print-muted">
                                  {recommendation.reason}
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        );
                      }
                    )
                  ) : (
                    <div className="print-card rounded-2xl border border-white/5 bg-black/20 p-5 text-sm text-white/30 print-muted">
                      No recommendations are currently available.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* RIGHT */}

            <div className="space-y-5">

              {/* Activity */}

              <div className="print-card rounded-[2rem] border border-white/10 bg-white/[0.02] p-6 sm:p-8 print-section">
                <div className="flex items-center justify-between">
                  <div>
                    <SectionLabel>
                      Infrastructure activity
                    </SectionLabel>

                    <h2 className="mt-2 text-2xl font-medium print-accent">
                      Recent signals
                    </h2>
                  </div>

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/5 bg-white/[0.02] print-card">
                    <Activity className="h-4 w-4 text-white/35" />
                  </div>
                </div>

                <div className="mt-7 space-y-3">
                  {activity.length === 0 ? (
                    <div className="print-card rounded-2xl border border-white/5 bg-black/20 p-5 text-sm text-white/30 print-muted">
                      No supporting activity has been recorded for
                      this asset.
                    </div>
                  ) : (
                    activity.map((item, index) => {
                      const Icon = item.icon;

                      return (
                        <motion.div
                          key={`${item.type}-${item.title}-${index}`}
                          initial={{
                            opacity: 0,
                            y: 10,
                          }}
                          animate={{
                            opacity: 1,
                            y: 0,
                          }}
                          transition={{
                            duration: 0.3,
                            delay: index * 0.04,
                          }}
                          className="print-card rounded-2xl border border-white/5 bg-black/20 p-5 print-break"
                        >
                          <div className="flex items-start gap-4">
                            <div className="print-card flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/5 bg-white/[0.02]">
                              <Icon className="h-4 w-4 text-white/45" />
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="text-[10px] uppercase tracking-[0.14em] text-white/25 print-muted">
                                  {item.type}
                                </span>

                                <span
                                  className={`text-[10px] uppercase tracking-[0.14em] ${
                                    item.priority ===
                                    "High"
                                      ? "text-red-400"
                                      : item.priority ===
                                        "Medium"
                                      ? "text-amber-400"
                                      : "text-emerald-400"
                                  }`}
                                >
                                  {item.priority}
                                </span>
                              </div>

                              <p className="mt-2 text-sm font-medium print-accent">
                                {item.title}
                              </p>

                              <p className="mt-2 text-sm leading-6 text-white/35 print-muted">
                                {item.description}
                              </p>

                              <div className="mt-3 flex items-center gap-2 text-[11px] text-white/20 print-muted">
                                <Clock3 className="h-3.5 w-3.5" />

                                {item.age === 0
                                  ? "Today"
                                  : `${item.age} days ago`}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Inspections */}

              <div className="print-card rounded-[2rem] border border-white/10 bg-white/[0.02] p-6 sm:p-8 print-section">
                <SectionLabel>Inspection history</SectionLabel>

                <h2 className="mt-2 text-2xl font-medium print-accent">
                  Condition assessments
                </h2>

                <div className="mt-6 space-y-3">
                  {asset.inspections?.length ? (
                    asset.inspections.map(
                      (inspection) => (
                        <div
                          key={inspection.id}
                          className="print-card rounded-2xl border border-white/5 bg-black/20 p-5 print-break"
                        >
                          <div className="flex items-center justify-between gap-4">
                            <span className="text-xs text-white/30 print-muted">
                              {inspection.inspector}
                            </span>

                            <span
                              className={`text-sm font-semibold ${
                                inspection.condition_score <
                                50
                                  ? "text-red-400"
                                  : inspection.condition_score <
                                    70
                                  ? "text-amber-400"
                                  : "text-emerald-400"
                              }`}
                            >
                              {inspection.condition_score}
                              /100
                            </span>
                          </div>

                          <p className="mt-4 text-sm font-medium print-accent">
                            Condition assessment
                          </p>

                          <p className="mt-2 text-sm leading-6 text-white/35 print-muted">
                            {inspection.findings}
                          </p>

                          <p className="mt-4 text-[11px] text-white/20 print-muted">
                            {inspection.inspection_days_ago} days ago
                          </p>
                        </div>
                      )
                    )
                  ) : (
                    <div className="print-card rounded-2xl border border-white/5 bg-black/20 p-5 text-sm text-white/30 print-muted">
                      No inspections recorded.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* ================================================== */}
          {/* MAINTENANCE */}
          {/* ================================================== */}

          <section className="print-card mt-5 rounded-[2rem] border border-white/10 bg-white/[0.02] p-6 sm:p-8 print-section">
            <div className="flex items-end justify-between">
              <div>
                <SectionLabel>
                  Maintenance history
                </SectionLabel>

                <h2 className="mt-2 text-2xl font-medium print-accent">
                  Recent maintenance events
                </h2>
              </div>

              <Wrench className="h-5 w-5 text-white/25" />
            </div>

            <div className="mt-7 overflow-x-auto">
              <table className="w-full min-w-[750px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-white/5 text-[10px] uppercase tracking-[0.14em] text-white/20">
                    <th className="pb-4 pr-6">
                      Event
                    </th>

                    <th className="pb-4 pr-6">
                      Description
                    </th>

                    <th className="pb-4 pr-6">
                      Cost
                    </th>

                    <th className="pb-4">
                      Age
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {asset.maintenance_events?.length ? (
                    asset.maintenance_events.map(
                      (event) => (
                        <tr
                          key={event.id}
                          className="border-b border-white/5 last:border-0"
                        >
                          <td className="py-5 pr-6 text-sm font-medium print-accent">
                            {event.event_type}
                          </td>

                          <td className="py-5 pr-6 text-sm text-white/35 print-muted">
                            {event.description}
                          </td>

                          <td className="py-5 pr-6 text-sm print-accent">
                            ₹
                            {Number(
                              event.cost ?? 0
                            ).toLocaleString(
                              "en-IN"
                            )}
                          </td>

                          <td className="py-5 text-sm text-white/30 print-muted">
                            {
                              event.maintenance_days_ago
                            }{" "}
                            days ago
                          </td>
                        </tr>
                      )
                    )
                  ) : (
                    <tr>
                      <td
                        colSpan="4"
                        className="py-8 text-center text-sm text-white/25 print-muted"
                      >
                        No maintenance events recorded.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* ================================================== */}
          {/* ACTION */}
          {/* ================================================== */}

          <section className="print-hide mt-5 pb-8">
            <div className="rounded-[2rem] border border-amber-400/10 bg-amber-400/[0.025] p-6 sm:p-8">
              <div className="flex flex-col gap-7 xl:flex-row xl:items-center xl:justify-between">
                <div>
                  <SectionLabel>
                    Recommended workflow
                  </SectionLabel>

                  <h2 className="mt-2 max-w-3xl text-2xl font-medium">
                    Turn the current signal profile into an
                    inspection task.
                  </h2>

                  <p className="mt-3 max-w-3xl text-sm leading-6 text-white/35">
                    Signal combines infrastructure signals into an
                    explainable risk score and generates
                    action-oriented recommendations for the asset.
                  </p>

                  {message && (
                    <p className="mt-4 text-xs text-emerald-400">
                      {message}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleCreateInspectionTask}
                  disabled={creatingTask}
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition hover:scale-[1.03] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Plus className="h-4 w-4" />

                  {creatingTask
                    ? "Creating..."
                    : "Create inspection task"}
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}

export default AssetDetails;