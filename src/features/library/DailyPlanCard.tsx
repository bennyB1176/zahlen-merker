import { useStore } from '../../store';
import { computeDailyPlan, DAILY_MINUTES } from '../../data/dailyPlan';

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function CheckRow({ done, label }: { done: boolean; label: string }) {
  return (
    <li className={`check-row${done ? ' done' : ''}`}>
      <span className="check-mark" aria-hidden>
        {done ? '✓' : '○'}
      </span>
      {label}
    </li>
  );
}

export function DailyPlanCard() {
  const sessions = useStore((s) => s.sessions);
  const numberRounds = useStore((s) => s.numberRounds);
  const streak = useStore((s) => s.settings.streak);
  const setView = useStore((s) => s.setView);

  const plan = computeDailyPlan(sessions, numberRounds, todayKey());

  return (
    <div className="card daily-plan">
      <h3>Today’s practice</h3>
      <p className="meta">
        About {DAILY_MINUTES} a day, done consistently, beats rare long sessions.
        {streak > 0 ? ` Streak: ${streak} day${streak === 1 ? '' : 's'}.` : ''}
      </p>

      {plan.allComplete ? (
        <p className="note">Nice — today’s practice is done. ✓</p>
      ) : (
        <ul className="checklist">
          <CheckRow
            done={plan.readingComplete}
            label={`📖 Read with quiz — ${plan.readingDone}/${plan.readingGoal}`}
          />
          <CheckRow
            done={plan.numbersComplete}
            label={`🔢 Number flash — ${plan.numbersDone}/${plan.numbersGoal}`}
          />
        </ul>
      )}

      {!plan.numbersComplete && (
        <button className="btn" onClick={() => setView('numbers')}>
          Practice numbers
        </button>
      )}
    </div>
  );
}
