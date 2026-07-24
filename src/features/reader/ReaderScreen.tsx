import { useMemo } from 'react';
import { useStore } from '../../store';
import { buildRsvpSequence } from '../../engine/rsvp';
import {
  pushTargetWpm,
  DISTRACTOR_BPM_MIN,
  DISTRACTOR_BPM_MAX,
} from '../../engine/focus';
import { useWordPlayer } from '../../hooks/useWordPlayer';
import { useMetronome } from '../../hooks/useMetronome';
import { RsvpDisplay } from '../../components/RsvpDisplay';
import { HighlightReader } from '../../components/HighlightReader';

export function ReaderScreen() {
  const passage = useStore((s) => s.passage);
  const mode = useStore((s) => s.mode);
  const targetWpm = useStore((s) => s.targetWpm);
  const chunkSize = useStore((s) => s.settings.chunkSize);
  const distractorEnabled = useStore((s) => s.settings.distractorEnabled);
  const distractorBpm = useStore((s) => s.settings.distractorBpm);
  const setMode = useStore((s) => s.setMode);
  const setTargetWpm = useStore((s) => s.setTargetWpm);
  const setChunkSize = useStore((s) => s.setChunkSize);
  const setDistractor = useStore((s) => s.setDistractor);
  const setDistractorBpm = useStore((s) => s.setDistractorBpm);
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

  // The metronome distractor runs only while words are actually flashing.
  useMetronome({
    enabled: distractorEnabled,
    bpm: distractorBpm,
    active: player.playing,
  });

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
          <button
            className="preset"
            onClick={() => setTargetWpm(pushTargetWpm(targetWpm))}
            disabled={player.playing}
            title="Jump above the speed where your inner voice can keep up"
          >
            Quiet speed
          </button>
        </div>
      </div>

      {mode === 'rsvp' && (
        <div className="field">
          <div className="control-label">Words per flash</div>
          <div className="stepper">
            <button
              aria-label="Fewer words"
              onClick={() => setChunkSize(chunkSize - 1)}
              disabled={player.playing || chunkSize <= 1}
            >
              −
            </button>
            <span className="value" data-testid="chunk-value">
              {chunkSize}
            </span>
            <button
              aria-label="More words"
              onClick={() => setChunkSize(chunkSize + 1)}
              disabled={player.playing || chunkSize >= 3}
            >
              +
            </button>
          </div>
        </div>
      )}

      <div className="field">
        <div className="control-label">Silence the inner voice (beat)</div>
        <div className="segmented" role="group" aria-label="Metronome distractor">
          <button
            aria-pressed={!distractorEnabled}
            onClick={() => setDistractor(false)}
            disabled={player.playing}
          >
            Off
          </button>
          <button
            aria-pressed={distractorEnabled}
            onClick={() => setDistractor(true)}
            disabled={player.playing}
            data-testid="beat-on"
          >
            On
          </button>
        </div>
        {distractorEnabled && (
          <div className="stepper" style={{ marginTop: 8 }}>
            <button
              aria-label="Slower beat"
              onClick={() => setDistractorBpm(distractorBpm - 10)}
              disabled={player.playing || distractorBpm <= DISTRACTOR_BPM_MIN}
            >
              −
            </button>
            <span className="value" data-testid="bpm-value">
              {distractorBpm} bpm
            </span>
            <button
              aria-label="Faster beat"
              onClick={() => setDistractorBpm(distractorBpm + 10)}
              disabled={player.playing || distractorBpm >= DISTRACTOR_BPM_MAX}
            >
              +
            </button>
          </div>
        )}
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
