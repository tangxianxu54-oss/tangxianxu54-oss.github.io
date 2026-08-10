import { useState } from "react";
import { Plus, Trash2, ArrowRightLeft, Pencil } from "lucide-react";
import type { Food, WeightBasis } from "@/data/foods";
import type { MealType } from "@/store/useStore";

interface FoodCardProps {
  food: Food;
  onAdd: (grams: number, mealType: MealType, basis: WeightBasis) => void;
  onDelete?: () => void;
  onEdit?: () => void;
}

const mealLabels: Record<MealType, string> = {
  breakfast: "早餐",
  lunch: "午餐",
  dinner: "晚餐",
  snack: "加餐",
};

const mealColors: Record<MealType, string> = {
  breakfast: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  lunch: "bg-mint/20 text-mint-light border-mint/30",
  dinner: "bg-flame/20 text-flame-light border-flame/30",
  snack: "bg-purple-500/20 text-purple-300 border-purple-500/30",
};

const basisLabel: Record<WeightBasis, string> = {
  raw: "生重",
  cooked: "熟重",
};

function pickNutrition(food: Food, basis: WeightBasis) {
  return basis === "raw"
    ? {
        calories: food.rawCalories ?? food.calories,
        carbs: food.rawCarbs ?? food.carbs,
        protein: food.rawProtein ?? food.protein,
        fat: food.rawFat ?? food.fat,
        fiber: food.rawFiber ?? food.fiber,
      }
    : {
        calories: food.calories,
        carbs: food.carbs,
        protein: food.protein,
        fat: food.fat,
        fiber: food.fiber,
      };
}

