import type { RsvpWord } from '../engine/types';

/**
 * Guided-highlight mode: the full passage stays visible and a highlight sweeps
 * across it word-by-word at the target pace. Unlike RSVP, this trains the eye
 * movements (saccades) used in ordinary reading, which transfer better to books
 * and screens.
 */
export function HighlightReader({
  sequence,
  activeIndex,
}: {
  sequence: RsvpWord[];
  activeIndex: number;
}) {
  return (
    <div className="highlight-stage" data-testid="highlight-stage">
      {sequence.map((w, i) => (
        <span key={i} className={`tok${i === activeIndex ? ' active' : ''}`}>
          {w.text}{' '}
        </span>
      ))}
    </div>
  );
}
