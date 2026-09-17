// 训练消耗数据库
//
// 两类计算模型：
// 1) 力量训练（strength）：按训练量（重量 × 次数 × 组数）计算
//    机械功 = 有效重量 × 总次数 × 单次位移 × 9.81 (J)
//    运动消耗 = 机械功 / 4184 / 0.20（肌肉机械效率约 20%）
//    组间休息（默认 90s）按 2.0 MET 计恢复消耗
// 2) 时间制（timed）：kcal = MET × 体重 × 时长（小时）
// 3) 跑步机爬坡（incline）：ACSM 步行代谢方程
//    VO₂(ml/kg/min) = 0.1×v + 1.8×v×坡度 + 3.5（v = 米/分钟）
//    MET = VO₂ / 3.5

export type ExerciseCategory = "练胸" | "背" | "手臂" | "肩" | "腹" | "腿" | "有氧";
export type ExerciseType = "strength" | "timed" | "incline";

export interface Exercise {
  id: string;
  name: string;
  nameEn: string;
  category: ExerciseCategory;
  emoji: string;
  type: ExerciseType;
  // timed：MET 代谢当量
  met?: number;
  // strength：每次重复负重移动的垂直位移（米）
  liftDistance?: number;
  // strength：输入重量为单边哑铃重量时 true（做功重量 × 2）
  perSide?: boolean;
  // strength：自重动作，默认负重 = 体重
  bodyweight?: boolean;
  tip: string;
}

export const EXERCISE_CATEGORIES: ExerciseCategory[] = [
  "练胸",
  "背",
  "手臂",
  "肩",
  "腹",
  "腿",
  "有氧",
];

// 组间休息秒数
const REST_SECONDS_PER_SET = 90;
// 每组最少执行秒数
const MIN_SECONDS_PER_SET = 20;
// 每次重复平均耗时（向心+离心+锁定）
const SECONDS_PER_REP = 4;
// 肌肉机械效率
const MUSCLE_EFFICIENCY = 0.2;
// 组间休息恢复强度（MET）
const REST_MET = 2.0;

/**
 * 力量训练消耗（按重量 × 次数 × 组数）
 * @param loadKg      负重（kg；自重动作传体重；单边哑铃传单边重量，perSide 会自动 ×2）
 * @param reps        每组次数
 * @param sets        组数
 * @param bodyWeight  训练者体重（kg，用于组间休息消耗）
 */
export function calcStrengthBurn(
  exercise: Exercise,
  loadKg: number,
  reps: number,
  sets: number,
  bodyWeight: number
): { kcal: number; totalTonnage: number; workKcal: number; restKcal: number; totalSeconds: number } {
  const distance = exercise.liftDistance ?? 0.4;
  const effLoad = exercise.perSide ? loadKg * 2 : loadKg;
  const totalReps = reps * sets;

  // 机械功 → 净运动消耗
  const workJoules = effLoad * totalReps * distance * 9.81;
  const workKcal = workJoules / 4184 / MUSCLE_EFFICIENCY;

  // 组间休息消耗
  const workSeconds = totalReps * SECONDS_PER_REP + sets * 0; // 每组执行时长由总次数决定
  const totalWorkSeconds = Math.max(workSeconds, sets * MIN_SECONDS_PER_SET);
  const restSeconds = Math.max(0, sets - 1) * REST_SECONDS_PER_SET;
  const restKcal = REST_MET * bodyWeight * (restSeconds / 3600);

  return {
    kcal: Math.round(workKcal + restKcal),
    totalTonnage: Math.round((effLoad * totalReps) / 10) / 100, // 吨
    workKcal: Math.round(workKcal),
    restKcal: Math.round(restKcal),
    totalSeconds: Math.round(totalWorkSeconds + restSeconds),
  };
}

/** 时间制运动消耗：kcal = MET × 体重 × 小时 */
export function calcTimedBurn(met: number, weightKg: number, minutes: number): number {
  return Math.round(met * weightKg * (minutes / 60));
}

/** 跑步机爬坡 MET（ACSM 步行代谢方程） */
export function calcInclineMET(speedKmh: number, gradePercent: number): number {
  const v = (speedKmh * 1000) / 60; // m/min
  const grade = gradePercent / 100;
  const vo2 = 0.1 * v + 1.8 * v * grade + 3.5;
  return vo2 / 3.5;
}

