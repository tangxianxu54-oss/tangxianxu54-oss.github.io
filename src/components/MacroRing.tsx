interface MacroRingProps {
  segments: { value: number; max: number; color: string; label: string }[];
  size?: number;
}

// 宏量营养素环形图
export default function MacroRing({ segments, size = 200 }: MacroRingProps) {
  const stroke = 18;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const gap = 8;
  const segmentCount = segments.length;
  const segmentLength = circumference / segmentCount - gap;
  const center = size / 2;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          {/* 背景圆环 */}
          {segments.map((_, i) => {
            const offset = i * (circumference / segmentCount);
            return (
              <circle
                key={`bg-${i}`}
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke="rgba(255,255,255,0.05)"
                strokeWidth={stroke}
                strokeDasharray={`${segmentLength} ${circumference - segmentLength}`}
                strokeDashoffset={-offset}
                strokeLinecap="round"
              />
            );
          })}
          {/* 数据圆环 */}
          {segments.map((seg, i) => {
            const offset = i * (circumference / segmentCount);
            const ratio = seg.max > 0 ? Math.min(seg.value / seg.max, 1) : 0;
            const filled = segmentLength * ratio;
            return (
              <circle
                key={`data-${i}`}
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke={seg.color}
                strokeWidth={stroke}
                strokeDasharray={`${filled} ${circumference - filled}`}
                strokeDashoffset={-offset}
                strokeLinecap="round"
                style={{ transition: "stroke-dasharray 0.6s ease" }}
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-3xl text-cream">
            {Math.round(segments.reduce((a, s) => a + s.value, 0))}
          </span>
          <span className="text-[10px] uppercase tracking-wider text-white/40">
            总计 kcal
          </span>
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        {segments.map((seg) => {
          const ratio = seg.max > 0 ? Math.min(seg.value / seg.max, 1) * 100 : 0;
          return (
            <div key={seg.label} className="flex items-center gap-1.5">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: seg.color }}
              />
              <span className="text-xs text-white/60">
                {seg.label} {Math.round(ratio)}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
