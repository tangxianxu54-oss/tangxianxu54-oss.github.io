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

// 计算宏量营养素目标（健身人群比例：蛋白质30% 碳水45% 脂肪25%）
export function calculateTargets(profile: UserProfile): NutritionTargets {
  const bmr = calculateBMR(profile);
  const tdee = calculateTDEE(profile);
  return {
    bmr,
    tdee,
    protein: Math.round((tdee * 0.3) / 4), // 4 kcal/g
    carbs: Math.round((tdee * 0.45) / 4), // 4 kcal/g
    fat: Math.round((tdee * 0.25) / 9), // 9 kcal/g
  };
}

export function getActivityLabel(level: ActivityLevel): string {
  return ACTIVITY_OPTIONS.find((a) => a.value === level)?.label ?? "久坐不动";
}
