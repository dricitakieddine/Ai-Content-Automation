import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  Lightbulb,
  PenTool,
  Library,
  Search,
  Youtube,
  FileText,
  Share2,
  Instagram,
  Facebook,
  Calendar,
  Sparkles,
  BarChart3,
  Plus,
  ArrowRight,
  Check,
  TrendingUp,
  TrendingDown,
  ChevronRight,
} from "lucide-react";
import "./style.css";

/* ---------------------------------------------------------
   Data — unchanged from the original.
--------------------------------------------------------- */
const PLATFORM_ICON = {
  blog: FileText,
  youtube: Youtube,
  socials: Share2,
  instagram: Instagram,
  facebook: Facebook,
};

const PLATFORM_LABEL = {
  blog: "Blog",
  youtube: "YouTube",
  socials: "Socials",
  instagram: "Instagram",
  facebook: "Facebook",
};

const STATUS_ORDER = ["draft", "scheduled", "published"];
const STATUS_META = {
  draft: { label: "Drafts", dotClass: "chip-dot--neutral" },
  scheduled: { label: "Scheduled", dotClass: "chip-dot--gold" },
  published: { label: "Published", dotClass: "chip-dot--teal" },
};

const INITIAL_POSTS = [
  { id: "p1", title: "8 AI Tools Every Marketer Needs Next Year", platforms: ["blog"], status: "draft" },
  { id: "p2", title: "10 AI Trends Reshaping Content Teams", platforms: ["blog", "socials"], status: "draft" },
  { id: "p3", title: "Behind the Scenes: Our Content Pipeline", platforms: ["instagram"], status: "draft" },
  { id: "p4", title: "The Future of SEO: What Changes This Year", platforms: ["blog", "youtube"], status: "scheduled" },
  { id: "p5", title: "Weekly Roundup: Automation Wins", platforms: ["socials", "facebook"], status: "scheduled" },
  { id: "p6", title: "Content Automation, Demystified", platforms: ["youtube"], status: "published" },
  { id: "p7", title: "Repurposing One Article Into Six Posts", platforms: ["blog", "instagram"], status: "published" },
];

const INITIAL_TOPICS = [
  { id: "t1", name: "AI Automation Playbooks", score: 92, trend: 6 },
  { id: "t2", name: "No-Code Workflow Guides", score: 84, trend: 3 },
  { id: "t3", name: "SEO for SaaS Founders", score: 77, trend: -2 },
  { id: "t4", name: "LLM Agent Case Studies", score: 71, trend: 9 },
  { id: "t5", name: "Short-Form Video Hooks", score: 63, trend: -4 },
];

const VELOCITY = [
  { label: "Mon", value: 4 },
  { label: "Tue", value: 7 },
  { label: "Wed", value: 5 },
  { label: "Thu", value: 9 },
  { label: "Fri", value: 6 },
  { label: "Sat", value: 3 },
  { label: "Sun", value: 5 },
];

const DRAFT_SEGMENTS = [
  { type: "text", value: "AI is transforming content marketing " },
  { type: "edit", id: "s1", original: "at an unprecedented pace", revision: "faster than most teams can track" },
  { type: "text", value: ". Businesses that adopt automation early " },
  { type: "edit", id: "s2", original: "gain a significant advantage", revision: "pull ahead of slower competitors" },
  { type: "text", value: " over competitors who are slow to adapt. From draft generation to SEO optimization, machine learning tools " },
  { type: "edit", id: "s3", original: "are becoming essential", revision: "have become essential" },
  { type: "text", value: " to how modern content teams operate." },
];

const SUGGESTION_NOTE = {
  s1: "Sharper pacing — replaces a stock phrase with a concrete claim.",
  s2: "Shorter and more direct; keeps the sentence moving.",
  s3: "Tense correction — the shift already happened, not still happening.",
};

const QUICK_ACTIONS = [
  { icon: Calendar, label: "Plan editorial calendar", msg: "Opening the editorial calendar…" },
  { icon: PenTool, label: "Draft with AI", msg: "Starting a new AI-assisted draft…" },
  { icon: Search, label: "Optimize for SEO", msg: "Running SEO checks on your latest post…" },
  { icon: BarChart3, label: "Track performance", msg: "Loading this week's performance report…" },
];

