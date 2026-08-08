import { useState } from "react";
import { X, Plus, Check, Link, Unlink } from "lucide-react";
import { CATEGORIES, type WeightBasis } from "@/data/foods";
import { useStore } from "@/store/useStore";

interface AddFoodModalProps {
  open: boolean;
  onClose: () => void;
}

const EMOJI_CHOICES = ["🍽️", "🥘", "🍳", "🥗", "🧆", "🍔", "🥪", "🌯", "🧀", "🥩", "🐟", "🥚", "🥛", "🍞", "🍜", "🥣", "🥗", "🍎", "🍌", "🥑", "🌰", "🥜", "💪", "🧂", "🍯"];

type FormState = {
  name: string;
  nameEn: string;
  category: string;
  emoji: string;
  // 熟重 / 可食部 (每100g)
  calories: string;
  carbs: string;
  protein: string;
  fat: string;
  fiber: string;
  // 生重 (每100g)
  rawCalories: string;
  rawCarbs: string;
  rawProtein: string;
  rawFat: string;
  rawFiber: string;
  // 配置
  basisDefault: WeightBasis;
  cookFactor: string;
  // 生熟同步开关
  syncRaw: boolean;
};

const initialForm = (): FormState => ({
  name: "",
  nameEn: "",
  category: "其他",
  emoji: "🍽️",
  calories: "",
  carbs: "",
  protein: "",
  fat: "",
  fiber: "",
  rawCalories: "",
  rawCarbs: "",
  rawProtein: "",
  rawFat: "",
  rawFiber: "",
  basisDefault: "raw",
  cookFactor: "1",
  syncRaw: true,
});

