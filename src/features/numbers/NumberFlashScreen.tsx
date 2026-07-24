import { useEffect, useRef, useState } from 'react';
import { useStore } from '../../store';
import {
  generateNumber,
  groupDigits,
  DIGITS_MIN,
  DIGITS_MAX,
} from '../../engine/numberflash';
import { DEFAULT_SETTINGS } from '../../data/repository';

type Phase = 'idle' | 'countdown' | 'flashing' | 'input' | 'feedback';

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

export function NumberFlashScreen() {
  const settings = useStore((s) => s.settings);
  const stats = useStore((s) => s.numberStats);
  const mode = useStore((s) => s.numberMode);
  const setMode = useStore((s) => s.setNumberMode);
  const setDigits = useStore((s) => s.setNumberDigits);
  const setFlashMs = useStore((s) => s.setNumberFlashMs);
  const recordRound = useStore((s) => s.recordNumberRound);

  const [phase, setPhase] = useState<Phase>('idle');
  const [count, setCount] = useState(3);
  const [current, setCurrent] = useState('');
  const [typed, setTyped] = useState('');
  const [lastCorrect, setLastCorrect] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fall back to defaults so a settings object missing these fields can never
  // produce a NaN timeout delay (which stalls the flash → input transition).
  const digits = settings.numberDigits ?? DEFAULT_SETTINGS.numberDigits;
  const flashMs = settings.numberFlashMs ?? DEFAULT_SETTINGS.numberFlashMs;

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };
  useEffect(() => () => clearTimers(), []);

  const startRound = () => {
    clearTimers();
    const number = generateNumber(digits);
    setCurrent(number);
    setTyped('');
    setCount(3);
    setPhase('countdown');

    timers.current.push(setTimeout(() => setCount(2), 500));
    timers.current.push(setTimeout(() => setCount(1), 1000));
    timers.current.push(setTimeout(() => setPhase('flashing'), 1500));
    timers.current.push(setTimeout(() => setPhase('input'), 1500 + flashMs));
  };

  // Focus the input when it appears.
  useEffect(() => {
    if (phase === 'input') inputRef.current?.focus();
  }, [phase]);

  const submit = async () => {
    const round = await recordRound(current, typed);
    setLastCorrect(round.correct);
    setPhase('feedback');
  };

  return (
    <div className="screen">
      <h1>Number flash</h1>
      <p className="subtitle">
        A number flashes for a moment — hold it in your mind, then type it. Trains how
        much you can take in at a glance.
      </p>

      <div className="kpi-grid">
        <Kpi value={`${stats.bestSpan || '—'}`} label="Best digit span" headline />
        <Kpi
          value={stats.accuracyPct === null ? '—' : `${stats.accuracyPct}%`}
          label="Accuracy"
        />
      </div>

      <div className="field">
        <div className="control-label">Difficulty</div>
        <div className="segmented" role="group" aria-label="Difficulty mode">
          <button
            aria-pressed={mode === 'adaptive'}
            onClick={() => setMode('adaptive')}
            disabled={phase !== 'idle' && phase !== 'feedback'}
          >
            Adaptive
          </button>
          <button
            aria-pressed={mode === 'manual'}
            onClick={() => setMode('manual')}
            disabled={phase !== 'idle' && phase !== 'feedback'}
          >
            Manual
          </button>
        </div>
      </div>

      {mode === 'manual' && (
        <>
          <div className="field">
            <div className="control-label">Digits</div>
            <div className="stepper">
              <button
                aria-label="Fewer digits"
                onClick={() => setDigits(digits - 1)}
                disabled={digits <= DIGITS_MIN}
              >
                −
              </button>
              <span className="value" data-testid="digits-value">
                {digits}
              </span>
              <button
                aria-label="More digits"
                onClick={() => setDigits(digits + 1)}
                disabled={digits >= DIGITS_MAX}
              >
                +
              </button>
            </div>
          </div>
          <div className="field">
            <div className="control-label">Flash time (ms)</div>
            <div className="stepper">
              <button aria-label="Shorter flash" onClick={() => setFlashMs(flashMs - 50)}>
                −
              </button>
              <span className="value">{flashMs}</span>
              <button aria-label="Longer flash" onClick={() => setFlashMs(flashMs + 50)}>
                +
              </button>
            </div>
          </div>
        </>
      )}

      <div className="rsvp-stage" data-testid="number-stage" style={{ marginTop: 8 }}>
        {phase === 'idle' && (
          <span className="subtitle" style={{ margin: 0 }}>
            {mode === 'adaptive'
              ? `Ready — next number has ${digits} digits.`
              : `Ready — ${digits} digits, ${flashMs} ms.`}
          </span>
        )}
        {phase === 'countdown' && (
          <span className="rsvp-word" data-testid="countdown">
            {count}
          </span>
        )}
        {phase === 'flashing' && (
          <span className="rsvp-word" data-testid="flashed-number">
            {groupDigits(current)}
          </span>
        )}
        {phase === 'input' && (
          <span className="subtitle" style={{ margin: 0 }}>
            Type what you saw
          </span>
        )}
        {phase === 'feedback' && (
          <span
            className="rsvp-word"
            data-testid="feedback-number"
            style={{ color: lastCorrect ? 'var(--good)' : 'var(--danger)' }}
          >
            {groupDigits(current)}
          </span>
        )}
      </div>

      {phase === 'input' && (
        <div className="field" style={{ marginTop: 16 }}>
          <input
            ref={inputRef}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            autoComplete="off"
            aria-label="Your answer"
            data-testid="number-input"
            value={typed}
            onChange={(e) => setTyped(e.target.value.replace(/[^0-9]/g, ''))}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && typed.length > 0) void submit();
            }}
          />
          <button
            className="btn primary"
            style={{ marginTop: 12 }}
            disabled={typed.length === 0}
            onClick={() => void submit()}
            data-testid="number-submit"
          >
            Check
          </button>
        </div>
      )}

      {phase === 'feedback' && (
        <>
          <div
            className="note"
            data-testid="number-feedback"
            style={{ borderLeftColor: lastCorrect ? 'var(--good)' : 'var(--danger)' }}
          >
            {lastCorrect
              ? mode === 'adaptive'
                ? `Correct! Stepping up to ${digits} digits.`
                : 'Correct!'
              : `Not quite — you typed “${typed || '—'}”.` +
                (mode === 'adaptive' ? ` Easing to ${digits} digits.` : '')}
          </div>
          <button className="btn primary" onClick={startRound} data-testid="number-next">
            Next number →
          </button>
        </>
      )}

      {phase === 'idle' && (
        <button className="btn primary" onClick={startRound} data-testid="number-start">
          Start
        </button>
      )}

      <p className="subtitle" style={{ marginTop: 16, fontSize: '0.82rem' }}>
        Rounds played: {stats.rounds}
      </p>
    </div>
  );
}
