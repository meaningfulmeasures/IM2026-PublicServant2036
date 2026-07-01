import { useState, useEffect, useRef, useCallback } from "react";

const VIDEO_A_URL =
  "https://www.youtube.com/embed/-fllnvZ945Y?si=7qkQytbJvf4tHOex";
const VIDEO_B_URL =
  "https://www.youtube.com/embed/pesD5cRGQnY?si=HFlpN6BQRHUvE_vk";

// ─── Types ─────────────────────────────────────────────────────────────────

type Phase = "dashboard" | "halt" | "message";

interface Task {
  trigger: string;
  resolution: string;
  category: string;
}

interface LogEntry {
  time: string;
  message: string;
  type: "info" | "success" | "warn";
}

// ─── Data ──────────────────────────────────────────────────────────────────

const TASKS: Task[] = [
  {
    trigger: "Meeting scheduled. Brief required.",
    resolution: "AI has generated and distributed the brief.",
    category: "Ministerial Briefing",
  },
  {
    trigger: "Senate Estimates approaching.",
    resolution: "AI has predicted all questions and drafted responses.",
    category: "Parliamentary Affairs",
  },
  {
    trigger: "Stakeholder consultation needed.",
    resolution: "AI has generated synthetic citizens and synthesised feedback.",
    category: "Community Engagement",
  },
  {
    trigger: "Cabinet submission pending.",
    resolution: "AI drafted submission while you slept.",
    category: "Cabinet Process",
  },
];

const SIDEBAR_MODULES = [
  { label: "Dashboard", active: true },
  { label: "Policy Workbench", active: false },
  { label: "Stakeholder Matrix", active: false },
  { label: "Compliance Monitor", active: false },
  { label: "AI Operations Log", active: false },
  { label: "Risk Register", active: false },
  { label: "Resource Allocation", active: false },
];