/* ---------------------------------------------------------
   Shared building blocks
--------------------------------------------------------- */
function Badge({ children, tone = "neutral" }) {
  return <span className={`badge badge--${tone}`}>{children}</span>;
}

function Reveal({ as: Tag = "div", index = 0, className = "", children, ...props }) {
  return (
    <Tag className={`reveal ${className}`} style={{ "--stagger": index }} {...props}>
      {children}
    </Tag>
  );
}

function PlatformIcons({ platforms }) {
  return (
    <div className="flex items-center gap-1.5">
      {platforms.map((p) => {
        const Icon = PLATFORM_ICON[p];
        return (
          <span key={p} className="chip h-6 w-6" title={PLATFORM_LABEL[p]}>
            <Icon size={13} strokeWidth={1.75} aria-hidden="true" />
            <span className="sr-only">{PLATFORM_LABEL[p]}</span>
          </span>
        );
      })}
    </div>
  );
}

/* ---------------------------------------------------------
   Hero feature card
--------------------------------------------------------- */
function FeatureCard({ icon: Icon, title, desc, index }) {
  return (
    <Reveal
      index={index}
      className="feature-card rounded-[var(--radius-lg)] border border-black/[0.08] bg-white/60 p-6"
    >
      <div
        className="mb-4 flex h-11 w-11 items-center justify-center rounded-[var(--radius-md)]"
        style={{ background: "var(--color-charcoal)", color: "var(--color-gold)" }}
      >
        <Icon size={20} strokeWidth={1.75} aria-hidden="true" />
      </div>
      <h3 className="text-[15px] font-semibold" style={{ color: "var(--color-ink)" }}>
        {title}
      </h3>
      <p className="mt-1.5 text-sm leading-relaxed" style={{ color: "var(--color-ink-soft)" }}>
        {desc}
      </p>
    </Reveal>
  );
}