export default function AddFoodModal({ open, onClose }: AddFoodModalProps) {
  const addCustomFood = useStore((s) => s.addCustomFood);
  const [form, setForm] = useState<FormState>(initialForm());
  const [error, setError] = useState("");

  if (!open) return null;

  const handleField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    let next = { ...form, [key]: value };
    // 生熟同步：熟重改动时同步生重（用户关闭同步时不生效）
    if (next.syncRaw) {
      const cookedFields = ["calories", "carbs", "protein", "fat", "fiber"] as const;
      if (cookedFields.includes(key as (typeof cookedFields)[number])) {
        (next as any)[`raw${(key as string).charAt(0).toUpperCase()}${(key as string).slice(1)}`] = value;
      }
    }
    setForm(next);
    setError("");
  };

  const handleSubmit = () => {
    if (!form.name.trim()) {
      setError("请输入食物名称");
      return;
    }
    const cooked = {
      calories: Number(form.calories),
      carbs: Number(form.carbs) || 0,
      protein: Number(form.protein) || 0,
      fat: Number(form.fat) || 0,
      fiber: Number(form.fiber) || 0,
    };
    const raw = {
      calories: Number(form.rawCalories),
      carbs: Number(form.rawCarbs) || 0,
      protein: Number(form.rawProtein) || 0,
      fat: Number(form.rawFat) || 0,
      fiber: Number(form.rawFiber) || 0,
    };
    // 未填生重则按同步逻辑回退到熟重
    if (!form.rawCalories) {
      raw.calories = cooked.calories;
      raw.carbs = cooked.carbs;
      raw.protein = cooked.protein;
      raw.fat = cooked.fat;
      raw.fiber = cooked.fiber;
    }

    if (!form.calories || isNaN(cooked.calories) || cooked.calories < 0) {
      setError("请输入有效的热量值（熟重/可食部）");
      return;
    }
    if (isNaN(raw.calories) || raw.calories < 0) {
      setError("请输入有效的生重热量值");
      return;
    }
    if (
      cooked.carbs < 0 || cooked.protein < 0 || cooked.fat < 0 || cooked.fiber < 0 ||
      raw.carbs < 0 || raw.protein < 0 || raw.fat < 0 || raw.fiber < 0
    ) {
      setError("营养素数值不能为负数");
      return;
    }
    let cookFactor = Number(form.cookFactor);
    if (!cookFactor || isNaN(cookFactor) || cookFactor <= 0) cookFactor = 1;

    addCustomFood({
      name: form.name.trim(),
      nameEn: form.nameEn.trim() || form.name.trim(),
      category: form.category,
      emoji: form.emoji,
      calories: cooked.calories,
      carbs: cooked.carbs,
      protein: cooked.protein,
      fat: cooked.fat,
      fiber: cooked.fiber,
      rawCalories: raw.calories,
      rawCarbs: raw.carbs,
      rawProtein: raw.protein,
      rawFat: raw.fat,
      rawFiber: raw.fiber,
      basisDefault: form.basisDefault,
      cookFactor,
    });

    setForm(initialForm());
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="glass-card relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl p-6 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 关闭按钮 */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-white/40 transition-colors hover:bg-white/10 hover:text-cream"
        >
          <X className="h-5 w-5" />
        </button>

        {/* 标题 */}
        <div className="mb-5 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-mint to-mint-dark shadow-lg shadow-mint/30">
            <Plus className="h-5 w-5 text-charcoal" />
          </div>
          <div>
            <h2 className="font-display text-2xl tracking-wide text-cream">添加自定义食物</h2>
            <p className="text-xs text-white/40">数据以每 100g 为基准，保存后可在列表中搜索使用</p>
          </div>
        </div>

        {/* 表单 */}
        <div className="space-y-4">
          {/* 食物名称 */}
          <div className="grid grid-cols-2 gap-3">
            <FormField label="食物名称 *" >
              <input
                type="text"
                value={form.name}
                onChange={(e) => handleField("name", e.target.value)}
                placeholder="如：自制鸡胸沙拉"
                className="input-base"
              />
            </FormField>
            <FormField label="英文名称（选填）">
              <input
                type="text"
                value={form.nameEn}
                onChange={(e) => handleField("nameEn", e.target.value)}
                placeholder="Chicken Salad"
                className="input-base"
              />
            </FormField>
          </div>

          {/* 分类 */}
          <FormField label="分类">
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleField("category", cat)}
                  className={`rounded-full px-3 py-1 text-xs transition-all ${
                    form.category === cat
                      ? "bg-mint text-charcoal font-medium"
                      : "border border-white/10 bg-white/5 text-white/50 hover:text-cream"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </FormField>

          {/* Emoji 选择 */}
          <FormField label="图标">
            <div className="flex flex-wrap gap-1.5">
              {EMOJI_CHOICES.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => handleField("emoji", emoji)}
                  className={`flex h-9 w-9 items-center justify-center rounded-lg text-lg transition-all ${
                    form.emoji === emoji
                      ? "bg-mint/20 ring-2 ring-mint"
                      : "bg-white/5 hover:bg-white/10"
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </FormField>

          {/* ===== 熟重 / 可食部 ===== */}
          <div className="rounded-xl border border-orange-500/20 bg-orange-500/5 p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-medium text-orange-300">熟重 / 可食部（每 100g）</span>
            </div>
            <div className="space-y-3">
              <FormField label="热量 (kcal) *">
                <input
                  type="number"
                  min={0}
                  value={form.calories}
                  onChange={(e) => handleField("calories", e.target.value)}
                  placeholder="如：150"
                  className="input-base"
                />
              </FormField>
              <div className="grid grid-cols-3 gap-3">
                <FormField label="碳水 (g)">
                  <input
                    type="number"
                    min={0}
                    step="0.1"
                    value={form.carbs}
                    onChange={(e) => handleField("carbs", e.target.value)}
                    placeholder="0"
                    className="input-base text-carb"
                  />
                </FormField>
                <FormField label="蛋白 (g)">
                  <input
                    type="number"
                    min={0}
                    step="0.1"
                    value={form.protein}
                    onChange={(e) => handleField("protein", e.target.value)}
                    placeholder="0"
                    className="input-base text-protein"
                  />
                </FormField>
                <FormField label="脂肪 (g)">
                  <input
                    type="number"
                    min={0}
                    step="0.1"
                    value={form.fat}
                    onChange={(e) => handleField("fat", e.target.value)}
                    placeholder="0"
                    className="input-base text-fat"
                  />
                </FormField>
              </div>
              <FormField label="膳食纤维 (g)">
                <input
                  type="number"
                  min={0}
                  step="0.1"
                  value={form.fiber}
                  onChange={(e) => handleField("fiber", e.target.value)}
                  placeholder="0"
                  className="input-base text-mint"
                />
              </FormField>
            </div>
          </div>

          {/* ===== 生重 ===== */}
          <div className="rounded-xl border border-sky-500/20 bg-sky-500/5 p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-medium text-sky-300">生重 / 干重（每 100g）</span>
              <button
                type="button"
                onClick={() => handleField("syncRaw", !form.syncRaw)}
                className={`flex items-center gap-1 rounded-lg border px-2 py-0.5 text-[10px] transition-all ${
                  form.syncRaw
                    ? "border-sky-500/30 bg-sky-500/10 text-sky-200"
                    : "border-white/10 bg-white/5 text-white/40 hover:text-white/60"
                }`}
              >
                {form.syncRaw ? <Link className="h-3 w-3" /> : <Unlink className="h-3 w-3" />}
                {form.syncRaw ? "同步熟重" : "已取消同步"}
              </button>
            </div>
            <div className="space-y-3">
              <FormField label="热量 (kcal) *">
                <input
                  type="number"
                  min={0}
                  value={form.rawCalories}
                  onChange={(e) => handleField("rawCalories", e.target.value)}
                  placeholder="默认与熟重相同"
                  className="input-base"
                />
              </FormField>
              <div className="grid grid-cols-3 gap-3">
                <FormField label="碳水 (g)">
                  <input
                    type="number"
                    min={0}
                    step="0.1"
                    value={form.rawCarbs}
                    onChange={(e) => handleField("rawCarbs", e.target.value)}
                    placeholder="0"
                    className="input-base text-carb"
                  />
                </FormField>
                <FormField label="蛋白 (g)">
                  <input
                    type="number"
                    min={0}
                    step="0.1"
                    value={form.rawProtein}
                    onChange={(e) => handleField("rawProtein", e.target.value)}
                    placeholder="0"
                    className="input-base text-protein"
                  />
                </FormField>
                <FormField label="脂肪 (g)">
                  <input
                    type="number"
                    min={0}
                    step="0.1"
                    value={form.rawFat}
                    onChange={(e) => handleField("rawFat", e.target.value)}
                    placeholder="0"
                    className="input-base text-fat"
                  />
                </FormField>
              </div>
              <FormField label="膳食纤维 (g)">
                <input
                  type="number"
                  min={0}
                  step="0.1"
                  value={form.rawFiber}
                  onChange={(e) => handleField("rawFiber", e.target.value)}
                  placeholder="0"
                  className="input-base text-mint"
                />
              </FormField>
            </div>
            <p className="mt-2 text-[10px] text-white/30">
              提示：未填写则默认与熟重相同。开启「同步熟重」时修改熟重会自动同步到生重。
            </p>
          </div>

          {/* 称量默认 & 换算系数 */}
          <div className="grid grid-cols-2 gap-3">
            <FormField label="常用称量基准">
              <div className="flex rounded-lg border border-white/10 bg-white/5 p-1">
                {(["raw", "cooked"] as WeightBasis[]).map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => handleField("basisDefault", b)}
                    className={`flex-1 rounded-md py-1.5 text-xs transition-all ${
                      form.basisDefault === b
                        ? "bg-charcoal-light text-cream"
                        : "text-white/40 hover:text-white/70"
                    }`}
                  >
                    {b === "raw" ? "生重" : "熟重"}
                  </button>
                ))}
              </div>
            </FormField>
            <FormField label="生→熟换算系数">
              <input
                type="number"
                min={0.1}
                step="0.05"
                value={form.cookFactor}
                onChange={(e) => handleField("cookFactor", e.target.value)}
                className="input-base"
              />
            </FormField>
          </div>
          <p className="-mt-2 text-[10px] text-white/30">
            换算系数 = 熟重 ÷ 生重。例：生米100g → 熟饭270g，则系数 2.7；肉类失水约 0.8（无差别填 1）。
          </p>

          {/* 错误提示 */}
          {error && (
            <div className="rounded-xl border border-flame/30 bg-flame/10 px-4 py-2 text-sm text-flame-light">
              {error}
            </div>
          )}

          {/* 按钮 */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 rounded-xl border border-white/10 bg-white/5 py-3 text-sm text-white/60 transition-all hover:text-cream"
            >
              取消
            </button>
            <button
              onClick={handleSubmit}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-mint to-mint-dark py-3 font-medium text-charcoal shadow-lg shadow-mint/30 transition-all hover:shadow-mint/50"
            >
              <Check className="h-4 w-4" />
              保存食物
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs text-white/50">{label}</label>
      {children}
    </div>
  );
}
