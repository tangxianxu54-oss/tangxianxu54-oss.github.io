import { useMemo, useState } from "react";
import { Dumbbell, Plus, Trash2, Flame, Timer, Beef, Egg, CupSoda } from "lucide-react";
import {
  exercises,
  EXERCISE_CATEGORIES,
  type Exercise,
  type ExerciseCategory,
} from "@/data/exercises";
import { useStore } from "@/store/useStore";
import { getCachedInitials, pinyinMatchCached } from "@/utils/pinyin";

// 热量公式：kcal = MET × 体重(kg) × 时长(小时)
const calcBurn = (met: number, weight: number, minutes: number) =>
  Math.round(met * weight * (minutes / 60));

interface CartItem {
  key: number;
  exercise: Exercise;
  minutes: number;
  kcal: number;
}

export default function Exercises() {
  const profileWeight = useStore((s) => s.profile?.weight ?? 70);

  const [weight, setWeight] = useState<number>(profileWeight);
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("全部");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [minutes, setMinutes] = useState(30);
  const [cart, setCart] = useState<CartItem[]>([]);

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

  const totalKcal = cart.reduce((sum, item) => sum + item.kcal, 0);

  const addToCart = (exercise: Exercise, mins: number) => {
    const kcal = calcBurn(exercise.met, weight, mins);
    setCart((prev) => [...prev, { key: Date.now(), exercise, minutes: mins, kcal }]);
    setExpandedId(null);
  };

  const removeFromCart = (key: number) => {
    setCart((prev) => prev.filter((item) => item.key !== key));
  };

  return (
    <div className="animate-fade-in">
      {/* Hero 区 */}
      <section className="mb-8 text-center">
        <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-mint/20 bg-mint/5 px-3 py-1 text-xs text-mint">
          <Dumbbell className="h-3 w-3" />
          MET 代谢当量 · 消耗 = MET × 体重 × 时长
        </div>
        <h1 className="font-display text-5xl tracking-wide text-cream sm:text-6xl">
          训练 <span className="text-gradient-mint">消耗</span> 计算器
        </h1>
        <p className="mt-2 text-sm text-white/50">
          胸 · 背 · 手臂 · 肩 · 腹 · 腿 · 有氧，共 {exercises.length} 个训练动作
        </p>
      </section>

      {/* 体重输入 */}
      <div className="mb-6 flex items-center justify-center gap-3">
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
        <span className="text-xs text-white/30">（自动读取个人资料）</span>
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
                  weight={weight}
                  expanded={expandedId === e.id}
                  minutes={minutes}
                  setMinutes={setMinutes}
                  onToggle={() => setExpandedId(expandedId === e.id ? null : e.id)}
                  onAdd={() => addToCart(e, minutes)}
                />
              ))}
            </div>
          )}
        </div>

        {/* 训练清单侧栏 */}
        <aside className="lg:sticky lg:top-20 h-fit">
          <div className="rounded-2xl border border-white/10 bg-charcoal-light/60 p-5 backdrop-blur-sm">
            <h2 className="mb-4 flex items-center gap-2 font-display text-lg text-cream">
              <Flame className="h-5 w-5 text-flame" />
              本次训练
              {cart.length > 0 && (
                <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-white/50">
                  {cart.length} 项
                </span>
              )}
            </h2>

            {cart.length === 0 ? (
              <p className="py-6 text-center text-sm text-white/30">
                点击动作卡片添加训练项目
              </p>
            ) : (
              <>
                <ul className="mb-4 space-y-2">
                  {cart.map((item) => (
                    <li
                      key={item.key}
                      className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2 text-sm"
                    >
                      <span>{item.exercise.emoji}</span>
                      <span className="flex-1 truncate text-cream">{item.exercise.name}</span>
                      <span className="text-xs text-white/40">{item.minutes}min</span>
                      <span className="font-medium text-flame">{item.kcal} kcal</span>
                      <button
                        onClick={() => removeFromCart(item.key)}
                        className="text-white/30 transition-colors hover:text-red-400"
                        aria-label="删除"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </li>
                  ))}
                </ul>

                {/* 总消耗 */}
                <div className="rounded-xl bg-gradient-to-r from-flame/20 to-flame/5 p-4 text-center">
                  <p className="text-xs text-white/50">总消耗</p>
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

// ===== 单个动作卡片 =====
function ExerciseCard({
  exercise,
  weight,
  expanded,
  minutes,
  setMinutes,
  onToggle,
  onAdd,
}: {
  exercise: Exercise;
  weight: number;
  expanded: boolean;
  minutes: number;
  setMinutes: (m: number) => void;
  onToggle: () => void;
  onAdd: () => void;
}) {
  const refBurn = calcBurn(exercise.met, 70, 30);
  const realBurn = calcBurn(exercise.met, weight, minutes);

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
            <p className="font-display text-lg text-mint">{refBurn}</p>
            <p className="text-[10px] text-white/30">kcal/30min</p>
          </div>
        </div>
        <p className="mt-1.5 text-xs text-white/40">MET {exercise.met} · {exercise.tip}</p>
      </button>

      {/* 展开区：时长输入 */}
      {expanded && (
        <div className="border-t border-white/10 px-4 py-3">
          <div className="flex items-center gap-3">
            <Timer className="h-4 w-4 flex-shrink-0 text-mint" />
            <input
              type="range"
              min={5}
              max={180}
              step={5}
              value={minutes}
              onChange={(e) => setMinutes(Number(e.target.value))}
              className="h-1.5 flex-1 accent-mint"
            />
            <span className="w-16 text-right text-sm text-cream">{minutes} 分钟</span>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <p className="text-sm text-white/60">
              消耗 <span className="font-display text-lg text-flame">{realBurn}</span> kcal
              <span className="ml-1 text-xs text-white/30">（{weight}kg）</span>
            </p>
            <button
              onClick={onAdd}
              className="flex items-center gap-1 rounded-full bg-gradient-to-r from-mint to-mint-dark px-4 py-1.5 text-sm font-medium text-charcoal shadow-lg shadow-mint/30 transition-all hover:shadow-mint/50"
            >
              <Plus className="h-4 w-4" />
              添加
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
