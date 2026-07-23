import { useCallback, useEffect, useRef, useState } from 'react';
import type { RsvpWord } from '../engine/types';

export interface WordPlayer {
  index: number;
  current: RsvpWord | null;
  playing: boolean;
  finished: boolean;
  progressPct: number;
  totalDurationMs: number;
  play: () => void;
  pause: () => void;
  toggle: () => void;
  restart: () => void;
}

/**
 * Drives a timed RSVP/highlight sequence. Each word is shown for its own
 * `durationMs`, then the next is scheduled. Pausing stops the timer in place;
 * play resumes from the current word.
 */
export function useWordPlayer(
  sequence: RsvpWord[],
  onFinish: (elapsedMs: number) => void,
): WordPlayer {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [finished, setFinished] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onFinishRef = useRef(onFinish);
  onFinishRef.current = onFinish;

  const totalDurationMs = sequence.reduce((sum, w) => sum + w.durationMs, 0);

  const clear = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  }, []);

  const pause = useCallback(() => {
    clear();
    setPlaying(false);
  }, [clear]);

  const restart = useCallback(() => {
    clear();
    setIndex(0);
    setFinished(false);
    setPlaying(false);
  }, [clear]);

  const play = useCallback(() => {
    if (sequence.length === 0 || finished) return;
    setPlaying(true);
  }, [sequence.length, finished]);

  const toggle = useCallback(() => {
    if (playing) pause();
    else play();
  }, [playing, pause, play]);

  // Advance while playing.
  useEffect(() => {
    if (!playing) return;
    const word = sequence[index];
    if (!word) return;
    timer.current = setTimeout(() => {
      if (index + 1 >= sequence.length) {
        setPlaying(false);
        setFinished(true);
        onFinishRef.current(totalDurationMs);
      } else {
        setIndex((i) => i + 1);
      }
    }, word.durationMs);
    return clear;
  }, [playing, index, sequence, totalDurationMs, clear]);

  // Reset when the sequence identity changes (new passage / settings).
  useEffect(() => {
    restart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sequence]);

  const progressPct =
    sequence.length === 0
      ? 0
      : Math.round(((index + (finished ? 1 : 0)) / sequence.length) * 100);

  return {
    index,
    current: sequence[index] ?? null,
    playing,
    finished,
    progressPct,
    totalDurationMs,
    play,
    pause,
    toggle,
    restart,
  };
}
