import { useMemo } from "react";
import { Flame, TrendingDown, TrendingUp, Activity } from "lucide-react";
import { useStore, dateKey, type DiaryEntry, type ExerciseLogEntry } from "@/store/useStore";

// 生成以 endDate 为最后一天、往前 n 天的日期 key 数组（旧 → 新）
function lastNDays(endDate: Date, n: number): { key: string; label: string; date: Date }[] {
  const days: { key: string; label: string; date: Date }[] = [];
  const weekLabels = ["日", "一", "二", "三", "四", "五", "六"];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(endDate);
    d.setDate(d.getDate() - i);
    days.push({ key: dateKey(d), label: weekLabels[d.getDay()], date: d });
  }
  return days;
}

const sumCalories = (entries: DiaryEntry[]) => entries.reduce((s, e) => s + e.calories, 0);
const sumBurn = (logs: ExerciseLogEntry[]) => logs.reduce((s, e) => s + e.kcal, 0);

export default function CalorieBalanceCard({
  date,
  onSelectDate,
}: {
  date: string;
  onSelectDate?: (date: Date) => void;
}) {
  const entriesByDate = useStore((s) => s.entriesByDate);
  const exerciseLogsByDate = useStore((s) => s.exerciseLogsByDate);
  const tdee = useStore((s) => s.targets?.tdee ?? 0);

  const todayKey = dateKey();
  const entries = entriesByDate[date] ?? [];
  const logs = exerciseLogsByDate[date] ?? [];

  const intake = sumCalories(entries);
  const burn = sumBurn(logs);
  const net = intake - burn;
  // 与维持热量目标的差额：负值=热量缺口（减脂），正值=盈余
  const balance = tdee > 0 ? net - tdee : 0;

  // 近 7 日趋势
  const week = useMemo(() => {
    const endDate = (() => {
      const [y, m, d] = date.split("-").map(Number);
      return new Date(y, m - 1, d);
    })();
    return lastNDays(endDate, 7).map((day) => {
      const dayIntake = sumCalories(entriesByDate[day.key] ?? []);
      const dayBurn = sumBurn(exerciseLogsByDate[day.key] ?? []);
      return { ...day, intake: dayIntake, burn: dayBurn };
    });
  }, [date, entriesByDate, exerciseLogsByDate]);

  // 柱状图纵轴比例（以目标和最大摄入的较大者为 100%）
  const chartMax = Math.max(tdee * 1.1, ...week.map((d) => d.intake), 100);

  // 进度条比例
  const intakePct = tdee > 0 ? Math.min(100, (intake / tdee) * 100) : 0;
  const netPct = tdee > 0 ? Math.min(100, Math.max(0, (net / tdee) * 100)) : 0;
  const overPct = intake > tdee && tdee > 0 ? ((intake - tdee) / tdee) * 100 : 0;

  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center gap-2 font-display text-lg tracking-wide text-cream">
          <Activity className="h-4 w-4 text-mint" />
          今日热量收支
        </h3>
        {tdee > 0 && <span className="text-[10px] text-white/30">目标 {tdee} kcal</span>}
      </div>

      {/* 三大数字 */}
      <div className="mb-4 grid grid-cols-3 gap-2 text-center">
        <div className="rounded-xl bg-flame/10 py-2.5">
          <p className="text-[10px] text-white/40">摄入</p>
          <p className="font-display text-xl text-flame">{intake}</p>
          <p className="text-[9px] text-white/30">kcal</p>
        </div>
        <div className="rounded-xl bg-mint/10 py-2.5">
          <p className="text-[10px] text-white/40">训练消耗</p>
          <p className="font-display text-xl text-mint">{burn}</p>
          <p className="text-[9px] text-white/30">kcal</p>
        </div>
        <div className="rounded-xl bg-white/5 py-2.5">
          <p className="text-[10px] text-white/40">净摄入</p>
          <p className="font-display text-xl text-cream">{net}</p>
          <p className="text-[9px] text-white/30">kcal</p>
        </div>
      </div>

      {/* 摄入 / 净摄入 对比目标进度条 */}
      {tdee > 0 && (
        <div className="mb-4 space-y-2.5">
          <div>
            <div className="mb-1 flex justify-between text-[10px] text-white/40">
              <span>摄入 / 目标</span>
              <span>{Math.round((intake / tdee) * 100)}%</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-white/5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-flame-dark to-flame transition-all duration-500"
                style={{ width: `${Math.min(100, intakePct + overPct)}%` }}
              />
            </div>
          </div>
          <div>
            <div className="mb-1 flex justify-between text-[10px] text-white/40">
              <span>净摄入（摄入−消耗）/ 目标</span>
              <span>{Math.round((net / tdee) * 100)}%</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-white/5">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  balance <= 0
                    ? "bg-gradient-to-r from-mint-dark to-mint"
                    : "bg-gradient-to-r from-amber-600 to-amber-400"
                }`}
                style={{ width: `${netPct}%` }}
              />
            </div>
          </div>

          {/* 结论 */}
          <div
            className={`flex items-center justify-center gap-1.5 rounded-xl py-2 text-sm font-medium ${
              balance <= 0 ? "bg-mint/10 text-mint" : "bg-amber-500/10 text-amber-300"
            }`}
          >
            {balance <= 0 ? (
              <>
                <TrendingDown className="h-4 w-4" />
                今日热量缺口 {Math.abs(balance)} kcal
                {intake === 0 && burn === 0 && (
                  <span className="text-[10px] font-normal text-white/30">（还没有记录）</span>
                )}
              </>
            ) : (
              <>
                <TrendingUp className="h-4 w-4" />
                今日热量盈余 {balance} kcal
              </>
            )}
          </div>
        </div>
      )}

      {/* 近 7 日趋势柱状图 */}
      <div>
        <p className="mb-2 flex items-center gap-3 text-[10px] text-white/40">
          <span className="flex items-center gap-1">
            <span className="inline-block h-2 w-2 rounded-sm bg-flame" /> 摄入
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-2 w-2 rounded-sm bg-mint" /> 消耗
          </span>
          <span className="ml-auto">近 7 日</span>
        </p>
        <div className="relative">
          {/* 目标虚线 */}
          {tdee > 0 && (
            <div
              className="pointer-events-none absolute left-0 right-0 border-t border-dashed border-white/20"
              style={{ bottom: `${(tdee / chartMax) * 100}%` }}
              title={`目标 ${tdee} kcal`}
            />
          )}
          <div className="flex h-28 items-end justify-between gap-1">
            {week.map((day) => {
              const isSelected = day.key === date;
              const isToday = day.key === todayKey;
              return (
                <button
                  key={day.key}
                  onClick={() => onSelectDate?.(day.date)}
                  className="group flex h-full flex-1 flex-col items-center justify-end gap-1"
                  title={`${day.key} · 摄入 ${day.intake} · 消耗 ${day.burn}`}
                >
                  <div className="flex h-full w-full items-end justify-center gap-0.5">
                    <div
                      className={`w-2.5 rounded-t-sm transition-all duration-300 group-hover:opacity-80 sm:w-3 ${
                        isSelected ? "bg-flame ring-1 ring-flame-light" : "bg-flame/60"
                      }`}
                      style={{ height: `${Math.max(2, (day.intake / chartMax) * 100)}%` }}
                    />
                    <div
                      className={`w-2.5 rounded-t-sm transition-all duration-300 group-hover:opacity-80 sm:w-3 ${
                        isSelected ? "bg-mint ring-1 ring-mint-light" : "bg-mint/50"
                      }`}
                      style={{ height: `${Math.max(day.burn > 0 ? 3 : 0, (day.burn / chartMax) * 100)}%` }}
                    />
                  </div>
                  <span
                    className={`text-[10px] ${
                      isToday ? "font-bold text-flame-light" : isSelected ? "text-cream" : "text-white/35"
                    }`}
                  >
                    {isToday ? "今" : day.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {tdee === 0 && (
        <p className="mt-3 flex items-center justify-center gap-1 text-center text-[10px] text-white/30">
          <Flame className="h-3 w-3" />
          前往「每日摄入」设置目标后可查看缺口/盈余分析
        </p>
      )}
    </div>
  );
}
