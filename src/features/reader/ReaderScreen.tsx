import { useMemo } from 'react';
import { useStore } from '../../store';
import { buildRsvpSequence } from '../../engine/rsvp';
import { useWordPlayer } from '../../hooks/useWordPlayer';
import { RsvpDisplay } from '../../components/RsvpDisplay';
import { HighlightReader } from '../../components/HighlightReader';

export function ReaderScreen() {
  const passage = useStore((s) => s.passage);
  const mode = useStore((s) => s.mode);
  const targetWpm = useStore((s) => s.targetWpm);
  const chunkSize = useStore((s) => s.settings.chunkSize);
  const setMode = useStore((s) => s.setMode);
  const setTargetWpm = useStore((s) => s.setTargetWpm);
  const finishReading = useStore((s) => s.finishReading);
  const setView = useStore((s) => s.setView);

  const sequence = useMemo(
    () =>
      passage
        ? buildRsvpSequence(passage.text, targetWpm, mode === 'rsvp' ? chunkSize : 1)
        : [],
    [passage, targetWpm, chunkSize, mode],
  );

  // On completion we stop and show a Continue button rather than auto-advancing,
  // so the reader controls when to move to the quiz/results.
  const player = useWordPlayer(sequence, () => {});

  if (!passage) {
    return (
      <div className="screen">
        <p className="empty">No passage selected.</p>
        <button className="btn" onClick={() => setView('library')}>
          Go to library
        </button>
      </div>
    );
  }

  return (
    <div className="screen">
      <button
        className="btn ghost"
        onClick={() => setView('library')}
        style={{ width: 'auto' }}
      >
        ← Library
      </button>
      <h1 style={{ marginTop: 12 }}>{passage.title}</h1>
      <p className="subtitle">
        {passage.wordCount} words
        {passage.questions.length > 0 && (
          <span className="tag">{passage.questions.length}-question quiz</span>
        )}
      </p>

      <div className="field">
        <div className="control-label">Mode</div>
        <div className="segmented" role="group" aria-label="Reading mode">
          <button
            aria-pressed={mode === 'rsvp'}
            onClick={() => setMode('rsvp')}
            disabled={player.playing}
          >
            RSVP (flash)
          </button>
          <button
            aria-pressed={mode === 'highlight'}
            onClick={() => setMode('highlight')}
            disabled={player.playing}
          >
            Guided highlight
          </button>
        </div>
      </div>

      <div className="field">
        <div className="control-label">Target speed (words per minute)</div>
        <div className="stepper">
          <button
            aria-label="Slower"
            onClick={() => setTargetWpm(targetWpm - 25)}
            disabled={player.playing}
          >
            −
          </button>
          <span className="value" data-testid="wpm-value">
            {targetWpm}
          </span>
          <button
            aria-label="Faster"
            onClick={() => setTargetWpm(targetWpm + 25)}
            disabled={player.playing}
          >
            +
          </button>
        </div>
      </div>

      <div className="reader-wrap">
        {mode === 'rsvp' ? (
          <RsvpDisplay word={player.current} />
        ) : (
          <HighlightReader sequence={sequence} activeIndex={player.index} />
        )}

        <div className="progress-track" aria-hidden>
          <div className="progress-fill" style={{ width: `${player.progressPct}%` }} />
        </div>

        {!player.finished ? (
          <div className="btn-row">
            <button className="btn" onClick={player.restart}>
              Restart
            </button>
            <button
              className="btn primary"
              onClick={player.toggle}
              data-testid="play-toggle"
            >
              {player.playing ? 'Pause' : player.index > 0 ? 'Resume' : 'Start'}
            </button>
          </div>
        ) : (
          <button
            className="btn primary"
            data-testid="continue-btn"
            onClick={() => finishReading(player.totalDurationMs, passage.wordCount)}
          >
            {passage.questions.length > 0 ? 'Continue to quiz →' : 'See results →'}
          </button>
        )}
      </div>
    </div>
  );
}
