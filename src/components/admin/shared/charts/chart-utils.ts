export const palette = ["var(--color-primary-500)", "var(--color-info-500)", "var(--color-fuchsia-400)", "var(--color-success-500)", "var(--color-error-500)"];
export type ChartRow = { label: string; values: number[]; detail?: string };
export type PercentRow = { label: string; value: number; count?: number };
export const finiteValue = (value: number) => Number.isFinite(value) ? Math.max(0, value) : 0;
export const shortLabel = (label: string) => /^\d{4}-\d{2}-\d{2}$/.test(label) ? label.slice(5) : label;
export function smoothPath(points: {x: number; y: number}[]) {
  return points.map((point, i) => {
    if (!i) return `M${point.x},${point.y}`;
    const previous = points[i-1], middle = (previous.x + point.x) / 2;
    return `C${middle},${previous.y} ${middle},${point.y} ${point.x},${point.y}`;
  }).join(" ");
}
