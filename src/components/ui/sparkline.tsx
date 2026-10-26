export function Sparkline({ values, color = "#26cf3a", }: {
    values: number[];
    color?: string;
}) {
    return (<svg viewBox="0 0 100 32" className="h-8 w-24" aria-hidden="true">
      <polyline points={values
            .map((v, i) => `${(i * 100) / (values.length - 1)},${32 - v * 0.8}`)
            .join(" ")} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round"/>
    </svg>);
}
