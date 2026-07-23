import type { RsvpWord } from '../engine/types';

/**
 * RSVP word display with the ORP pivot letter fixed at the horizontal centre.
 * The `before` half is right-aligned and the `after` half left-aligned so the
 * pivot never moves, eliminating eye travel between words.
 */
export function RsvpDisplay({ word }: { word: RsvpWord | null }) {
  return (
    <div className="rsvp-stage" data-testid="rsvp-stage">
      <span className="rsvp-guide top" aria-hidden />
      <span className="rsvp-guide bottom" aria-hidden />
      <div className="rsvp-word" aria-live="polite" data-testid="rsvp-word">
        <span className="before">{word?.before ?? ''}</span>
        <span className="pivot" data-testid="rsvp-pivot">
          {word?.pivot ?? ' '}
        </span>
        <span className="after">{word?.after ?? ''}</span>
      </div>
    </div>
  );
}