/** 跑步机爬坡消耗 */
export function calcInclineBurn(speedKmh: number, gradePercent: number, weightKg: number, minutes: number): {
  kcal: number;
  met: number;
} {
  const met = calcInclineMET(speedKmh, gradePercent);
  return { kcal: Math.round(met * weightKg * (minutes / 60)), met: Math.round(met * 10) / 10 };
}

// 跑步机爬坡常用预设档（速度 km/h / 坡度 % / 时长 min）
export const INCLINE_PRESETS: { name: string; speed: number; grade: number; minutes: number; desc: string }[] = [
  { name: "12-3-30 燃脂走", speed: 4.8, grade: 12, minutes: 30, desc: "经典网红方案" },
  { name: "新手入门", speed: 4.0, grade: 5, minutes: 30, desc: "轻松可持续" },
  { name: "标准爬坡", speed: 5.5, grade: 8, minutes: 30, desc: "中等强度" },
  { name: "强力爬坡", speed: 6.5, grade: 10, minutes: 20, desc: "高强度短时" },
  { name: "平地快走", speed: 6.0, grade: 0, minutes: 30, desc: "无坡度对照" },
];

export const exercises: Exercise[] = [
  // ===== 练胸 =====
  { id: "bench-press", name: "杠铃卧推", nameEn: "Barbell Bench Press", category: "练胸", emoji: "🏋️",
    type: "strength", liftDistance: 0.5, tip: "平板卧推，胸肌主力复合动作" },
  { id: "incline-db-press", name: "上斜哑铃卧推", nameEn: "Incline Dumbbell Press", category: "练胸", emoji: "🏋️",
    type: "strength", liftDistance: 0.45, perSide: true, tip: "侧重上胸，重量填单边哑铃重量" },
  { id: "db-fly", name: "哑铃飞鸟", nameEn: "Dumbbell Fly", category: "练胸", emoji: "🦋",
    type: "strength", liftDistance: 0.4, perSide: true, tip: "孤立拉伸胸肌，控制离心" },
  { id: "push-up", name: "俯卧撑", nameEn: "Push-up", category: "练胸", emoji: "💪",
    type: "strength", liftDistance: 0.3, bodyweight: true, tip: "徒手经典，负重=体重（可按实际折算）" },
  { id: "chest-dip", name: "双杠臂屈伸", nameEn: "Chest Dip", category: "练胸", emoji: "🤸",
    type: "strength", liftDistance: 0.45, bodyweight: true, tip: "身体前倾侧重下胸，负重=体重" },
  { id: "machine-fly", name: "器械夹胸", nameEn: "Machine Fly / Pec Deck", category: "练胸", emoji: "🦋",
    type: "strength", liftDistance: 0.25, tip: "重量填器械插销重量，顶峰收缩" },

  // ===== 背 =====
  { id: "pull-up", name: "引体向上", nameEn: "Pull-up", category: "背", emoji: "🧗",
    type: "strength", liftDistance: 0.5, bodyweight: true, tip: "背部黄金动作，负重=体重" },
  { id: "barbell-row", name: "杠铃划船", nameEn: "Barbell Row", category: "背", emoji: "🚣",
    type: "strength", liftDistance: 0.4, tip: "俯身 45°，背阔与中背同练" },
  { id: "db-row", name: "哑铃单臂划船", nameEn: "One-arm Dumbbell Row", category: "背", emoji: "🚣",
    type: "strength", liftDistance: 0.4, tip: "单侧孤立，重量填单只哑铃" },
  { id: "lat-pulldown", name: "高位下拉", nameEn: "Lat Pulldown", category: "背", emoji: "⬇️",
    type: "strength", liftDistance: 0.5, tip: "重量填器械插销重量，新手友好" },
  { id: "deadlift", name: "硬拉", nameEn: "Deadlift", category: "背", emoji: "🏋️",
    type: "strength", liftDistance: 0.8, tip: "地面到锁定行程长，全身复合之王" },
  { id: "seated-row", name: "坐姿划船", nameEn: "Seated Cable Row", category: "背", emoji: "🚣",
    type: "strength", liftDistance: 0.4, tip: "重量填插销重量，肩胛后缩" },
  { id: "back-ext", name: "山羊挺身", nameEn: "Back Extension", category: "背", emoji: "🐐",
    type: "strength", liftDistance: 0.35, bodyweight: true, tip: "下背强化，无负重时=体重，可抱杠铃片" },

  // ===== 手臂 =====
  { id: "barbell-curl", name: "杠铃弯举", nameEn: "Barbell Curl", category: "手臂", emoji: "💪",
    type: "strength", liftDistance: 0.35, tip: "二头肌基础动作，避免甩动" },
  { id: "hammer-curl", name: "锤式弯举", nameEn: "Hammer Curl", category: "手臂", emoji: "🔨",
    type: "strength", liftDistance: 0.35, perSide: true, tip: "重量填单边哑铃，练肱肌" },
  { id: "tricep-pushdown", name: "绳索下压", nameEn: "Tricep Pushdown", category: "手臂", emoji: "⬇️",
    type: "strength", liftDistance: 0.4, tip: "重量填插销重量，肘部固定" },
  { id: "skull-crusher", name: "仰卧臂屈伸", nameEn: "Skull Crusher", category: "手臂", emoji: "💀",
    type: "strength", liftDistance: 0.4, tip: "杠铃/哑铃通用，三头长头拉伸" },
  { id: "tricep-dip", name: "凳上臂屈伸", nameEn: "Bench Dip", category: "手臂", emoji: "🪑",
    type: "strength", liftDistance: 0.4, bodyweight: true, tip: "徒手三头训练，负重=体重" },
  { id: "concentration-curl", name: "集中弯举", nameEn: "Concentration Curl", category: "手臂", emoji: "💪",
    type: "strength", liftDistance: 0.35, tip: "单臂顶峰收缩，重量填单只哑铃" },

  // ===== 肩 =====
  { id: "overhead-press", name: "杠铃推举", nameEn: "Overhead Press", category: "肩", emoji: "🏋️",
    type: "strength", liftDistance: 0.5, tip: "站姿实力举，核心参与" },
  { id: "arnold-press", name: "阿诺德推举", nameEn: "Arnold Press", category: "肩", emoji: "💪",
    type: "strength", liftDistance: 0.5, perSide: true, tip: "旋转轨迹，重量填单边哑铃" },
  { id: "lateral-raise", name: "哑铃侧平举", nameEn: "Lateral Raise", category: "肩", emoji: "🕊️",
    type: "strength", liftDistance: 0.5, perSide: true, tip: "中束孤立，重量填单边哑铃" },
  { id: "front-raise", name: "哑铃前平举", nameEn: "Front Raise", category: "肩", emoji: "🕊️",
    type: "strength", liftDistance: 0.5, perSide: true, tip: "前束孤立，重量填单边哑铃" },
  { id: "face-pull", name: "面拉", nameEn: "Face Pull", category: "肩", emoji: "🪢",
    type: "strength", liftDistance: 0.3, tip: "重量填插销重量，后束与肩袖必备" },
  { id: "shrug", name: "杠铃耸肩", nameEn: "Barbell Shrug", category: "肩", emoji: "🤷",
    type: "strength", liftDistance: 0.1, tip: "斜方肌训练，行程短但负重高" },

  // ===== 腹 =====
  { id: "crunch", name: "卷腹", nameEn: "Crunch", category: "腹", emoji: "🌀",
    type: "timed", met: 3.8, tip: "上腹孤立，腰贴地面" },
  { id: "plank", name: "平板支撑", nameEn: "Plank", category: "腹", emoji: "🧘",
    type: "timed", met: 3.8, tip: "核心抗伸展，全身绷紧" },
  { id: "sit-up", name: "仰卧起坐", nameEn: "Sit-up", category: "腹", emoji: "🔄",
    type: "timed", met: 4.3, tip: "传统腹肌动作，幅度完整" },
  { id: "russian-twist", name: "俄罗斯转体", nameEn: "Russian Twist", category: "腹", emoji: "🔄",
    type: "timed", met: 4.0, tip: "腹斜肌训练，可负重" },
  { id: "hanging-leg-raise", name: "悬垂举腿", nameEn: "Hanging Leg Raise", category: "腹", emoji: "🦵",
    type: "timed", met: 4.0, tip: "下腹王牌，控制摆动" },
  { id: "ab-wheel", name: "健腹轮", nameEn: "Ab Wheel Rollout", category: "腹", emoji: "☸️",
    type: "timed", met: 4.0, tip: "高级核心动作，避免塌腰" },

  // ===== 腿 =====
  { id: "squat", name: "杠铃深蹲", nameEn: "Barbell Squat", category: "腿", emoji: "🏋️",
    type: "strength", liftDistance: 0.6, tip: "下肢训练之王，蹲至平行以下" },
  { id: "leg-press", name: "腿举", nameEn: "Leg Press", category: "腿", emoji: "🦵",
    type: "strength", liftDistance: 0.5, tip: "重量填器械承重，大重量更安全" },
  { id: "lunge", name: "哑铃弓步蹲", nameEn: "Dumbbell Lunge", category: "腿", emoji: "🦵",
    type: "strength", liftDistance: 0.5, perSide: true, tip: "重量填单边哑铃（双手合计自动 ×2）；自重训练填体重的一半" },
  { id: "romanian-deadlift", name: "罗马尼亚硬拉", nameEn: "Romanian Deadlift", category: "腿", emoji: "🏋️",
    type: "strength", liftDistance: 0.5, tip: "腘绳肌与臀，髋铰链模式" },
  { id: "leg-curl", name: "腿弯举", nameEn: "Leg Curl", category: "腿", emoji: "🌀",
    type: "strength", liftDistance: 0.25, tip: "腘绳肌孤立，重量填插销重量" },
  { id: "leg-extension", name: "腿屈伸", nameEn: "Leg Extension", category: "腿", emoji: "🌀",
    type: "strength", liftDistance: 0.35, tip: "股四头肌孤立收缩" },
  { id: "calf-raise", name: "站姿提踵", nameEn: "Standing Calf Raise", category: "腿", emoji: "🦶",
    type: "strength", liftDistance: 0.1, tip: "小腿训练，行程短，顶峰停顿" },
  { id: "bulgarian-split-squat", name: "保加利亚分腿蹲", nameEn: "Bulgarian Split Squat", category: "腿", emoji: "🇧🇬",
    type: "strength", liftDistance: 0.5, bodyweight: true, tip: "后脚垫高，负重=体重，可手持哑铃另计" },

  // ===== 有氧 =====
  { id: "jogging", name: "慢跑", nameEn: "Jogging (8 km/h)", category: "有氧", emoji: "🏃",
    type: "timed", met: 8.0, tip: "中等配速，燃脂主力" },
  { id: "brisk-walk", name: "快走", nameEn: "Brisk Walking (6 km/h)", category: "有氧", emoji: "🚶",
    type: "timed", met: 4.3, tip: "低强度长效，适合新手" },
  { id: "incline-walk", name: "跑步机爬坡", nameEn: "Incline Treadmill Walk", category: "有氧", emoji: "📈",
    type: "incline", tip: "ACSM 医学公式 · 速度 × 坡度 × 时长精确计算" },
  { id: "jump-rope", name: "跳绳", nameEn: "Jump Rope", category: "有氧", emoji: "🪢",
    type: "timed", met: 11.0, tip: "高耗能便携运动，注意膝盖" },
  { id: "swimming", name: "游泳", nameEn: "Swimming (Freestyle)", category: "有氧", emoji: "🏊",
    type: "timed", met: 8.3, tip: "全身性有氧，关节零冲击" },
  { id: "cycling", name: "骑行", nameEn: "Cycling (Moderate)", category: "有氧", emoji: "🚴",
    type: "timed", met: 7.5, tip: "中速 20km/h 左右" },
  { id: "elliptical", name: "椭圆机", nameEn: "Elliptical Trainer", category: "有氧", emoji: "🌀",
    type: "timed", met: 5.0, tip: "低冲击，保护膝踝" },
  { id: "rowing-machine", name: "划船机", nameEn: "Rowing Machine", category: "有氧", emoji: "🚣",
    type: "timed", met: 7.0, tip: "有氧+背，全身 85% 肌群" },
  { id: "stair-climb", name: "爬楼梯", nameEn: "Stair Climbing", category: "有氧", emoji: "🪜",
    type: "timed", met: 8.0, tip: "升心肺也练臀腿" },
  { id: "hiit", name: "HIIT 高强度间歇", nameEn: "HIIT", category: "有氧", emoji: "🔥",
    type: "timed", met: 10.0, tip: "短时高效，有氧后燃效应" },
  { id: "burpee", name: "波比跳", nameEn: "Burpee", category: "有氧", emoji: "💥",
    type: "timed", met: 8.0, tip: "徒手之王，心肺暴击" },
  { id: "mountain-climber", name: "登山跑", nameEn: "Mountain Climber", category: "有氧", emoji: "⛰️",
    type: "timed", met: 8.0, tip: "核心+心肺双效，节奏快" },
  { id: "kickboxing", name: "搏击操", nameEn: "Kickboxing", category: "有氧", emoji: "🥊",
    type: "timed", met: 7.7, tip: "解压燃脂，全身参与" },
];
