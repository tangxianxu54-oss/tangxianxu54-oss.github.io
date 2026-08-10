import { useState, useMemo } from "react";
import {
  Trash2, BookOpen, TrendingUp, Target, Leaf, Flame,
  ChevronLeft, ChevronRight, Calendar,
  Droplets, Plus, Minus, Download, Upload, AlertCircle,
} from "lucide-react";
import {
  useStore, getDailyTotals, splitTotalsByBasis,
  type MealType, type DiaryEntry, dateKey,
} from "@/store/useStore";
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

// 日期格式化显示
function formatDateDisplay(date: Date): string {
  const today = dateKey();
  const tomorrow = dateKey(new Date(Date.now() + 86400000));
  const yesterday = dateKey(new Date(Date.now() - 86400000));
  const key = dateKey(date);
  if (key === today) return "今天";
  if (key === tomorrow) return "明天";
  if (key === yesterday) return "昨天";
  return `${date.getMonth() + 1}月${date.getDate()}日`;
}

export default function Diary() {
  const targets = useStore((s) => s.targets);
  const removeEntry = useStore((s) => s.removeEntry);
  const clearEntries = useStore((s) => s.clearEntries);
  const updateEntryGrams = useStore((s) => s.updateEntryGrams);
  const getEntries = useStore((s) => s.getEntries);
  const water = useStore((s) => s.getWater());
  const addWater = useStore((s) => s.addWater);
  const setWater = useStore((s) => s.setWater);
  const exportData = useStore((s) => s.exportData);
  const importData = useStore((s) => s.importData);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const dateStr = dateKey(selectedDate);
  const entries = getEntries(dateStr);
  const isToday = dateStr === dateKey();

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

  // 饮水目标：体重(kg) × 35ml
  const waterGoal = targets ? Math.round((useStore.getState().profile?.weight ?? 70) * 35) : 2500;

  const changeDate = (delta: number) => {
    const next = new Date(selectedDate);
    next.setDate(next.getDate() + delta);
    setSelectedDate(next);
  };

  const goToday = () => setSelectedDate(new Date());

  const handleExport = () => {
    const data = exportData();
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `fitness-data-${dateKey()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        const success = importData(reader.result as string);
        if (success) {
          alert("数据导入成功！");
        } else {
          alert("导入失败：文件格式不正确");
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  return (
    <div className="animate-fade-in">
      <section className="mb-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-flame/20 bg-flame/5 px-3 py-1 text-xs text-flame-light">
            <BookOpen className="h-3 w-3" />
            当日累计
          </div>
          <h1 className="font-display text-5xl tracking-wide text-cream sm:text-6xl">
            当日 <span className="text-gradient-flame">餐单</span>
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleImport}
            title="导入数据"
            className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/50 transition-all hover:border-mint/30 hover:text-mint-light"
          >
            <Upload className="h-4 w-4" />
          </button>
          <button
            onClick={handleExport}
            title="导出数据"
            className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/50 transition-all hover:border-mint/30 hover:text-mint-light"
          >
            <Download className="h-4 w-4" />
          </button>
          {entries.length > 0 && (
            <button
              onClick={() => clearEntries(dateStr)}
              className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/50 transition-all hover:border-red-500/30 hover:text-red-400"
            >
              <Trash2 className="h-4 w-4" />
              <span className="hidden sm:inline">清空</span>
            </button>
          )}
        </div>
      </section>

      {/* 日期选择器 */}
      <div className="glass-card mb-6 flex items-center justify-between rounded-2xl px-4 py-3">
        <button
          onClick={() => changeDate(-1)}
          className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm text-white/50 transition-all hover:bg-white/5 hover:text-cream"
        >
          <ChevronLeft className="h-4 w-4" />
          前一天
        </button>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-flame-light" />
          <span className="font-display text-lg text-cream">{formatDateDisplay(selectedDate)}</span>
          {!isToday && (
            <button
              onClick={goToday}
              className="rounded-lg bg-flame/10 px-2 py-0.5 text-[10px] text-flame-light transition-all hover:bg-flame/20"
            >
              回今天
            </button>
          )}
        </div>
        <button
          onClick={() => changeDate(1)}
          className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm text-white/50 transition-all hover:bg-white/5 hover:text-cream"
        >
          后一天
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* 饮水追踪 */}
      <div className="glass-card mb-6 rounded-2xl p-5">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Droplets className="h-5 w-5 text-sky-400" />
            <h3 className="font-display text-lg tracking-wide text-cream">饮水量</h3>
          </div>
          <div className="text-right">
            <span className="font-display text-2xl text-sky-300">{water}</span>
            <span className="text-sm text-white/40"> / {waterGoal} ml</span>
          </div>
        </div>
        <div className="mb-3 h-3 overflow-hidden rounded-full bg-white/5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-sky-500 to-sky-300 transition-all duration-300"
            style={{ width: `${Math.min(100, (water / waterGoal) * 100)}%` }}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {[100, 200, 250, 500].map((ml) => (
            <button
              key={ml}
              onClick={() => addWater(ml, dateStr)}
              className="flex items-center gap-1 rounded-lg border border-sky-500/20 bg-sky-500/10 px-3 py-1.5 text-sm text-sky-200 transition-all hover:bg-sky-500/20"
            >
              <Plus className="h-3 w-3" />
              {ml}ml
            </button>
          ))}
          <button
            onClick={() => setWater(0, dateStr)}
            className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white/40 transition-all hover:text-red-400"
          >
            <Minus className="h-3 w-3" />
            重置
          </button>
        </div>
      </div>

      {entries.length === 0 ? (
        <div className="glass-card flex flex-col items-center justify-center rounded-2xl py-24 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5">
            <BookOpen className="h-8 w-8 text-white/30" />
          </div>
          <p className="mb-1 text-lg font-medium text-cream">{isToday ? "还没有添加食物" : "当天无餐单记录"}</p>
          <p className="mb-6 text-sm text-white/40">
            {isToday ? "前往「食物查询」页搜索食物并添加到当日餐单" : "切换日期查看其他天的记录"}
          </p>
          {isToday && (
            <a
              href="/"
              className="rounded-xl bg-gradient-to-r from-flame to-flame-dark px-6 py-2.5 font-medium text-white shadow-lg shadow-flame/30"
            >
              去添加食物
            </a>
          )}
        </div>
      ) : (
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
                      <DiaryEntryRow
                        key={entry.id}
                        entry={entry}
                        dateStr={dateStr}
                        onRemove={() => removeEntry(entry.id, dateStr)}
                        onUpdateGrams={(g) => updateEntryGrams(entry.id, g, dateStr)}
                      />
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
                  { value: totals.protein, max: targets ? targets.protein : totals.protein || 1, color: "#EF4444", label: "蛋白" },
                  { value: totals.carbs, max: targets ? targets.carbs : totals.carbs || 1, color: "#FBBF24", label: "碳水" },
                  { value: totals.fat, max: targets ? targets.fat : totals.fat || 1, color: "#3B82F6", label: "脂肪" },
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
            {targets ? (
              <div className="glass-card rounded-2xl p-5">
                <div className="mb-4 flex items-center gap-2">
                  <Target className="h-4 w-4 text-mint" />
                  <h3 className="font-display text-lg tracking-wide text-cream">目标达成</h3>
                </div>
                <div className="space-y-3">
                  <ProgressBar value={totals.calories} max={targets.tdee} color="#FF6B35" label="热量" unit="kcal" />
                  <ProgressBar value={totals.protein} max={targets.protein} color="#EF4444" label="蛋白质" />
                  <ProgressBar value={totals.carbs} max={targets.carbs} color="#FBBF24" label="碳水化合物" />
                  <ProgressBar value={totals.fat} max={targets.fat} color="#3B82F6" label="脂肪" />
                  <ProgressBar value={totals.fiber} max={targets.fiber} color="#06D6A0" label="膳食纤维" />
                </div>
                <div className="mt-4 rounded-xl bg-white/5 p-3 text-center">
                  <p className="text-xs text-white/40">剩余可摄入热量</p>
                  <p className={`font-display text-2xl ${totals.calories > targets.tdee ? "text-flame" : "text-mint"}`}>
                    {totals.calories > targets.tdee
                      ? `+${totals.calories - targets.tdee}`
                      : targets.tdee - totals.calories}{" "}
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
      )}
    </div>
  );
}

// 可行内编辑克数的餐单行
function DiaryEntryRow({
  entry,
  dateStr,
  onRemove,
  onUpdateGrams,
}: {
  entry: DiaryEntry;
  dateStr: string;
  onRemove: () => void;
  onUpdateGrams: (grams: number) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draftGrams, setDraftGrams] = useState(String(entry.grams));

  const commitEdit = () => {
    const g = Number(draftGrams);
    if (g > 0 && g !== entry.grams) {
      onUpdateGrams(g);
    } else {
      setDraftGrams(String(entry.grams));
    }
    setEditing(false);
  };

  return (
    <div
      className={`flex items-center gap-3 border-l-4 ${mealColors[entry.mealType]} px-5 py-3 transition-colors hover:bg-white/5`}
    >
      <span className="text-2xl">{entry.foodEmoji}</span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-medium text-cream">{entry.foodName}</span>
          <BasisBadge entry={entry} />
          {editing ? (
            <span className="flex items-center gap-1">
              <input
                type="number"
                min={1}
                value={draftGrams}
                onChange={(e) => setDraftGrams(e.target.value)}
                onBlur={commitEdit}
                onKeyDown={(e) => {
                  if (e.key === "Enter") commitEdit();
                  if (e.key === "Escape") {
                    setDraftGrams(String(entry.grams));
                    setEditing(false);
                  }
                }}
                autoFocus
                className="w-16 rounded-md border border-flame/40 bg-charcoal-light px-2 py-0.5 text-center text-xs text-cream outline-none"
              />
              <span className="text-xs text-white/40">g ↵</span>
            </span>
          ) : (
            <button
              onClick={() => {
                setDraftGrams(String(entry.grams));
                setEditing(true);
              }}
              className="rounded-md bg-white/5 px-1.5 py-0.5 text-xs text-white/40 transition-colors hover:bg-white/10 hover:text-cream"
            >
              {entry.grams}g ✎
            </button>
          )}
        </div>
        <div className="flex gap-3 text-xs text-white/40">
          <span>碳水 {entry.carbs}g</span>
          <span className="text-protein">蛋白 {entry.protein}g</span>
          <span className="text-fat">脂肪 {entry.fat}g</span>
        </div>
      </div>
      <span className="font-display text-lg text-cream">{entry.calories}</span>
      <button
        onClick={onRemove}
        className="rounded-lg p-1.5 text-white/30 transition-colors hover:bg-red-500/10 hover:text-red-400"
      >
        <Trash2 className="h-4 w-4" />
      </button>
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
