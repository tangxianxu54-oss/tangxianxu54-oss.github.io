interface ProgressBarProps {
  value: number;
  max: number;
  color: string;
  label: string;
  unit?: string;
}

export default function ProgressBar({ value, max, color, label, unit = "g" }: ProgressBarProps) {
  const ratio = max > 0 ? Math.min(value / max, 1) : 0;
  const percent = Math.round(ratio * 100);
  const over = value > max;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-white/70">{label}</span>
        <span className={over ? "text-flame-light" : "text-white/50"}>
          {Math.round(value)} / {Math.round(max)} {unit}
          <span className={`ml-1.5 ${over ? "text-flame" : ratio >= 0.8 ? "text-mint" : "text-white/40"}`}>
            {percent}%
          </span>
        </span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-white/5">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${ratio * 100}%`,
            backgroundColor: color,
            boxShadow: `0 0 8px ${color}80`,
          }}
        />
      </div>
    </div>
  );
}