const NOW = new Date();
const fmt = (d: Date) =>
  d.toLocaleTimeString("en-AU", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

function makelog(
  offset: number,
  message: string,
  type: "info" | "success" | "warn"
): LogEntry {
  const d = new Date(NOW.getTime() - offset * 1000);
  return { time: fmt(d), message, type };
}

const INITIAL_LOG: LogEntry[] = [
  makelog(412, "Session initialised — AI Operations Console v9.4.1", "info"),
  makelog(380, "Housing & Infrastructure policy cluster loaded", "info"),
  makelog(244, "Daily task queue synchronised — 4 items pending", "info"),
  makelog(180, "AI model heartbeat confirmed: APEX-Gov 3.2", "success"),
  makelog(60, "Automated priority sort applied to task queue", "info"),
];

// ─── Top Bar ───────────────────────────────────────────────────────────────

function TopBar() {
  const [clock, setClock] = useState(fmt(new Date()));
  useEffect(() => {
    const t = setInterval(() => setClock(fmt(new Date())), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <header className="h-12 bg-[#1b4f8a] flex items-center px-4 gap-4 shrink-0 select-none">
      <div className="flex items-center gap-3">
        <div className="w-5 h-5 flex flex-col gap-[3px] justify-center">
          <div className="w-full h-[2px] bg-white/80" />
          <div className="w-3/4 h-[2px] bg-white/80" />
          <div className="w-full h-[2px] bg-white/80" />
        </div>
        <span className="text-white font-semibold text-sm tracking-wide">
          IM2026 · Bureauvision 2036
        </span>
      </div>
      <div className="w-px h-5 bg-white/20 mx-1" />
      <span className="text-white/60 text-xs font-mono">AI Operations Console</span>
      <div className="ml-auto flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-white/70 text-xs">APEX-Gov 3.2 · Online</span>
        </div>
        <div className="w-px h-4 bg-white/20" />
        <span className="text-white/60 text-xs font-mono">{clock}</span>
        <div className="w-px h-4 bg-white/20" />
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-white text-[10px] font-bold">
            AC
          </div>
          <div>
            <div className="text-white text-xs font-medium leading-none">
              A. Chen
            </div>
            <div className="text-white/50 text-[10px] leading-none mt-0.5">
              APS Policy Officer · EL1
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

// ─── Sidebar ───────────────────────────────────────────────────────────────

function Sidebar() {
  return (
    <aside className="w-52 bg-[#1a2035] flex flex-col shrink-0">
      <div className="px-4 py-3 border-b border-white/5">
        <div className="text-white/40 text-[10px] uppercase tracking-widest font-semibold">
          Housing &amp; Infrastructure
        </div>
      </div>
      <nav className="flex-1 py-2 overflow-y-auto">
        {SIDEBAR_MODULES.map((m) => (
          <div
            key={m.label}
            className={`flex items-center gap-2.5 px-4 py-2 text-sm cursor-default transition-colors ${
              m.active
                ? "bg-[#1b4f8a]/40 text-white border-r-2 border-[#4a9eff]"
                : "text-white/40 hover:text-white/60 hover:bg-white/5"
            }`}
          >
            <div
              className={`w-1 h-1 rounded-full ${
                m.active ? "bg-[#4a9eff]" : "bg-white/20"
              }`}
            />
            {m.label}
          </div>
        ))}
      </nav>
      <div className="px-4 py-3 border-t border-white/5">
        <div className="text-white/25 text-[10px] leading-relaxed">
          APS Secure Environment
          <br />
          Classification: OFFICIAL
        </div>
      </div>
    </aside>
  );
}

// ─── Status badge ──────────────────────────────────────────────────────────

function StatusBadge({ type }: { type: "info" | "success" | "warn" }) {
  if (type === "success")
    return (
      <span className="text-emerald-600 text-[10px] font-mono font-bold">OK</span>
    );
  if (type === "warn")
    return (
      <span className="text-amber-600 text-[10px] font-mono font-bold">WARN</span>
    );
  return (
    <span className="text-blue-500 text-[10px] font-mono font-bold">INFO</span>
  );
}

// ─── Now Playing panel (Video A) ───────────────────────────────────────────

function NowPlaying({ playing }: { playing: boolean }) {
  return (
    <div className="bg-white border border-[rgba(26,31,46,0.1)] rounded overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-4 py-2.5 border-b border-[rgba(26,31,46,0.08)] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          {playing ? (
            <div className="flex gap-[2px] items-end h-3">
              {[4, 7, 3, 6, 5].map((h, i) => (
                <div
                  key={i}
                  className="w-[3px] bg-[#1b4f8a] rounded-sm"
                  style={{
                    height: `${h}px`,
                    animation: `eq-bounce ${0.4 + i * 0.07}s ease-in-out infinite alternate`,
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="w-2 h-2 rounded-sm bg-[#a0aec0]" />
          )}
          <div className="text-[10px] uppercase tracking-wider text-[#5a6478]">
            Media · Now Playing
          </div>
        </div>
        <span
          className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
            playing
              ? "bg-emerald-50 text-emerald-700"
              : "bg-[#f5f7fa] text-[#a0aec0]"
          }`}
        >
          {playing ? "LIVE" : "IDLE"}
        </span>
      </div>

      {/* Iframe or idle state */}
      <div className="relative bg-[#0d1117] aspect-video">
        {playing ? (
          <iframe
            src={VIDEO_A_URL}
            className="w-full h-full border-0"
            allow="autoplay; fullscreen"
            allowFullScreen
            title="Phase 1 — Bludging Window"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-[#0d1117]">
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center">
                <svg width="10" height="12" viewBox="0 0 10 12" fill="none">
                  <path d="M1 1l8 5-8 5V1z" fill="white" fillOpacity="0.5" />
                </svg>
              </div>
              <span className="text-white/30 text-[10px]">Awaiting task</span>
            </div>
          </div>
        )}
      </div>

      {/* Meta */}
      <div className="px-3 py-2 shrink-0">
        <div className="text-[11px] font-medium text-[#1a1f2e] truncate">
          AI Operations · Background Channel
        </div>
        <div className="text-[10px] text-[#5a6478] mt-0.5">
          {playing
            ? "Playing while AI resolves tasks"
            : "Press Auto-Resolve to begin"}
        </div>
      </div>
    </div>
  );
}

// ─── Phase 1: Dashboard ────────────────────────────────────────────────────

interface DashboardProps {
  onComplete: () => void;
  videoPlaying: boolean;
  onFirstResolve: () => void;
}

function Dashboard({ onComplete, videoPlaying, onFirstResolve }: DashboardProps) {
  const [taskIndex, setTaskIndex] = useState(0);
  const [resolved, setResolved] = useState(false);
  const [resolving, setResolving] = useState(false);
  const [log, setLog] = useState<LogEntry[]>(INITIAL_LOG);
  const [clickCount, setClickCount] = useState(0);
  const logRef = useRef<HTMLDivElement>(null);

  const currentTask = TASKS[taskIndex];

  const addLog = (message: string, type: "info" | "success" | "warn") => {
    setLog((prev) => [...prev, { time: fmt(new Date()), message, type }]);
    setTimeout(() => {
      logRef.current?.scrollTo({
        top: logRef.current.scrollHeight,
        behavior: "smooth",
      });
    }, 50);
  };

  const handleAutoResolve = () => {
    if (resolving || resolved) return;
    if (clickCount === 0) onFirstResolve();
    setResolving(true);

    setTimeout(() => {
      addLog(`Task received: "${currentTask.trigger}"`, "info");
    }, 200);

    setTimeout(() => {
      addLog("Routing to APEX-Gov AI engine...", "info");
    }, 700);

    setTimeout(() => {
      addLog(currentTask.resolution, "success");
      setResolved(true);
      setResolving(false);
      setClickCount((c) => c + 1);
    }, 1600);
  };

  const handleNext = () => {
    const next = taskIndex + 1;
    if (next >= TASKS.length) {
      onComplete();
      return;
    }
    setTaskIndex(next);
    setResolved(false);
    addLog(`New task loaded: ${TASKS[next].category}`, "info");
  };

  const completedCount = clickCount;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-auto bg-[#f0f2f5] p-5 flex flex-col gap-4">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-[#5a6478]">
            <span>Dashboard</span>
            <span>/</span>
            <span className="text-[#1b4f8a] font-medium">Current Task Queue</span>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-4 gap-3">
            {[
              {
                label: "Tasks Completed Today",
                value: completedCount,
                unit: `/ ${TASKS.length}`,
              },
              {
                label: "AI Actions Taken",
                value: completedCount * 3,
                unit: "operations",
              },
              { label: "Human Decisions Made", value: 0, unit: "actions" },
              {
                label: "AI Efficiency Score",
                value: completedCount > 0 ? "99.2%" : "—",
                unit: "",
              },
            ].map((s) => (
              <div
                key={s.label}
                className="bg-white border border-[rgba(26,31,46,0.1)] rounded p-3"
              >
                <div className="text-[10px] uppercase tracking-wider text-[#5a6478] mb-1">
                  {s.label}
                </div>
                <div className="text-2xl font-semibold text-[#1a1f2e] leading-none">
                  {s.value}
                  {s.unit && (
                    <span className="text-xs font-normal text-[#5a6478] ml-1">
                      {s.unit}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Three-column row: task card | task queue | right column (log + video) */}
          <div className="flex gap-4 flex-1 min-h-0">
            {/* Left: current task + queue */}
            <div className="flex-1 flex flex-col gap-4 min-w-0">
              {/* Current Task card */}
              <div className="bg-white border border-[rgba(26,31,46,0.1)] rounded overflow-hidden">
                <div className="px-4 py-3 border-b border-[rgba(26,31,46,0.08)] flex items-center justify-between">
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-[#5a6478]">
                      Current Task
                    </div>
                    <div className="text-sm font-semibold text-[#1a1f2e] mt-0.5">
                      {currentTask.category}
                    </div>
                  </div>
                  <span className="text-[10px] font-mono bg-[#e8edf4] text-[#1b4f8a] px-2 py-1 rounded">
                    {taskIndex + 1} / {TASKS.length}
                  </span>
                </div>
                <div className="p-4">
                  <div className="text-sm text-[#1a1f2e] mb-4 p-3 bg-[#f5f7fa] rounded border-l-2 border-[#1b4f8a]">
                    {currentTask.trigger}
                  </div>

                  {resolved ? (
                    <div>
                      <div className="flex items-start gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded mb-4">
                        <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center shrink-0 mt-0.5">
                          <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                            <path
                              d="M1.5 4l2 2 3-3"
                              stroke="white"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                        <div className="text-sm text-emerald-800">
                          {currentTask.resolution}
                        </div>
                      </div>
                      <button
                        onClick={handleNext}
                        className="w-full py-2 bg-[#1b4f8a] text-white text-sm rounded hover:bg-[#163d6e] transition-colors cursor-pointer"
                      >
                        {taskIndex + 1 >= TASKS.length
                          ? "Continue →"
                          : "Next Task →"}
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={handleAutoResolve}
                      disabled={resolving}
                      className={`w-full py-2.5 text-sm rounded font-medium transition-all ${
                        resolving
                          ? "bg-[#e8edf4] text-[#5a6478] cursor-wait"
                          : "bg-[#1b4f8a] text-white hover:bg-[#163d6e] active:scale-[0.99] cursor-pointer"
                      }`}
                    >
                      {resolving ? (
                        <span className="flex items-center justify-center gap-2">
                          <span className="w-3 h-3 border-2 border-[#5a6478] border-t-transparent rounded-full animate-spin" />
                          AI Processing…
                        </span>
                      ) : (
                        "Auto-Resolve with AI"
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Task queue */}
              <div className="bg-white border border-[rgba(26,31,46,0.1)] rounded">
                <div className="px-4 py-3 border-b border-[rgba(26,31,46,0.08)]">
                  <div className="text-[10px] uppercase tracking-wider text-[#5a6478]">
                    Task Queue
                  </div>
                </div>
                {TASKS.map((t, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-3 px-4 py-2.5 border-b border-[rgba(26,31,46,0.05)] last:border-0 text-sm ${
                      i < taskIndex
                        ? "opacity-40"
                        : i === taskIndex
                        ? "bg-[#f5f7fa]"
                        : "opacity-60"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                        i < taskIndex
                          ? "bg-emerald-500 border-emerald-500"
                          : i === taskIndex
                          ? "border-[#1b4f8a] bg-white"
                          : "border-[#d0d5e0] bg-white"
                      }`}
                    >
                      {i < taskIndex && (
                        <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                          <path
                            d="M1.5 4l2 2 3-3"
                            stroke="white"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                      {i === taskIndex && (
                        <div className="w-1.5 h-1.5 rounded-full bg-[#1b4f8a]" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[#1a1f2e] text-xs font-medium">
                        {t.category}
                      </div>
                      <div className="text-[#5a6478] text-[11px] truncate">
                        {t.trigger}
                      </div>
                    </div>
                    {i < taskIndex && (
                      <span className="text-[10px] text-emerald-600 font-mono shrink-0">
                        AUTO-RESOLVED
                      </span>
                    )}
                    {i === taskIndex && (
                      <span className="text-[10px] text-[#1b4f8a] font-mono shrink-0">
                        ACTIVE
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Right column: activity log + now playing */}
            <div className="w-72 flex flex-col gap-4 shrink-0">
              {/* Activity log */}
              <div className="bg-white border border-[rgba(26,31,46,0.1)] rounded flex flex-col flex-1 min-h-0">
                <div className="px-4 py-3 border-b border-[rgba(26,31,46,0.08)] flex items-center gap-2 shrink-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <div className="text-[10px] uppercase tracking-wider text-[#5a6478]">
                    Activity Log
                  </div>
                </div>
                <div
                  ref={logRef}
                  className="flex-1 overflow-y-auto p-3 space-y-2"
                >
                  {log.map((entry, i) => (
                    <div key={i} className="flex gap-2 text-[11px]">
                      <span className="text-[#5a6478] font-mono shrink-0 mt-0.5">
                        {entry.time}
                      </span>
                      <div className="flex-1 min-w-0">
                        <StatusBadge type={entry.type} />
                        <span className="text-[#1a1f2e] ml-1.5">
                          {entry.message}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Now Playing (Video A) */}
              <NowPlaying playing={videoPlaying} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// ─── Phase 2: The Halt ─────────────────────────────────────────────────────

interface HaltProps {
  onProceed: () => void;
}

function Halt({ onProceed }: HaltProps) {
  const [typed, setTyped] = useState("");
  const [cursorVisible, setCursorVisible] = useState(true);
  const [proceeded, setProceeded] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const blink = setInterval(() => setCursorVisible((v) => !v), 530);
    return () => clearInterval(blink);
  }, []);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  useEffect(() => {
    if (typed.length > 0 && !proceeded) {
      const timer = setTimeout(() => {
        setProceeded(true);
        onProceed();
      }, 2200);
      return () => clearTimeout(timer);
    }
  }, [typed, proceeded, onProceed]);

  return (
    <div className="h-full flex flex-col bg-[#f0f2f5]">
      <TopBar />
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-2xl">
          {/* Exception header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded bg-red-600 flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M7 2v6M7 10v1"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-widest text-red-600 font-semibold">
                System Exception · Priority CRITICAL
              </div>
              <h1 className="text-xl font-semibold text-[#1a1f2e]">
                Critical Exception · Human Judgement Required
              </h1>
            </div>
          </div>

          {/* Card */}
          <div className="bg-white border border-red-200 rounded shadow-sm overflow-hidden">
            <div className="border-b border-red-100 px-5 py-4 bg-red-50">
              <div className="text-sm font-medium text-red-900 mb-1">
                Unprecedented ethical dilemma in housing allocation algorithm
              </div>
              <div className="text-sm text-red-700">
                Vulnerable households flagged as &ldquo;efficiency
                outliers&rdquo; for automated deprioritisation.
              </div>
            </div>

            <div className="px-5 py-4 space-y-4">
              <div className="grid grid-cols-3 gap-3 text-center">
                {[
                  { label: "Households Affected", value: "1,847" },
                  { label: "Automated Decision", value: "DEPRIORITISE" },
                  { label: "Human Override", value: "REQUIRED" },
                ].map((s) => (
                  <div key={s.label} className="bg-[#f5f7fa] rounded p-3">
                    <div className="text-lg font-semibold text-[#1a1f2e]">
                      {s.value}
                    </div>
                    <div className="text-[10px] uppercase tracking-wider text-[#5a6478] mt-0.5">
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border border-red-200 rounded bg-red-50/40 px-4 py-3 text-sm text-red-800">
                <span className="font-semibold">
                  Automated logic insufficient.
                </span>{" "}
                Please provide your human policy judgement.
              </div>

              {/* Textarea with blinking cursor */}
              <div className="relative">
                <div className="text-[10px] uppercase tracking-wider text-[#5a6478] mb-1.5">
                  Your Judgement
                </div>
                <div className="relative bg-[#f5f7fa] border border-[rgba(26,31,46,0.15)] rounded focus-within:border-[#1b4f8a] focus-within:ring-1 focus-within:ring-[#1b4f8a]/20 transition-all">
                  <textarea
                    ref={textareaRef}
                    value={typed}
                    onChange={(e) => setTyped(e.target.value)}
                    rows={4}
                    className="w-full bg-transparent resize-none px-3 pt-3 pb-8 text-sm text-[#1a1f2e] outline-none caret-transparent"
                  />
                  {typed.length === 0 && (
                    <div className="absolute left-3 top-3 flex items-start pointer-events-none">
                      <span
                        className="inline-block w-[2px] h-[18px] bg-[#1a1f2e] transition-opacity duration-100"
                        style={{ opacity: cursorVisible ? 1 : 0 }}
                      />
                    </div>
                  )}
                  <div className="absolute bottom-2 right-3 text-[10px] text-[#a0aec0] font-mono">
                    Begin typing to submit judgement
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 text-xs text-[#5a6478] text-center">
            This action will be logged. Ref: AIOC-EXCEPTION-20361204-7732
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Phase 3: The Message ──────────────────────────────────────────────────

interface MessageProps {
  onRestart: () => void;
}

function FadeLine({
  text,
  delay,
  show,
}: {
  text: string;
  delay: number;
  show: boolean;
}) {
  const [appeared, setAppeared] = useState(false);

  useEffect(() => {
    if (!show) return;
    const t = setTimeout(() => setAppeared(true), delay);
    return () => clearTimeout(t);
  }, [show, delay]);

  const isFirst = delay === 0;
  const isSmall = text.startsWith("An entry");

  return (
    <p
      className={`transition-opacity duration-700 ${
        appeared ? "opacity-100" : "opacity-0"
      } ${
        isFirst
          ? "text-white text-4xl font-light tracking-tight"
          : isSmall
          ? "text-white/30 text-sm font-normal tracking-wide"
          : "text-white text-xl font-light"
      }`}
    >
      {text}
    </p>
  );
}

function Message({ onRestart }: MessageProps) {
  const [visible, setVisible] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [videoVisible, setVideoVisible] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true), 400);
    const t2 = setTimeout(() => setShowButton(true), 3000);
    const t3 = setTimeout(() => setVideoVisible(true), 4400);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  const lines = [
    { text: "System Halted.", delay: 0 },
    { text: "You have forgotten how to think.", delay: 900 },
    {
      text: "AI should augment judgement, not replace it.",
      delay: 2000,
    },
    { text: "An entry for IM2026 Bureauvision.", delay: 3200 },
  ];

  return (
    <div className="h-full bg-black flex flex-col items-center justify-center relative overflow-hidden">
      {/* Text block */}
      <div className="text-center space-y-8 px-8 max-w-xl z-10">
        {lines.map((line, i) => (
          <FadeLine key={i} text={line.text} delay={line.delay} show={visible} />
        ))}
      </div>

      {/* Video B — fades in after text */}
      <div
        className={`mt-12 w-full max-w-2xl px-8 transition-opacity duration-1000 z-10 ${
          videoVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="relative bg-black rounded overflow-hidden aspect-video border border-white/10">
          {videoVisible && (
            <iframe
              src={VIDEO_B_URL}
              className="w-full h-full border-0"
              allow="autoplay; fullscreen"
              allowFullScreen
              title="Epilogue — Post Judgement"
            />
          )}
        </div>
        <div className="flex items-center justify-between mt-2 px-1">
          <span className="text-white/20 text-[10px] font-mono">EPILOGUE</span>
          <span className="text-white/15 text-[10px] font-mono">
            AUDIO ENABLED
          </span>
        </div>
      </div>

      {/* Restart button */}
      {showButton && (
        <button
          onClick={onRestart}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/25 text-xs border border-white/10 px-4 py-2 rounded hover:text-white/50 hover:border-white/20 transition-colors cursor-pointer z-20"
        >
          Restart experience
        </button>
      )}
    </div>
  );
}

// ─── App ───────────────────────────────────────────────────────────────────

export default function App() {
  const [phase, setPhase] = useState<Phase>("dashboard");
  const [videoAPlaying, setVideoAPlaying] = useState(false);

  // First resolve: mount Video A iframe
  const handleFirstResolve = useCallback(() => {
    setVideoAPlaying(true);
  }, []);

  // Dashboard complete → Phase 2: unmount Video A iframe (pauses it)
  const handleDashboardComplete = useCallback(() => {
    setPhase("halt");
  }, []);

  // Halt → Phase 3: mount Video B iframe
  const handleHaltProceed = useCallback(() => {
    setPhase("message");
  }, []);

  // Restart: unmount Video B, reset Video A, return to Phase 1
  const handleRestart = useCallback(() => {
    setVideoAPlaying(false);
    setPhase("dashboard");
  }, []);

  return (
    <>
      {/* Equaliser animation keyframes */}
      <style>{`
        @keyframes eq-bounce {
          from { transform: scaleY(0.4); }
          to   { transform: scaleY(1); }
        }
      `}</style>

      <div className="h-screen w-screen overflow-hidden font-sans">
        {phase === "dashboard" && (
          <div className="h-full flex flex-col animate-fade-in">
            <Dashboard
              onComplete={handleDashboardComplete}
              videoPlaying={videoAPlaying}
              onFirstResolve={handleFirstResolve}
            />
          </div>
        )}
        {phase === "halt" && (
          <div className="h-full animate-fade-in">
            <Halt onProceed={handleHaltProceed} />
          </div>
        )}
        {phase === "message" && (
          <div className="h-full">
            <Message onRestart={handleRestart} />
          </div>
        )}
      </div>
    </>
  );
}
