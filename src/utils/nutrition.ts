// 营养计算工具

export type Gender = "male" | "female";

export type ActivityLevel = "sedentary" | "light" | "moderate" | "active" | "very_active";

export interface ActivityOption {
  value: ActivityLevel;
  label: string;
  factor: number;
  description: string;
}

export const ACTIVITY_OPTIONS: ActivityOption[] = [
  { value: "sedentary", label: "久坐不动", factor: 1.2, description: "办公室工作，几乎不运动" },
  { value: "light", label: "轻度活动", factor: 1.375, description: "每周运动 1-3 次" },
  { value: "moderate", label: "中度活动", factor: 1.55, description: "每周运动 3-5 次" },
  { value: "active", label: "高度活动", factor: 1.725, description: "每周运动 6-7 次" },
  { value: "very_active", label: "极高度活动", factor: 1.9, description: "每天高强度训练/体力工作" },
];

export interface UserProfile {
  gender: Gender;
  age: number;
  height: number; // cm
  weight: number; // kg
  activityLevel: ActivityLevel;
}

export interface NutritionTargets {
  bmr: number;
  tdee: number;
  protein: number; // g
  carbs: number; // g
  fat: number; // g
  fiber: number; // g 膳食纤维目标
}

// ===== 营养比例预设方案 =====
export type MacroPresetId = "balanced" | "bulk" | "cut" | "keto";

export interface MacroPreset {
  id: MacroPresetId;
  label: string;
  description: string;
  proteinRatio: number; // 蛋白质供能占比
  carbsRatio: number;   // 碳水供能占比
  fatRatio: number;     // 脂肪供能占比
}

export const MACRO_PRESETS: MacroPreset[] = [
  { id: "balanced", label: "均衡饮食", description: "蛋白30% · 碳水45% · 脂肪25%", proteinRatio: 0.3, carbsRatio: 0.45, fatRatio: 0.25 },
  { id: "bulk",     label: "增肌模式", description: "蛋白30% · 碳水50% · 脂肪20%", proteinRatio: 0.3, carbsRatio: 0.5,  fatRatio: 0.2  },
  { id: "cut",      label: "减脂模式", description: "蛋白40% · 碳水35% · 脂肪25%", proteinRatio: 0.4, carbsRatio: 0.35, fatRatio: 0.25 },
  { id: "keto",     label: "生酮模式", description: "蛋白25% · 碳水5% · 脂肪70%",  proteinRatio: 0.25, carbsRatio: 0.05, fatRatio: 0.7  },
];

export interface MacroRatios {
  protein: number;
  carbs: number;
  fat: number;
}

// Mifflin-St Jeor 公式计算基础代谢率 BMR
export function calculateBMR(profile: UserProfile): number {
  const { weight, height, age, gender } = profile;
  const base = 10 * weight + 6.25 * height - 5 * age;
  return Math.round(gender === "male" ? base + 5 : base - 161);
}

// 计算每日总能量消耗 TDEE
export function calculateTDEE(profile: UserProfile): number {
  const bmr = calculateBMR(profile);
  const factor = ACTIVITY_OPTIONS.find((a) => a.value === profile.activityLevel)?.factor ?? 1.2;
  return Math.round(bmr * factor);
}

// 计算宏量营养素目标，支持自定义比例；膳食纤维按 14g/1000kcal 计算
export function calculateTargets(
  profile: UserProfile,
  ratios?: MacroRatios
): NutritionTargets {
  const bmr = calculateBMR(profile);
  const tdee = calculateTDEE(profile);
  const r = ratios ?? { protein: 0.3, carbs: 0.45, fat: 0.25 };
  return {
    bmr,
    tdee,
    protein: Math.round((tdee * r.protein) / 4), // 4 kcal/g
    carbs: Math.round((tdee * r.carbs) / 4),     // 4 kcal/g
    fat: Math.round((tdee * r.fat) / 9),         // 9 kcal/g
    fiber: Math.round((tdee / 1000) * 14),       // 14g / 1000kcal
  };
}

export function getActivityLabel(level: ActivityLevel): string {
  return ACTIVITY_OPTIONS.find((a) => a.value === level)?.label ?? "久坐不动";
}
