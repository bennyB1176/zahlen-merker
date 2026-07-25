import { useEffect, useRef } from 'react';
import { beatIntervalMs } from '../engine/focus';

interface MetronomeOptions {
  enabled: boolean;
  bpm: number;
  active: boolean;
}

/**
 * Plays a steady metronome click while `enabled && active`, using the Web Audio
 * API (no dependencies). The beat occupies the articulatory loop so the inner
 * voice can't "say" the words — articulatory suppression against subvocalization.
 *
 * The AudioContext is created lazily and only after `active` becomes true, which
 * always follows a user gesture (the reader's Start button), satisfying the
 * browser autoplay policy. It is suspended when not in use.
 */
export function useMetronome({ enabled, bpm, active }: MetronomeOptions): void {
  const ctxRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const running = enabled && active;

    const stop = () => {
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      void ctxRef.current?.suspend().catch(() => {});
    };

    if (!running) {
      stop();
      return;
    }

    // Web Audio may be unavailable (e.g. jsdom); fail silently.
    const AudioCtor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioCtor) return;

    if (!ctxRef.current) ctxRef.current = new AudioCtor();
    const ctx = ctxRef.current;
    void ctx.resume().catch(() => {});

    const click = () => {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.value = 1000;
      // Short percussive envelope so it reads as a "tick", not a tone.
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.15, now + 0.001);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
    };

    click();
    timerRef.current = setInterval(click, beatIntervalMs(bpm));

    return stop;
  }, [enabled, bpm, active]);

  // Release the audio context on unmount.
  useEffect(() => {
    return () => {
      void ctxRef.current?.close().catch(() => {});
      ctxRef.current = null;
    };
  }, []);
}
