import { useState } from "react";
import { Calculator as CalcIcon, User, Activity, Zap } from "lucide-react";
import { useStore } from "@/store/useStore";
import {
  ACTIVITY_OPTIONS,
  calculateBMR,
  calculateTDEE,
  type Gender,
  type ActivityLevel,
} from "@/utils/nutrition";

export default function Calculator() {
  const profile = useStore((s) => s.profile);
  const targets = useStore((s) => s.targets);
  const updateProfile = useStore((s) => s.updateProfile);

  const [form, setForm] = useState({
    gender: profile?.gender ?? "male",
    age: profile?.age ?? 25,
    height: profile?.height ?? 175,
    weight: profile?.weight ?? 70,
    activityLevel: profile?.activityLevel ?? "moderate",
  });

  const bmr = calculateBMR(form as never);
  const tdee = calculateTDEE(form as never);
  const protein = Math.round((tdee * 0.3) / 4);
  const carbs = Math.round((tdee * 0.45) / 4);
  const fat = Math.round((tdee * 0.25) / 9);

  const handleSave = () => {
    updateProfile(form as never);
  };

  return (
    <div className="animate-fade-in">
      <section className="mb-8 text-center">
        <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-mint/20 bg-mint/5 px-3 py-1 text-xs text-mint-light">
          <CalcIcon className="h-3 w-3" />
          Mifflin-St Jeor 公式
        </div>
        <h1 className="font-display text-5xl tracking-wide text-cream sm:text-6xl">
          每日 <span className="text-gradient-mint">摄入量</span> 计算
        </h1>
        <p className="mt-2 text-sm text-white/50">
          根据年龄、身高、体重与运动量，精准计算 BMR / TDEE 与宏量营养素目标
        </p>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* 左侧：输入表单 */}
        <div className="glass-card rounded-2xl p-6">
          <div className="mb-5 flex items-center gap-2">
            <User className="h-5 w-5 text-flame" />
            <h2 className="font-display text-2xl tracking-wide text-cream">身体数据</h2>
          </div>

          {/* 性别 */}
          <div className="mb-5">
            <label className="mb-2 block text-sm text-white/60">性别</label>
            <div className="flex gap-2">
              {([
                { value: "male", label: "男性" },
                { value: "female", label: "女性" },
              ] as const).map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setForm({ ...form, gender: value })}
                  className={`flex-1 rounded-xl border py-2.5 text-sm font-medium transition-all ${
                    form.gender === value
                      ? "border-flame bg-flame/15 text-flame-light"
                      : "border-white/10 bg-white/5 text-white/50 hover:text-cream"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* 年龄 */}
          <NumberField
            label="年龄"
            value={form.age}
            unit="岁"
            min={10}
            max={100}
            onChange={(v) => setForm({ ...form, age: v })}
          />

          {/* 身高 */}
          <NumberField
            label="身高"
            value={form.height}
            unit="cm"
            min={100}
            max={250}
            onChange={(v) => setForm({ ...form, height: v })}
          />

          {/* 体重 */}
          <NumberField
            label="体重"
            value={form.weight}
            unit="kg"
            min={30}
            max={250}
            onChange={(v) => setForm({ ...form, weight: v })}
          />

          {/* 运动量 */}
          <div className="mb-6">
            <label className="mb-2 block text-sm text-white/60">运动量</label>
            <div className="space-y-2">
              {ACTIVITY_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setForm({ ...form, activityLevel: opt.value as ActivityLevel })}
                  className={`flex w-full items-center justify-between rounded-xl border px-4 py-2.5 text-left transition-all ${
                    form.activityLevel === opt.value
                      ? "border-mint bg-mint/10"
                      : "border-white/10 bg-white/5 hover:border-white/20"
                  }`}
                >
                  <div>
                    <p className={`text-sm font-medium ${form.activityLevel === opt.value ? "text-mint-light" : "text-cream"}`}>
                      {opt.label}
                    </p>
                    <p className="text-xs text-white/40">{opt.description}</p>
                  </div>
                  <span className="font-display text-lg text-white/30">×{opt.factor}</span>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleSave}
            className="w-full rounded-xl bg-gradient-to-r from-flame to-flame-dark py-3 font-medium text-white shadow-lg shadow-flame/30 transition-all hover:shadow-flame/50"
          >
            保存为目标
          </button>
          {targets && (
            <p className="mt-2 text-center text-xs text-mint/60">
              ✓ 已保存，餐单页将以此为每日目标
            </p>
          )}
        </div>

        {/* 右侧：计算结果 */}
        <div className="space-y-4">
          {/* TDEE 主结果 */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-flame/20 to-flame-dark/10 p-6">
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-flame/20 blur-2xl" />
            <div className="relative">
              <div className="mb-1 flex items-center gap-2">
                <Zap className="h-4 w-4 text-flame" />
                <span className="text-xs uppercase tracking-wider text-flame-light">
                  每日总能量消耗 TDEE
                </span>
              </div>
              <div className="flex items-end gap-2">
                <span className="font-display text-6xl text-cream">{tdee}</span>
                <span className="mb-2 text-lg text-white/40">kcal / 天</span>
              </div>
            </div>
          </div>

          {/* BMR */}
          <div className="glass-card flex items-center justify-between rounded-2xl p-5">
            <div>
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-mint" />
                <span className="text-xs uppercase tracking-wider text-mint-light">
                  基础代谢率 BMR
                </span>
              </div>
              <p className="mt-1 text-xs text-white/40">静息状态下的能量消耗</p>
            </div>
            <span className="font-display text-3xl text-cream">
              {bmr} <span className="text-base text-white/40">kcal</span>
            </span>
          </div>

          {/* 宏量营养素目标 */}
          <div className="glass-card rounded-2xl p-5">
            <h3 className="mb-4 font-display text-xl tracking-wide text-cream">
              宏量营养素目标
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <MacroBox label="蛋白质" value={protein} unit="g" color="text-protein" bg="bg-protein/10" dot="bg-protein" ratio="30%" />
              <MacroBox label="碳水" value={carbs} unit="g" color="text-carb" bg="bg-carb/10" dot="bg-carb" ratio="45%" />
              <MacroBox label="脂肪" value={fat} unit="g" color="text-fat" bg="bg-fat/10" dot="bg-fat" ratio="25%" />
            </div>
            <div className="mt-4 rounded-xl bg-white/5 p-3 text-xs text-white/50">
              <p className="mb-1 font-medium text-white/70">营养素能量换算：</p>
              <p>· 蛋白质 1g = 4 kcal · 碳水 1g = 4 kcal · 脂肪 1g = 9 kcal</p>
            </div>
          </div>

          {/* 公式说明 */}
          <div className="glass-card rounded-2xl p-5">
            <h3 className="mb-3 font-display text-lg tracking-wide text-cream">计算公式</h3>
            <div className="space-y-2 text-xs text-white/50">
              <p>
                <span className="text-flame-light">BMR (男)</span> = 10×体重 + 6.25×身高 - 5×年龄 + 5
              </p>
              <p>
                <span className="text-flame-light">BMR (女)</span> = 10×体重 + 6.25×身高 - 5×年龄 - 161
              </p>
              <p>
                <span className="text-mint-light">TDEE</span> = BMR × 运动系数
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function NumberField({
  label,
  value,
  unit,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="mb-5">
      <label className="mb-2 block text-sm text-white/60">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={value}
          min={min}
          max={max}
          onChange={(e) => onChange(Number(e.target.value) || 0)}
          className="w-full rounded-xl border border-white/10 bg-charcoal-light/60 px-4 py-2.5 text-cream outline-none focus:border-flame focus:ring-2 focus:ring-flame/20"
        />
        <span className="text-sm text-white/40">{unit}</span>
      </div>
    </div>
  );
}

function MacroBox({
  label,
  value,
  unit,
  color,
  bg,
  dot,
  ratio,
}: {
  label: string;
  value: number;
  unit: string;
  color: string;
  bg: string;
  dot: string;
  ratio: string;
}) {
  return (
    <div className={`rounded-xl ${bg} p-3 text-center`}>
      <div className="mb-1 flex items-center justify-center gap-1">
        <span className={`h-2 w-2 rounded-full ${dot}`} />
        <span className="text-xs text-white/50">{label}</span>
      </div>
      <p className={`font-display text-3xl ${color}`}>{value}</p>
      <p className="text-[10px] text-white/30">{unit} · {ratio}</p>
    </div>
  );
}
