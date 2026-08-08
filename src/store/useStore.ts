import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserProfile, ActivityLevel, NutritionTargets } from "@/utils/nutrition";
import { calculateTargets } from "@/utils/nutrition";
import type { Food, WeightBasis } from "@/data/foods";

export type MealType = "breakfast" | "lunch" | "dinner" | "snack";

export interface DiaryEntry {
  id: string;
  foodId: string;
  foodName: string;
  foodEmoji: string;
  grams: number;
  // 记录条目是按「生重」还是「熟重」称量并计算的
  weightBasis: WeightBasis;
  // 按对应 weightBasis 的每 100g 营养 × grams / 100 计算得到的摄入值
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  fiber: number;
  mealType: MealType;
  addedAt: number;
}

export type CustomFood = Food & { isCustom?: true };

export interface NutritionTotals {
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  fiber: number;
}

interface StoreState {
  entries: DiaryEntry[];
  profile: UserProfile | null;
  targets: NutritionTargets | null;
  customFoods: CustomFood[];
  addEntry: (entry: Omit<DiaryEntry, "id" | "addedAt">) => void;
  removeEntry: (id: string) => void;
  clearEntries: () => void;
  setProfile: (profile: UserProfile) => void;
  updateProfile: (partial: Partial<UserProfile>) => void;
  clearProfile: () => void;
  addCustomFood: (food: Omit<CustomFood, "id" | "isCustom">) => void;
  removeCustomFood: (id: string) => void;
}

const defaultProfile: UserProfile = {
  gender: "male",
  age: 25,
  height: 175,
  weight: 70,
  activityLevel: "moderate" as ActivityLevel,
};

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      entries: [],
      profile: defaultProfile,
      targets: calculateTargets(defaultProfile),
      customFoods: [],
      addEntry: (entry) =>
        set((state) => ({
          entries: [
            ...state.entries,
            { ...entry, id: crypto.randomUUID(), addedAt: Date.now() },
          ],
        })),
      removeEntry: (id) =>
        set((state) => ({
          entries: state.entries.filter((e) => e.id !== id),
        })),
      clearEntries: () => set({ entries: [] }),
      setProfile: (profile) =>
        set({ profile, targets: calculateTargets(profile) }),
      updateProfile: (partial) =>
        set((state) => {
          const profile = { ...state.profile!, ...partial };
          return { profile, targets: calculateTargets(profile) };
        }),
      clearProfile: () => set({ profile: null, targets: null }),
      addCustomFood: (food) =>
        set((state) => ({
          customFoods: [
            ...state.customFoods,
            { ...food, id: `custom-${crypto.randomUUID()}`, isCustom: true },
          ],
        })),
      removeCustomFood: (id) =>
        set((state) => ({
          customFoods: state.customFoods.filter((f) => f.id !== id),
        })),
    }),
    {
      name: "fitness-calorie-store",
      // 版本迁移：给历史 entries 补上默认 weightBasis = "cooked"（老版本无此字段时最接近原来的行为）
      migrate: (persistedState: unknown, version: number) => {
        const state = (persistedState ?? {}) as Partial<StoreState>;
        if (Array.isArray(state.entries)) {
          state.entries = state.entries.map((e) => ({
            ...e,
            weightBasis: (e as DiaryEntry).weightBasis ?? ("cooked" as WeightBasis),
          }));
        }
        // 兼容旧版自定义食物：补齐生重字段与配置
        if (Array.isArray(state.customFoods)) {
          state.customFoods = state.customFoods.map((f) => {
            const food = f as CustomFood;
            return {
              ...food,
              rawCalories: food.rawCalories ?? food.calories,
              rawCarbs: food.rawCarbs ?? food.carbs,
              rawProtein: food.rawProtein ?? food.protein,
              rawFat: food.rawFat ?? food.fat,
              rawFiber: food.rawFiber ?? food.fiber,
              basisDefault: (food.basisDefault ?? "cooked") as WeightBasis,
              cookFactor: food.cookFactor ?? 1,
            };
          });
        }
        return state as StoreState;
      },
    }
  )
);

const emptyTotals = (): NutritionTotals => ({
  calories: 0,
  carbs: 0,
  protein: 0,
  fat: 0,
  fiber: 0,
});

// 计算当日总摄入
export function getDailyTotals(entries: DiaryEntry[]): NutritionTotals {
  return entries.reduce<NutritionTotals>(
    (acc, e) => ({
      calories: acc.calories + e.calories,
      carbs: acc.carbs + e.carbs,
      protein: acc.protein + e.protein,
      fat: acc.fat + e.fat,
      fiber: acc.fiber + e.fiber,
    }),
    emptyTotals()
  );
}

// 按生重 / 熟重 分别汇总
export function splitTotalsByBasis(entries: DiaryEntry[]): {
  raw: NutritionTotals & { rawGrams: number };
  cooked: NutritionTotals & { cookedGrams: number };
  total: NutritionTotals;
} {
  const raw = { ...emptyTotals(), rawGrams: 0 };
  const cooked = { ...emptyTotals(), cookedGrams: 0 };
  for (const e of entries) {
    if (e.weightBasis === "raw") {
      raw.calories += e.calories;
      raw.carbs += e.carbs;
      raw.protein += e.protein;
      raw.fat += e.fat;
      raw.fiber += e.fiber;
      raw.rawGrams += e.grams;
    } else {
      cooked.calories += e.calories;
      cooked.carbs += e.carbs;
      cooked.protein += e.protein;
      cooked.fat += e.fat;
      cooked.fiber += e.fiber;
      cooked.cookedGrams += e.grams;
    }
  }
  const total: NutritionTotals = {
    calories: raw.calories + cooked.calories,
    carbs: raw.carbs + cooked.carbs,
    protein: raw.protein + cooked.protein,
    fat: raw.fat + cooked.fat,
    fiber: raw.fiber + cooked.fiber,
  };
  return { raw, cooked, total };
}
