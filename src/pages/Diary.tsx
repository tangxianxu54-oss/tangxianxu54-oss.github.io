import { useMemo } from "react";
import { Trash2, BookOpen, TrendingUp, Target, Leaf, Flame } from "lucide-react";
import { useStore, getDailyTotals, splitTotalsByBasis, type MealType, type DiaryEntry } from "@/store/useStore";
import MacroRing from "@/components/MacroRing";
import ProgressBar from "@/components/ProgressBar";

const mealLabels: Record<MealType, string> = {
  breakfast: "早餐",
  lunch: "午餐",
  dinner: "晚餐",
  snack: "加餐",
};

const mealColors: Record<MealType, string> = {
  breakfast: "border-l-amber-500",
  lunch: "border-l-mint",
  dinner: "border-l-flame",
  snack: "border-l-purple-500",
};

function BasisBadge({ entry }: { entry: DiaryEntry }) {
  const isRaw = entry.weightBasis === "raw";
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-medium ${
        isRaw
          ? "bg-sky-500/15 text-sky-300"
          : "bg-orange-500/15 text-orange-300"
      }`}
    >
      {isRaw ? <Leaf className="h-2.5 w-2.5" /> : <Flame className="h-2.5 w-2.5" />}
      {isRaw ? "生重" : "熟重"}
    </span>
  );
}

export default function Diary() {
  const entries = useStore((s) => s.entries);
  const targets = useStore((s) => s.targets);
  const removeEntry = useStore((s) => s.removeEntry);
  const clearEntries = useStore((s) => s.clearEntries);

  const totals = useMemo(() => getDailyTotals(entries), [entries]);
  const basisSplit = useMemo(() => splitTotalsByBasis(entries), [entries]);

  const grouped = useMemo(() => {
    const groups: Record<MealType, typeof entries> = {
      breakfast: [],
      lunch: [],
      dinner: [],
      snack: [],
    };
    entries.forEach((e) => {
      groups[e.mealType].push(e);
    });
    return groups;
  }, [entries]);

  if (entries.length === 0) {
    return (
      <div className="animate-fade-in">
        <section className="mb-8 text-center">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-flame/20 bg-flame/5 px-3 py-1 text-xs text-flame-light">
            <BookOpen className="h-3 w-3" />
            当日累计
          </div>
          <h1 className="font-display text-5xl tracking-wide text-cream sm:text-6xl">
            当日 <span className="text-gradient-flame">餐单</span>
          </h1>
        </section>
        <div className="glass-card flex flex-col items-center justify-center rounded-2xl py-24 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5">
            <BookOpen className="h-8 w-8 text-white/30" />
          </div>
          <p className="mb-1 text-lg font-medium text-cream">还没有添加食物</p>
          <p className="mb-6 text-sm text-white/40">
            前往「食物查询」页搜索食物并添加到当日餐单
          </p>
          <a
            href="/"
            className="rounded-xl bg-gradient-to-r from-flame to-flame-dark px-6 py-2.5 font-medium text-white shadow-lg shadow-flame/30"
          >
            去添加食物
          </a>
        </div>
      </div>
    );
  }

  const hasTargets = targets !== null;

  return (
    <div className="animate-fade-in">
      <section className="mb-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-flame/20 bg-flame/5 px-3 py-1 text-xs text-flame-light">
            <BookOpen className="h-3 w-3" />
            当日累计
          </div>
          <h1 className="font-display text-5xl tracking-wide text-cream sm:text-6xl">
            当日 <span className="text-gradient-flame">餐单</span>
          </h1>
        </div>
        <button
          onClick={clearEntries}
          className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/50 transition-all hover:border-red-500/30 hover:text-red-400"
        >
          <Trash2 className="h-4 w-4" />
          清空餐单
        </button>
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* 左侧：餐单列表 */}
        <div className="space-y-4 lg:col-span-2">
          {(Object.keys(grouped) as MealType[]).map((mealType) => {
            const group = grouped[mealType];
            if (group.length === 0) return null;
            const mealCalories = group.reduce((a, e) => a + e.calories, 0);
            return (
              <div key={mealType} className="glass-card overflow-hidden rounded-2xl">
                <div className="flex items-center justify-between border-b border-white/5 px-5 py-3">
                  <div className="flex items-center gap-2">
                    <span className={`h-3 w-3 rounded-full ${mealType === "breakfast" ? "bg-amber-500" : mealType === "lunch" ? "bg-mint" : mealType === "dinner" ? "bg-flame" : "bg-purple-500"}`} />
                    <h3 className="font-medium text-cream">{mealLabels[mealType]}</h3>
                    <span className="text-xs text-white/40">{group.length} 项</span>
                  </div>
                  <span className="font-display text-lg text-flame-light">{mealCalories} kcal</span>
                </div>
                <div className="divide-y divide-white/5">
                  {group.map((entry) => (
                    <div
                      key={entry.id}
                      className={`flex items-center gap-3 border-l-4 ${mealColors[entry.mealType]} px-5 py-3 transition-colors hover:bg-white/5`}
                    >
                      <span className="text-2xl">{entry.foodEmoji}</span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-medium text-cream">{entry.foodName}</span>
                          <BasisBadge entry={entry} />
                          <span className="text-xs text-white/40">{entry.grams}g</span>
                        </div>
                        <div className="flex gap-3 text-xs text-white/40">
                          <span>碳水 {entry.carbs}g</span>
                          <span className="text-protein">蛋白 {entry.protein}g</span>
                          <span className="text-fat">脂肪 {entry.fat}g</span>
                        </div>
                      </div>
                      <span className="font-display text-lg text-cream">{entry.calories}</span>
                      <button
                        onClick={() => removeEntry(entry.id)}
                        className="rounded-lg p-1.5 text-white/30 transition-colors hover:bg-red-500/10 hover:text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* 右侧：营养概览 */}
        <div className="space-y-4">
          {/* 环形图 */}
          <div className="glass-card rounded-2xl p-6">
            <div className="mb-4 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-flame" />
              <h3 className="font-display text-lg tracking-wide text-cream">营养总览</h3>
            </div>
            <MacroRing
              segments={[
                { value: totals.protein, max: hasTargets ? targets!.protein : totals.protein || 1, color: "#EF4444", label: "蛋白" },
                { value: totals.carbs, max: hasTargets ? targets!.carbs : totals.carbs || 1, color: "#FBBF24", label: "碳水" },
                { value: totals.fat, max: hasTargets ? targets!.fat : totals.fat || 1, color: "#3B82F6", label: "脂肪" },
              ]}
            />
          </div>

          {/* 生重 / 熟重 分别汇总 */}
          <div className="glass-card rounded-2xl p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-lg tracking-wide text-cream">生 / 熟重 · 分别汇总</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <BasisSummaryCard
                title="生重部分"
                icon={<Leaf className="h-4 w-4 text-sky-300" />}
                tagClass="bg-sky-500/10 border-sky-500/20 text-sky-200"
                grams={basisSplit.raw.rawGrams}
                data={basisSplit.raw}
              />
              <BasisSummaryCard
                title="熟重部分"
                icon={<Flame className="h-4 w-4 text-orange-300" />}
                tagClass="bg-orange-500/10 border-orange-500/20 text-orange-200"
                grams={basisSplit.cooked.cookedGrams}
                data={basisSplit.cooked}
              />
            </div>
            <div className="mt-3 rounded-xl border border-white/5 bg-charcoal-light/50 px-3 py-2 text-[10px] text-white/40 text-center">
              合计热量 <span className="text-flame-light font-medium">{basisSplit.total.calories}</span> kcal
              · 碳水 <span className="text-carb">{basisSplit.total.carbs}g</span>
              · 蛋白 <span className="text-protein">{basisSplit.total.protein}g</span>
              · 脂肪 <span className="text-fat">{basisSplit.total.fat}g</span>
            </div>
          </div>

          {/* 目标对比 */}
          {hasTargets ? (
            <div className="glass-card rounded-2xl p-5">
              <div className="mb-4 flex items-center gap-2">
                <Target className="h-4 w-4 text-mint" />
                <h3 className="font-display text-lg tracking-wide text-cream">目标达成</h3>
              </div>
              <div className="space-y-3">
                <ProgressBar value={totals.calories} max={targets!.tdee} color="#FF6B35" label="热量" unit="kcal" />
                <ProgressBar value={totals.protein} max={targets!.protein} color="#EF4444" label="蛋白质" />
                <ProgressBar value={totals.carbs} max={targets!.carbs} color="#FBBF24" label="碳水化合物" />
                <ProgressBar value={totals.fat} max={targets!.fat} color="#3B82F6" label="脂肪" />
                <ProgressBar value={totals.fiber} max={30} color="#06D6A0" label="膳食纤维" />
              </div>
              <div className="mt-4 rounded-xl bg-white/5 p-3 text-center">
                <p className="text-xs text-white/40">剩余可摄入热量</p>
                <p className={`font-display text-2xl ${totals.calories > targets!.tdee ? "text-flame" : "text-mint"}`}>
                  {totals.calories > targets!.tdee
                    ? `+${totals.calories - targets!.tdee}`
                    : targets!.tdee - totals.calories}{" "}
                  kcal
                </p>
              </div>
            </div>
          ) : (
            <div className="glass-card rounded-2xl p-5 text-center">
              <Target className="mx-auto mb-2 h-8 w-8 text-white/20" />
              <p className="mb-3 text-sm text-white/40">
                前往「每日摄入」页设置个人目标，查看达成率
              </p>
              <a
                href="/calculator"
                className="inline-block rounded-xl bg-gradient-to-r from-mint to-mint-dark px-5 py-2 text-sm font-medium text-charcoal"
              >
                设置每日目标
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function BasisSummaryCard({
  title,
  icon,
  tagClass,
  grams,
  data,
}: {
  title: string;
  icon: React.ReactNode;
  tagClass: string;
  grams: number;
  data: {
    calories: number;
    carbs: number;
    protein: number;
    fat: number;
    fiber: number;
  };
}) {
  return (
    <div className={`rounded-xl border p-3 ${tagClass}`}>
      <div className="mb-2 flex items-center gap-1.5">
        {icon}
        <span className="text-xs font-medium">{title}</span>
        <span className="ml-auto text-[10px] opacity-60">{grams}g</span>
      </div>
      <p className="mb-2 font-display text-xl text-cream">{data.calories} <span className="text-[10px] text-white/40">kcal</span></p>
      <div className="flex flex-wrap gap-x-2 gap-y-0.5 text-[10px]">
        <span className="text-carb">碳水 {data.carbs}g</span>
        <span className="text-protein">蛋白 {data.protein}g</span>
        <span className="text-fat">脂肪 {data.fat}g</span>
      </div>
    </div>
  );
}
