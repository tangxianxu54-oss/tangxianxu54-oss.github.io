import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserProfile, ActivityLevel, NutritionTargets, MacroPresetId, MacroRatios } from "@/utils/nutrition";
import { calculateTargets, MACRO_PRESETS } from "@/utils/nutrition";
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

// 生成 YYYY-MM-DD 格式的日期 key（本地时区）
export function dateKey(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

interface StoreState {
  // 按日期分组的餐单记录
  entriesByDate: Record<string, DiaryEntry[]>;
  // 按日期记录的饮水量 (ml)
  waterByDate: Record<string, number>;
  profile: UserProfile | null;
  targets: NutritionTargets | null;
  macroPresetId: MacroPresetId;
  customRatios: MacroRatios | null;
  customFoods: CustomFood[];

  // 餐单操作（带日期）
  addEntry: (entry: Omit<DiaryEntry, "id" | "addedAt">, date?: string) => void;
  removeEntry: (id: string, date?: string) => void;
  updateEntryGrams: (id: string, grams: number, date?: string) => void;
  clearEntries: (date?: string) => void;
  getEntries: (date?: string) => DiaryEntry[];

  // 饮水操作
  addWater: (ml: number, date?: string) => void;
  setWater: (ml: number, date?: string) => void;
  getWater: (date?: string) => number;

  // 个人资料与营养目标
  setProfile: (profile: UserProfile) => void;
  updateProfile: (partial: Partial<UserProfile>) => void;
  clearProfile: () => void;
  setMacroPreset: (id: MacroPresetId) => void;
  setCustomRatios: (ratios: MacroRatios) => void;
  getActiveRatios: () => MacroRatios;

  // 自定义食物
  addCustomFood: (food: Omit<CustomFood, "id" | "isCustom">) => void;
  updateCustomFood: (id: string, food: Omit<CustomFood, "id" | "isCustom">) => void;
  removeCustomFood: (id: string) => void;

  // 数据导入导出
  exportData: () => string;
  importData: (json: string) => boolean;
}

const defaultProfile: UserProfile = {
  gender: "male",
  age: 25,
  height: 175,
  weight: 70,
  activityLevel: "moderate" as ActivityLevel,
};

function getRatios(presetId: MacroPresetId, custom: MacroRatios | null): MacroRatios {
  if (custom) return custom;
  const preset = MACRO_PRESETS.find((p) => p.id === presetId) ?? MACRO_PRESETS[0];
  return { protein: preset.proteinRatio, carbs: preset.carbsRatio, fat: preset.fatRatio };
}

function recomputeTargets(profile: UserProfile, presetId: MacroPresetId, custom: MacroRatios | null): NutritionTargets {
  return calculateTargets(profile, getRatios(presetId, custom));
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      entriesByDate: {},
      waterByDate: {},
      profile: defaultProfile,
      targets: recomputeTargets(defaultProfile, "balanced", null),
      macroPresetId: "balanced",
      customRatios: null,
      customFoods: [],

      addEntry: (entry, date) => {
        const key = date ?? dateKey();
        set((state) => ({
          entriesByDate: {
            ...state.entriesByDate,
            [key]: [
              ...(state.entriesByDate[key] ?? []),
              { ...entry, id: crypto.randomUUID(), addedAt: Date.now() },
            ],
          },
        }));
      },

      removeEntry: (id, date) => {
        const key = date ?? dateKey();
        set((state) => ({
          entriesByDate: {
            ...state.entriesByDate,
            [key]: (state.entriesByDate[key] ?? []).filter((e) => e.id !== id),
          },
        }));
      },

      updateEntryGrams: (id, grams, date) => {
        const key = date ?? dateKey();
        const entries = get().entriesByDate[key] ?? [];
        const entry = entries.find((e) => e.id === id);
        if (!entry || grams <= 0) return;
        // 按原始每100g营养重新计算
        const ratio = grams / 100;
        const originalRatio = entry.grams > 0 ? 1 / (entry.grams / 100) : 0;
        const per100 = {
          calories: entry.calories * originalRatio,
          carbs: entry.carbs * originalRatio,
          protein: entry.protein * originalRatio,
          fat: entry.fat * originalRatio,
          fiber: entry.fiber * originalRatio,
        };
        set((state) => ({
          entriesByDate: {
            ...state.entriesByDate,
            [key]: (state.entriesByDate[key] ?? []).map((e) =>
              e.id === id
                ? {
                    ...e,
                    grams,
                    calories: Math.round(per100.calories * ratio),
                    carbs: Math.round(per100.carbs * ratio * 10) / 10,
                    protein: Math.round(per100.protein * ratio * 10) / 10,
                    fat: Math.round(per100.fat * ratio * 10) / 10,
                    fiber: Math.round(per100.fiber * ratio * 10) / 10,
                  }
                : e
            ),
          },
        }));
      },

      clearEntries: (date) => {
        const key = date ?? dateKey();
        set((state) => {
          const next = { ...state.entriesByDate };
          delete next[key];
          return { entriesByDate: next };
        });
      },

      getEntries: (date) => {
        const key = date ?? dateKey();
        return get().entriesByDate[key] ?? [];
      },

      addWater: (ml, date) => {
        const key = date ?? dateKey();
        set((state) => ({
          waterByDate: {
            ...state.waterByDate,
            [key]: (state.waterByDate[key] ?? 0) + ml,
          },
        }));
      },

      setWater: (ml, date) => {
        const key = date ?? dateKey();
        set((state) => ({
          waterByDate: {
            ...state.waterByDate,
            [key]: Math.max(0, ml),
          },
        }));
      },

      getWater: (date) => {
        const key = date ?? dateKey();
        return get().waterByDate[key] ?? 0;
      },

      setProfile: (profile) =>
        set((state) => ({
          profile,
          targets: recomputeTargets(profile, state.macroPresetId, state.customRatios),
        })),

      updateProfile: (partial) =>
        set((state) => {
          const profile = { ...state.profile!, ...partial };
          return {
            profile,
            targets: recomputeTargets(profile, state.macroPresetId, state.customRatios),
          };
        }),

      clearProfile: () => set({ profile: null, targets: null }),

      setMacroPreset: (id) =>
        set((state) => ({
          macroPresetId: id,
          customRatios: null,
          targets: state.profile
            ? recomputeTargets(state.profile, id, null)
            : state.targets,
        })),

      setCustomRatios: (ratios) =>
        set((state) => ({
          customRatios: ratios,
          targets: state.profile
            ? recomputeTargets(state.profile, state.macroPresetId, ratios)
            : state.targets,
        })),

      getActiveRatios: () => {
        const { macroPresetId, customRatios } = get();
        return getRatios(macroPresetId, customRatios);
      },

      addCustomFood: (food) =>
        set((state) => ({
          customFoods: [
            ...state.customFoods,
            { ...food, id: `custom-${crypto.randomUUID()}`, isCustom: true },
          ],
        })),

      updateCustomFood: (id, food) =>
        set((state) => ({
          customFoods: state.customFoods.map((f) =>
            f.id === id ? { ...f, ...food, id, isCustom: true } : f
          ),
        })),

      removeCustomFood: (id) =>
        set((state) => ({
          customFoods: state.customFoods.filter((f) => f.id !== id),
        })),

      exportData: () => {
        const state = get();
        return JSON.stringify(
          {
            version: 2,
            exportedAt: new Date().toISOString(),
            entriesByDate: state.entriesByDate,
            waterByDate: state.waterByDate,
            profile: state.profile,
            macroPresetId: state.macroPresetId,
            customRatios: state.customRatios,
            customFoods: state.customFoods,
          },
          null,
          2
        );
      },

      importData: (json) => {
        try {
          const data = JSON.parse(json);
          if (!data || typeof data !== "object") return false;
          set((state) => ({
            entriesByDate: data.entriesByDate ?? state.entriesByDate,
            waterByDate: data.waterByDate ?? state.waterByDate,
            profile: data.profile ?? state.profile,
            macroPresetId: data.macroPresetId ?? state.macroPresetId,
            customRatios: data.customRatios ?? state.customRatios,
            customFoods: Array.isArray(data.customFoods) ? data.customFoods : state.customFoods,
            targets:
              data.profile ?? state.profile
                ? recomputeTargets(
                    data.profile ?? state.profile!,
                    data.macroPresetId ?? state.macroPresetId,
                    data.customRatios ?? state.customRatios
                  )
                : state.targets,
          }));
          return true;
        } catch {
          return false;
        }
      },
    }),
    {
      name: "fitness-calorie-store",
      version: 2,
      // 版本迁移：v1 → v2
      migrate: (persistedState: unknown, version: number) => {
        const state = (persistedState ?? {}) as Partial<StoreState> & {
          entries?: DiaryEntry[];
        };
        const result: Partial<StoreState> = { ...state };

        // v1 的 entries 数组迁移到 entriesByDate[today]
        if (version < 2 && Array.isArray(state.entries)) {
          const today = dateKey();
          const entries = state.entries.map((e) => ({
            ...e,
            weightBasis: (e as DiaryEntry).weightBasis ?? ("cooked" as WeightBasis),
          }));
          result.entriesByDate = { [today]: entries };
          delete (result as Record<string, unknown>).entries;
        }

        // 确保 entriesByDate 存在
        if (!result.entriesByDate) result.entriesByDate = {};
        if (!result.waterByDate) result.waterByDate = {};

        // 兼容旧版自定义食物：补齐生重字段与配置
        if (Array.isArray(result.customFoods)) {
          result.customFoods = result.customFoods.map((f) => {
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

        // 确保默认值
        if (!result.macroPresetId) result.macroPresetId = "balanced";

        return result as StoreState;
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