export default function FoodCard({ food, onAdd, onDelete, onEdit }: FoodCardProps) {
  const [grams, setGrams] = useState(100);
  const [expanded, setExpanded] = useState(false);
  const [mealType, setMealType] = useState<MealType>("breakfast");
  const [basis, setBasis] = useState<WeightBasis>(food.basisDefault ?? "cooked");

  const ratio = grams / 100;
  const calc = (v: number) => Math.round(v * ratio * 10) / 10;
  const cookFactor = food.cookFactor && food.cookFactor > 0 ? food.cookFactor : 1;

  const defaultNut = pickNutrition(food, food.basisDefault ?? "cooked");
  const activeNut = pickNutrition(food, basis);
  const otherBasis: WeightBasis = basis === "raw" ? "cooked" : "raw";
  const otherGrams = Math.round(grams * (basis === "raw" ? cookFactor : 1 / cookFactor) * 10) / 10;

  return (
    <div
      className={`glass-card overflow-hidden rounded-2xl transition-all duration-300 hover:border-flame/30 hover:shadow-lg hover:shadow-flame/5 ${
        expanded ? "ring-1 ring-flame/20" : ""
      }`}
    >
      {/* 头部：食物信息 */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center gap-4 p-4 text-left"
      >
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-white/5 text-2xl">
          {food.emoji}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate font-medium text-cream">{food.name}</h3>
            <span className="rounded-md bg-white/5 px-1.5 py-0.5 text-[10px] text-white/40">
              {food.category}
            </span>
            <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-medium ${
              (food.basisDefault ?? "cooked") === "raw"
                ? "bg-sky-500/15 text-sky-300"
                : "bg-orange-500/15 text-orange-300"
            }`}>
              常用·{basisLabel[food.basisDefault ?? "cooked"]}
            </span>
            {"isCustom" in food && food.isCustom && (
              <span className="rounded-md bg-mint/15 px-1.5 py-0.5 text-[10px] font-medium text-mint-light">
                自定义
              </span>
            )}
          </div>
          <p className="text-xs text-white/40">{food.nameEn}</p>
        </div>
        <div className="flex flex-col items-end">
          <span className="font-display text-2xl text-gradient-flame">
            {defaultNut.calories}
          </span>
          <span className="text-[10px] text-white/40">kcal / 100g {basisLabel[food.basisDefault ?? "cooked"]}</span>
        </div>
      </button>

      {/* 生/熟两套 100g 基准面板 */}
      <div className="grid grid-cols-2 gap-2 px-4 pb-3">
        <Per100gPanel
          basis="raw"
          active={basis === "raw"}
          food={food}
          onClick={() => setBasis("raw")}
        />
        <Per100gPanel
          basis="cooked"
          active={basis === "cooked"}
          food={food}
          onClick={() => setBasis("cooked")}
        />
      </div>

      {/* 展开区域：克数输入与添加 */}
      {expanded && (
        <div className="animate-slide-up border-t border-white/5 p-4">
          {/* 生/熟 Tab 切换 */}
          <div className="mb-4 flex rounded-xl border border-white/10 bg-white/5 p-1">
            {(["raw", "cooked"] as WeightBasis[]).map((b) => (
              <button
                key={b}
                onClick={() => setBasis(b)}
                className={`flex-1 rounded-lg py-1.5 text-xs font-medium transition-all ${
                  basis === b
                    ? "bg-charcoal-light text-cream shadow"
                    : "text-white/40 hover:text-white/70"
                }`}
              >
                按 {basisLabel[b]} 输入
              </button>
            ))}
          </div>

          <div className="mb-3 flex items-center gap-3">
            <label className="text-sm text-white/60">{basisLabel[basis]}克数</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={1}
                value={grams}
                onChange={(e) => setGrams(Math.max(0, Number(e.target.value) || 0))}
                className="w-24 rounded-lg border border-white/10 bg-charcoal-light px-3 py-1.5 text-center text-cream outline-none focus:border-flame"
              />
              <span className="text-sm text-white/40">g</span>
            </div>
            {cookFactor !== 1 && (
              <div className="ml-auto flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-[10px] text-white/40">
                <ArrowRightLeft className="h-3 w-3" />
                约 {otherGrams}g {basisLabel[otherBasis]}
              </div>
            )}
          </div>

          {/* 实时换算结果（按当前 basis） */}
          <div className="mb-2 rounded-xl border border-white/5 bg-charcoal-light/50 px-3 py-2 text-[10px] text-white/40">
            按「{basisLabel[basis]} {grams}g」计算摄入
          </div>
          <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
            <CalcBox label="热量" value={calc(activeNut.calories)} unit="kcal" color="text-flame-light" />
            <CalcBox label="碳水" value={calc(activeNut.carbs)} unit="g" color="text-carb" />
            <CalcBox label="蛋白" value={calc(activeNut.protein)} unit="g" color="text-protein" />
            <CalcBox label="脂肪" value={calc(activeNut.fat)} unit="g" color="text-fat" />
          </div>

          {/* 餐次选择 */}
          <div className="mb-3">
            <p className="mb-2 text-xs text-white/40">选择餐次</p>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(mealLabels) as MealType[]).map((mt) => (
                <button
                  key={mt}
                  onClick={() => setMealType(mt)}
                  className={`rounded-full border px-3 py-1 text-xs transition-all ${
                    mealType === mt
                      ? mealColors[mt]
                      : "border-white/10 bg-white/5 text-white/40 hover:text-white/70"
                  }`}
                >
                  {mealLabels[mt]}
                </button>
              ))}
            </div>
          </div>

          {/* 添加 / 删除按钮 */}
          <div className="flex gap-2">
            <button
              onClick={() => {
                if (grams > 0) {
                  onAdd(grams, mealType, basis);
                  setExpanded(false);
                }
              }}
              disabled={grams <= 0}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-flame to-flame-dark py-2.5 font-medium text-white shadow-lg shadow-flame/30 transition-all hover:shadow-flame/50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Plus className="h-4 w-4" />
              添加（{basisLabel[basis]}）
            </button>
            {onEdit && (
              <button
                onClick={onEdit}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white/50 transition-all hover:border-mint/30 hover:text-mint-light"
              >
                <Pencil className="h-4 w-4" />
                编辑
              </button>
            )}
            {onDelete && (
              <button
                onClick={onDelete}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white/50 transition-all hover:border-red-500/30 hover:text-red-400"
              >
                <Trash2 className="h-4 w-4" />
                删除
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Per100gPanel({
  basis,
  active,
  food,
  onClick,
}: {
  basis: WeightBasis;
  active: boolean;
  food: Food;
  onClick: () => void;
}) {
  const nut = pickNutrition(food, basis);
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl border p-2.5 text-left transition-all ${
        active
          ? "border-flame/40 bg-flame/5"
          : "border-white/5 bg-white/[0.02] hover:border-white/10"
      }`}
    >
      <div className="mb-1 flex items-center justify-between">
        <span className={`text-[10px] font-medium ${
          basis === "raw" ? "text-sky-300" : "text-orange-300"
        }`}>
          每100g {basisLabel[basis]}
        </span>
        <span className={`text-[10px] ${active ? "text-flame-light" : "text-white/30"}`}>
          {nut.calories} kcal
        </span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        <MiniNutri color="text-carb" v={nut.carbs} label="碳水" />
        <MiniNutri color="text-protein" v={nut.protein} label="蛋白" />
        <MiniNutri color="text-fat" v={nut.fat} label="脂肪" />
      </div>
    </button>
  );
}

function MiniNutri({ color, v, label }: { color: string; v: number; label: string }) {
  return (
    <span className={`rounded-md bg-white/5 px-1.5 py-0.5 text-[10px] ${color}`}>
      {label} {v}g
    </span>
  );
}

function NutrientTag({
  label,
  value,
  color,
  dot,
}: {
  label: string;
  value: number;
  color: string;
  dot: string;
}) {
  return (
    <div className="flex items-center gap-1 rounded-lg bg-white/5 px-2 py-1">
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
      <span className="text-[10px] text-white/40">{label}</span>
      <span className={`text-xs font-medium ${color}`}>{value}g</span>
    </div>
  );
}

function CalcBox({
  label,
  value,
  unit,
  color,
}: {
  label: string;
  value: number;
  unit: string;
  color: string;
}) {
  return (
    <div className="rounded-xl border border-white/5 bg-charcoal-light/50 p-2.5 text-center">
      <p className="text-[10px] text-white/40">{label}</p>
      <p className={`font-display text-lg ${color}`}>{value}</p>
      <p className="text-[10px] text-white/30">{unit}</p>
    </div>
  );
}
