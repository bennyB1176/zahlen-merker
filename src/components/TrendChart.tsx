import type { TrendPoint } from '../data/stats';

/**
 * Minimal dependency-free SVG line chart of effective WPM over sessions.
 * Uses a viewBox so it scales fluidly on any screen width.
 */
export function TrendChart({ points }: { points: TrendPoint[] }) {
  const W = 320;
  const H = 140;
  const pad = 12;

  if (points.length < 2) {
    return <p className="empty">Complete at least two sessions to see your trend.</p>;
  }

  const values = points.map((p) => p.eWpm);
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;

  const x = (i: number) => pad + (i / (points.length - 1)) * (W - pad * 2);
  const y = (v: number) => H - pad - ((v - min) / range) * (H - pad * 2);

  const path = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${x(i)} ${y(p.eWpm)}`)
    .join(' ');
  const baselineY = y(values[0]!);

  return (
    <svg
      className="trend-chart"
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label={`Effective WPM trend across ${points.length} sessions`}
    >
      <line
        className="chart-baseline"
        x1={pad}
        y1={baselineY}
        x2={W - pad}
        y2={baselineY}
      />
      <path className="chart-line" d={path} />
      {points.map((p, i) => (
        <circle key={i} className="chart-dot" cx={x(i)} cy={y(p.eWpm)} r={3} />
      ))}
    </svg>
  );
}
