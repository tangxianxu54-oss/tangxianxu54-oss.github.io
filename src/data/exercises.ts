// 训练消耗数据库 —— 基于 MET（代谢当量）标准
// 数据来源参考：Compendium of Physical Activities（身体活动概要）
//
// 热量消耗公式：kcal = MET × 体重(kg) × 时长(小时)
//   MET = 运动时代谢率 / 静息代谢率，静坐 = 1 MET

export type ExerciseCategory = "练胸" | "背" | "手臂" | "肩" | "腹" | "腿" | "有氧";

export interface Exercise {
  id: string;
  name: string;
  nameEn: string;
  category: ExerciseCategory;
  emoji: string;
  met: number;
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

export const exercises: Exercise[] = [
  // ===== 练胸 =====
  { id: "bench-press", name: "杠铃卧推", nameEn: "Barbell Bench Press", category: "练胸", emoji: "🏋️",
    met: 6.0, tip: "平板卧推，胸肌主力复合动作" },
  { id: "incline-db-press", name: "上斜哑铃卧推", nameEn: "Incline Dumbbell Press", category: "练胸", emoji: "🏋️",
    met: 6.0, tip: "侧重上胸，30-45° 斜板" },
  { id: "db-fly", name: "哑铃飞鸟", nameEn: "Dumbbell Fly", category: "练胸", emoji: "🦋",
    met: 5.0, tip: "孤立拉伸胸肌，控制离心" },
  { id: "push-up", name: "俯卧撑", nameEn: "Push-up", category: "练胸", emoji: "💪",
    met: 8.0, tip: "徒手经典，可调节幅度" },
  { id: "chest-dip", name: "双杠臂屈伸", nameEn: "Chest Dip", category: "练胸", emoji: "🤸",
    met: 6.0, tip: "身体前倾侧重下胸" },
  { id: "machine-fly", name: "器械夹胸", nameEn: "Machine Fly / Pec Deck", category: "练胸", emoji: "🦋",
    met: 5.0, tip: "顶峰收缩，感受胸肌挤压" },

  // ===== 背 =====
  { id: "pull-up", name: "引体向上", nameEn: "Pull-up", category: "背", emoji: "🧗",
    met: 8.0, tip: "背部黄金动作，宽握练背阔" },
  { id: "barbell-row", name: "杠铃划船", nameEn: "Barbell Row", category: "背", emoji: "🚣",
    met: 6.0, tip: "俯身 45°，背阔与中背同练" },
  { id: "db-row", name: "哑铃单臂划船", nameEn: "One-arm Dumbbell Row", category: "背", emoji: "🚣",
    met: 5.0, tip: "单侧孤立，改善左右失衡" },
  { id: "lat-pulldown", name: "高位下拉", nameEn: "Lat Pulldown", category: "背", emoji: "⬇️",
    met: 5.0, tip: "新手友好，替代引体向上" },
  { id: "deadlift", name: "硬拉", nameEn: "Deadlift", category: "背", emoji: "🏋️",
    met: 6.0, tip: "全身复合之王，注意腰背中立" },
  { id: "seated-row", name: "坐姿划船", nameEn: "Seated Cable Row", category: "背", emoji: "🚣",
    met: 5.0, tip: "中背厚度，肩胛后缩" },
  { id: "back-ext", name: "山羊挺身", nameEn: "Back Extension", category: "背", emoji: "🐐",
    met: 4.0, tip: "下背与竖脊肌强化" },

  // ===== 手臂 =====
  { id: "barbell-curl", name: "杠铃弯举", nameEn: "Barbell Curl", category: "手臂", emoji: "💪",
    met: 3.5, tip: "二头肌基础动作，避免甩动" },
  { id: "hammer-curl", name: "锤式弯举", nameEn: "Hammer Curl", category: "手臂", emoji: "🔨",
    met: 3.5, tip: "中立握法，练肱肌与围度" },
  { id: "tricep-pushdown", name: "绳索下压", nameEn: "Tricep Pushdown", category: "手臂", emoji: "⬇️",
    met: 3.5, tip: "三头孤立，肘部固定" },
  { id: "skull-crusher", name: "仰卧臂屈伸", nameEn: "Skull Crusher", category: "手臂", emoji: "💀",
    met: 3.5, tip: "三头长头拉伸位训练" },
  { id: "tricep-dip", name: "凳上臂屈伸", nameEn: "Bench Dip", category: "手臂", emoji: "🪑",
    met: 4.3, tip: "徒手三头训练，居家友好" },
  { id: "concentration-curl", name: "集中弯举", nameEn: "Concentration Curl", category: "手臂", emoji: "💪",
    met: 3.5, tip: "单臂顶峰收缩，挤压感强" },

  // ===== 肩 =====
  { id: "overhead-press", name: "杠铃推举", nameEn: "Overhead Press", category: "肩", emoji: "🏋️",
    met: 5.0, tip: "站姿实力举，核心参与" },
  { id: "arnold-press", name: "阿诺德推举", nameEn: "Arnold Press", category: "肩", emoji: "💪",
    met: 5.0, tip: "旋转轨迹，全束刺激" },
  { id: "lateral-raise", name: "哑铃侧平举", nameEn: "Lateral Raise", category: "肩", emoji: "🕊️",
    met: 4.0, tip: "中束孤立，小重量多次数" },
  { id: "front-raise", name: "哑铃前平举", nameEn: "Front Raise", category: "肩", emoji: "🕊️",
    met: 4.0, tip: "前束孤立，避免借力" },
  { id: "face-pull", name: "面拉", nameEn: "Face Pull", category: "肩", emoji: "🪢",
    met: 3.5, tip: "后束与肩袖健康必备" },
  { id: "shrug", name: "杠铃耸肩", nameEn: "Barbell Shrug", category: "肩", emoji: "🤷",
    met: 4.0, tip: "斜方肌训练，垂直耸起" },

  // ===== 腹 =====
  { id: "crunch", name: "卷腹", nameEn: "Crunch", category: "腹", emoji: "🌀",
    met: 3.8, tip: "上腹孤立，腰贴地面" },
  { id: "plank", name: "平板支撑", nameEn: "Plank", category: "腹", emoji: "🧘",
    met: 3.8, tip: "核心抗伸展，全身绷紧" },
  { id: "sit-up", name: "仰卧起坐", nameEn: "Sit-up", category: "腹", emoji: "🔄",
    met: 4.3, tip: "传统腹肌动作，幅度完整" },
  { id: "russian-twist", name: "俄罗斯转体", nameEn: "Russian Twist", category: "腹", emoji: "🔄",
    met: 4.0, tip: "腹斜肌训练，可负重" },
  { id: "hanging-leg-raise", name: "悬垂举腿", nameEn: "Hanging Leg Raise", category: "腹", emoji: "🦵",
    met: 4.0, tip: "下腹王牌，控制摆动" },
  { id: "ab-wheel", name: "健腹轮", nameEn: "Ab Wheel Rollout", category: "腹", emoji: "☸️",
    met: 4.0, tip: "高级核心动作，避免塌腰" },
  { id: "mountain-climber", name: "登山跑", nameEn: "Mountain Climber", category: "腹", emoji: "⛰️",
    met: 8.0, tip: "核心+心肺双效，节奏快" },

  // ===== 腿 =====
  { id: "squat", name: "杠铃深蹲", nameEn: "Barbell Squat", category: "腿", emoji: "🏋️",
    met: 6.0, tip: "下肢训练之王，蹲至平行以下" },
  { id: "leg-press", name: "腿举", nameEn: "Leg Press", category: "腿", emoji: "🦵",
    met: 5.0, tip: "大重量安全替代深蹲" },
  { id: "lunge", name: "哑铃弓步蹲", nameEn: "Dumbbell Lunge", category: "腿", emoji: "🦵",
    met: 4.0, tip: "单腿训练，改善稳定性" },
  { id: "romanian-deadlift", name: "罗马尼亚硬拉", nameEn: "Romanian Deadlift", category: "腿", emoji: "🏋️",
    met: 6.0, tip: "腘绳肌与臀，髋铰链模式" },
  { id: "leg-curl", name: "腿弯举", nameEn: "Leg Curl", category: "腿", emoji: "🌀",
    met: 4.0, tip: "腘绳肌孤立，俯卧或坐姿" },
  { id: "leg-extension", name: "腿屈伸", nameEn: "Leg Extension", category: "腿", emoji: "🌀",
    met: 4.0, tip: "股四头肌孤立收缩" },
  { id: "calf-raise", name: "站姿提踵", nameEn: "Standing Calf Raise", category: "腿", emoji: "🦶",
    met: 3.5, tip: "小腿训练，顶峰停顿" },
  { id: "bulgarian-split-squat", name: "保加利亚分腿蹲", nameEn: "Bulgarian Split Squat", category: "腿", emoji: "🇧🇬",
    met: 5.0, tip: "后脚垫高，单腿地狱级" },

  // ===== 有氧 =====
  { id: "jogging", name: "慢跑", nameEn: "Jogging (8 km/h)", category: "有氧", emoji: "🏃",
    met: 8.0, tip: "中等配速，燃脂主力" },
  { id: "brisk-walk", name: "快走", nameEn: "Brisk Walking (6 km/h)", category: "有氧", emoji: "🚶",
    met: 4.3, tip: "低强度长效，适合新手" },
  { id: "jump-rope", name: "跳绳", nameEn: "Jump Rope", category: "有氧", emoji: "🪢",
    met: 11.0, tip: "高耗能便携运动，注意膝盖" },
  { id: "swimming", name: "游泳", nameEn: "Swimming (Freestyle)", category: "有氧", emoji: "🏊",
    met: 8.3, tip: "全身性有氧，关节零冲击" },
  { id: "cycling", name: "骑行", nameEn: "Cycling (Moderate)", category: "有氧", emoji: "🚴",
    met: 7.5, tip: "中速 20km/h 左右" },
  { id: "elliptical", name: "椭圆机", nameEn: "Elliptical Trainer", category: "有氧", emoji: "🌀",
    met: 5.0, tip: "低冲击，保护膝踝" },
  { id: "rowing-machine", name: "划船机", nameEn: "Rowing Machine", category: "有氧", emoji: "🚣",
    met: 7.0, tip: "有氧+背，全身 85% 肌群" },
  { id: "stair-climb", name: "爬楼梯", nameEn: "Stair Climbing", category: "有氧", emoji: "🪜",
    met: 8.0, tip: "升心肺也练臀腿" },
  { id: "hiit", name: "HIIT 高强度间歇", nameEn: "HIIT", category: "有氧", emoji: "🔥",
    met: 10.0, tip: "短时高效，有氧后燃效应" },
  { id: "burpee", name: "波比跳", nameEn: "Burpee", category: "有氧", emoji: "💥",
    met: 8.0, tip: "徒手之王，心肺暴击" },
  { id: "kickboxing", name: "搏击操", nameEn: "Kickboxing", category: "有氧", emoji: "🥊",
    met: 7.7, tip: "解压燃脂，全身参与" },
];
