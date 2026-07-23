import { useStore } from '../../store';
import { TrendChart } from '../../components/TrendChart';

function Kpi({
  value,
  label,
  headline,
}: {
  value: string;
  label: string;
  headline?: boolean;
}) {
  return (
    <div className="kpi">
      <div className={`value${headline ? ' headline' : ''}`}>{value}</div>
      <div className="label">{label}</div>
    </div>
  );
}

export function ProgressScreen() {
  const progress = useStore((s) => s.progress);
  const streak = useStore((s) => s.settings.streak);
  const clearProgress = useStore((s) => s.clearProgress);
  const setView = useStore((s) => s.setView);

  if (progress.totalSessions === 0) {
    return (
      <div className="screen">
        <h1>Your progress</h1>
        <p className="empty">
          No sessions yet. Read your first passage to start tracking your effective
          reading speed.
        </p>
        <button className="btn primary" onClick={() => setView('library')}>
          Start reading
        </button>
      </div>
    );
  }

  return (
    <div className="screen">
      <h1>Your progress</h1>
      <p className="subtitle">
        Effective WPM = reading speed weighted by how much you understood.
      </p>

      <div className="kpi-grid">
        <Kpi value={`${progress.latestEWpm}`} label="Latest effective WPM" headline />
        <Kpi value={`${progress.bestEWpm}`} label="Personal best" />
        <Kpi
          value={
            progress.improvementPct >= 0
              ? `+${progress.improvementPct}%`
              : `${progress.improvementPct}%`
          }
          label="Since baseline"
        />
        <Kpi
          value={
            progress.avgComprehension === null ? '—' : `${progress.avgComprehension}%`
          }
          label="Avg comprehension"
        />
      </div>

      <div className="card">
        <h3>Effective WPM over time</h3>
        <TrendChart points={progress.trend} />
      </div>

      <div className="kpi-grid">
        <Kpi value={`${progress.totalSessions}`} label="Sessions" />
        <Kpi value={`${streak} 🔥`} label="Day streak" />
      </div>

      <button
        className="btn ghost"
        data-testid="reset-progress"
        onClick={() => {
          if (confirm('Delete all sessions and progress? This cannot be undone.')) {
            clearProgress();
          }
        }}
      >
        Reset progress
      </button>
    </div>
  );
}
