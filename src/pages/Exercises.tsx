import { useMemo, useState } from "react";
import {
  Dumbbell, Plus, Trash2, Flame, Beef, Egg, CupSoda, TrendingUp,
  ChevronLeft, ChevronRight, Calendar,
} from "lucide-react";
import {
  exercises,
  EXERCISE_CATEGORIES,
  INCLINE_PRESETS,
  calcStrengthBurn,
  calcTimedBurn,
  calcInclineBurn,
  type Exercise,
} from "@/data/exercises";
import { useStore, dateKey } from "@/store/useStore";
import { getCachedInitials, pinyinMatchCached } from "@/utils/pinyin";
import CalorieBalanceCard from "@/components/CalorieBalanceCard";

// 日期显示
function formatDateDisplay(date: Date): string {
  const today = dateKey();
  const yesterday = dateKey(new Date(Date.now() - 86400000));
  const key = dateKey(date);
  if (key === today) return "今天";
  if (key === yesterday) return "昨天";
  return `${date.getMonth() + 1}月${date.getDate()}日`;
}

export default function Exercises() {
  const profileWeight = useStore((s) => s.profile?.weight ?? 70);

  // 按日期持久化的训练日志
  const [selectedDate, setSelectedDate] = useState(new Date());
  const dateStr = dateKey(selectedDate);
  const isToday = dateStr === dateKey();
  const logs = useStore((s) => s.exerciseLogsByDate[dateStr] ?? []);
  const addExerciseLog = useStore((s) => s.addExerciseLog);
  const removeExerciseLog = useStore((s) => s.removeExerciseLog);
  const clearExerciseLogs = useStore((s) => s.clearExerciseLogs);

  const [weight, setWeight] = useState<number>(profileWeight);
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("全部");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // 拼音首字母缓存（复用食物搜索的缓存机制）
  const pinyinMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const e of exercises) {
      map.set(e.id, getCachedInitials(e.name));
    }
    return map;
  }, []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    let result = exercises;
    if (q) {
      result = result.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          e.nameEn.toLowerCase().includes(q) ||
          e.category.includes(q) ||
          pinyinMatchCached(q, pinyinMap.get(e.id) ?? "")
      );
    }
    if (activeCategory !== "全部") {
      result = result.filter((e) => e.category === activeCategory);
    }
    return result;
  }, [query, activeCategory, pinyinMap]);

  const totalKcal = logs.reduce((sum, item) => sum + item.kcal, 0);

  const addItem = (exercise: Exercise, kcal: number, detail: string, minutes?: number) => {
    addExerciseLog(
      {
        exerciseId: exercise.id,
        exerciseName: exercise.name,
        exerciseEmoji: exercise.emoji,
        category: exercise.category,
        kcal,
        detail,
        minutes,
      },
      dateStr
    );
    setExpandedId(null);
  };

  const changeDate = (delta: number) => {
    const next = new Date(selectedDate);
    next.setDate(next.getDate() + delta);
    setSelectedDate(next);
  };

  return (
    <div className="animate-fade-in">
      {/* Hero 区 */}
      <section className="mb-6 text-center">
        <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-mint/20 bg-mint/5 px-3 py-1 text-xs text-mint">
          <Dumbbell className="h-3 w-3" />
          力量按做功（重量×次数×组数） · 有氧按 MET / ACSM 方程
        </div>
        <h1 className="font-display text-5xl tracking-wide text-cream sm:text-6xl">
          训练 <span className="text-gradient-mint">消耗</span> 计算器
        </h1>
        <p className="mt-2 text-sm text-white/50">
          胸 · 背 · 手臂 · 肩 · 腹 · 腿 · 有氧，共 {exercises.length} 个训练动作
        </p>
      </section>

      {/* 体重 + 日期选择 */}
      <div className="mb-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
        <div className="flex items-center gap-3">
          <label className="text-sm text-white/60">当前体重</label>
          <div className="relative">
            <input
              type="number"
              min={30}
              max={200}
              value={weight}
              onChange={(e) => setWeight(Math.max(0, Number(e.target.value)))}
              className="w-24 rounded-xl border border-white/10 bg-charcoal-light/60 py-2 pl-3 pr-8 text-center text-cream outline-none transition-all focus:border-mint focus:ring-2 focus:ring-mint/20"
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-white/40">kg</span>
          </div>
        </div>
        <div className="flex items-center gap-1 rounded-2xl border border-white/10 bg-charcoal-light/60 px-2 py-1.5">
          <button
            onClick={() => changeDate(-1)}
            className="rounded-lg px-2 py-1 text-white/50 transition-all hover:bg-white/5 hover:text-cream"
            aria-label="前一天"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-1.5 px-2">
            <Calendar className="h-4 w-4 text-mint" />
            <span className="font-display text-lg text-cream">{formatDateDisplay(selectedDate)}</span>
            {!isToday && (
              <button
                onClick={() => setSelectedDate(new Date())}
                className="rounded-lg bg-mint/10 px-2 py-0.5 text-[10px] text-mint transition-all hover:bg-mint/20"
              >
                回今天
              </button>
            )}
          </div>
          <button
            onClick={() => changeDate(1)}
            className="rounded-lg px-2 py-1 text-white/50 transition-all hover:bg-white/5 hover:text-cream"
            aria-label="后一天"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* 搜索 + 分类 */}
      <div className="mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="搜索动作（中文 / 英文 / 拼音首字母 如 ytss = 引体向上）..."
          className="w-full rounded-2xl border border-white/10 bg-charcoal-light/60 py-3 px-4 text-cream outline-none backdrop-blur-sm transition-all placeholder:text-white/30 focus:border-mint focus:ring-2 focus:ring-mint/20"
        />
      </div>
      <div className="mb-6 flex flex-wrap gap-2">
        {["全部", ...EXERCISE_CATEGORIES].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`rounded-full px-4 py-1.5 text-sm transition-all ${
              activeCategory === cat
                ? "bg-mint text-charcoal shadow-lg shadow-mint/30"
                : "border border-white/10 bg-white/5 text-white/50 hover:text-cream"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 今日热量收支图 */}
      <div className="mb-6">
        <CalorieBalanceCard date={dateStr} onSelectDate={setSelectedDate} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* 动作卡片 */}
        <div>
          {filtered.length === 0 ? (
            <div className="py-20 text-center text-white/30">
              <Dumbbell className="mx-auto mb-3 h-10 w-10 opacity-30" />
              <p>未找到匹配的动作，试试其他关键词</p>
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {filtered.map((e) => (
                <ExerciseCard
                  key={e.id}
                  exercise={e}
                  bodyWeight={weight}
                  expanded={expandedId === e.id}
                  onToggle={() => setExpandedId(expandedId === e.id ? null : e.id)}
                  onAdd={addItem}
                />
              ))}
            </div>
          )}
        </div>

        {/* 当日训练记录侧栏（持久化） */}
        <aside className="lg:sticky lg:top-20 h-fit">
          <div className="rounded-2xl border border-white/10 bg-charcoal-light/60 p-5 backdrop-blur-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="flex items-center gap-2 font-display text-lg text-cream">
                <Flame className="h-5 w-5 text-flame" />
                {isToday ? "今日训练" : `${formatDateDisplay(selectedDate)}训练`}
                {logs.length > 0 && (
                  <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-white/50">
                    {logs.length} 项
                  </span>
                )}
              </h2>
              {logs.length > 0 && (
                <button
                  onClick={() => {
                    if (confirm(`确定清空 ${formatDateDisplay(selectedDate)} 的全部训练记录吗？`)) {
                      clearExerciseLogs(dateStr);
                    }
                  }}
                  className="rounded-lg p-1.5 text-white/30 transition-colors hover:bg-red-500/10 hover:text-red-400"
                  title="清空当日训练"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>

            {logs.length === 0 ? (
              <p className="py-6 text-center text-sm text-white/30">
                点击动作卡片记录训练项目
                <br />
                <span className="text-xs">记录会按日期自动保存</span>
              </p>
            ) : (
              <>
                <ul className="mb-4 space-y-2">
                  {logs.map((item) => (
                    <li
                      key={item.id}
                      className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2 text-sm"
                    >
                      <span>{item.exerciseEmoji}</span>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-cream">{item.exerciseName}</div>
                        <div className="truncate text-[10px] text-white/40">{item.detail}</div>
                      </div>
                      <span className="flex-shrink-0 font-medium text-flame">{item.kcal} kcal</span>
                      <button
                        onClick={() => removeExerciseLog(item.id, dateStr)}
                        className="flex-shrink-0 text-white/30 transition-colors hover:text-red-400"
                        aria-label="删除"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </li>
                  ))}
                </ul>

                {/* 总消耗 */}
                <div className="rounded-xl bg-gradient-to-r from-flame/20 to-flame/5 p-4 text-center">
                  <p className="text-xs text-white/50">当日训练总消耗</p>
                  <p className="font-display text-3xl text-flame">{totalKcal} <span className="text-base">kcal</span></p>
                </div>

                {/* 食物等价换算 */}
                <div className="mt-4 space-y-2 text-xs text-white/50">
                  <p className="mb-1 font-medium text-white/40">相当于 ——</p>
                  <div className="flex items-center gap-2">
                    <Beef className="h-4 w-4 text-white/30" />
                    <span>{Math.round(totalKcal / 1.3)} g 米饭（130 kcal/100g）</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Egg className="h-4 w-4 text-white/30" />
                    <span>{(totalKcal / 78).toFixed(1)} 个鸡蛋（78 kcal/个）</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CupSoda className="h-4 w-4 text-white/30" />
                    <span>{(totalKcal / 142).toFixed(1)} 罐可乐（142 kcal/罐）</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

// ===== 单个动作卡片（内部自管理输入状态） =====
function ExerciseCard({
  exercise,
  bodyWeight,
  expanded,
  onToggle,
  onAdd,
}: {
  exercise: Exercise;
  bodyWeight: number;
  expanded: boolean;
  onToggle: () => void;
  onAdd: (exercise: Exercise, kcal: number, detail: string, minutes?: number) => void;
}) {
  // 收起时右侧的参考值
  const reference = (() => {
    if (exercise.type === "strength") {
      const refLoad = exercise.bodyweight ? bodyWeight : exercise.perSide ? 10 : 50;
      const refReps = 10;
      const refSets = 3;
      const r = calcStrengthBurn(exercise, refLoad, refReps, refSets, bodyWeight);
      return { value: r.kcal, label: `${refLoad}kg×${refReps}×${refSets}` };
    }
    if (exercise.type === "incline") {
      const r = calcInclineBurn(4.8, 12, bodyWeight, 30);
      return { value: r.kcal, label: "4.8km/h·12%·30min" };
    }
    return { value: calcTimedBurn(exercise.met ?? 4, 70, 30), label: "kcal/30min" };
  })();

  return (
    <div
      className={`rounded-2xl border bg-charcoal-light/60 backdrop-blur-sm transition-all ${
        expanded ? "border-mint/50 ring-2 ring-mint/20" : "border-white/10 hover:border-white/20"
      }`}
    >
      <button onClick={onToggle} className="w-full px-4 py-3 text-left">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{exercise.emoji}</span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="truncate font-medium text-cream">{exercise.name}</h3>
              <span className="flex-shrink-0 rounded-full bg-mint/10 px-2 py-0.5 text-[10px] text-mint">
                {exercise.category}
              </span>
            </div>
            <p className="truncate text-xs text-white/35">{exercise.nameEn}</p>
          </div>
          <div className="text-right">
            <p className="font-display text-lg text-mint">{reference.value}</p>
            <p className="text-[10px] text-white/30">{reference.label}</p>
          </div>
        </div>
        <p className="mt-1.5 text-xs text-white/40">
          {exercise.type === "strength"
            ? `做功模型 · 位移 ${exercise.liftDistance}m${exercise.perSide ? " · 单边×2" : ""} · ${exercise.tip}`
            : exercise.type === "incline"
            ? exercise.tip
            : `MET ${exercise.met} · ${exercise.tip}`}
        </p>
      </button>

      {/* 展开区：按类型渲染不同输入 */}
      {expanded && exercise.type === "strength" && (
        <StrengthInputs
          exercise={exercise}
          bodyWeight={bodyWeight}
          onAdd={onAdd}
        />
      )}
      {expanded && exercise.type === "timed" && (
        <TimedInputs
          exercise={exercise}
          bodyWeight={bodyWeight}
          onAdd={onAdd}
        />
      )}
      {expanded && exercise.type === "incline" && (
        <InclineInputs
          bodyWeight={bodyWeight}
          onAdd={(kcal, detail, minutes) => onAdd(exercise, kcal, detail, minutes)}
        />
      )}
    </div>
  );
}

// ===== 力量训练输入：重量 × 次数 × 组数 =====
function StrengthInputs({
  exercise,
  bodyWeight,
  onAdd,
}: {
  exercise: Exercise;
  bodyWeight: number;
  onAdd: (exercise: Exercise, kcal: number, detail: string) => void;
}) {
  const [load, setLoad] = useState<number>(exercise.bodyweight ? bodyWeight : exercise.perSide ? 10 : 40);
  const [reps, setReps] = useState(10);
  const [sets, setSets] = useState(3);

  const result = calcStrengthBurn(exercise, load, reps, sets, bodyWeight);
  const durationMin = Math.round(result.totalSeconds / 6) / 10;

  return (
    <div className="border-t border-white/10 px-4 py-3">
      <div className="grid grid-cols-3 gap-2">
        <NumberField
          label={exercise.bodyweight ? "负重 kg（自重）" : exercise.perSide ? "重量 kg（单边）" : "重量 kg"}
          value={load}
          min={0}
          max={300}
          step={2.5}
          onChange={setLoad}
        />
        <NumberField label="次数 /组" value={reps} min={1} max={100} step={1} onChange={setReps} />
        <NumberField label="组数" value={sets} min={1} max={20} step={1} onChange={setSets} />
      </div>

      {/* 实时结果 */}
      <div className="mt-3 grid grid-cols-3 gap-2 text-center">
        <div className="rounded-lg bg-white/5 py-1.5">
          <p className="text-[10px] text-white/40">总吨位</p>
          <p className="text-sm font-medium text-cream">{result.totalTonnage} 吨</p>
        </div>
        <div className="rounded-lg bg-white/5 py-1.5">
          <p className="text-[10px] text-white/40">预计时长</p>
          <p className="text-sm font-medium text-cream">{durationMin} 分钟</p>
        </div>
        <div className="rounded-lg bg-flame/10 py-1.5">
          <p className="text-[10px] text-white/40">总消耗</p>
          <p className="text-sm font-medium text-flame">{result.kcal} kcal</p>
        </div>
      </div>
      <p className="mt-1.5 text-[10px] text-white/30">
        含做功 {result.workKcal} kcal + 组间休息 {result.restKcal} kcal（{(sets - 1) * 90 > 0 ? `${(sets - 1) * 90}s 休息` : "无组间休息"}）
      </p>

      <div className="mt-3 text-right">
        <button
          onClick={() =>
            onAdd(
              exercise,
              result.kcal,
              `${load}kg × ${reps}次 × ${sets}组 · ${result.totalTonnage}吨 · 约${durationMin}min`
            )
          }
          className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-mint to-mint-dark px-4 py-1.5 text-sm font-medium text-charcoal shadow-lg shadow-mint/30 transition-all hover:shadow-mint/50"
        >
          <Plus className="h-4 w-4" />
          添加
        </button>
      </div>
    </div>
  );
}

// ===== 时间制输入（普通有氧/腹部） =====
function TimedInputs({
  exercise,
  bodyWeight,
  onAdd,
}: {
  exercise: Exercise;
  bodyWeight: number;
  onAdd: (exercise: Exercise, kcal: number, detail: string, minutes: number) => void;
}) {
  const [minutes, setMinutes] = useState(30);
  const kcal = calcTimedBurn(exercise.met ?? 4, bodyWeight, minutes);

  return (
    <div className="border-t border-white/10 px-4 py-3">
      <div className="flex items-center gap-3">
        <span className="text-sm text-white/50">时长</span>
        <input
          type="range"
          min={5}
          max={120}
          step={5}
          value={minutes}
          onChange={(e) => setMinutes(Number(e.target.value))}
          className="h-1.5 flex-1 accent-mint"
        />
        <span className="w-16 text-right text-sm text-cream">{minutes} 分钟</span>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <p className="text-sm text-white/60">
          消耗 <span className="font-display text-lg text-flame">{kcal}</span> kcal
          <span className="ml-1 text-xs text-white/30">（{bodyWeight}kg · MET {exercise.met}）</span>
        </p>
        <button
          onClick={() => onAdd(exercise, kcal, `${minutes}min · MET ${exercise.met}`, minutes)}
          className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-mint to-mint-dark px-4 py-1.5 text-sm font-medium text-charcoal shadow-lg shadow-mint/30 transition-all hover:shadow-mint/50"
        >
          <Plus className="h-4 w-4" />
          添加
        </button>
      </div>
    </div>
  );
}

// ===== 跑步机爬坡输入：速度 + 坡度 + 时长（自由组合 + 预设档） =====
function InclineInputs({
  bodyWeight,
  onAdd,
}: {
  bodyWeight: number;
  onAdd: (kcal: number, detail: string, minutes: number) => void;
}) {
  const [speed, setSpeed] = useState(4.8);
  const [grade, setGrade] = useState(12);
  const [minutes, setMinutes] = useState(30);

  const result = calcInclineBurn(speed, grade, bodyWeight, minutes);

  return (
    <div className="border-t border-white/10 px-4 py-3">
      {/* 预设档 */}
      <div className="mb-3 flex flex-wrap gap-1.5">
        {INCLINE_PRESETS.map((p) => {
          const active = p.speed === speed && p.grade === grade && p.minutes === minutes;
          return (
            <button
              key={p.name}
              onClick={() => {
                setSpeed(p.speed);
                setGrade(p.grade);
                setMinutes(p.minutes);
              }}
              title={p.desc}
              className={`rounded-full px-2.5 py-1 text-[11px] transition-all ${
                active
                  ? "bg-mint text-charcoal"
                  : "border border-white/10 bg-white/5 text-white/50 hover:text-cream"
              }`}
            >
              {p.name}
            </button>
          );
        })}
      </div>

      {/* 速度 */}
      <SliderRow
        label="速度"
        value={speed}
        min={1}
        max={10}
        step={0.1}
        unit="km/h"
        onChange={setSpeed}
      />
      {/* 坡度 */}
      <SliderRow
        label="坡度"
        value={grade}
        min={0}
        max={15}
        step={0.5}
        unit="%"
        onChange={setGrade}
      />
      {/* 时长 */}
      <SliderRow
        label="时长"
        value={minutes}
        min={5}
        max={90}
        step={5}
        unit="分钟"
        onChange={setMinutes}
      />

      <div className="mt-3 flex items-center justify-between">
        <p className="text-sm text-white/60">
          <TrendingUp className="mr-1 inline h-4 w-4 text-mint" />
          MET <span className="text-cream">{result.met}</span> · 消耗{" "}
          <span className="font-display text-lg text-flame">{result.kcal}</span> kcal
        </p>
        <button
          onClick={() =>
            onAdd(
              result.kcal,
              `${speed}km/h · ${grade}%坡度 · ${minutes}min · MET ${result.met}`,
              minutes
            )
          }
          className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-mint to-mint-dark px-4 py-1.5 text-sm font-medium text-charcoal shadow-lg shadow-mint/30 transition-all hover:shadow-mint/50"
        >
          <Plus className="h-4 w-4" />
          添加
        </button>
      </div>
    </div>
  );
}

// ===== 通用小组件 =====
function NumberField({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[10px] text-white/40">{label}</span>
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(Math.max(0, Number(e.target.value)))}
        className="w-full rounded-lg border border-white/10 bg-charcoal/60 px-2 py-1.5 text-center text-sm text-cream outline-none transition-all focus:border-mint"
      />
    </label>
  );
}

function SliderRow({
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (v: number) => void;
}) {
  return (
    <div className="mb-2 flex items-center gap-3">
      <span className="w-10 flex-shrink-0 text-xs text-white/50">{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-1.5 flex-1 accent-mint"
      />
      <span className="w-20 text-right text-sm text-cream">
        {value} <span className="text-xs text-white/40">{unit}</span>
      </span>
    </div>
  );
}