/* ---------------------------------------------------------
   Kanban post card
--------------------------------------------------------- */
function PostCard({ post, onAdvance }) {
  const next = STATUS_ORDER[STATUS_ORDER.indexOf(post.status) + 1];
  return (
    <div className="post-card tile">
      <p className="text-sm font-medium leading-snug" style={{ color: "var(--color-paper-on-charcoal)" }}>
        {post.title}
      </p>
      <div className="mt-3 flex items-center justify-between">
        <PlatformIcons platforms={post.platforms} />
        {next && (
          <button
            type="button"
            onClick={() => onAdvance(post.id)}
            className="btn btn--nav"
            aria-label={`Move "${post.title}" to ${STATUS_META[next].label}`}
          >
            {STATUS_META[next].label}
            <ChevronRight size={13} aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   Kanban board
--------------------------------------------------------- */
function KanbanBoard({ posts, onAdvance, onNewPost }) {
  return (
    <div id="workflows" className="panel panel--elevated mt-6 scroll-mt-24">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-[15px] font-semibold" style={{ color: "var(--color-paper-on-charcoal)" }}>
          Editorial kanban
        </h3>
        <button type="button" onClick={onNewPost} className="btn btn--outline">
          <Plus size={13} aria-hidden="true" /> New post
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {STATUS_ORDER.map((status) => {
          const columnPosts = posts.filter((p) => p.status === status);
          return (
            <div key={status}>
              <div className="mb-3 flex items-center gap-2 px-1">
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{
                    backgroundColor:
                      status === "draft" ? "#a8a29a" : status === "scheduled" ? "var(--color-gold)" : "var(--color-teal)",
                  }}
                  aria-hidden="true"
                />
                <p className="text-xs font-medium" style={{ color: "var(--color-paper-on-charcoal-faint)" }}>
                  {STATUS_META[status].label}
                </p>
                <span className="text-xs" style={{ color: "#5a5d60" }}>
                  {columnPosts.length}
                </span>
              </div>
              <div className="space-y-3">
                {columnPosts.map((post) => (
                  <PostCard key={post.id} post={post} onAdvance={onAdvance} />
                ))}
                {columnPosts.length === 0 && (
                  <p className="tile text-xs" style={{ color: "var(--color-paper-on-charcoal-mute)" }}>
                    Nothing here yet.
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   Topic suggestions + velocity chart
--------------------------------------------------------- */
function TopicRow({ topic }) {
  const trendingUp = topic.trend >= 0;
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs" style={{ color: "var(--color-paper-on-charcoal-faint)" }}>
        <span>{topic.name}</span>
        <span
          className="flex items-center gap-1"
          style={{ color: trendingUp ? "var(--color-teal)" : "var(--color-gold)" }}
        >
          {trendingUp ? <TrendingUp size={12} aria-hidden="true" /> : <TrendingDown size={12} aria-hidden="true" />}
          {Math.abs(topic.trend)}
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-white/5">
        <div
          className="score-fill h-full rounded-full"
          style={{
            width: `${topic.score}%`,
            background: "linear-gradient(90deg, var(--color-gold), var(--color-gold-bright))",
          }}
        />
      </div>
    </div>
  );
}

function VelocityChart({ data }) {
  const max = useMemo(() => Math.max(...data.map((v) => v.value)), [data]);
  return (
    <div className="tile flex flex-col justify-between">
      <p className="mb-3 text-xs" style={{ color: "var(--color-paper-on-charcoal-faint)" }}>
        Publishing velocity, last 7 days
      </p>
      <div className="flex h-28 items-end gap-2" role="img" aria-label="Bar chart of posts published per day this week">
        {data.map((v) => (
          <div key={v.label} className="flex flex-1 flex-col items-center gap-2">
            <div
              className="velocity-bar w-full rounded-t-md"
              style={{ height: `${(v.value / max) * 100}%`, background: "var(--color-teal-wash-strong)" }}
            />
            <span className="text-[10px]" style={{ color: "var(--color-paper-on-charcoal-mute)" }}>
              {v.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TopicSuggestions({ topics, velocity }) {
  return (
    <div className="panel panel--elevated lg:col-span-2">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-[15px] font-semibold" style={{ color: "var(--color-paper-on-charcoal)" }}>
          Data-driven topic suggestions
        </h3>
        <Badge tone="gold">
          <Sparkles size={12} aria-hidden="true" /> Updated today
        </Badge>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-3">
          {topics.map((t) => (
            <TopicRow key={t.id} topic={t} />
          ))}
        </div>
        <VelocityChart data={velocity} />
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   Quick actions
--------------------------------------------------------- */
function QuickActions({ toast, onFire }) {
  return (
    <div className="panel panel--elevated">
      <h3 className="mb-5 text-[15px] font-semibold" style={{ color: "var(--color-paper-on-charcoal)" }}>
        Quick actions
      </h3>
      <div className="space-y-2">
        {QUICK_ACTIONS.map(({ icon: Icon, label, msg }) => (
          <button key={label} type="button" onClick={() => onFire(msg)} className="btn btn--quiet">
            <span className="chip h-8 w-8" style={{ color: "var(--color-gold)" }}>
              <Icon size={15} strokeWidth={1.75} aria-hidden="true" />
            </span>
            {label}
          </button>
        ))}
      </div>
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="mt-4 rounded-[var(--radius-sm)] px-3 py-2 text-xs md:hidden"
          style={{ border: "1px solid var(--color-gold-wash-strong)", background: "var(--color-gold-wash)", color: "var(--color-gold-bright)" }}
        >
          {toast}
        </div>
      )}
    </div>
  );
}

/* ---------------------------------------------------------
   Draft reviewer + suggestions
--------------------------------------------------------- */
function DraftReviewer({ applied, appliedCount, editCount }) {
  return (
    <div className="panel panel--elevated lg:col-span-3">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs" style={{ color: "var(--color-paper-on-charcoal-mute)" }}>
            Draft reviewer
          </p>
          <h3 className="text-[15px] font-semibold" style={{ color: "var(--color-paper-on-charcoal)" }}>
            10 AI Trends Reshaping Content Teams
          </h3>
        </div>
        <Badge tone={appliedCount === editCount ? "teal" : "neutral"}>
          {appliedCount}/{editCount} applied
        </Badge>
      </div>
      <p className="text-[15px] leading-[1.9]" style={{ color: "var(--color-paper-on-charcoal-soft)" }}>
        {DRAFT_SEGMENTS.map((seg, i) => {
          if (seg.type === "text") return <span key={i}>{seg.value}</span>;
          const isApplied = applied[seg.id];
          return (
            <span
              key={seg.id}
              className="rounded px-1 py-0.5"
              style={{
                transition: "background-color 300ms var(--ease-out), color 300ms var(--ease-out)",
                background: isApplied ? "var(--color-teal-wash)" : "var(--color-gold-wash)",
                color: isApplied ? "var(--color-teal-bright)" : "var(--color-gold-bright)",
                textDecoration: isApplied ? "none" : "underline dotted",
                textUnderlineOffset: isApplied ? undefined : "4px",
              }}
            >
              {isApplied ? seg.revision : seg.original}
            </span>
          );
        })}
      </p>
    </div>
  );
}

function SuggestionCard({ segment, isApplied, onApply, onRevert }) {
  return (
    <div className="suggestion-card tile">
      <p className="font-note text-sm" style={{ color: "var(--color-paper-on-charcoal-faint)" }}>
        {SUGGESTION_NOTE[segment.id]}
      </p>
      <div className="mt-2 flex items-center justify-between gap-2">
        <span className="truncate text-xs" style={{ color: "var(--color-paper-on-charcoal-mute)" }}>
          “{segment.revision}”
        </span>
        {isApplied ? (
          <button type="button" onClick={() => onRevert(segment.id)} className="btn btn--teal shrink-0">
            <Check size={12} aria-hidden="true" /> Applied
          </button>
        ) : (
          <button type="button" onClick={() => onApply(segment.id)} className="btn btn--gold shrink-0">
            Apply <ArrowRight size={12} aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  );
}

function SuggestionsPanel({ applied, onApply, onRevert }) {
  return (
    <div className="panel panel--elevated lg:col-span-2">
      <h3 className="mb-4 text-[15px] font-semibold" style={{ color: "var(--color-paper-on-charcoal)" }}>
        Suggested improvements
      </h3>
      <div className="space-y-3">
        {DRAFT_SEGMENTS.filter((s) => s.type === "edit").map((seg) => (
          <SuggestionCard key={seg.id} segment={seg} isApplied={applied[seg.id]} onApply={onApply} onRevert={onRevert} />
        ))}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   Header
--------------------------------------------------------- */
function Header({ onNavigate }) {
  const navItems = [
    { id: "features", label: "Features" },
    { id: "analytics", label: "Analytics" },
    { id: "workflows", label: "Workflows" },
  ];
  return (
    <header
      className="sticky top-0 z-30 backdrop-blur"
      style={{ borderBottom: "1px solid rgba(0,0,0,0.06)", background: "rgba(249,248,246,0.9)" }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div
            className="font-display flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold"
            style={{ background: "var(--color-charcoal)", color: "var(--color-gold)" }}
          >
            TD
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold" style={{ color: "var(--color-ink)" }}>
              Takieddine Drici
            </p>
            <p className="text-[11px] tracking-wide" style={{ color: "var(--color-ink-faint)" }}>
              Web Developer &amp; AI Builder
            </p>
          </div>
        </div>

        <nav className="hidden items-center gap-7 text-sm md:flex" style={{ color: "#4a4942" }} aria-label="Section navigation">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={onNavigate(item.id)}
              className="rounded transition-colors hover:text-[var(--color-ink)]"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <a href="#dashboard" onClick={onNavigate("dashboard")} className="btn btn--primary">
          Launch Platform
        </a>
      </div>
    </header>
  );
}

/* ---------------------------------------------------------
   Hero
--------------------------------------------------------- */
function Hero() {
  const features = [
    { icon: Lightbulb, title: "Intelligent Insights", desc: "Topic scoring built from search demand and audience signals, refreshed daily." },
    { icon: PenTool, title: "AI Editor", desc: "Draft, revise, and tighten copy with inline suggestions you approve one at a time." },
    { icon: Library, title: "Central Content Library", desc: "Every draft, asset, and published post in one searchable place." },
    { icon: Search, title: "Deep SEO Optimization", desc: "Keyword coverage and on-page checks surfaced before you hit publish." },
  ];

  return (
    <section className="mx-auto max-w-6xl px-6 pb-16 pt-16 md:pt-20">
      <Reveal index={0} as="h1" className="font-display text-[clamp(2.25rem,8vw,4.25rem)] leading-[0.98] tracking-tight" style={{ color: "var(--color-ink)" }}>
        AI Content
        <br />
        Automation Hub
      </Reveal>
      <Reveal index={1} as="p" className="font-note mt-4 text-xl md:text-2xl" style={{ color: "#5b5a50" }}>
        Orchestrate content strategy
      </Reveal>
      <Reveal index={2} as="p" className="mt-5 max-w-xl text-[15px] leading-relaxed" style={{ color: "#5b5a50" }}>
        Create. Analyze. Publish. Amplify. Leverage machine learning for complete content cycle
        mastery — from the first topic idea to the published post.
      </Reveal>

      <div id="features" className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 scroll-mt-24">
        {features.map((f, i) => (
          <FeatureCard key={f.title} {...f} index={i + 3} />
        ))}
      </div>
    </section>
  );
}

/* ---------------------------------------------------------
   App
--------------------------------------------------------- */
export default function App() {
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [applied, setApplied] = useState({});
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  const advancePost = useCallback((id) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id !== id) return post;
        const idx = STATUS_ORDER.indexOf(post.status);
        const nextStatus = STATUS_ORDER[idx + 1] || post.status;
        return { ...post, status: nextStatus };
      })
    );
  }, []);

  const applySuggestion = useCallback((id) => {
    setApplied((prev) => ({ ...prev, [id]: true }));
  }, []);

  const revertSuggestion = useCallback((id) => {
    setApplied((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  }, []);

  const fireToast = useCallback((message) => {
    setToast(message);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2200);
  }, []);

  const scrollToId = (id) => (e) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const editCount = DRAFT_SEGMENTS.filter((s) => s.type === "edit").length;
  const appliedCount = Object.keys(applied).length;

  return (
    <div className="min-h-screen w-full" style={{ backgroundColor: "var(--color-canvas)", color: "var(--color-ink)" }}>
      <Header onNavigate={scrollToId} />
      <Hero />

      <section id="dashboard" className="scroll-mt-16 py-14" style={{ borderTop: "1px solid rgba(0,0,0,0.06)", background: "var(--color-canvas-alt)" }}>
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="font-display text-2xl" style={{ color: "var(--color-ink)" }}>
                Content Ecosystem Hub
              </h2>
              <p className="font-note" style={{ color: "var(--color-ink-faint)" }}>
                Everything in motion, at a glance
              </p>
            </div>
            {toast && (
              <div
                role="status"
                aria-live="polite"
                className="hidden rounded-full px-4 py-2 text-sm md:block"
                style={{ border: "1px solid var(--color-gold-wash-strong)", background: "var(--color-gold-wash)", color: "#8a6d14" }}
              >
                {toast}
              </div>
            )}
          </div>

          <div id="analytics" className="grid grid-cols-1 gap-5 lg:grid-cols-3 scroll-mt-24">
            <TopicSuggestions topics={INITIAL_TOPICS} velocity={VELOCITY} />
            <QuickActions toast={toast} onFire={fireToast} />
          </div>

          <KanbanBoard
            posts={posts}
            onAdvance={advancePost}
            onNewPost={() => fireToast("Draft slot ready in the Drafts column.")}
          />

          <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-5">
            <DraftReviewer applied={applied} appliedCount={appliedCount} editCount={editCount} />
            <SuggestionsPanel applied={applied} onApply={applySuggestion} onRevert={revertSuggestion} />
          </div>
        </div>
      </section>

      <footer className="py-8 text-center text-xs" style={{ borderTop: "1px solid rgba(0,0,0,0.06)", color: "var(--color-ink-faint)" }}>
        AI Content Automation Hub — built by Takieddine Drici
      </footer>
    </div>
  );
}
