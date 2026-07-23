import { useStore } from '../../store';

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

export function ResultsScreen() {
  const result = useStore((s) => s.lastResult);
  const streak = useStore((s) => s.settings.streak);
  const setView = useStore((s) => s.setView);
  const choosePassage = useStore((s) => s.choosePassage);
  const passage = useStore((s) => s.passage);

  if (!result) return null;
  const { session, suggestedWpm } = result;
  const comp = session.comprehensionPct;

  return (
    <div className="screen">
      <h1>Session complete 🎉</h1>
      <p className="subtitle">{session.passageTitle}</p>

      <div className="kpi-grid">
        <Kpi value={`${session.eWpm}`} label="Effective WPM (understood)" headline />
        <Kpi value={`${session.rawWpm}`} label="Raw WPM" />
        <Kpi value={comp === null ? '—' : `${comp}%`} label="Comprehension" />
        <Kpi value={`${streak} 🔥`} label="Day streak" />
      </div>

      {comp !== null && (
        <div className="note" data-testid="coach-note">
          {comp >= 85
            ? `Great comprehension — next time try ${suggestedWpm} WPM to push your limit.`
            : comp < 70
              ? `Comprehension dipped. We've eased your next target to ${suggestedWpm} WPM so understanding leads speed.`
              : `Solid. Staying around ${suggestedWpm} WPM will lock this in before speeding up.`}
        </div>
      )}
      {comp === null && (
        <div className="note">
          Pasted text has no quiz, so this counts toward raw speed only. Use the library
          to measure comprehension.
        </div>
      )}

      <div className="btn-row" style={{ marginTop: 8 }}>
        <button className="btn" onClick={() => setView('progress')}>
          View progress
        </button>
        {passage && !passage.id.startsWith('custom-') ? (
          <button className="btn primary" onClick={() => choosePassage(passage)}>
            Read again
          </button>
        ) : (
          <button className="btn primary" onClick={() => setView('library')}>
            Read another
          </button>
        )}
      </div>
    </div>
  );
}
