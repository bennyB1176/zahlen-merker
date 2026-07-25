import { describe, it, expect } from 'vitest';
import {
  pushTargetWpm,
  beatIntervalMs,
  clampBpm,
  SUBVOCAL_THRESHOLD_WPM,
  DISTRACTOR_BPM_MIN,
  DISTRACTOR_BPM_MAX,
} from './focus';

describe('pushTargetWpm', () => {
  it('raises a slow target up to the subvocalization threshold', () => {
    expect(pushTargetWpm(300)).toBe(SUBVOCAL_THRESHOLD_WPM);
  });

  it('leaves an already-fast target unchanged', () => {
    expect(pushTargetWpm(600)).toBe(600);
  });

  it('is idempotent at the threshold boundary', () => {
    expect(pushTargetWpm(SUBVOCAL_THRESHOLD_WPM)).toBe(SUBVOCAL_THRESHOLD_WPM);
  });
});

describe('beatIntervalMs', () => {
  it('converts a typical BPM to a delay', () => {
    expect(beatIntervalMs(120)).toBe(500);
  });

  it('clamps below-range BPM before dividing', () => {
    expect(beatIntervalMs(0)).toBe(60000 / DISTRACTOR_BPM_MIN);
  });

  it('clamps above-range BPM', () => {
    expect(beatIntervalMs(10000)).toBe(60000 / DISTRACTOR_BPM_MAX);
  });
});

describe('clampBpm', () => {
  it('keeps an in-range value', () => {
    expect(clampBpm(120)).toBe(120);
  });

  it('clamps and rounds out-of-range values', () => {
    expect(clampBpm(1)).toBe(DISTRACTOR_BPM_MIN);
    expect(clampBpm(999)).toBe(DISTRACTOR_BPM_MAX);
    expect(clampBpm(120.6)).toBe(121);
  });
});
