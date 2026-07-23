import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RsvpDisplay } from './RsvpDisplay';
import { buildRsvpSequence } from '../engine/rsvp';

describe('RsvpDisplay', () => {
  it('renders the pivot letter separately from the rest of the word', () => {
    const [word] = buildRsvpSequence('reading', 300, 1);
    render(<RsvpDisplay word={word!} />);
    expect(screen.getByTestId('rsvp-pivot')).toHaveTextContent('a');
    expect(screen.getByTestId('rsvp-word')).toHaveTextContent('reading');
  });

  it('renders safely with no word', () => {
    render(<RsvpDisplay word={null} />);
    expect(screen.getByTestId('rsvp-stage')).toBeInTheDocument();
  });
});
