// 食物营养数据库 - 以每 100g 为基准
// 数据来源参考：中国食物成分表 / USDA Food Database

export type WeightBasis = "raw" | "cooked";

export interface Food {
  id: string;
  name: string;
  nameEn: string;
  category: string;
  emoji: string;
  // ===== 熟重 / 可食部 基准 (每 100g) =====
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  fiber: number;
  // ===== 生重 基准 (每 100g) =====
  rawCalories: number;
  rawCarbs: number;
  rawProtein: number;
  rawFat: number;
  rawFiber: number;
  // 默认称量基准 (卡片默认展开哪一种)
  basisDefault: WeightBasis;
  // 生→熟换算系数 (熟重 / 生重)，如生米→熟饭约 2.8；无法换算的填 1
  cookFactor: number;
}

export const CATEGORIES = [
  "主食",
  "肉类",
  "海鲜",
  "蛋奶",
  "蔬菜",
  "水果",
  "豆类坚果",
  "其他",
] as const;

// 自定义食物可选分类（含"自定义"标记）
export const CUSTOM_CATEGORIES = [...CATEGORIES] as const;

// 数据口径说明：
//   calories / carbs / protein / fat / fiber   → 熟重 / 可食部 (每 100g)
//   rawCalories / rawCarbs / rawProtein / rawFat / rawFiber → 生重 / 干重 (每 100g)
//   basisDefault → 用户称量该食物时通常按"生重"还是"熟重"
//   cookFactor  → 熟重 / 生重 (换算倍数)
export const foods: Food[] = [
  // ===== 主食 (Staple) =====
  // 白米饭 (熟) — 生大米 346 kcal → 熟饭吸水膨胀 2.7x
  { id: "rice-white", name: "白米饭", nameEn: "White Rice", category: "主食", emoji: "🍚",
    calories: 130, carbs: 28.7, protein: 2.7, fat: 0.3, fiber: 0.4,
    rawCalories: 346, rawCarbs: 77.7, rawProtein: 7.2, rawFat: 0.8, rawFiber: 1.3,
    basisDefault: "cooked", cookFactor: 2.7 },
  // 糙米饭 (熟) — 生糙米 357 kcal / cookFactor 2.9
  { id: "rice-brown", name: "糙米饭", nameEn: "Brown Rice", category: "主食", emoji: "🍚",
    calories: 123, carbs: 25.6, protein: 2.7, fat: 1.0, fiber: 1.8,
    rawCalories: 357, rawCarbs: 74.3, rawProtein: 7.8, rawFat: 2.9, rawFiber: 5.2,
    basisDefault: "cooked", cookFactor: 2.9 },
  // 燕麦片 (生/干) — 煮后膨胀 cookFactor 3x
  { id: "oats", name: "燕麦片", nameEn: "Oats", category: "主食", emoji: "🥣",
    calories: 130, carbs: 22.1, protein: 5.6, fat: 2.3, fiber: 3.5,
    rawCalories: 389, rawCarbs: 66.3, rawProtein: 16.9, rawFat: 6.9, rawFiber: 10.6,
    basisDefault: "raw", cookFactor: 3.0 },
  // 面条 (熟) — 生挂面 350 kcal / cookFactor 2.5
  { id: "noodle", name: "面条", nameEn: "Noodles", category: "主食", emoji: "🍜",
    calories: 138, carbs: 28.0, protein: 4.5, fat: 0.6, fiber: 1.2,
    rawCalories: 345, rawCarbs: 70.0, rawProtein: 11.3, rawFat: 1.5, rawFiber: 3.0,
    basisDefault: "cooked", cookFactor: 2.5 },
  // 面包类无需换算 (出厂即熟) — raw = cooked, factor=1
  { id: "bread-white", name: "白面包", nameEn: "White Bread", category: "主食", emoji: "🍞",
    calories: 265, carbs: 49.4, protein: 9.0, fat: 3.2, fiber: 2.7,
    rawCalories: 265, rawCarbs: 49.4, rawProtein: 9.0, rawFat: 3.2, rawFiber: 2.7,
    basisDefault: "raw", cookFactor: 1 },
  { id: "bread-whole", name: "全麦面包", nameEn: "Whole Wheat Bread", category: "主食", emoji: "🍞",
    calories: 247, carbs: 41.3, protein: 13.0, fat: 4.2, fiber: 7.0,
    rawCalories: 247, rawCarbs: 41.3, rawProtein: 13.0, rawFat: 4.2, rawFiber: 7.0,
    basisDefault: "raw", cookFactor: 1 },
  // 土豆 / 红薯 / 玉米 等薯类：生熟变化不大，按生重称量最常见
  { id: "potato", name: "土豆", nameEn: "Potato", category: "主食", emoji: "🥔",
    calories: 78, carbs: 17.8, protein: 2.0, fat: 0.1, fiber: 2.2,
    rawCalories: 77, rawCarbs: 17.5, rawProtein: 2.0, rawFat: 0.1, rawFiber: 2.2,
    basisDefault: "raw", cookFactor: 1.01 },
  { id: "sweet-potato", name: "红薯", nameEn: "Sweet Potato", category: "主食", emoji: "🍠",
    calories: 90, carbs: 20.7, protein: 1.6, fat: 0.1, fiber: 3.0,
    rawCalories: 86, rawCarbs: 20.1, rawProtein: 1.6, rawFat: 0.1, rawFiber: 3.0,
    basisDefault: "raw", cookFactor: 1.05 },
  { id: "corn", name: "玉米", nameEn: "Corn", category: "主食", emoji: "🌽",
    calories: 96, carbs: 21.0, protein: 3.4, fat: 1.3, fiber: 2.8,
    rawCalories: 86, rawCarbs: 19.0, rawProtein: 3.2, rawFat: 1.2, rawFiber: 2.7,
    basisDefault: "raw", cookFactor: 1.1 },
  // 意大利面 熟 / 生干面
  { id: "pasta", name: "意大利面", nameEn: "Pasta", category: "主食", emoji: "🍝",
    calories: 158, carbs: 31.0, protein: 5.8, fat: 0.9, fiber: 1.8,
    rawCalories: 371, rawCarbs: 75.0, rawProtein: 13.0, rawFat: 1.5, rawFiber: 4.0,
    basisDefault: "cooked", cookFactor: 2.35 },
  // 藜麦 熟 — 生藜麦 368 kcal / factor 3.0
  { id: "quinoa", name: "藜麦", nameEn: "Quinoa", category: "主食", emoji: "🥣",
    calories: 120, carbs: 21.3, protein: 4.4, fat: 1.9, fiber: 2.8,
    rawCalories: 368, rawCarbs: 64.0, rawProtein: 14.0, rawFat: 6.0, rawFiber: 7.0,
    basisDefault: "cooked", cookFactor: 3.0 },
  // 荞麦、小米 — 干/生为主
  { id: "buckwheat", name: "荞麦", nameEn: "Buckwheat", category: "主食", emoji: "🥣",
    calories: 114, carbs: 23.8, protein: 3.1, fat: 0.8, fiber: 1.6,
    rawCalories: 343, rawCarbs: 71.5, rawProtein: 9.3, rawFat: 2.3, rawFiber: 4.9,
    basisDefault: "raw", cookFactor: 3.0 },
  { id: "millet", name: "小米", nameEn: "Millet", category: "主食", emoji: "🥣",
    calories: 119, carbs: 24.3, protein: 3.0, fat: 1.0, fiber: 0.5,
    rawCalories: 358, rawCarbs: 72.8, rawProtein: 9.0, rawFat: 3.1, rawFiber: 1.6,
    basisDefault: "raw", cookFactor: 3.0 },
  { id: "taro", name: "芋头", nameEn: "Taro", category: "主食", emoji: "🥔",
    calories: 81, carbs: 18.1, protein: 2.2, fat: 0.2, fiber: 1.0,
    rawCalories: 81, rawCarbs: 18.1, rawProtein: 2.2, rawFat: 0.2, rawFiber: 1.0,
    basisDefault: "raw", cookFactor: 1 },
  { id: "pumpkin", name: "南瓜", nameEn: "Pumpkin", category: "主食", emoji: "🎃",
    calories: 26, carbs: 6.5, protein: 1.0, fat: 0.1, fiber: 0.5,
    rawCalories: 26, rawCarbs: 6.5, rawProtein: 1.0, rawFat: 0.1, rawFiber: 0.5,
    basisDefault: "raw", cookFactor: 1 },

  // ===== 肉类 (Meat) — 现状数值为生重基准；熟重按 cookFactor=0.8 浓缩 =====
  { id: "chicken-breast", name: "鸡胸肉", nameEn: "Chicken Breast", category: "肉类", emoji: "🍗",
    calories: 166, carbs: 0, protein: 38.8, fat: 1.5, fiber: 0,
    rawCalories: 133, rawCarbs: 0, rawProtein: 31.0, rawFat: 1.2, rawFiber: 0,
    basisDefault: "raw", cookFactor: 0.8 },
  { id: "chicken-thigh", name: "鸡腿肉", nameEn: "Chicken Thigh", category: "肉类", emoji: "🍗",
    calories: 230, carbs: 0, protein: 25.9, fat: 14.1, fiber: 0,
    rawCalories: 184, rawCarbs: 0, rawProtein: 20.7, rawFat: 11.3, rawFiber: 0,
    basisDefault: "raw", cookFactor: 0.8 },
  { id: "beef-lean", name: "瘦牛肉", nameEn: "Lean Beef", category: "肉类", emoji: "🥩",
    calories: 198, carbs: 0, protein: 32.6, fat: 6.8, fiber: 0,
    rawCalories: 158, rawCarbs: 0, rawProtein: 26.1, rawFat: 5.4, rawFiber: 0,
    basisDefault: "raw", cookFactor: 0.8 },
  { id: "beef-fatty", name: "肥牛肉", nameEn: "Fatty Beef", category: "肉类", emoji: "🥩",
    calories: 313, carbs: 0, protein: 21.3, fat: 25.0, fiber: 0,
    rawCalories: 250, rawCarbs: 0, rawProtein: 17.0, rawFat: 20.0, rawFiber: 0,
    basisDefault: "raw", cookFactor: 0.8 },
  { id: "pork-lean", name: "瘦猪肉", nameEn: "Lean Pork", category: "肉类", emoji: "🥓",
    calories: 179, carbs: 0, protein: 27.8, fat: 6.3, fiber: 0,
    rawCalories: 143, rawCarbs: 0, rawProtein: 22.2, rawFat: 5.0, rawFiber: 0,
    basisDefault: "raw", cookFactor: 0.8 },
  { id: "pork-belly", name: "五花肉", nameEn: "Pork Belly", category: "肉类", emoji: "🥓",
    calories: 648, carbs: 0, protein: 17.5, fat: 62.5, fiber: 0,
    rawCalories: 518, rawCarbs: 0, rawProtein: 14.0, rawFat: 50.0, rawFiber: 0,
    basisDefault: "raw", cookFactor: 0.8 },
  { id: "lamb", name: "羊肉", nameEn: "Lamb", category: "肉类", emoji: "🥩",
    calories: 254, carbs: 0, protein: 25.0, fat: 17.5, fiber: 0,
    rawCalories: 203, rawCarbs: 0, rawProtein: 20.0, rawFat: 14.0, rawFiber: 0,
    basisDefault: "raw", cookFactor: 0.8 },
  { id: "turkey", name: "火鸡胸", nameEn: "Turkey Breast", category: "肉类", emoji: "🦃",
    calories: 169, carbs: 0, protein: 37.5, fat: 1.3, fiber: 0,
    rawCalories: 135, rawCarbs: 0, rawProtein: 30.0, rawFat: 1.0, rawFiber: 0,
    basisDefault: "raw", cookFactor: 0.8 },
  { id: "duck", name: "鸭肉", nameEn: "Duck", category: "肉类", emoji: "🦆",
    calories: 300, carbs: 0, protein: 22.5, fat: 22.5, fiber: 0,
    rawCalories: 240, rawCarbs: 0, rawProtein: 18.0, rawFat: 18.0, rawFiber: 0,
    basisDefault: "raw", cookFactor: 0.8 },
  // 加工肉制品 — 即成品，生熟一致
  { id: "ham", name: "火腿", nameEn: "Ham", category: "肉类", emoji: "🍖",
    calories: 145, carbs: 1.5, protein: 21.0, fat: 6.0, fiber: 0,
    rawCalories: 145, rawCarbs: 1.5, rawProtein: 21.0, rawFat: 6.0, rawFiber: 0,
    basisDefault: "raw", cookFactor: 1 },
  { id: "sausage", name: "香肠", nameEn: "Sausage", category: "肉类", emoji: "🌭",
    calories: 312, carbs: 2.0, protein: 13.0, fat: 28.0, fiber: 0,
    rawCalories: 312, rawCarbs: 2.0, rawProtein: 13.0, rawFat: 28.0, rawFiber: 0,
    basisDefault: "raw", cookFactor: 1 },
  { id: "bacon", name: "培根", nameEn: "Bacon", category: "肉类", emoji: "🥓",
    calories: 541, carbs: 1.4, protein: 37.0, fat: 42.0, fiber: 0,
    rawCalories: 541, rawCarbs: 1.4, rawProtein: 37.0, rawFat: 42.0, rawFiber: 0,
    basisDefault: "raw", cookFactor: 1 },

  // ===== 海鲜 (Seafood) — 多数按生重称量，熟重浓缩约0.85 =====
  { id: "salmon", name: "三文鱼", nameEn: "Salmon", category: "海鲜", emoji: "🐟",
    calories: 245, carbs: 0, protein: 23.5, fat: 15.3, fiber: 0,
    rawCalories: 208, rawCarbs: 0, rawProtein: 20.0, rawFat: 13.0, rawFiber: 0,
    basisDefault: "raw", cookFactor: 0.85 },
  { id: "tuna", name: "金枪鱼", nameEn: "Tuna", category: "海鲜", emoji: "🐟",
    calories: 155, carbs: 0, protein: 32.9, fat: 1.5, fiber: 0,
    rawCalories: 132, rawCarbs: 0, rawProtein: 28.0, rawFat: 1.3, rawFiber: 0,
    basisDefault: "raw", cookFactor: 0.85 },
  { id: "shrimp", name: "虾仁", nameEn: "Shrimp", category: "海鲜", emoji: "🦐",
    calories: 116, carbs: 0.2, protein: 28.2, fat: 0.4, fiber: 0,
    rawCalories: 99, rawCarbs: 0.2, rawProtein: 24.0, rawFat: 0.3, rawFiber: 0,
    basisDefault: "raw", cookFactor: 0.85 },
  { id: "cod", name: "鳕鱼", nameEn: "Cod", category: "海鲜", emoji: "🐟",
    calories: 96, carbs: 0, protein: 21.2, fat: 0.8, fiber: 0,
    rawCalories: 82, rawCarbs: 0, rawProtein: 18.0, rawFat: 0.7, rawFiber: 0,
    basisDefault: "raw", cookFactor: 0.85 },
  { id: "squid", name: "鱿鱼", nameEn: "Squid", category: "海鲜", emoji: "🦑",
    calories: 108, carbs: 3.6, protein: 18.4, fat: 1.6, fiber: 0,
    rawCalories: 92, rawCarbs: 3.1, rawProtein: 15.6, rawFat: 1.4, rawFiber: 0,
    basisDefault: "raw", cookFactor: 0.85 },
  { id: "crab", name: "螃蟹", nameEn: "Crab", category: "海鲜", emoji: "🦀",
    calories: 112, carbs: 2.7, protein: 22.1, fat: 1.3, fiber: 0,
    rawCalories: 95, rawCarbs: 2.3, rawProtein: 18.8, rawFat: 1.1, rawFiber: 0,
    basisDefault: "raw", cookFactor: 0.85 },
  { id: "oyster", name: "生蚝", nameEn: "Oyster", category: "海鲜", emoji: "🦪",
    calories: 81, carbs: 4.7, protein: 9.5, fat: 2.3, fiber: 0,
    rawCalories: 81, rawCarbs: 4.7, rawProtein: 9.5, rawFat: 2.3, rawFiber: 0,
    basisDefault: "raw", cookFactor: 1 },
  { id: "clam", name: "蛤蜊", nameEn: "Clam", category: "海鲜", emoji: "🦪",
    calories: 86, carbs: 4.6, protein: 14.7, fat: 0.7, fiber: 0,
    rawCalories: 86, rawCarbs: 4.6, rawProtein: 14.7, rawFat: 0.7, rawFiber: 0,
    basisDefault: "raw", cookFactor: 1 },
  { id: "tilapia", name: "罗非鱼", nameEn: "Tilapia", category: "海鲜", emoji: "🐟",
    calories: 113, carbs: 0, protein: 23.5, fat: 2.0, fiber: 0,
    rawCalories: 96, rawCarbs: 0, rawProtein: 20.0, rawFat: 1.7, rawFiber: 0,
    basisDefault: "raw", cookFactor: 0.85 },
  { id: "mackerel", name: "鲭鱼", nameEn: "Mackerel", category: "海鲜", emoji: "🐟",
    calories: 241, carbs: 0, protein: 21.9, fat: 16.4, fiber: 0,
    rawCalories: 205, rawCarbs: 0, rawProtein: 18.6, rawFat: 13.9, rawFiber: 0,
    basisDefault: "raw", cookFactor: 0.85 },

  // ===== 蛋奶 (Eggs & Dairy) — 生熟一体或成品 =====
  { id: "egg-whole", name: "鸡蛋", nameEn: "Whole Egg", category: "蛋奶", emoji: "🥚",
    calories: 155, carbs: 1.1, protein: 13.0, fat: 11.0, fiber: 0,
    rawCalories: 144, rawCarbs: 1.1, rawProtein: 13.3, rawFat: 8.8, rawFiber: 0,
    basisDefault: "raw", cookFactor: 0.93 },
  { id: "egg-white", name: "蛋白", nameEn: "Egg White", category: "蛋奶", emoji: "🥚",
    calories: 52, carbs: 0.7, protein: 11.0, fat: 0.1, fiber: 0,
    rawCalories: 52, rawCarbs: 1.1, rawProtein: 11.1, rawFat: 0.2, rawFiber: 0,
    basisDefault: "raw", cookFactor: 1 },
  // 奶制品直接可食 — 生熟一致
  { id: "milk-whole", name: "全脂牛奶", nameEn: "Whole Milk", category: "蛋奶", emoji: "🥛",
    calories: 61, carbs: 4.8, protein: 3.2, fat: 3.3, fiber: 0,
    rawCalories: 61, rawCarbs: 4.8, rawProtein: 3.2, rawFat: 3.3, rawFiber: 0,
    basisDefault: "raw", cookFactor: 1 },
  { id: "milk-skim", name: "脱脂牛奶", nameEn: "Skim Milk", category: "蛋奶", emoji: "🥛",
    calories: 34, carbs: 5.0, protein: 3.4, fat: 0.1, fiber: 0,
    rawCalories: 34, rawCarbs: 5.0, rawProtein: 3.4, rawFat: 0.1, rawFiber: 0,
    basisDefault: "raw", cookFactor: 1 },
  { id: "yogurt-plain", name: "原味酸奶", nameEn: "Plain Yogurt", category: "蛋奶", emoji: "🥛",
    calories: 72, carbs: 9.3, protein: 2.5, fat: 2.7, fiber: 0,
    rawCalories: 72, rawCarbs: 9.3, rawProtein: 2.5, rawFat: 2.7, rawFiber: 0,
    basisDefault: "raw", cookFactor: 1 },
  { id: "yogurt-greek", name: "希腊酸奶", nameEn: "Greek Yogurt", category: "蛋奶", emoji: "🥛",
    calories: 59, carbs: 3.6, protein: 10.0, fat: 0.4, fiber: 0,
    rawCalories: 59, rawCarbs: 3.6, rawProtein: 10.0, rawFat: 0.4, rawFiber: 0,
    basisDefault: "raw", cookFactor: 1 },
  { id: "cheese-cheddar", name: "切达奶酪", nameEn: "Cheddar Cheese", category: "蛋奶", emoji: "🧀",
    calories: 403, carbs: 1.3, protein: 25.0, fat: 33.0, fiber: 0,
    rawCalories: 403, rawCarbs: 1.3, rawProtein: 25.0, rawFat: 33.0, rawFiber: 0,
    basisDefault: "raw", cookFactor: 1 },
  { id: "cheese-mozzarella", name: "马苏里拉", nameEn: "Mozzarella", category: "蛋奶", emoji: "🧀",
    calories: 280, carbs: 3.1, protein: 28.0, fat: 17.0, fiber: 0,
    rawCalories: 280, rawCarbs: 3.1, rawProtein: 28.0, rawFat: 17.0, rawFiber: 0,
    basisDefault: "raw", cookFactor: 1 },
  { id: "cottage-cheese", name: "茅屋奶酪", nameEn: "Cottage Cheese", category: "蛋奶", emoji: "🧀",
    calories: 98, carbs: 3.4, protein: 11.0, fat: 4.3, fiber: 0,
    rawCalories: 98, rawCarbs: 3.4, rawProtein: 11.0, rawFat: 4.3, rawFiber: 0,
    basisDefault: "raw", cookFactor: 1 },
  { id: "butter", name: "黄油", nameEn: "Butter", category: "蛋奶", emoji: "🧈",
    calories: 717, carbs: 0.1, protein: 0.9, fat: 81.0, fiber: 0,
    rawCalories: 717, rawCarbs: 0.1, rawProtein: 0.9, rawFat: 81.0, rawFiber: 0,
    basisDefault: "raw", cookFactor: 1 },

  // ===== 蔬菜 (Vegetables) — 生熟差异小，统一生熟相同，默认按生重 =====
  { id: "broccoli", name: "西兰花", nameEn: "Broccoli", category: "蔬菜", emoji: "🥦",
    calories: 34, carbs: 6.6, protein: 2.8, fat: 0.4, fiber: 1.6,
    rawCalories: 34, rawCarbs: 6.6, rawProtein: 2.8, rawFat: 0.4, rawFiber: 1.6,
    basisDefault: "raw", cookFactor: 1 },
  { id: "spinach", name: "菠菜", nameEn: "Spinach", category: "蔬菜", emoji: "🥬",
    calories: 28, carbs: 4.5, protein: 2.6, fat: 0.3, fiber: 1.7,
    rawCalories: 28, rawCarbs: 4.5, rawProtein: 2.6, rawFat: 0.3, rawFiber: 1.7,
    basisDefault: "raw", cookFactor: 1 },
  { id: "cabbage", name: "卷心菜", nameEn: "Cabbage", category: "蔬菜", emoji: "🥬",
    calories: 24, carbs: 5.5, protein: 1.5, fat: 0.2, fiber: 2.5,
    rawCalories: 24, rawCarbs: 5.5, rawProtein: 1.5, rawFat: 0.2, rawFiber: 2.5,
    basisDefault: "raw", cookFactor: 1 },
  { id: "carrot", name: "胡萝卜", nameEn: "Carrot", category: "蔬菜", emoji: "🥕",
    calories: 41, carbs: 9.6, protein: 1.0, fat: 0.2, fiber: 2.8,
    rawCalories: 41, rawCarbs: 9.6, rawProtein: 1.0, rawFat: 0.2, rawFiber: 2.8,
    basisDefault: "raw", cookFactor: 1 },
  { id: "tomato", name: "番茄", nameEn: "Tomato", category: "蔬菜", emoji: "🍅",
    calories: 18, carbs: 3.9, protein: 0.9, fat: 0.2, fiber: 1.2,
    rawCalories: 18, rawCarbs: 3.9, rawProtein: 0.9, rawFat: 0.2, rawFiber: 1.2,
    basisDefault: "raw", cookFactor: 1 },
  { id: "cucumber", name: "黄瓜", nameEn: "Cucumber", category: "蔬菜", emoji: "🥒",
    calories: 15, carbs: 3.6, protein: 0.7, fat: 0.1, fiber: 0.5,
    rawCalories: 15, rawCarbs: 3.6, rawProtein: 0.7, rawFat: 0.1, rawFiber: 0.5,
    basisDefault: "raw", cookFactor: 1 },
  { id: "lettuce", name: "生菜", nameEn: "Lettuce", category: "蔬菜", emoji: "🥬",
    calories: 15, carbs: 2.9, protein: 1.4, fat: 0.2, fiber: 1.1,
    rawCalories: 15, rawCarbs: 2.9, rawProtein: 1.4, rawFat: 0.2, rawFiber: 1.1,
    basisDefault: "raw", cookFactor: 1 },
  { id: "cauliflower", name: "花椰菜", nameEn: "Cauliflower", category: "蔬菜", emoji: "🥦",
    calories: 25, carbs: 5.0, protein: 1.9, fat: 0.2, fiber: 2.1,
    rawCalories: 25, rawCarbs: 5.0, rawProtein: 1.9, rawFat: 0.2, rawFiber: 2.1,
    basisDefault: "raw", cookFactor: 1 },
  { id: "mushroom", name: "蘑菇", nameEn: "Mushroom", category: "蔬菜", emoji: "🍄",
    calories: 22, carbs: 4.1, protein: 3.1, fat: 0.3, fiber: 1.0,
    rawCalories: 22, rawCarbs: 4.1, rawProtein: 3.1, rawFat: 0.3, rawFiber: 1.0,
    basisDefault: "raw", cookFactor: 1 },
  { id: "onion", name: "洋葱", nameEn: "Onion", category: "蔬菜", emoji: "🧅",
    calories: 40, carbs: 9.3, protein: 1.1, fat: 0.1, fiber: 1.7,
    rawCalories: 40, rawCarbs: 9.3, rawProtein: 1.1, rawFat: 0.1, rawFiber: 1.7,
    basisDefault: "raw", cookFactor: 1 },
  { id: "pepper-green", name: "青椒", nameEn: "Green Pepper", category: "蔬菜", emoji: "🫑",
    calories: 22, carbs: 5.4, protein: 1.0, fat: 0.2, fiber: 2.1,
    rawCalories: 22, rawCarbs: 5.4, rawProtein: 1.0, rawFat: 0.2, rawFiber: 2.1,
    basisDefault: "raw", cookFactor: 1 },
  { id: "eggplant", name: "茄子", nameEn: "Eggplant", category: "蔬菜", emoji: "🍆",
    calories: 25, carbs: 5.9, protein: 1.0, fat: 0.2, fiber: 2.5,
    rawCalories: 25, rawCarbs: 5.9, rawProtein: 1.0, rawFat: 0.2, rawFiber: 2.5,
    basisDefault: "raw", cookFactor: 1 },
  { id: "celery", name: "芹菜", nameEn: "Celery", category: "蔬菜", emoji: "🥬",
    calories: 14, carbs: 3.0, protein: 0.6, fat: 0.2, fiber: 1.5,
    rawCalories: 14, rawCarbs: 3.0, rawProtein: 0.6, rawFat: 0.2, rawFiber: 1.5,
    basisDefault: "raw", cookFactor: 1 },
  { id: "zucchini", name: "西葫芦", nameEn: "Zucchini", category: "蔬菜", emoji: "🥒",
    calories: 17, carbs: 3.1, protein: 1.2, fat: 0.2, fiber: 1.1,
    rawCalories: 17, rawCarbs: 3.1, rawProtein: 1.2, rawFat: 0.2, rawFiber: 1.1,
    basisDefault: "raw", cookFactor: 1 },
  { id: "asparagus", name: "芦笋", nameEn: "Asparagus", category: "蔬菜", emoji: "🥬",
    calories: 20, carbs: 4.9, protein: 2.2, fat: 0.1, fiber: 1.9,
    rawCalories: 20, rawCarbs: 4.9, rawProtein: 2.2, rawFat: 0.1, rawFiber: 1.9,
    basisDefault: "raw", cookFactor: 1 },
  { id: "bok-choy", name: "小白菜", nameEn: "Bok Choy", category: "蔬菜", emoji: "🥬",
    calories: 13, carbs: 2.5, protein: 1.5, fat: 0.2, fiber: 1.0,
    rawCalories: 13, rawCarbs: 2.5, rawProtein: 1.5, rawFat: 0.2, rawFiber: 1.0,
    basisDefault: "raw", cookFactor: 1 },

  // ===== 水果 (Fruits) — 生熟一致 =====
  { id: "banana", name: "香蕉", nameEn: "Banana", category: "水果", emoji: "🍌",
    calories: 89, carbs: 22.8, protein: 1.1, fat: 0.3, fiber: 2.6,
    rawCalories: 89, rawCarbs: 22.8, rawProtein: 1.1, rawFat: 0.3, rawFiber: 2.6,
    basisDefault: "raw", cookFactor: 1 },
  { id: "apple", name: "苹果", nameEn: "Apple", category: "水果", emoji: "🍎",
    calories: 52, carbs: 13.8, protein: 0.3, fat: 0.2, fiber: 2.4,
    rawCalories: 52, rawCarbs: 13.8, rawProtein: 0.3, rawFat: 0.2, rawFiber: 2.4,
    basisDefault: "raw", cookFactor: 1 },
  { id: "orange", name: "橙子", nameEn: "Orange", category: "水果", emoji: "🍊",
    calories: 47, carbs: 11.7, protein: 0.9, fat: 0.1, fiber: 2.4,
    rawCalories: 47, rawCarbs: 11.7, rawProtein: 0.9, rawFat: 0.1, rawFiber: 2.4,
    basisDefault: "raw", cookFactor: 1 },
  { id: "grape", name: "葡萄", nameEn: "Grape", category: "水果", emoji: "🍇",
    calories: 69, carbs: 18.1, protein: 0.7, fat: 0.2, fiber: 0.9,
    rawCalories: 69, rawCarbs: 18.1, rawProtein: 0.7, rawFat: 0.2, rawFiber: 0.9,
    basisDefault: "raw", cookFactor: 1 },
  { id: "strawberry", name: "草莓", nameEn: "Strawberry", category: "水果", emoji: "🍓",
    calories: 32, carbs: 7.7, protein: 0.7, fat: 0.3, fiber: 2.0,
    rawCalories: 32, rawCarbs: 7.7, rawProtein: 0.7, rawFat: 0.3, rawFiber: 2.0,
    basisDefault: "raw", cookFactor: 1 },
  { id: "watermelon", name: "西瓜", nameEn: "Watermelon", category: "水果", emoji: "🍉",
    calories: 30, carbs: 7.6, protein: 0.6, fat: 0.2, fiber: 0.4,
    rawCalories: 30, rawCarbs: 7.6, rawProtein: 0.6, rawFat: 0.2, rawFiber: 0.4,
    basisDefault: "raw", cookFactor: 1 },
  { id: "mango", name: "芒果", nameEn: "Mango", category: "水果", emoji: "🥭",
    calories: 60, carbs: 15.0, protein: 0.8, fat: 0.4, fiber: 1.6,
    rawCalories: 60, rawCarbs: 15.0, rawProtein: 0.8, rawFat: 0.4, rawFiber: 1.6,
    basisDefault: "raw", cookFactor: 1 },
  { id: "kiwi", name: "猕猴桃", nameEn: "Kiwi", category: "水果", emoji: "🥝",
    calories: 61, carbs: 14.7, protein: 1.0, fat: 0.5, fiber: 3.0,
    rawCalories: 61, rawCarbs: 14.7, rawProtein: 1.0, rawFat: 0.5, rawFiber: 3.0,
    basisDefault: "raw", cookFactor: 1 },
  { id: "blueberry", name: "蓝莓", nameEn: "Blueberry", category: "水果", emoji: "🫐",
    calories: 57, carbs: 14.5, protein: 0.7, fat: 0.3, fiber: 2.4,
    rawCalories: 57, rawCarbs: 14.5, rawProtein: 0.7, rawFat: 0.3, rawFiber: 2.4,
    basisDefault: "raw", cookFactor: 1 },
  { id: "avocado", name: "牛油果", nameEn: "Avocado", category: "水果", emoji: "🥑",
    calories: 160, carbs: 8.5, protein: 2.0, fat: 14.7, fiber: 6.7,
    rawCalories: 160, rawCarbs: 8.5, rawProtein: 2.0, rawFat: 14.7, rawFiber: 6.7,
    basisDefault: "raw", cookFactor: 1 },
  { id: "pear", name: "梨", nameEn: "Pear", category: "水果", emoji: "🍐",
    calories: 57, carbs: 15.2, protein: 0.4, fat: 0.1, fiber: 3.1,
    rawCalories: 57, rawCarbs: 15.2, rawProtein: 0.4, rawFat: 0.1, rawFiber: 3.1,
    basisDefault: "raw", cookFactor: 1 },
  { id: "peach", name: "桃子", nameEn: "Peach", category: "水果", emoji: "🍑",
    calories: 39, carbs: 9.5, protein: 0.9, fat: 0.3, fiber: 1.5,
    rawCalories: 39, rawCarbs: 9.5, rawProtein: 0.9, rawFat: 0.3, rawFiber: 1.5,
    basisDefault: "raw", cookFactor: 1 },
  { id: "pineapple", name: "菠萝", nameEn: "Pineapple", category: "水果", emoji: "🍍",
    calories: 50, carbs: 13.1, protein: 0.5, fat: 0.1, fiber: 1.4,
    rawCalories: 50, rawCarbs: 13.1, rawProtein: 0.5, rawFat: 0.1, rawFiber: 1.4,
    basisDefault: "raw", cookFactor: 1 },

  // ===== 豆类坚果 (Legumes & Nuts) =====
  // 豆腐/豆浆：成品，生熟一致
  { id: "tofu", name: "豆腐", nameEn: "Tofu", category: "豆类坚果", emoji: "🧈",
    calories: 76, carbs: 1.9, protein: 8.1, fat: 4.8, fiber: 0.4,
    rawCalories: 76, rawCarbs: 1.9, rawProtein: 8.1, rawFat: 4.8, rawFiber: 0.4,
    basisDefault: "raw", cookFactor: 1 },
  { id: "soy-milk", name: "豆浆", nameEn: "Soy Milk", category: "豆类坚果", emoji: "🥛",
    calories: 31, carbs: 1.2, protein: 3.0, fat: 1.6, fiber: 0.6,
    rawCalories: 31, rawCarbs: 1.2, rawProtein: 3.0, rawFat: 1.6, rawFiber: 0.6,
    basisDefault: "raw", cookFactor: 1 },
  // 黄豆/黑豆 等干豆 — 煮熟膨胀
  { id: "soybean", name: "黄豆", nameEn: "Soybean", category: "豆类坚果", emoji: "🫘",
    calories: 173, carbs: 11.0, protein: 18.0, fat: 9.0, fiber: 6.0,
    rawCalories: 359, rawCarbs: 34.2, rawProtein: 35.0, rawFat: 16.0, rawFiber: 15.5,
    basisDefault: "raw", cookFactor: 2.1 },
  { id: "black-bean", name: "黑豆", nameEn: "Black Bean", category: "豆类坚果", emoji: "🫘",
    calories: 164, carbs: 24.0, protein: 8.9, fat: 0.5, fiber: 8.7,
    rawCalories: 341, rawCarbs: 33.6, rawProtein: 36.0, rawFat: 15.9, rawFiber: 10.2,
    basisDefault: "raw", cookFactor: 2.1 },
  { id: "red-bean", name: "红豆", nameEn: "Red Bean", category: "豆类坚果", emoji: "🫘",
    calories: 128, carbs: 25.0, protein: 8.7, fat: 0.2, fiber: 7.0,
    rawCalories: 309, rawCarbs: 55.7, rawProtein: 20.2, rawFat: 0.6, rawFiber: 7.7,
    basisDefault: "raw", cookFactor: 2.4 },
  { id: "chickpea", name: "鹰嘴豆", nameEn: "Chickpea", category: "豆类坚果", emoji: "🫘",
    calories: 164, carbs: 27.4, protein: 8.9, fat: 2.6, fiber: 7.6,
    rawCalories: 378, rawCarbs: 63.0, rawProtein: 20.5, rawFat: 6.0, rawFiber: 17.5,
    basisDefault: "cooked", cookFactor: 2.3 },
  { id: "lentil", name: "扁豆", nameEn: "Lentil", category: "豆类坚果", emoji: "🫘",
    calories: 116, carbs: 20.1, protein: 9.0, fat: 0.4, fiber: 7.9,
    rawCalories: 352, rawCarbs: 60.0, rawProtein: 26.0, rawFat: 1.1, rawFiber: 24.0,
    basisDefault: "cooked", cookFactor: 3.0 },
  // 坚果类成品 — 生熟等同
  { id: "almond", name: "杏仁", nameEn: "Almond", category: "豆类坚果", emoji: "🌰",
    calories: 579, carbs: 21.6, protein: 21.2, fat: 49.9, fiber: 12.5,
    rawCalories: 579, rawCarbs: 21.6, rawProtein: 21.2, rawFat: 49.9, rawFiber: 12.5,
    basisDefault: "raw", cookFactor: 1 },
  { id: "walnut", name: "核桃", nameEn: "Walnut", category: "豆类坚果", emoji: "🌰",
    calories: 654, carbs: 13.7, protein: 15.2, fat: 65.2, fiber: 6.7,
    rawCalories: 654, rawCarbs: 13.7, rawProtein: 15.2, rawFat: 65.2, rawFiber: 6.7,
    basisDefault: "raw", cookFactor: 1 },
  { id: "peanut", name: "花生", nameEn: "Peanut", category: "豆类坚果", emoji: "🥜",
    calories: 567, carbs: 16.1, protein: 25.8, fat: 49.2, fiber: 8.5,
    rawCalories: 567, rawCarbs: 16.1, rawProtein: 25.8, rawFat: 49.2, rawFiber: 8.5,
    basisDefault: "raw", cookFactor: 1 },
  { id: "peanut-butter", name: "花生酱", nameEn: "Peanut Butter", category: "豆类坚果", emoji: "🥜",
    calories: 588, carbs: 20.0, protein: 25.0, fat: 50.0, fiber: 6.0,
    rawCalories: 588, rawCarbs: 20.0, rawProtein: 25.0, rawFat: 50.0, rawFiber: 6.0,
    basisDefault: "raw", cookFactor: 1 },
  { id: "cashew", name: "腰果", nameEn: "Cashew", category: "豆类坚果", emoji: "🌰",
    calories: 553, carbs: 30.2, protein: 18.2, fat: 43.9, fiber: 3.3,
    rawCalories: 553, rawCarbs: 30.2, rawProtein: 18.2, rawFat: 43.9, rawFiber: 3.3,
    basisDefault: "raw", cookFactor: 1 },
  { id: "chia-seed", name: "奇亚籽", nameEn: "Chia Seed", category: "豆类坚果", emoji: "🌰",
    calories: 486, carbs: 42.1, protein: 16.5, fat: 30.7, fiber: 34.4,
    rawCalories: 486, rawCarbs: 42.1, rawProtein: 16.5, rawFat: 30.7, rawFiber: 34.4,
    basisDefault: "raw", cookFactor: 1 },
  { id: "flax-seed", name: "亚麻籽", nameEn: "Flax Seed", category: "豆类坚果", emoji: "🌰",
    calories: 534, carbs: 28.9, protein: 18.3, fat: 42.2, fiber: 27.3,
    rawCalories: 534, rawCarbs: 28.9, rawProtein: 18.3, rawFat: 42.2, rawFiber: 27.3,
    basisDefault: "raw", cookFactor: 1 },

  // ===== 其他 / 增补主食 & 豆类 =====
  // 成品 / 干货，生熟统一
  { id: "protein-powder", name: "蛋白粉", nameEn: "Protein Powder", category: "其他", emoji: "💪",
    calories: 400, carbs: 5.0, protein: 80.0, fat: 5.0, fiber: 0,
    rawCalories: 400, rawCarbs: 5.0, rawProtein: 80.0, rawFat: 5.0, rawFiber: 0,
    basisDefault: "raw", cookFactor: 1 },
  { id: "olive-oil", name: "橄榄油", nameEn: "Olive Oil", category: "其他", emoji: "🫒",
    calories: 884, carbs: 0, protein: 0, fat: 100.0, fiber: 0,
    rawCalories: 884, rawCarbs: 0, rawProtein: 0, rawFat: 100.0, rawFiber: 0,
    basisDefault: "raw", cookFactor: 1 },
  { id: "honey", name: "蜂蜜", nameEn: "Honey", category: "其他", emoji: "🍯",
    calories: 304, carbs: 82.4, protein: 0.3, fat: 0, fiber: 0.2,
    rawCalories: 304, rawCarbs: 82.4, rawProtein: 0.3, rawFat: 0, rawFiber: 0.2,
    basisDefault: "raw", cookFactor: 1 },
  { id: "dark-chocolate", name: "黑巧克力", nameEn: "Dark Chocolate", category: "其他", emoji: "🍫",
    calories: 546, carbs: 61.0, protein: 8.0, fat: 31.0, fiber: 7.0,
    rawCalories: 546, rawCarbs: 61.0, rawProtein: 8.0, rawFat: 31.0, rawFiber: 7.0,
    basisDefault: "raw", cookFactor: 1 },
  // 糯米饭 熟 — 生糯米 350 kcal / factor 2.1
  { id: "rice-cooked", name: "糯米饭", nameEn: "Glutinous Rice", category: "主食", emoji: "🍚",
    calories: 168, carbs: 36.0, protein: 3.8, fat: 0.5, fiber: 0.5,
    rawCalories: 350, rawCarbs: 78.0, rawProtein: 6.0, rawFat: 1.0, rawFiber: 1.8,
    basisDefault: "cooked", cookFactor: 2.1 },
  // 米粉 熟 — 干米粉 360 kcal / factor 3.3
  { id: "rice-noodle", name: "米粉", nameEn: "Rice Noodle", category: "主食", emoji: "🍜",
    calories: 109, carbs: 24.0, protein: 1.8, fat: 0.2, fiber: 0.8,
    rawCalories: 360, rawCarbs: 80.0, rawProtein: 5.0, rawFat: 0.7, rawFiber: 2.6,
    basisDefault: "cooked", cookFactor: 3.3 },
  // 玉米饼、米饼：成品
  { id: "tortilla", name: "玉米饼", nameEn: "Tortilla", category: "主食", emoji: "🫓",
    calories: 218, carbs: 44.6, protein: 5.7, fat: 2.9, fiber: 6.3,
    rawCalories: 218, rawCarbs: 44.6, rawProtein: 5.7, rawFat: 2.9, rawFiber: 6.3,
    basisDefault: "raw", cookFactor: 1 },
  { id: "rice-cake", name: "米饼", nameEn: "Rice Cake", category: "主食", emoji: "🍘",
    calories: 386, carbs: 84.0, protein: 6.0, fat: 1.5, fiber: 1.0,
    rawCalories: 386, rawCarbs: 84.0, rawProtein: 6.0, rawFat: 1.5, rawFiber: 1.0,
    basisDefault: "raw", cookFactor: 1 },
  // 毛豆、天贝：成品
  { id: "edamame", name: "毛豆", nameEn: "Edamame", category: "豆类坚果", emoji: "🫛",
    calories: 121, carbs: 11.0, protein: 12.0, fat: 5.0, fiber: 5.2,
    rawCalories: 121, rawCarbs: 11.0, rawProtein: 12.0, rawFat: 5.0, rawFiber: 5.2,
    basisDefault: "raw", cookFactor: 1 },
  { id: "tempeh", name: "天贝", nameEn: "Tempeh", category: "豆类坚果", emoji: "🧈",
    calories: 192, carbs: 7.6, protein: 20.3, fat: 10.8, fiber: 4.0,
    rawCalories: 192, rawCarbs: 7.6, rawProtein: 20.3, rawFat: 10.8, rawFiber: 4.0,
    basisDefault: "raw", cookFactor: 1 },
  { id: "coconut-oil", name: "椰子油", nameEn: "Coconut Oil", category: "其他", emoji: "🥥",
    calories: 862, carbs: 0, protein: 0, fat: 100.0, fiber: 0,
    rawCalories: 862, rawCarbs: 0, rawProtein: 0, rawFat: 100.0, rawFiber: 0,
    basisDefault: "raw", cookFactor: 1 },
  { id: "sugar", name: "白砂糖", nameEn: "Sugar", category: "其他", emoji: "🧂",
    calories: 387, carbs: 99.9, protein: 0, fat: 0, fiber: 0,
    rawCalories: 387, rawCarbs: 99.9, rawProtein: 0, rawFat: 0, rawFiber: 0,
    basisDefault: "raw", cookFactor: 1 },

  // ===== 常见中式主食面点 (Chinese Staple & Pastries) =====
  // 馒头 — 成品（发酵面食），生熟一致
  { id: "mantou", name: "馒头", nameEn: "Steamed Bun", category: "主食", emoji: "🍞",
    calories: 223, carbs: 47.0, protein: 7.0, fat: 1.1, fiber: 1.3,
    rawCalories: 223, rawCarbs: 47.0, rawProtein: 7.0, rawFat: 1.1, rawFiber: 1.3,
    basisDefault: "raw", cookFactor: 1 },
  // 包子(猪肉馅) — 成品
  { id: "baozi-pork", name: "包子(猪肉馅)", nameEn: "Pork Baozi", category: "主食", emoji: "🥟",
    calories: 227, carbs: 30.0, protein: 8.4, fat: 8.0, fiber: 1.0,
    rawCalories: 227, rawCarbs: 30.0, rawProtein: 8.4, rawFat: 8.0, rawFiber: 1.0,
    basisDefault: "raw", cookFactor: 1 },
  // 包子(素馅) — 成品
  { id: "baozi-veggie", name: "包子(素馅)", nameEn: "Vegetable Baozi", category: "主食", emoji: "🥟",
    calories: 199, carbs: 35.0, protein: 6.5, fat: 4.5, fiber: 2.0,
    rawCalories: 199, rawCarbs: 35.0, rawProtein: 6.5, rawFat: 4.5, rawFiber: 2.0,
    basisDefault: "raw", cookFactor: 1 },
  // 饺子(猪肉馅) — 成品
  { id: "dumpling-pork", name: "饺子(猪肉馅)", nameEn: "Pork Dumpling", category: "主食", emoji: "🥟",
    calories: 239, carbs: 27.0, protein: 9.5, fat: 10.0, fiber: 1.2,
    rawCalories: 239, rawCarbs: 27.0, rawProtein: 9.5, rawFat: 10.0, rawFiber: 1.2,
    basisDefault: "raw", cookFactor: 1 },
  // 锅贴 — 成品（煎制）
  { id: "guotie", name: "锅贴", nameEn: "Potsticker", category: "主食", emoji: "🥟",
    calories: 280, carbs: 28.0, protein: 10.0, fat: 14.0, fiber: 1.0,
    rawCalories: 280, rawCarbs: 28.0, rawProtein: 10.0, rawFat: 14.0, rawFiber: 1.0,
    basisDefault: "raw", cookFactor: 1 },
  // 油条 — 成品（油炸）
  { id: "youtiao", name: "油条", nameEn: "Fried Dough Stick", category: "主食", emoji: "🌭",
    calories: 388, carbs: 51.0, protein: 6.9, fat: 17.6, fiber: 1.0,
    rawCalories: 388, rawCarbs: 51.0, rawProtein: 6.9, rawFat: 17.6, rawFiber: 1.0,
    basisDefault: "raw", cookFactor: 1 },
  // 烧饼 — 成品
  { id: "shaobing", name: "烧饼", nameEn: "Sesame Flatbread", category: "主食", emoji: "🫓",
    calories: 326, carbs: 55.0, protein: 8.0, fat: 7.5, fiber: 2.0,
    rawCalories: 326, rawCarbs: 55.0, rawProtein: 8.0, rawFat: 7.5, rawFiber: 2.0,
    basisDefault: "raw", cookFactor: 1 },
  // 花卷 — 成品
  { id: "huajuan", name: "花卷", nameEn: "Steamed Twisted Roll", category: "主食", emoji: "🍞",
    calories: 217, carbs: 45.0, protein: 6.5, fat: 1.2, fiber: 1.2,
    rawCalories: 217, rawCarbs: 45.0, rawProtein: 6.5, rawFat: 1.2, rawFiber: 1.2,
    basisDefault: "raw", cookFactor: 1 },
  // 窝头 — 成品
  { id: "wotou", name: "窝头", nameEn: "Cornmeal Bun", category: "主食", emoji: "🍞",
    calories: 227, carbs: 49.0, protein: 5.5, fat: 1.3, fiber: 3.0,
    rawCalories: 227, rawCarbs: 49.0, rawProtein: 5.5, rawFat: 1.3, rawFiber: 3.0,
    basisDefault: "raw", cookFactor: 1 },
  // 葱油饼 — 成品
  { id: "congyoubing", name: "葱油饼", nameEn: "Scallion Pancake", category: "主食", emoji: "🫓",
    calories: 325, carbs: 40.0, protein: 6.5, fat: 15.0, fiber: 1.5,
    rawCalories: 325, rawCarbs: 40.0, rawProtein: 6.5, rawFat: 15.0, rawFiber: 1.5,
    basisDefault: "raw", cookFactor: 1 },
  // 煎饼 — 成品
  { id: "jianbing", name: "煎饼", nameEn: "Jianbing", category: "主食", emoji: "🫓",
    calories: 324, carbs: 50.0, protein: 8.0, fat: 10.0, fiber: 1.5,
    rawCalories: 324, rawCarbs: 50.0, rawProtein: 8.0, rawFat: 10.0, rawFiber: 1.5,
    basisDefault: "raw", cookFactor: 1 },
  // 肉夹馍 — 成品
  { id: "roujiamo", name: "肉夹馍", nameEn: "Roujiamo", category: "主食", emoji: "🥙",
    calories: 280, carbs: 30.0, protein: 10.0, fat: 13.0, fiber: 1.0,
    rawCalories: 280, rawCarbs: 30.0, rawProtein: 10.0, rawFat: 13.0, rawFiber: 1.0,
    basisDefault: "raw", cookFactor: 1 },
  // 白米粥 — 熟（大米:水≈1:7），生大米 346 kcal
  { id: "rice-porridge", name: "白米粥", nameEn: "Rice Porridge", category: "主食", emoji: "🍚",
    calories: 46, carbs: 9.8, protein: 1.1, fat: 0.2, fiber: 0.1,
    rawCalories: 346, rawCarbs: 77.7, rawProtein: 7.2, rawFat: 0.8, rawFiber: 1.3,
    basisDefault: "cooked", cookFactor: 7.5 },
  // 小米粥 — 熟
  { id: "millet-porridge", name: "小米粥", nameEn: "Millet Porridge", category: "主食", emoji: "🥣",
    calories: 46, carbs: 8.4, protein: 1.4, fat: 0.7, fiber: 0.3,
    rawCalories: 358, rawCarbs: 72.8, rawProtein: 9.0, rawFat: 3.1, rawFiber: 1.6,
    basisDefault: "cooked", cookFactor: 7.5 },
  // 八宝粥 — 成品
  { id: "babaozhou", name: "八宝粥", nameEn: "Eight-Treasure Porridge", category: "主食", emoji: "🥣",
    calories: 100, carbs: 18.0, protein: 2.5, fat: 1.5, fiber: 1.5,
    rawCalories: 100, rawCarbs: 18.0, rawProtein: 2.5, rawFat: 1.5, rawFiber: 1.5,
    basisDefault: "raw", cookFactor: 1 },
  // 年糕 — 成品
  { id: "niangao", name: "年糕", nameEn: "Rice Cake", category: "主食", emoji: "🍘",
    calories: 154, carbs: 33.0, protein: 3.2, fat: 0.5, fiber: 0.5,
    rawCalories: 154, rawCarbs: 33.0, rawProtein: 3.2, rawFat: 0.5, rawFiber: 0.5,
    basisDefault: "raw", cookFactor: 1 },
  // 方便面 — 成品
  { id: "instant-noodle", name: "方便面", nameEn: "Instant Noodles", category: "主食", emoji: "🍜",
    calories: 473, carbs: 61.0, protein: 9.5, fat: 21.0, fiber: 1.5,
    rawCalories: 473, rawCarbs: 61.0, rawProtein: 9.5, rawFat: 21.0, rawFiber: 1.5,
    basisDefault: "raw", cookFactor: 1 },
  // 粉丝(干) — 干货，泡发 cookFactor ≈ 4
  { id: "glass-noodle", name: "粉丝(干)", nameEn: "Glass Noodle (Dry)", category: "主食", emoji: "🍜",
    calories: 338, carbs: 83.0, protein: 0.8, fat: 0.2, fiber: 0.5,
    rawCalories: 338, rawCarbs: 83.0, rawProtein: 0.8, rawFat: 0.2, rawFiber: 0.5,
    basisDefault: "raw", cookFactor: 4.0 },
  // 汤圆 — 成品
  { id: "tangyuan", name: "汤圆", nameEn: "Glutinous Rice Ball", category: "主食", emoji: "🟤",
    calories: 311, carbs: 50.0, protein: 5.0, fat: 10.0, fiber: 0.8,
    rawCalories: 311, rawCarbs: 50.0, rawProtein: 5.0, rawFat: 10.0, rawFiber: 0.8,
    basisDefault: "raw", cookFactor: 1 },
  // 春卷 — 成品（油炸）
  { id: "chunjuan", name: "春卷", nameEn: "Spring Roll", category: "主食", emoji: "🥟",
    calories: 320, carbs: 35.0, protein: 7.0, fat: 16.0, fiber: 1.5,
    rawCalories: 320, rawCarbs: 35.0, rawProtein: 7.0, rawFat: 16.0, rawFiber: 1.5,
    basisDefault: "raw", cookFactor: 1 },
  // 粽子 — 成品
  { id: "zongzi", name: "粽子", nameEn: "Zongzi", category: "主食", emoji: "🎋",
    calories: 195, carbs: 35.0, protein: 5.0, fat: 4.0, fiber: 1.0,
    rawCalories: 195, rawCarbs: 35.0, rawProtein: 5.0, rawFat: 4.0, rawFiber: 1.0,
    basisDefault: "raw", cookFactor: 1 },
  // 豆沙包 — 成品
  { id: "doushabao", name: "豆沙包", nameEn: "Red Bean Bun", category: "主食", emoji: "🥟",
    calories: 240, carbs: 50.0, protein: 6.0, fat: 1.5, fiber: 1.5,
    rawCalories: 240, rawCarbs: 50.0, rawProtein: 6.0, rawFat: 1.5, rawFiber: 1.5,
    basisDefault: "raw", cookFactor: 1 },

  // ===== 常见中式蛋类 (Chinese Eggs) =====
  // 鸭蛋 — 生熟一体
  { id: "duck-egg", name: "鸭蛋", nameEn: "Duck Egg", category: "蛋奶", emoji: "🥚",
    calories: 180, carbs: 3.1, protein: 12.6, fat: 13.0, fiber: 0,
    rawCalories: 180, rawCarbs: 3.1, rawProtein: 12.6, rawFat: 13.0, rawFiber: 0,
    basisDefault: "raw", cookFactor: 1 },
  // 咸鸭蛋 — 成品
  { id: "salted-duck-egg", name: "咸鸭蛋", nameEn: "Salted Duck Egg", category: "蛋奶", emoji: "🥚",
    calories: 190, carbs: 6.3, protein: 12.7, fat: 12.7, fiber: 0,
    rawCalories: 190, rawCarbs: 6.3, rawProtein: 12.7, rawFat: 12.7, rawFiber: 0,
    basisDefault: "raw", cookFactor: 1 },
  // 皮蛋 — 成品
  { id: "century-egg", name: "皮蛋", nameEn: "Century Egg", category: "蛋奶", emoji: "🥚",
    calories: 178, carbs: 4.5, protein: 14.2, fat: 10.7, fiber: 0,
    rawCalories: 178, rawCarbs: 4.5, rawProtein: 14.2, rawFat: 10.7, rawFiber: 0,
    basisDefault: "raw", cookFactor: 1 },
  // 鹌鹑蛋 — 生熟一体
  { id: "quail-egg", name: "鹌鹑蛋", nameEn: "Quail Egg", category: "蛋奶", emoji: "🥚",
    calories: 160, carbs: 2.1, protein: 12.8, fat: 11.1, fiber: 0,
    rawCalories: 160, rawCarbs: 2.1, rawProtein: 12.8, rawFat: 11.1, rawFiber: 0,
    basisDefault: "raw", cookFactor: 1 },

  // ===== 常见中式蔬菜 (Chinese Vegetables) =====
  // 大白菜 — 生熟一致
  { id: "napa-cabbage", name: "大白菜", nameEn: "Napa Cabbage", category: "蔬菜", emoji: "🥬",
    calories: 20, carbs: 3.1, protein: 1.5, fat: 0.1, fiber: 0.8,
    rawCalories: 20, rawCarbs: 3.1, rawProtein: 1.5, rawFat: 0.1, rawFiber: 0.8,
    basisDefault: "raw", cookFactor: 1 },
  // 莲藕 — 生熟一致
  { id: "lotus-root", name: "莲藕", nameEn: "Lotus Root", category: "蔬菜", emoji: "🪷",
    calories: 79, carbs: 17.2, protein: 1.7, fat: 0.1, fiber: 4.9,
    rawCalories: 79, rawCarbs: 17.2, rawProtein: 1.7, rawFat: 0.1, rawFiber: 4.9,
    basisDefault: "raw", cookFactor: 1 },
  // 山药 — 生熟一致
  { id: "yam", name: "山药", nameEn: "Chinese Yam", category: "蔬菜", emoji: "🥔",
    calories: 57, carbs: 12.4, protein: 1.9, fat: 0.2, fiber: 0.8,
    rawCalories: 57, rawCarbs: 12.4, rawProtein: 1.9, rawFat: 0.2, rawFiber: 0.8,
    basisDefault: "raw", cookFactor: 1 },
  // 豆角 — 生熟一致
  { id: "green-bean", name: "豆角", nameEn: "Green Bean", category: "蔬菜", emoji: "🫛",
    calories: 30, carbs: 5.7, protein: 2.5, fat: 0.2, fiber: 1.5,
    rawCalories: 30, rawCarbs: 5.7, rawProtein: 2.5, rawFat: 0.2, rawFiber: 1.5,
    basisDefault: "raw", cookFactor: 1 },
  // 白萝卜 — 生熟一致
  { id: "daikon", name: "白萝卜", nameEn: "Daikon Radish", category: "蔬菜", emoji: "🥬",
    calories: 21, carbs: 4.6, protein: 0.9, fat: 0.1, fiber: 1.0,
    rawCalories: 21, rawCarbs: 4.6, rawProtein: 0.9, rawFat: 0.1, rawFiber: 1.0,
    basisDefault: "raw", cookFactor: 1 },
  // 木耳(水发) — 生熟一致
  { id: "wood-ear", name: "木耳", nameEn: "Wood Ear Mushroom", category: "蔬菜", emoji: "🍄",
    calories: 27, carbs: 6.0, protein: 1.5, fat: 0.2, fiber: 2.6,
    rawCalories: 27, rawCarbs: 6.0, rawProtein: 1.5, rawFat: 0.2, rawFiber: 2.6,
    basisDefault: "raw", cookFactor: 1 },
  // 海带 — 生熟一致
  { id: "kelp", name: "海带", nameEn: "Kelp", category: "蔬菜", emoji: "🌿",
    calories: 17, carbs: 3.0, protein: 1.2, fat: 0.1, fiber: 1.3,
    rawCalories: 17, rawCarbs: 3.0, rawProtein: 1.2, rawFat: 0.1, rawFiber: 1.3,
    basisDefault: "raw", cookFactor: 1 },
  // 韭菜 — 生熟一致
  { id: "chinese-chive", name: "韭菜", nameEn: "Chinese Chive", category: "蔬菜", emoji: "🥬",
    calories: 26, carbs: 4.6, protein: 2.4, fat: 0.4, fiber: 1.4,
    rawCalories: 26, rawCarbs: 4.6, rawProtein: 2.4, rawFat: 0.4, rawFiber: 1.4,
    basisDefault: "raw", cookFactor: 1 },
  // 苦瓜 — 生熟一致
  { id: "bitter-melon", name: "苦瓜", nameEn: "Bitter Melon", category: "蔬菜", emoji: "🥒",
    calories: 22, carbs: 4.9, protein: 1.0, fat: 0.1, fiber: 1.4,
    rawCalories: 22, rawCarbs: 4.9, rawProtein: 1.0, rawFat: 0.1, rawFiber: 1.4,
    basisDefault: "raw", cookFactor: 1 },
  // 冬瓜 — 生熟一致
  { id: "winter-melon", name: "冬瓜", nameEn: "Winter Melon", category: "蔬菜", emoji: "🥒",
    calories: 12, carbs: 2.6, protein: 0.4, fat: 0.2, fiber: 0.7,
    rawCalories: 12, rawCarbs: 2.6, rawProtein: 0.4, rawFat: 0.2, rawFiber: 0.7,
    basisDefault: "raw", cookFactor: 1 },
  // 豆芽 — 生熟一致
  { id: "bean-sprout", name: "豆芽", nameEn: "Bean Sprout", category: "蔬菜", emoji: "🌱",
    calories: 18, carbs: 2.5, protein: 2.6, fat: 0.2, fiber: 1.0,
    rawCalories: 18, rawCarbs: 2.5, rawProtein: 2.6, rawFat: 0.2, rawFiber: 1.0,
    basisDefault: "raw", cookFactor: 1 },

  // ===== 豆制品/坚果干果 (Soy Products & Dried Fruits) =====
  // 豆腐脑 — 成品
  { id: "tofu-pudding", name: "豆腐脑", nameEn: "Tofu Pudding", category: "豆类坚果", emoji: "🥣",
    calories: 47, carbs: 3.0, protein: 5.0, fat: 1.8, fiber: 0.4,
    rawCalories: 47, rawCarbs: 3.0, rawProtein: 5.0, rawFat: 1.8, rawFiber: 0.4,
    basisDefault: "raw", cookFactor: 1 },
  // 腐竹(干) — 干货，泡发 cookFactor ≈ 3
  { id: "yuba", name: "腐竹", nameEn: "Yuba (Dry)", category: "豆类坚果", emoji: "🍜",
    calories: 459, carbs: 22.0, protein: 44.0, fat: 21.0, fiber: 1.0,
    rawCalories: 459, rawCarbs: 22.0, rawProtein: 44.0, rawFat: 21.0, rawFiber: 1.0,
    basisDefault: "raw", cookFactor: 3.0 },
  // 豆皮 — 成品
  { id: "tofu-skin", name: "豆皮", nameEn: "Tofu Skin", category: "豆类坚果", emoji: "🧈",
    calories: 409, carbs: 19.0, protein: 44.0, fat: 18.0, fiber: 0.5,
    rawCalories: 409, rawCarbs: 19.0, rawProtein: 44.0, rawFat: 18.0, rawFiber: 0.5,
    basisDefault: "raw", cookFactor: 1 },
  // 芝麻 — 成品
  { id: "sesame", name: "芝麻", nameEn: "Sesame", category: "豆类坚果", emoji: "🌰",
    calories: 573, carbs: 24.0, protein: 19.0, fat: 50.0, fiber: 11.0,
    rawCalories: 573, rawCarbs: 24.0, rawProtein: 19.0, rawFat: 50.0, rawFiber: 11.0,
    basisDefault: "raw", cookFactor: 1 },
  // 红枣(干) — 干货
  { id: "red-date", name: "红枣(干)", nameEn: "Red Date (Dried)", category: "豆类坚果", emoji: "🔴",
    calories: 277, carbs: 72.0, protein: 3.2, fat: 0.5, fiber: 6.2,
    rawCalories: 277, rawCarbs: 72.0, rawProtein: 3.2, rawFat: 0.5, rawFiber: 6.2,
    basisDefault: "raw", cookFactor: 1 },
  // 葡萄干 — 干货
  { id: "raisin", name: "葡萄干", nameEn: "Raisin", category: "豆类坚果", emoji: "🍇",
    calories: 299, carbs: 79.0, protein: 3.1, fat: 0.5, fiber: 3.7,
    rawCalories: 299, rawCarbs: 79.0, rawProtein: 3.1, rawFat: 0.5, rawFiber: 3.7,
    basisDefault: "raw", cookFactor: 1 },
  // 栗子(熟) — 成品
  { id: "chestnut", name: "栗子(熟)", nameEn: "Chestnut (Roasted)", category: "豆类坚果", emoji: "🌰",
    calories: 214, carbs: 46.0, protein: 4.8, fat: 1.5, fiber: 1.7,
    rawCalories: 214, rawCarbs: 46.0, rawProtein: 4.8, rawFat: 1.5, rawFiber: 1.7,
    basisDefault: "raw", cookFactor: 1 },
  // 葵花籽(仁) — 成品
  { id: "sunflower-seed", name: "葵花籽", nameEn: "Sunflower Seed", category: "豆类坚果", emoji: "🌻",
    calories: 606, carbs: 12.5, protein: 22.6, fat: 52.8, fiber: 7.0,
    rawCalories: 606, rawCarbs: 12.5, rawProtein: 22.6, rawFat: 52.8, rawFiber: 7.0,
    basisDefault: "raw", cookFactor: 1 },
  // 桂圆(干) — 干货
  { id: "longan-dried", name: "桂圆(干)", nameEn: "Dried Longan", category: "豆类坚果", emoji: "🟤",
    calories: 282, carbs: 71.0, protein: 4.6, fat: 1.0, fiber: 3.0,
    rawCalories: 282, rawCarbs: 71.0, rawProtein: 4.6, rawFat: 1.0, rawFiber: 3.0,
    basisDefault: "raw", cookFactor: 1 },

  // ===== 扩充主食 (Staple Part 2) =====
  // 糯米(生) — 煮成熟饭后 cookFactor 2.1
  { id: "glutinous-rice", name: "糯米", nameEn: "Glutinous Rice", category: "主食", emoji: "🍚",
    calories: 168, carbs: 36.0, protein: 3.8, fat: 0.5, fiber: 0.5,
    rawCalories: 350, rawCarbs: 78.0, rawProtein: 6.0, rawFat: 1.0, rawFiber: 1.8,
    basisDefault: "raw", cookFactor: 2.1 },
  // 黑米(生) — 煮熟 cookFactor 2.8
  { id: "black-rice", name: "黑米", nameEn: "Black Rice", category: "主食", emoji: "🍚",
    calories: 130, carbs: 27.0, protein: 2.8, fat: 0.8, fiber: 1.5,
    rawCalories: 333, rawCarbs: 68.0, rawProtein: 9.4, rawFat: 2.5, rawFiber: 3.9,
    basisDefault: "raw", cookFactor: 2.8 },
  // 紫米(生) — 煮熟 cookFactor 2.8
  { id: "purple-rice", name: "紫米", nameEn: "Purple Rice", category: "主食", emoji: "🍚",
    calories: 128, carbs: 26.5, protein: 2.7, fat: 0.7, fiber: 1.4,
    rawCalories: 346, rawCarbs: 70.0, rawProtein: 8.3, rawFat: 1.7, rawFiber: 3.8,
    basisDefault: "raw", cookFactor: 2.8 },
  // 薏米(生) — 煮熟 cookFactor 3.0
  { id: "coix-seed", name: "薏米", nameEn: "Coix Seed", category: "主食", emoji: "🥣",
    calories: 118, carbs: 23.0, protein: 3.0, fat: 0.6, fiber: 0.5,
    rawCalories: 357, rawCarbs: 71.0, rawProtein: 12.8, rawFat: 3.3, rawFiber: 2.0,
    basisDefault: "raw", cookFactor: 3.0 },
  // 高粱(生) — 煮熟 cookFactor 3.0
  { id: "sorghum", name: "高粱", nameEn: "Sorghum", category: "主食", emoji: "🥣",
    calories: 118, carbs: 24.0, protein: 3.0, fat: 0.7, fiber: 0.5,
    rawCalories: 360, rawCarbs: 74.0, rawProtein: 11.0, rawFat: 3.0, rawFiber: 1.5,
    basisDefault: "raw", cookFactor: 3.0 },
  // 玉米面(干) — 煮熟 cookFactor 3.0
  { id: "cornmeal", name: "玉米面", nameEn: "Cornmeal", category: "主食", emoji: "🥣",
    calories: 112, carbs: 23.0, protein: 2.9, fat: 0.5, fiber: 0.6,
    rawCalories: 341, rawCarbs: 72.0, rawProtein: 8.5, rawFat: 1.5, rawFiber: 5.5,
    basisDefault: "raw", cookFactor: 3.0 },
  // 面粉(中筋) — 干品
  { id: "flour", name: "面粉", nameEn: "All-purpose Flour", category: "主食", emoji: "🌾",
    calories: 354, carbs: 74.0, protein: 10.0, fat: 1.0, fiber: 2.5,
    rawCalories: 354, rawCarbs: 74.0, rawProtein: 10.0, rawFat: 1.0, rawFiber: 2.5,
    basisDefault: "raw", cookFactor: 1 },
  // 河粉(干) — 泡发 cookFactor 2.5
  { id: "hefen", name: "河粉", nameEn: "Rice Noodle Sheet", category: "主食", emoji: "🍜",
    calories: 138, carbs: 28.0, protein: 1.8, fat: 0.3, fiber: 0.5,
    rawCalories: 346, rawCarbs: 78.0, rawProtein: 5.0, rawFat: 0.7, rawFiber: 1.3,
    basisDefault: "cooked", cookFactor: 2.5 },
  // 米线(熟) — 干米线 cookFactor 3.3
  { id: "rice-thread", name: "米线", nameEn: "Rice Thread", category: "主食", emoji: "🍜",
    calories: 109, carbs: 24.0, protein: 1.8, fat: 0.2, fiber: 0.8,
    rawCalories: 360, rawCarbs: 80.0, rawProtein: 5.0, rawFat: 0.7, rawFiber: 2.6,
    basisDefault: "cooked", cookFactor: 3.3 },
  // 凉皮 — 成品
  { id: "liangpi", name: "凉皮", nameEn: "Cold Skin Noodle", category: "主食", emoji: "🍜",
    calories: 167, carbs: 33.0, protein: 3.0, fat: 1.5, fiber: 0.5,
    rawCalories: 167, rawCarbs: 33.0, rawProtein: 3.0, rawFat: 1.5, rawFiber: 0.5,
    basisDefault: "raw", cookFactor: 1 },
  // 烙饼 — 成品
  { id: "laobing", name: "烙饼", nameEn: "Pancake", category: "主食", emoji: "🫓",
    calories: 280, carbs: 50.0, protein: 7.0, fat: 5.0, fiber: 1.5,
    rawCalories: 280, rawCarbs: 50.0, rawProtein: 7.0, rawFat: 5.0, rawFiber: 1.5,
    basisDefault: "raw", cookFactor: 1 },
  // 手抓饼 — 成品
  { id: "shouzhuabing", name: "手抓饼", nameEn: "Scallion Pancake", category: "主食", emoji: "🫓",
    calories: 320, carbs: 40.0, protein: 6.0, fat: 14.0, fiber: 1.5,
    rawCalories: 320, rawCarbs: 40.0, rawProtein: 6.0, rawFat: 14.0, rawFiber: 1.5,
    basisDefault: "raw", cookFactor: 1 },
  // 韭菜盒子 — 成品
  { id: "jiucai-hezi", name: "韭菜盒子", nameEn: "Chive Pocket", category: "主食", emoji: "🥟",
    calories: 260, carbs: 35.0, protein: 7.0, fat: 9.0, fiber: 2.0,
    rawCalories: 260, rawCarbs: 35.0, rawProtein: 7.0, rawFat: 9.0, rawFiber: 2.0,
    basisDefault: "raw", cookFactor: 1 },
  // 肠粉 — 成品
  { id: "changfen", name: "肠粉", nameEn: "Rice Roll", category: "主食", emoji: "🍜",
    calories: 130, carbs: 25.0, protein: 4.0, fat: 1.5, fiber: 0.3,
    rawCalories: 130, rawCarbs: 25.0, rawProtein: 4.0, rawFat: 1.5, rawFiber: 0.3,
    basisDefault: "raw", cookFactor: 1 },
  // 蛋炒饭 — 成品
  { id: "egg-fried-rice", name: "蛋炒饭", nameEn: "Egg Fried Rice", category: "主食", emoji: "🍚",
    calories: 180, carbs: 28.0, protein: 5.0, fat: 5.0, fiber: 0.5,
    rawCalories: 180, rawCarbs: 28.0, rawProtein: 5.0, rawFat: 5.0, rawFiber: 0.5,
    basisDefault: "raw", cookFactor: 1 },
  // 卤肉饭 — 成品
  { id: "luroufan", name: "卤肉饭", nameEn: "Braised Pork Rice", category: "主食", emoji: "🍚",
    calories: 220, carbs: 30.0, protein: 8.0, fat: 7.0, fiber: 0.5,
    rawCalories: 220, rawCarbs: 30.0, rawProtein: 8.0, rawFat: 7.0, rawFiber: 0.5,
    basisDefault: "raw", cookFactor: 1 },
  // 酸辣粉 — 成品
  { id: "suanlafen", name: "酸辣粉", nameEn: "Hot & Sour Noodle", category: "主食", emoji: "🍜",
    calories: 180, carbs: 32.0, protein: 4.0, fat: 4.5, fiber: 1.0,
    rawCalories: 180, rawCarbs: 32.0, rawProtein: 4.0, rawFat: 4.5, rawFiber: 1.0,
    basisDefault: "raw", cookFactor: 1 },
  // 重庆小面 — 成品
  { id: "chongqing-noodle", name: "重庆小面", nameEn: "Chongqing Noodle", category: "主食", emoji: "🍜",
    calories: 195, carbs: 35.0, protein: 5.0, fat: 4.0, fiber: 1.0,
    rawCalories: 195, rawCarbs: 35.0, rawProtein: 5.0, rawFat: 4.0, rawFiber: 1.0,
    basisDefault: "raw", cookFactor: 1 },
  // 兰州拉面 — 成品
  { id: "lanzhou-noodle", name: "兰州拉面", nameEn: "Lanzhou Noodle", category: "主食", emoji: "🍜",
    calories: 150, carbs: 28.0, protein: 6.0, fat: 2.5, fiber: 1.0,
    rawCalories: 150, rawCarbs: 28.0, rawProtein: 6.0, rawFat: 2.5, rawFiber: 1.0,
    basisDefault: "raw", cookFactor: 1 },
  // 热干面 — 成品
  { id: "reganmian", name: "热干面", nameEn: "Hot Dry Noodle", category: "主食", emoji: "🍜",
    calories: 210, carbs: 38.0, protein: 6.0, fat: 4.0, fiber: 1.0,
    rawCalories: 210, rawCarbs: 38.0, rawProtein: 6.0, rawFat: 4.0, rawFiber: 1.0,
    basisDefault: "raw", cookFactor: 1 },
  // 螺蛳粉 — 成品
  { id: "luosifen", name: "螺蛳粉", nameEn: "Snail Noodle", category: "主食", emoji: "🍜",
    calories: 230, carbs: 40.0, protein: 5.0, fat: 6.0, fiber: 1.5,
    rawCalories: 230, rawCarbs: 40.0, rawProtein: 5.0, rawFat: 6.0, rawFiber: 1.5,
    basisDefault: "raw", cookFactor: 1 },
  // 披萨 — 成品
  { id: "pizza", name: "披萨", nameEn: "Pizza", category: "主食", emoji: "🍕",
    calories: 266, carbs: 33.0, protein: 11.0, fat: 10.0, fiber: 2.3,
    rawCalories: 266, rawCarbs: 33.0, rawProtein: 11.0, rawFat: 10.0, rawFiber: 2.3,
    basisDefault: "raw", cookFactor: 1 },
  // 汉堡 — 成品
  { id: "burger", name: "汉堡", nameEn: "Burger", category: "主食", emoji: "🍔",
    calories: 295, carbs: 30.0, protein: 12.0, fat: 14.0, fiber: 1.5,
    rawCalories: 295, rawCarbs: 30.0, rawProtein: 12.0, rawFat: 14.0, rawFiber: 1.5,
    basisDefault: "raw", cookFactor: 1 },
  // 薯条 — 成品（油炸）
  { id: "french-fries", name: "薯条", nameEn: "French Fries", category: "主食", emoji: "🍟",
    calories: 312, carbs: 41.0, protein: 3.4, fat: 15.0, fiber: 3.8,
    rawCalories: 312, rawCarbs: 41.0, rawProtein: 3.4, rawFat: 15.0, rawFiber: 3.8,
    basisDefault: "raw", cookFactor: 1 },
  // 早餐麦片 — 干品
  { id: "cereal", name: "早餐麦片", nameEn: "Breakfast Cereal", category: "主食", emoji: "🥣",
    calories: 385, carbs: 82.0, protein: 7.0, fat: 4.0, fiber: 5.0,
    rawCalories: 385, rawCarbs: 82.0, rawProtein: 7.0, rawFat: 4.0, rawFiber: 5.0,
    basisDefault: "raw", cookFactor: 1 },

  // ===== 扩充肉类 (Meat Part 2) =====
  // 鸡翅 — 生重，熟重浓缩 0.8
  { id: "chicken-wing", name: "鸡翅", nameEn: "Chicken Wing", category: "肉类", emoji: "🍗",
    calories: 222, carbs: 0, protein: 23.5, fat: 14.5, fiber: 0,
    rawCalories: 178, rawCarbs: 0, rawProtein: 18.8, rawFat: 11.6, rawFiber: 0,
    basisDefault: "raw", cookFactor: 0.8 },
  // 鸡爪 — 生重
  { id: "chicken-feet", name: "鸡爪", nameEn: "Chicken Feet", category: "肉类", emoji: "🍗",
    calories: 215, carbs: 0.2, protein: 19.0, fat: 14.5, fiber: 0,
    rawCalories: 172, rawCarbs: 0.2, rawProtein: 15.2, rawFat: 11.6, rawFiber: 0,
    basisDefault: "raw", cookFactor: 0.8 },
  // 鸡肝 — 生重
  { id: "chicken-liver", name: "鸡肝", nameEn: "Chicken Liver", category: "肉类", emoji: "🥩",
    calories: 133, carbs: 0.7, protein: 19.3, fat: 4.5, fiber: 0,
    rawCalories: 119, rawCarbs: 0.6, rawProtein: 17.2, rawFat: 4.8, rawFiber: 0,
    basisDefault: "raw", cookFactor: 0.85 },
  // 鸡心 — 生重
  { id: "chicken-heart", name: "鸡心", nameEn: "Chicken Heart", category: "肉类", emoji: "🥩",
    calories: 172, carbs: 0.6, protein: 17.3, fat: 10.5, fiber: 0,
    rawCalories: 138, rawCarbs: 0.5, rawProtein: 13.8, rawFat: 8.4, rawFiber: 0,
    basisDefault: "raw", cookFactor: 0.8 },
  // 鸡胗 — 生重
  { id: "chicken-gizzard", name: "鸡胗", nameEn: "Chicken Gizzard", category: "肉类", emoji: "🥩",
    calories: 154, carbs: 0.6, protein: 22.0, fat: 5.2, fiber: 0,
    rawCalories: 118, rawCarbs: 0.5, rawProtein: 17.6, rawFat: 4.2, rawFiber: 0,
    basisDefault: "raw", cookFactor: 0.8 },
  // 牛腩 — 生重
  { id: "beef-brisket", name: "牛腩", nameEn: "Beef Brisket", category: "肉类", emoji: "🥩",
    calories: 234, carbs: 0, protein: 28.0, fat: 13.5, fiber: 0,
    rawCalories: 187, rawCarbs: 0, rawProtein: 22.4, rawFat: 10.8, rawFiber: 0,
    basisDefault: "raw", cookFactor: 0.8 },
  // 牛排 — 生重
  { id: "beef-steak", name: "牛排", nameEn: "Beef Steak", category: "肉类", emoji: "🥩",
    calories: 271, carbs: 0, protein: 31.0, fat: 16.0, fiber: 0,
    rawCalories: 217, rawCarbs: 0, rawProtein: 24.8, rawFat: 12.8, rawFiber: 0,
    basisDefault: "raw", cookFactor: 0.8 },
  // 牛腱 — 生重
  { id: "beef-shank", name: "牛腱", nameEn: "Beef Shank", category: "肉类", emoji: "🥩",
    calories: 182, carbs: 0, protein: 30.0, fat: 5.5, fiber: 0,
    rawCalories: 146, rawCarbs: 0, rawProtein: 24.0, rawFat: 4.4, rawFiber: 0,
    basisDefault: "raw", cookFactor: 0.8 },
  // 牛肚 — 生重
  { id: "beef-tripe", name: "牛肚", nameEn: "Beef Tripe", category: "肉类", emoji: "🥩",
    calories: 85, carbs: 0, protein: 14.5, fat: 2.5, fiber: 0,
    rawCalories: 72, rawCarbs: 0, rawProtein: 12.6, rawFat: 2.0, rawFiber: 0,
    basisDefault: "raw", cookFactor: 0.85 },
  // 猪蹄 — 生重
  { id: "pig-trotter", name: "猪蹄", nameEn: "Pig Trotter", category: "肉类", emoji: "🥓",
    calories: 260, carbs: 0, protein: 22.6, fat: 18.8, fiber: 0,
    rawCalories: 208, rawCarbs: 0, rawProtein: 18.1, rawFat: 15.0, rawFiber: 0,
    basisDefault: "raw", cookFactor: 0.8 },
  // 猪肝 — 生重
  { id: "pork-liver", name: "猪肝", nameEn: "Pork Liver", category: "肉类", emoji: "🥩",
    calories: 134, carbs: 0.6, protein: 21.5, fat: 3.5, fiber: 0,
    rawCalories: 129, rawCarbs: 0.6, rawProtein: 20.6, rawFat: 3.4, rawFiber: 0,
    basisDefault: "raw", cookFactor: 0.95 },
  // 猪排骨 — 生重
  { id: "spare-ribs", name: "猪排骨", nameEn: "Spare Ribs", category: "肉类", emoji: "🥓",
    calories: 278, carbs: 0, protein: 23.0, fat: 20.0, fiber: 0,
    rawCalories: 222, rawCarbs: 0, rawProtein: 18.4, rawFat: 16.0, rawFiber: 0,
    basisDefault: "raw", cookFactor: 0.8 },
  // 兔肉 — 生重
  { id: "rabbit", name: "兔肉", nameEn: "Rabbit", category: "肉类", emoji: "🥩",
    calories: 102, carbs: 0, protein: 19.7, fat: 2.2, fiber: 0,
    rawCalories: 102, rawCarbs: 0, rawProtein: 19.7, rawFat: 2.2, rawFiber: 0,
    basisDefault: "raw", cookFactor: 0.85 },
  // 腊肉 — 成品
  { id: "cured-pork", name: "腊肉", nameEn: "Cured Pork", category: "肉类", emoji: "🥓",
    calories: 498, carbs: 2.0, protein: 11.0, fat: 50.0, fiber: 0,
    rawCalories: 498, rawCarbs: 2.0, rawProtein: 11.0, rawFat: 50.0, rawFiber: 0,
    basisDefault: "raw", cookFactor: 1 },
  // 午餐肉 — 成品
  { id: "luncheon-meat", name: "午餐肉", nameEn: "Luncheon Meat", category: "肉类", emoji: "🍖",
    calories: 280, carbs: 5.0, protein: 12.0, fat: 24.0, fiber: 0,
    rawCalories: 280, rawCarbs: 5.0, rawProtein: 12.0, rawFat: 24.0, rawFiber: 0,
    basisDefault: "raw", cookFactor: 1 },
  // 肉松 — 成品
  { id: "pork-floss", name: "肉松", nameEn: "Pork Floss", category: "肉类", emoji: "🥓",
    calories: 396, carbs: 26.0, protein: 26.0, fat: 20.0, fiber: 0,
    rawCalories: 396, rawCarbs: 26.0, rawProtein: 26.0, rawFat: 20.0, rawFiber: 0,
    basisDefault: "raw", cookFactor: 1 },
  // 牛肉干 — 成品
  { id: "beef-jerky", name: "牛肉干", nameEn: "Beef Jerky", category: "肉类", emoji: "🥩",
    calories: 410, carbs: 14.0, protein: 45.0, fat: 20.0, fiber: 0,
    rawCalories: 410, rawCarbs: 14.0, rawProtein: 45.0, rawFat: 20.0, rawFiber: 0,
    basisDefault: "raw", cookFactor: 1 },

  // ===== 扩充海鲜 (Seafood Part 2) =====
  // 带鱼 — 生重
  { id: "hairtail", name: "带鱼", nameEn: "Hairtail", category: "海鲜", emoji: "🐟",
    calories: 127, carbs: 0, protein: 17.7, fat: 4.9, fiber: 0,
    rawCalories: 108, rawCarbs: 0, rawProtein: 15.0, rawFat: 4.2, rawFiber: 0,
    basisDefault: "raw", cookFactor: 0.85 },
  // 黄花鱼 — 生重
  { id: "yellow-croaker", name: "黄花鱼", nameEn: "Yellow Croaker", category: "海鲜", emoji: "🐟",
    calories: 99, carbs: 0, protein: 17.6, fat: 2.5, fiber: 0,
    rawCalories: 99, rawCarbs: 0, rawProtein: 17.6, rawFat: 2.5, rawFiber: 0,
    basisDefault: "raw", cookFactor: 0.85 },
  // 鲈鱼 — 生重
  { id: "sea-bass", name: "鲈鱼", nameEn: "Sea Bass", category: "海鲜", emoji: "🐟",
    calories: 105, carbs: 0, protein: 18.6, fat: 3.4, fiber: 0,
    rawCalories: 105, rawCarbs: 0, rawProtein: 18.6, rawFat: 3.4, rawFiber: 0,
    basisDefault: "raw", cookFactor: 0.85 },
  // 草鱼 — 生重
  { id: "grass-carp", name: "草鱼", nameEn: "Grass Carp", category: "海鲜", emoji: "🐟",
    calories: 113, carbs: 0, protein: 16.6, fat: 5.2, fiber: 0,
    rawCalories: 113, rawCarbs: 0, rawProtein: 16.6, rawFat: 5.2, rawFiber: 0,
    basisDefault: "raw", cookFactor: 0.85 },
  // 鲤鱼 — 生重
  { id: "carp", name: "鲤鱼", nameEn: "Carp", category: "海鲜", emoji: "🐟",
    calories: 109, carbs: 0.5, protein: 17.6, fat: 4.1, fiber: 0,
    rawCalories: 109, rawCarbs: 0.5, rawProtein: 17.6, rawFat: 4.1, rawFiber: 0,
    basisDefault: "raw", cookFactor: 0.85 },
  // 鲢鱼 — 生重
  { id: "silver-carp", name: "鲢鱼", nameEn: "Silver Carp", category: "海鲜", emoji: "🐟",
    calories: 102, carbs: 0, protein: 17.8, fat: 3.6, fiber: 0,
    rawCalories: 102, rawCarbs: 0, rawProtein: 17.8, rawFat: 3.6, rawFiber: 0,
    basisDefault: "raw", cookFactor: 0.85 },
  // 黑鱼 — 生重
  { id: "snakehead", name: "黑鱼", nameEn: "Snakehead", category: "海鲜", emoji: "🐟",
    calories: 86, carbs: 0, protein: 18.5, fat: 1.2, fiber: 0,
    rawCalories: 86, rawCarbs: 0, rawProtein: 18.5, rawFat: 1.2, rawFiber: 0,
    basisDefault: "raw", cookFactor: 0.85 },
  // 多春鱼 — 生重
  { id: "capelin", name: "多春鱼", nameEn: "Capelin", category: "海鲜", emoji: "🐟",
    calories: 217, carbs: 0, protein: 19.0, fat: 15.0, fiber: 0,
    rawCalories: 217, rawCarbs: 0, rawProtein: 19.0, rawFat: 15.0, rawFiber: 0,
    basisDefault: "raw", cookFactor: 0.85 },
  // 扇贝(可食部) — 生重
  { id: "scallop", name: "扇贝", nameEn: "Scallop", category: "海鲜", emoji: "🦪",
    calories: 60, carbs: 2.6, protein: 11.1, fat: 0.6, fiber: 0,
    rawCalories: 60, rawCarbs: 2.6, rawProtein: 11.1, rawFat: 0.6, rawFiber: 0,
    basisDefault: "raw", cookFactor: 1 },
  // 贻贝 — 生重
  { id: "mussel", name: "贻贝", nameEn: "Mussel", category: "海鲜", emoji: "🦪",
    calories: 86, carbs: 4.7, protein: 11.4, fat: 2.3, fiber: 0,
    rawCalories: 86, rawCarbs: 4.7, rawProtein: 11.4, rawFat: 2.3, rawFiber: 0,
    basisDefault: "raw", cookFactor: 1 },
  // 鲍鱼(可食部) — 生重
  { id: "abalone", name: "鲍鱼", nameEn: "Abalone", category: "海鲜", emoji: "🦪",
    calories: 84, carbs: 6.6, protein: 12.6, fat: 0.8, fiber: 0,
    rawCalories: 84, rawCarbs: 6.6, rawProtein: 12.6, rawFat: 0.8, rawFiber: 0,
    basisDefault: "raw", cookFactor: 1 },
  // 海参(水发) — 生熟一致
  { id: "sea-cucumber", name: "海参", nameEn: "Sea Cucumber", category: "海鲜", emoji: "🥒",
    calories: 71, carbs: 0, protein: 16.5, fat: 0.2, fiber: 0,
    rawCalories: 71, rawCarbs: 0, rawProtein: 16.5, rawFat: 0.2, rawFiber: 0,
    basisDefault: "raw", cookFactor: 1 },
  // 虾皮(干) — 干品
  { id: "dried-shrimp", name: "虾皮", nameEn: "Dried Shrimp", category: "海鲜", emoji: "🦐",
    calories: 153, carbs: 2.5, protein: 30.7, fat: 2.2, fiber: 0,
    rawCalories: 153, rawCarbs: 2.5, rawProtein: 30.7, rawFat: 2.2, rawFiber: 0,
    basisDefault: "raw", cookFactor: 1 },
  // 龙虾 — 生重
  { id: "lobster", name: "龙虾", nameEn: "Lobster", category: "海鲜", emoji: "🦞",
    calories: 90, carbs: 0.5, protein: 18.9, fat: 0.9, fiber: 0,
    rawCalories: 90, rawCarbs: 0.5, rawProtein: 18.9, rawFat: 0.9, rawFiber: 0,
    basisDefault: "raw", cookFactor: 0.85 },
  // 墨鱼 — 生重
  { id: "cuttlefish", name: "墨鱼", nameEn: "Cuttlefish", category: "海鲜", emoji: "🦑",
    calories: 81, carbs: 3.4, protein: 15.2, fat: 0.9, fiber: 0,
    rawCalories: 81, rawCarbs: 3.4, rawProtein: 15.2, rawFat: 0.9, rawFiber: 0,
    basisDefault: "raw", cookFactor: 0.85 },
  // 章鱼 — 生重
  { id: "octopus", name: "章鱼", nameEn: "Octopus", category: "海鲜", emoji: "🦑",
    calories: 82, carbs: 2.2, protein: 14.9, fat: 1.0, fiber: 0,
    rawCalories: 82, rawCarbs: 2.2, rawProtein: 14.9, rawFat: 1.0, rawFiber: 0,
    basisDefault: "raw", cookFactor: 0.85 },
  // 海蜇(皮) — 成品
  { id: "jellyfish", name: "海蜇皮", nameEn: "Jellyfish", category: "海鲜", emoji: "🦑",
    calories: 33, carbs: 3.9, protein: 5.0, fat: 0.3, fiber: 0,
    rawCalories: 33, rawCarbs: 3.9, rawProtein: 5.0, rawFat: 0.3, rawFiber: 0,
    basisDefault: "raw", cookFactor: 1 },
  // 紫菜(干) — 干品，泡发 cookFactor 5
  { id: "laver", name: "紫菜(干)", nameEn: "Laver (Dry)", category: "海鲜", emoji: "🌿",
    calories: 207, carbs: 44.0, protein: 26.7, fat: 1.1, fiber: 21.6,
    rawCalories: 207, rawCarbs: 44.0, rawProtein: 26.7, rawFat: 1.1, rawFiber: 21.6,
    basisDefault: "raw", cookFactor: 5 },
  // 三文鱼籽 — 成品
  { id: "salmon-roe", name: "三文鱼籽", nameEn: "Salmon Roe", category: "海鲜", emoji: "🟠",
    calories: 252, carbs: 1.5, protein: 30.0, fat: 14.0, fiber: 0,
    rawCalories: 252, rawCarbs: 1.5, rawProtein: 30.0, rawFat: 14.0, rawFiber: 0,
    basisDefault: "raw", cookFactor: 1 },

  // ===== 扩充蛋奶 (Eggs & Dairy Part 2) =====
  // 鹅蛋 — 生熟一体
  { id: "goose-egg", name: "鹅蛋", nameEn: "Goose Egg", category: "蛋奶", emoji: "🥚",
    calories: 196, carbs: 1.3, protein: 14.0, fat: 15.0, fiber: 0,
    rawCalories: 196, rawCarbs: 1.3, rawProtein: 14.0, rawFat: 15.0, rawFiber: 0,
    basisDefault: "raw", cookFactor: 1 },
  // 蛋黄 — 生熟一体
  { id: "egg-yolk", name: "蛋黄", nameEn: "Egg Yolk", category: "蛋奶", emoji: "🥚",
    calories: 322, carbs: 3.6, protein: 15.9, fat: 27.5, fiber: 0,
    rawCalories: 322, rawCarbs: 3.6, rawProtein: 15.9, rawFat: 27.5, rawFiber: 0,
    basisDefault: "raw", cookFactor: 1 },
  // 奶油奶酪 — 成品
  { id: "cream-cheese", name: "奶油奶酪", nameEn: "Cream Cheese", category: "蛋奶", emoji: "🧀",
    calories: 342, carbs: 4.1, protein: 6.2, fat: 34.0, fiber: 0,
    rawCalories: 342, rawCarbs: 4.1, rawProtein: 6.2, rawFat: 34.0, rawFiber: 0,
    basisDefault: "raw", cookFactor: 1 },
  // 淡奶油 — 成品
  { id: "heavy-cream", name: "淡奶油", nameEn: "Heavy Cream", category: "蛋奶", emoji: "🥛",
    calories: 345, carbs: 3.0, protein: 2.8, fat: 36.0, fiber: 0,
    rawCalories: 345, rawCarbs: 3.0, rawProtein: 2.8, rawFat: 36.0, rawFiber: 0,
    basisDefault: "raw", cookFactor: 1 },
  // 炼乳 — 成品
  { id: "condensed-milk", name: "炼乳", nameEn: "Condensed Milk", category: "蛋奶", emoji: "🥛",
    calories: 332, carbs: 55.0, protein: 8.0, fat: 8.7, fiber: 0,
    rawCalories: 332, rawCarbs: 55.0, rawProtein: 8.0, rawFat: 8.7, rawFiber: 0,
    basisDefault: "raw", cookFactor: 1 },
  // 全脂奶粉 — 干品
  { id: "milk-powder", name: "全脂奶粉", nameEn: "Milk Powder", category: "蛋奶", emoji: "🥛",
    calories: 478, carbs: 39.0, protein: 24.0, fat: 26.0, fiber: 0,
    rawCalories: 478, rawCarbs: 39.0, rawProtein: 24.0, rawFat: 26.0, rawFiber: 0,
    basisDefault: "raw", cookFactor: 1 },
  // 椰奶 — 成品
  { id: "coconut-milk", name: "椰奶", nameEn: "Coconut Milk", category: "蛋奶", emoji: "🥥",
    calories: 230, carbs: 6.0, protein: 2.3, fat: 23.0, fiber: 2.2,
    rawCalories: 230, rawCarbs: 6.0, rawProtein: 2.3, rawFat: 23.0, rawFiber: 2.2,
    basisDefault: "raw", cookFactor: 1 },
  // 羊奶 — 成品
  { id: "goat-milk", name: "羊奶", nameEn: "Goat Milk", category: "蛋奶", emoji: "🥛",
    calories: 69, carbs: 4.6, protein: 3.5, fat: 4.1, fiber: 0,
    rawCalories: 69, rawCarbs: 4.6, rawProtein: 3.5, rawFat: 4.1, rawFiber: 0,
    basisDefault: "raw", cookFactor: 1 },
  // 布里奶酪 — 成品
  { id: "brie-cheese", name: "布里奶酪", nameEn: "Brie Cheese", category: "蛋奶", emoji: "🧀",
    calories: 334, carbs: 0.5, protein: 20.8, fat: 27.7, fiber: 0,
    rawCalories: 334, rawCarbs: 0.5, rawProtein: 20.8, rawFat: 27.7, rawFiber: 0,
    basisDefault: "raw", cookFactor: 1 },
  // 帕玛森奶酪 — 成品
  { id: "parmesan", name: "帕玛森奶酪", nameEn: "Parmesan", category: "蛋奶", emoji: "🧀",
    calories: 431, carbs: 4.1, protein: 38.0, fat: 28.7, fiber: 0,
    rawCalories: 431, rawCarbs: 4.1, rawProtein: 38.0, rawFat: 28.7, rawFiber: 0,
    basisDefault: "raw", cookFactor: 1 },

  // ===== 扩充蔬菜 (Vegetables Part 2) =====
  // 油菜 — 生熟一致
  { id: "rapeseed", name: "油菜", nameEn: "Rapeseed", category: "蔬菜", emoji: "🥬",
    calories: 23, carbs: 2.7, protein: 1.8, fat: 0.5, fiber: 1.1,
    rawCalories: 23, rawCarbs: 2.7, rawProtein: 1.8, rawFat: 0.5, rawFiber: 1.1,
    basisDefault: "raw", cookFactor: 1 },
  // 空心菜 — 生熟一致
  { id: "water-spinach", name: "空心菜", nameEn: "Water Spinach", category: "蔬菜", emoji: "🥬",
    calories: 20, carbs: 3.6, protein: 2.2, fat: 0.2, fiber: 1.4,
    rawCalories: 20, rawCarbs: 3.6, rawProtein: 2.2, rawFat: 0.2, rawFiber: 1.4,
    basisDefault: "raw", cookFactor: 1 },
  // 苋菜 — 生熟一致
  { id: "amaranth", name: "苋菜", nameEn: "Amaranth", category: "蔬菜", emoji: "🥬",
    calories: 25, carbs: 4.7, protein: 2.8, fat: 0.4, fiber: 2.2,
    rawCalories: 25, rawCarbs: 4.7, rawProtein: 2.8, rawFat: 0.4, rawFiber: 2.2,
    basisDefault: "raw", cookFactor: 1 },
  // 芥蓝 — 生熟一致
  { id: "chinese-broccoli", name: "芥蓝", nameEn: "Chinese Broccoli", category: "蔬菜", emoji: "🥬",
    calories: 30, carbs: 4.1, protein: 2.8, fat: 0.4, fiber: 1.6,
    rawCalories: 30, rawCarbs: 4.1, rawProtein: 2.8, rawFat: 0.4, rawFiber: 1.6,
    basisDefault: "raw", cookFactor: 1 },
  // 芥菜 — 生熟一致
  { id: "mustard-greens", name: "芥菜", nameEn: "Mustard Greens", category: "蔬菜", emoji: "🥬",
    calories: 22, carbs: 3.6, protein: 2.5, fat: 0.4, fiber: 1.0,
    rawCalories: 22, rawCarbs: 3.6, rawProtein: 2.5, rawFat: 0.4, rawFiber: 1.0,
    basisDefault: "raw", cookFactor: 1 },
  // 秋葵 — 生熟一致
  { id: "okra", name: "秋葵", nameEn: "Okra", category: "蔬菜", emoji: "🥬",
    calories: 25, carbs: 5.3, protein: 1.9, fat: 0.2, fiber: 3.2,
    rawCalories: 25, rawCarbs: 5.3, rawProtein: 1.9, rawFat: 0.2, rawFiber: 3.2,
    basisDefault: "raw", cookFactor: 1 },
  // 茭白 — 生熟一致
  { id: "water-bamboo", name: "茭白", nameEn: "Water Bamboo", category: "蔬菜", emoji: "🥬",
    calories: 23, carbs: 5.9, protein: 1.2, fat: 0.2, fiber: 1.9,
    rawCalories: 23, rawCarbs: 5.9, rawProtein: 1.2, rawFat: 0.2, rawFiber: 1.9,
    basisDefault: "raw", cookFactor: 1 },
  // 莴笋 — 生熟一致
  { id: "celtuce", name: "莴笋", nameEn: "Celtuce", category: "蔬菜", emoji: "🥬",
    calories: 14, carbs: 2.8, protein: 1.0, fat: 0.1, fiber: 0.6,
    rawCalories: 14, rawCarbs: 2.8, rawProtein: 1.0, rawFat: 0.1, rawFiber: 0.6,
    basisDefault: "raw", cookFactor: 1 },
  // 竹笋 — 生熟一致
  { id: "bamboo-shoot", name: "竹笋", nameEn: "Bamboo Shoot", category: "蔬菜", emoji: "🥬",
    calories: 23, carbs: 3.6, protein: 2.6, fat: 0.2, fiber: 1.8,
    rawCalories: 23, rawCarbs: 3.6, rawProtein: 2.6, rawFat: 0.2, rawFiber: 1.8,
    basisDefault: "raw", cookFactor: 1 },
  // 香菇(鲜) — 生熟一致
  { id: "shiitake", name: "香菇", nameEn: "Shiitake", category: "蔬菜", emoji: "🍄",
    calories: 26, carbs: 5.2, protein: 2.2, fat: 0.3, fiber: 3.3,
    rawCalories: 26, rawCarbs: 5.2, rawProtein: 2.2, rawFat: 0.3, rawFiber: 3.3,
    basisDefault: "raw", cookFactor: 1 },
  // 金针菇 — 生熟一致
  { id: "enoki", name: "金针菇", nameEn: "Enoki Mushroom", category: "蔬菜", emoji: "🍄",
    calories: 26, carbs: 6.0, protein: 2.4, fat: 0.4, fiber: 2.7,
    rawCalories: 26, rawCarbs: 6.0, rawProtein: 2.4, rawFat: 0.4, rawFiber: 2.7,
    basisDefault: "raw", cookFactor: 1 },
  // 平菇 — 生熟一致
  { id: "oyster-mushroom", name: "平菇", nameEn: "Oyster Mushroom", category: "蔬菜", emoji: "🍄",
    calories: 24, carbs: 4.6, protein: 1.9, fat: 0.3, fiber: 2.3,
    rawCalories: 24, rawCarbs: 4.6, rawProtein: 1.9, rawFat: 0.3, rawFiber: 2.3,
    basisDefault: "raw", cookFactor: 1 },
  // 杏鲍菇 — 生熟一致
  { id: "king-oyster", name: "杏鲍菇", nameEn: "King Oyster Mushroom", category: "蔬菜", emoji: "🍄",
    calories: 31, carbs: 6.0, protein: 1.3, fat: 0.1, fiber: 2.5,
    rawCalories: 31, rawCarbs: 6.0, rawProtein: 1.3, rawFat: 0.1, rawFiber: 2.5,
    basisDefault: "raw", cookFactor: 1 },
  // 茶树菇 — 生熟一致
  { id: "tea-tree-mushroom", name: "茶树菇", nameEn: "Tea Tree Mushroom", category: "蔬菜", emoji: "🍄",
    calories: 28, carbs: 5.2, protein: 3.3, fat: 0.3, fiber: 2.6,
    rawCalories: 28, rawCarbs: 5.2, rawProtein: 3.3, rawFat: 0.3, rawFiber: 2.6,
    basisDefault: "raw", cookFactor: 1 },
  // 蒜苗 — 生熟一致
  { id: "garlic-sprout", name: "蒜苗", nameEn: "Garlic Sprout", category: "蔬菜", emoji: "🥬",
    calories: 41, carbs: 8.0, protein: 2.1, fat: 0.4, fiber: 1.6,
    rawCalories: 41, rawCarbs: 8.0, rawProtein: 2.1, rawFat: 0.4, rawFiber: 1.6,
    basisDefault: "raw", cookFactor: 1 },
  // 蒜薹 — 生熟一致
  { id: "garlic-scape", name: "蒜薹", nameEn: "Garlic Scape", category: "蔬菜", emoji: "🥬",
    calories: 40, carbs: 7.4, protein: 2.1, fat: 0.4, fiber: 2.0,
    rawCalories: 40, rawCarbs: 7.4, rawProtein: 2.1, rawFat: 0.4, rawFiber: 2.0,
    basisDefault: "raw", cookFactor: 1 },
  // 韭黄 — 生熟一致
  { id: "yellow-chive", name: "韭黄", nameEn: "Yellow Chive", category: "蔬菜", emoji: "🥬",
    calories: 22, carbs: 3.8, protein: 2.3, fat: 0.2, fiber: 1.2,
    rawCalories: 22, rawCarbs: 3.8, rawProtein: 2.3, rawFat: 0.2, rawFiber: 1.2,
    basisDefault: "raw", cookFactor: 1 },
  // 香菜 — 生熟一致
  { id: "cilantro", name: "香菜", nameEn: "Cilantro", category: "蔬菜", emoji: "🌿",
    calories: 23, carbs: 3.7, protein: 1.8, fat: 0.4, fiber: 1.2,
    rawCalories: 23, rawCarbs: 3.7, rawProtein: 1.8, rawFat: 0.4, rawFiber: 1.2,
    basisDefault: "raw", cookFactor: 1 },
  // 丝瓜 — 生熟一致
  { id: "luffa", name: "丝瓜", nameEn: "Luffa", category: "蔬菜", emoji: "🥒",
    calories: 20, carbs: 4.2, protein: 1.0, fat: 0.2, fiber: 0.6,
    rawCalories: 20, rawCarbs: 4.2, rawProtein: 1.0, rawFat: 0.2, rawFiber: 0.6,
    basisDefault: "raw", cookFactor: 1 },
  // 佛手瓜 — 生熟一致
  { id: "chayote", name: "佛手瓜", nameEn: "Chayote", category: "蔬菜", emoji: "🥒",
    calories: 16, carbs: 3.8, protein: 0.7, fat: 0.1, fiber: 0.8,
    rawCalories: 16, rawCarbs: 3.8, rawProtein: 0.7, rawFat: 0.1, rawFiber: 0.8,
    basisDefault: "raw", cookFactor: 1 },
  // 荸荠 — 生熟一致
  { id: "water-chestnut", name: "荸荠", nameEn: "Water Chestnut", category: "蔬菜", emoji: "🥔",
    calories: 61, carbs: 14.2, protein: 1.2, fat: 0.2, fiber: 1.1,
    rawCalories: 61, rawCarbs: 14.2, rawProtein: 1.2, rawFat: 0.2, rawFiber: 1.1,
    basisDefault: "raw", cookFactor: 1 },
  // 百合(鲜) — 生熟一致
  { id: "lily-bulb", name: "百合", nameEn: "Lily Bulb", category: "蔬菜", emoji: "🥬",
    calories: 162, carbs: 38.8, protein: 3.2, fat: 0.1, fiber: 1.7,
    rawCalories: 162, rawCarbs: 38.8, rawProtein: 3.2, rawFat: 0.1, rawFiber: 1.7,
    basisDefault: "raw", cookFactor: 1 },
  // 红薯叶 — 生熟一致
  { id: "sweet-potato-leaf", name: "红薯叶", nameEn: "Sweet Potato Leaf", category: "蔬菜", emoji: "🥬",
    calories: 30, carbs: 5.0, protein: 2.3, fat: 0.3, fiber: 2.0,
    rawCalories: 30, rawCarbs: 5.0, rawProtein: 2.3, rawFat: 0.3, rawFiber: 2.0,
    basisDefault: "raw", cookFactor: 1 },
  // 豌豆苗 — 生熟一致
  { id: "pea-sprout", name: "豌豆苗", nameEn: "Pea Sprout", category: "蔬菜", emoji: "🌱",
    calories: 27, carbs: 4.4, protein: 4.0, fat: 0.2, fiber: 1.5,
    rawCalories: 27, rawCarbs: 4.4, rawProtein: 4.0, rawFat: 0.2, rawFiber: 1.5,
    basisDefault: "raw", cookFactor: 1 },
  // 茴香 — 生熟一致
  { id: "fennel", name: "茴香", nameEn: "Fennel", category: "蔬菜", emoji: "🌿",
    calories: 31, carbs: 6.4, protein: 1.5, fat: 0.2, fiber: 3.1,
    rawCalories: 31, rawCarbs: 6.4, rawProtein: 1.5, rawFat: 0.2, rawFiber: 3.1,
    basisDefault: "raw", cookFactor: 1 },
  // 紫甘蓝 — 生熟一致
  { id: "red-cabbage", name: "紫甘蓝", nameEn: "Red Cabbage", category: "蔬菜", emoji: "🥬",
    calories: 31, carbs: 7.4, protein: 1.4, fat: 0.3, fiber: 2.5,
    rawCalories: 31, rawCarbs: 7.4, rawProtein: 1.4, rawFat: 0.3, rawFiber: 2.5,
    basisDefault: "raw", cookFactor: 1 },
  // 荠菜 — 生熟一致
  { id: "shepherds-purse", name: "荠菜", nameEn: "Shepherd's Purse", category: "蔬菜", emoji: "🌿",
    calories: 27, carbs: 4.7, protein: 2.9, fat: 0.4, fiber: 1.7,
    rawCalories: 27, rawCarbs: 4.7, rawProtein: 2.9, rawFat: 0.4, rawFiber: 1.7,
    basisDefault: "raw", cookFactor: 1 },

  // ===== 扩充水果 (Fruits Part 2) =====
  // 樱桃 — 生熟一致
  { id: "cherry", name: "樱桃", nameEn: "Cherry", category: "水果", emoji: "🍒",
    calories: 50, carbs: 12.2, protein: 1.1, fat: 0.3, fiber: 1.6,
    rawCalories: 50, rawCarbs: 12.2, rawProtein: 1.1, rawFat: 0.3, rawFiber: 1.6,
    basisDefault: "raw", cookFactor: 1 },
  // 荔枝 — 生熟一致
  { id: "lychee", name: "荔枝", nameEn: "Lychee", category: "水果", emoji: "🫒",
    calories: 66, carbs: 16.5, protein: 0.8, fat: 0.4, fiber: 1.3,
    rawCalories: 66, rawCarbs: 16.5, rawProtein: 0.8, rawFat: 0.4, rawFiber: 1.3,
    basisDefault: "raw", cookFactor: 1 },
  // 龙眼 — 生熟一致
  { id: "longan", name: "龙眼", nameEn: "Longan", category: "水果", emoji: "🫒",
    calories: 60, carbs: 15.1, protein: 1.2, fat: 0.1, fiber: 1.1,
    rawCalories: 60, rawCarbs: 15.1, rawProtein: 1.2, rawFat: 0.1, rawFiber: 1.1,
    basisDefault: "raw", cookFactor: 1 },
  // 榴莲 — 生熟一致
  { id: "durian", name: "榴莲", nameEn: "Durian", category: "水果", emoji: "🥥",
    calories: 147, carbs: 27.0, protein: 1.5, fat: 5.3, fiber: 3.8,
    rawCalories: 147, rawCarbs: 27.0, rawProtein: 1.5, rawFat: 5.3, rawFiber: 3.8,
    basisDefault: "raw", cookFactor: 1 },
  // 椰子 — 生熟一致
  { id: "coconut", name: "椰子", nameEn: "Coconut", category: "水果", emoji: "🥥",
    calories: 354, carbs: 15.2, protein: 3.3, fat: 33.5, fiber: 9.0,
    rawCalories: 354, rawCarbs: 15.2, rawProtein: 3.3, rawFat: 33.5, rawFiber: 9.0,
    basisDefault: "raw", cookFactor: 1 },
  // 柿子 — 生熟一致
  { id: "persimmon", name: "柿子", nameEn: "Persimmon", category: "水果", emoji: "🍊",
    calories: 71, carbs: 18.5, protein: 0.4, fat: 0.1, fiber: 1.4,
    rawCalories: 71, rawCarbs: 18.5, rawProtein: 0.4, rawFat: 0.1, rawFiber: 1.4,
    basisDefault: "raw", cookFactor: 1 },
  // 石榴 — 生熟一致
  { id: "pomegranate", name: "石榴", nameEn: "Pomegranate", category: "水果", emoji: "🍎",
    calories: 72, carbs: 18.7, protein: 1.4, fat: 0.2, fiber: 4.8,
    rawCalories: 72, rawCarbs: 18.7, rawProtein: 1.4, rawFat: 0.2, rawFiber: 4.8,
    basisDefault: "raw", cookFactor: 1 },
  // 山竹 — 生熟一致
  { id: "mangosteen", name: "山竹", nameEn: "Mangosteen", category: "水果", emoji: "🟣",
    calories: 73, carbs: 18.0, protein: 0.4, fat: 0.2, fiber: 1.8,
    rawCalories: 73, rawCarbs: 18.0, rawProtein: 0.4, rawFat: 0.2, rawFiber: 1.8,
    basisDefault: "raw", cookFactor: 1 },
  // 火龙果 — 生熟一致
  { id: "dragon-fruit", name: "火龙果", nameEn: "Dragon Fruit", category: "水果", emoji: "🐉",
    calories: 51, carbs: 13.3, protein: 1.1, fat: 0.2, fiber: 2.0,
    rawCalories: 51, rawCarbs: 13.3, rawProtein: 1.1, rawFat: 0.2, rawFiber: 2.0,
    basisDefault: "raw", cookFactor: 1 },
  // 红毛丹 — 生熟一致
  { id: "rambutan", name: "红毛丹", nameEn: "Rambutan", category: "水果", emoji: "🟠",
    calories: 82, carbs: 20.9, protein: 0.7, fat: 0.2, fiber: 0.9,
    rawCalories: 82, rawCarbs: 20.9, rawProtein: 0.7, rawFat: 0.2, rawFiber: 0.9,
    basisDefault: "raw", cookFactor: 1 },
  // 柚子 — 生熟一致
  { id: "pomelo", name: "柚子", nameEn: "Pomelo", category: "水果", emoji: "🍊",
    calories: 42, carbs: 9.5, protein: 0.8, fat: 0.1, fiber: 1.0,
    rawCalories: 42, rawCarbs: 9.5, rawProtein: 0.8, rawFat: 0.1, rawFiber: 1.0,
    basisDefault: "raw", cookFactor: 1 },
  // 柠檬 — 生熟一致
  { id: "lemon", name: "柠檬", nameEn: "Lemon", category: "水果", emoji: "🍋",
    calories: 37, carbs: 9.3, protein: 1.1, fat: 0.3, fiber: 2.8,
    rawCalories: 37, rawCarbs: 9.3, rawProtein: 1.1, rawFat: 0.3, rawFiber: 2.8,
    basisDefault: "raw", cookFactor: 1 },
  // 蔓越莓 — 生熟一致
  { id: "cranberry", name: "蔓越莓", nameEn: "Cranberry", category: "水果", emoji: "🔴",
    calories: 46, carbs: 12.2, protein: 0.4, fat: 0.1, fiber: 4.6,
    rawCalories: 46, rawCarbs: 12.2, rawProtein: 0.4, rawFat: 0.1, rawFiber: 4.6,
    basisDefault: "raw", cookFactor: 1 },
  // 桑葚 — 生熟一致
  { id: "mulberry", name: "桑葚", nameEn: "Mulberry", category: "水果", emoji: "🟣",
    calories: 43, carbs: 9.7, protein: 1.7, fat: 0.4, fiber: 1.7,
    rawCalories: 43, rawCarbs: 9.7, rawProtein: 1.7, rawFat: 0.4, rawFiber: 1.7,
    basisDefault: "raw", cookFactor: 1 },
  // 无花果 — 生熟一致
  { id: "fig", name: "无花果", nameEn: "Fig", category: "水果", emoji: "🟤",
    calories: 65, carbs: 16.3, protein: 1.5, fat: 0.3, fiber: 2.9,
    rawCalories: 65, rawCarbs: 16.3, rawProtein: 1.5, rawFat: 0.3, rawFiber: 2.9,
    basisDefault: "raw", cookFactor: 1 },
  // 木瓜 — 生熟一致
  { id: "papaya", name: "木瓜", nameEn: "Papaya", category: "水果", emoji: "🥭",
    calories: 43, carbs: 10.8, protein: 0.5, fat: 0.3, fiber: 1.7,
    rawCalories: 43, rawCarbs: 10.8, rawProtein: 0.5, rawFat: 0.3, rawFiber: 1.7,
    basisDefault: "raw", cookFactor: 1 },
  // 杨梅 — 生熟一致
  { id: "bayberry", name: "杨梅", nameEn: "Bayberry", category: "水果", emoji: "🔴",
    calories: 28, carbs: 6.7, protein: 0.8, fat: 0.2, fiber: 1.0,
    rawCalories: 28, rawCarbs: 6.7, rawProtein: 0.8, rawFat: 0.2, rawFiber: 1.0,
    basisDefault: "raw", cookFactor: 1 },
  // 哈密瓜 — 生熟一致
  { id: "cantaloupe", name: "哈密瓜", nameEn: "Cantaloupe", category: "水果", emoji: "🍈",
    calories: 34, carbs: 7.7, protein: 0.5, fat: 0.1, fiber: 0.9,
    rawCalories: 34, rawCarbs: 7.7, rawProtein: 0.5, rawFat: 0.1, rawFiber: 0.9,
    basisDefault: "raw", cookFactor: 1 },
  // 百香果 — 生熟一致
  { id: "passion-fruit", name: "百香果", nameEn: "Passion Fruit", category: "水果", emoji: "🟣",
    calories: 68, carbs: 11.2, protein: 2.2, fat: 0.7, fiber: 10.4,
    rawCalories: 68, rawCarbs: 11.2, rawProtein: 2.2, rawFat: 0.7, rawFiber: 10.4,
    basisDefault: "raw", cookFactor: 1 },
  // 释迦果 — 生熟一致
  { id: "sugar-apple", name: "释迦果", nameEn: "Sugar Apple", category: "水果", emoji: "🟢",
    calories: 94, carbs: 23.6, protein: 2.1, fat: 0.6, fiber: 4.4,
    rawCalories: 94, rawCarbs: 23.6, rawProtein: 2.1, rawFat: 0.6, rawFiber: 4.4,
    basisDefault: "raw", cookFactor: 1 },
  // 李子 — 生熟一致
  { id: "plum", name: "李子", nameEn: "Plum", category: "水果", emoji: "🟣",
    calories: 46, carbs: 11.4, protein: 0.7, fat: 0.2, fiber: 1.4,
    rawCalories: 46, rawCarbs: 11.4, rawProtein: 0.7, rawFat: 0.2, rawFiber: 1.4,
    basisDefault: "raw", cookFactor: 1 },
  // 杏 — 生熟一致
  { id: "apricot", name: "杏", nameEn: "Apricot", category: "水果", emoji: "🟠",
    calories: 48, carbs: 11.1, protein: 1.4, fat: 0.4, fiber: 2.0,
    rawCalories: 48, rawCarbs: 11.1, rawProtein: 1.4, rawFat: 0.4, rawFiber: 2.0,
    basisDefault: "raw", cookFactor: 1 },
  // 莲雾 — 生熟一致
  { id: "wax-apple", name: "莲雾", nameEn: "Wax Apple", category: "水果", emoji: "🔴",
    calories: 25, carbs: 5.3, protein: 0.5, fat: 0.2, fiber: 1.0,
    rawCalories: 25, rawCarbs: 5.3, rawProtein: 0.5, rawFat: 0.2, rawFiber: 1.0,
    basisDefault: "raw", cookFactor: 1 },

  // ===== 扩充豆类坚果 (Legumes & Nuts Part 2) =====
  // 绿豆(干) — 煮熟 cookFactor 2.4
  { id: "mung-bean", name: "绿豆", nameEn: "Mung Bean", category: "豆类坚果", emoji: "🫘",
    calories: 124, carbs: 24.0, protein: 8.0, fat: 0.3, fiber: 6.4,
    rawCalories: 298, rawCarbs: 56.0, rawProtein: 19.5, rawFat: 0.7, rawFiber: 15.4,
    basisDefault: "raw", cookFactor: 2.4 },
  // 蚕豆(干) — 煮熟 cookFactor 2.2
  { id: "broad-bean", name: "蚕豆", nameEn: "Broad Bean", category: "豆类坚果", emoji: "🫘",
    calories: 127, carbs: 24.0, protein: 8.5, fat: 0.4, fiber: 3.1,
    rawCalories: 280, rawCarbs: 53.0, rawProtein: 18.7, rawFat: 0.9, rawFiber: 6.7,
    basisDefault: "raw", cookFactor: 2.2 },
  // 豌豆(干) — 煮熟 cookFactor 2.3
  { id: "dried-pea", name: "豌豆(干)", nameEn: "Dried Pea", category: "豆类坚果", emoji: "🫛",
    calories: 131, carbs: 24.0, protein: 8.5, fat: 0.4, fiber: 5.7,
    rawCalories: 299, rawCarbs: 55.0, rawProtein: 19.3, rawFat: 1.0, rawFiber: 13.0,
    basisDefault: "raw", cookFactor: 2.3 },
  // 芸豆(干) — 煮熟 cookFactor 2.3
  { id: "kidney-bean", name: "芸豆", nameEn: "Kidney Bean", category: "豆类坚果", emoji: "🫘",
    calories: 129, carbs: 24.0, protein: 8.7, fat: 0.5, fiber: 6.5,
    rawCalories: 296, rawCarbs: 54.0, rawProtein: 20.0, rawFat: 1.1, rawFiber: 15.0,
    basisDefault: "raw", cookFactor: 2.3 },
  // 黑芝麻 — 成品
  { id: "black-sesame", name: "黑芝麻", nameEn: "Black Sesame", category: "豆类坚果", emoji: "⚫",
    calories: 559, carbs: 24.0, protein: 19.1, fat: 46.1, fiber: 14.0,
    rawCalories: 559, rawCarbs: 24.0, rawProtein: 19.1, rawFat: 46.1, rawFiber: 14.0,
    basisDefault: "raw", cookFactor: 1 },
  // 芝麻酱 — 成品
  { id: "sesame-paste", name: "芝麻酱", nameEn: "Sesame Paste", category: "豆类坚果", emoji: "🥜",
    calories: 631, carbs: 22.0, protein: 19.0, fat: 52.7, fiber: 5.9,
    rawCalories: 631, rawCarbs: 22.0, rawProtein: 19.0, rawFat: 52.7, rawFiber: 5.9,
    basisDefault: "raw", cookFactor: 1 },
  // 南瓜子 — 成品
  { id: "pumpkin-seed", name: "南瓜子", nameEn: "Pumpkin Seed", category: "豆类坚果", emoji: "🎃",
    calories: 574, carbs: 14.0, protein: 30.0, fat: 46.0, fiber: 6.0,
    rawCalories: 574, rawCarbs: 14.0, rawProtein: 30.0, rawFat: 46.0, rawFiber: 6.0,
    basisDefault: "raw", cookFactor: 1 },
  // 西瓜子 — 成品
  { id: "watermelon-seed", name: "西瓜子", nameEn: "Watermelon Seed", category: "豆类坚果", emoji: "🍉",
    calories: 573, carbs: 14.0, protein: 28.0, fat: 47.0, fiber: 5.0,
    rawCalories: 573, rawCarbs: 14.0, rawProtein: 28.0, rawFat: 47.0, rawFiber: 5.0,
    basisDefault: "raw", cookFactor: 1 },
  // 松子 — 成品
  { id: "pine-nut", name: "松子", nameEn: "Pine Nut", category: "豆类坚果", emoji: "🌰",
    calories: 698, carbs: 13.0, protein: 13.7, fat: 68.6, fiber: 3.7,
    rawCalories: 698, rawCarbs: 13.0, rawProtein: 13.7, rawFat: 68.6, rawFiber: 3.7,
    basisDefault: "raw", cookFactor: 1 },
  // 榛子 — 成品
  { id: "hazelnut", name: "榛子", nameEn: "Hazelnut", category: "豆类坚果", emoji: "🌰",
    calories: 628, carbs: 16.7, protein: 15.0, fat: 60.8, fiber: 9.7,
    rawCalories: 628, rawCarbs: 16.7, rawProtein: 15.0, rawFat: 60.8, rawFiber: 9.7,
    basisDefault: "raw", cookFactor: 1 },
  // 开心果 — 成品
  { id: "pistachio", name: "开心果", nameEn: "Pistachio", category: "豆类坚果", emoji: "🌰",
    calories: 562, carbs: 27.2, protein: 20.6, fat: 45.3, fiber: 10.6,
    rawCalories: 562, rawCarbs: 27.2, rawProtein: 20.6, rawFat: 45.3, rawFiber: 10.6,
    basisDefault: "raw", cookFactor: 1 },
  // 夏威夷果 — 成品
  { id: "macadamia", name: "夏威夷果", nameEn: "Macadamia", category: "豆类坚果", emoji: "🌰",
    calories: 718, carbs: 13.8, protein: 7.9, fat: 75.8, fiber: 8.6,
    rawCalories: 718, rawCarbs: 13.8, rawProtein: 7.9, rawFat: 75.8, rawFiber: 8.6,
    basisDefault: "raw", cookFactor: 1 },
  // 碧根果 — 成品
  { id: "pecan", name: "碧根果", nameEn: "Pecan", category: "豆类坚果", emoji: "🌰",
    calories: 691, carbs: 13.9, protein: 9.2, fat: 72.0, fiber: 9.6,
    rawCalories: 691, rawCarbs: 13.9, rawProtein: 9.2, rawFat: 72.0, rawFiber: 9.6,
    basisDefault: "raw", cookFactor: 1 },
  // 莲子(干) — 煮熟 cookFactor 2.0
  { id: "lotus-seed", name: "莲子(干)", nameEn: "Lotus Seed (Dry)", category: "豆类坚果", emoji: "⚪",
    calories: 178, carbs: 34.0, protein: 8.0, fat: 1.5, fiber: 3.0,
    rawCalories: 356, rawCarbs: 67.0, rawProtein: 16.0, rawFat: 2.0, rawFiber: 5.6,
    basisDefault: "raw", cookFactor: 2.0 },
  // 芡实(干) — 煮熟 cookFactor 2.0
  { id: "gordon-euryale", name: "芡实", nameEn: "Gordon Euryale Seed", category: "豆类坚果", emoji: "⚪",
    calories: 178, carbs: 32.0, protein: 8.0, fat: 1.0, fiber: 2.5,
    rawCalories: 355, rawCarbs: 64.0, rawProtein: 15.6, rawFat: 2.0, rawFiber: 5.0,
    basisDefault: "raw", cookFactor: 2.0 },
  // 白果(干) — 成品
  { id: "ginkgo-nut", name: "白果", nameEn: "Ginkgo Nut", category: "豆类坚果", emoji: "🟡",
    calories: 355, carbs: 72.0, protein: 13.2, fat: 1.3, fiber: 2.0,
    rawCalories: 355, rawCarbs: 72.0, rawProtein: 13.2, rawFat: 1.3, rawFiber: 2.0,
    basisDefault: "raw", cookFactor: 1 },
  // 豆腐丝 — 成品
  { id: "tofu-shred", name: "豆腐丝", nameEn: "Shredded Tofu", category: "豆类坚果", emoji: "🧈",
    calories: 203, carbs: 6.2, protein: 21.5, fat: 10.5, fiber: 1.0,
    rawCalories: 203, rawCarbs: 6.2, rawProtein: 21.5, rawFat: 10.5, rawFiber: 1.0,
    basisDefault: "raw", cookFactor: 1 },
  // 杏仁(露) — 成品
  { id: "almond-milk", name: "杏仁奶", nameEn: "Almond Milk", category: "豆类坚果", emoji: "🥛",
    calories: 17, carbs: 0.6, protein: 0.6, fat: 1.5, fiber: 0.4,
    rawCalories: 17, rawCarbs: 0.6, rawProtein: 0.6, rawFat: 1.5, rawFiber: 0.4,
    basisDefault: "raw", cookFactor: 1 },
  // 柿饼 — 成品
  { id: "dried-persimmon", name: "柿饼", nameEn: "Dried Persimmon", category: "豆类坚果", emoji: "🟠",
    calories: 250, carbs: 65.0, protein: 1.8, fat: 0.6, fiber: 4.4,
    rawCalories: 250, rawCarbs: 65.0, rawProtein: 1.8, rawFat: 0.6, rawFiber: 4.4,
    basisDefault: "raw", cookFactor: 1 },
  // 杏干 — 干品
  { id: "dried-apricot", name: "杏干", nameEn: "Dried Apricot", category: "豆类坚果", emoji: "🟠",
    calories: 252, carbs: 65.0, protein: 3.4, fat: 0.5, fiber: 7.3,
    rawCalories: 252, rawCarbs: 65.0, rawProtein: 3.4, rawFat: 0.5, rawFiber: 7.3,
    basisDefault: "raw", cookFactor: 1 },
  // 蔓越莓干 — 干品
  { id: "dried-cranberry", name: "蔓越莓干", nameEn: "Dried Cranberry", category: "豆类坚果", emoji: "🔴",
    calories: 308, carbs: 82.4, protein: 0.2, fat: 1.4, fiber: 5.3,
    rawCalories: 308, rawCarbs: 82.4, rawProtein: 0.2, rawFat: 1.4, rawFiber: 5.3,
    basisDefault: "raw", cookFactor: 1 },

  // ===== 扩充其他 (Other Part 2) =====
  // 酱油 — 成品
  { id: "soy-sauce", name: "酱油", nameEn: "Soy Sauce", category: "其他", emoji: "🧂",
    calories: 63, carbs: 10.1, protein: 5.6, fat: 0.1, fiber: 0,
    rawCalories: 63, rawCarbs: 10.1, rawProtein: 5.6, rawFat: 0.1, rawFiber: 0,
    basisDefault: "raw", cookFactor: 1 },
  // 醋 — 成品
  { id: "vinegar", name: "醋", nameEn: "Vinegar", category: "其他", emoji: "🧂",
    calories: 21, carbs: 4.9, protein: 0.5, fat: 0, fiber: 0,
    rawCalories: 21, rawCarbs: 4.9, rawProtein: 0.5, rawFat: 0, rawFiber: 0,
    basisDefault: "raw", cookFactor: 1 },
  // 番茄酱 — 成品
  { id: "ketchup", name: "番茄酱", nameEn: "Ketchup", category: "其他", emoji: "🍅",
    calories: 102, carbs: 25.0, protein: 1.7, fat: 0.3, fiber: 1.0,
    rawCalories: 102, rawCarbs: 25.0, rawProtein: 1.7, rawFat: 0.3, rawFiber: 1.0,
    basisDefault: "raw", cookFactor: 1 },
  // 豆瓣酱 — 成品
  { id: "doubanjiang", name: "豆瓣酱", nameEn: "Doubanjiang", category: "其他", emoji: "🧂",
    calories: 165, carbs: 17.0, protein: 14.0, fat: 6.8, fiber: 2.0,
    rawCalories: 165, rawCarbs: 17.0, rawProtein: 14.0, rawFat: 6.8, rawFiber: 2.0,
    basisDefault: "raw", cookFactor: 1 },
  // 甜面酱 — 成品
  { id: "sweet-bean-sauce", name: "甜面酱", nameEn: "Sweet Bean Sauce", category: "其他", emoji: "🧂",
    calories: 154, carbs: 28.0, protein: 6.0, fat: 1.5, fiber: 1.0,
    rawCalories: 154, rawCarbs: 28.0, rawProtein: 6.0, rawFat: 1.5, rawFiber: 1.0,
    basisDefault: "raw", cookFactor: 1 },
  // 可乐 — 成品
  { id: "cola", name: "可乐", nameEn: "Cola", category: "其他", emoji: "🥤",
    calories: 43, carbs: 10.6, protein: 0, fat: 0, fiber: 0,
    rawCalories: 43, rawCarbs: 10.6, rawProtein: 0, rawFat: 0, rawFiber: 0,
    basisDefault: "raw", cookFactor: 1 },
  // 咖啡(黑) — 成品
  { id: "coffee", name: "黑咖啡", nameEn: "Black Coffee", category: "其他", emoji: "☕",
    calories: 2, carbs: 0.3, protein: 0.3, fat: 0, fiber: 0,
    rawCalories: 2, rawCarbs: 0.3, rawProtein: 0.3, rawFat: 0, rawFiber: 0,
    basisDefault: "raw", cookFactor: 1 },
  // 茶(绿茶) — 成品
  { id: "tea", name: "绿茶", nameEn: "Green Tea", category: "其他", emoji: "🍵",
    calories: 1, carbs: 0.2, protein: 0.2, fat: 0, fiber: 0,
    rawCalories: 1, rawCarbs: 0.2, rawProtein: 0.2, rawFat: 0, rawFiber: 0,
    basisDefault: "raw", cookFactor: 1 },
  // 啤酒 — 成品
  { id: "beer", name: "啤酒", nameEn: "Beer", category: "其他", emoji: "🍺",
    calories: 43, carbs: 3.6, protein: 0.5, fat: 0, fiber: 0,
    rawCalories: 43, rawCarbs: 3.6, rawProtein: 0.5, rawFat: 0, rawFiber: 0,
    basisDefault: "raw", cookFactor: 1 },
  // 红酒 — 成品
  { id: "red-wine", name: "红酒", nameEn: "Red Wine", category: "其他", emoji: "🍷",
    calories: 85, carbs: 2.6, protein: 0.1, fat: 0, fiber: 0,
    rawCalories: 85, rawCarbs: 2.6, rawProtein: 0.1, rawFat: 0, rawFiber: 0,
    basisDefault: "raw", cookFactor: 1 },
  // 白酒 — 成品
  { id: "baijiu", name: "白酒", nameEn: "Baijiu", category: "其他", emoji: "🍶",
    calories: 298, carbs: 0, protein: 0, fat: 0, fiber: 0,
    rawCalories: 298, rawCarbs: 0, rawProtein: 0, rawFat: 0, rawFiber: 0,
    basisDefault: "raw", cookFactor: 1 },
  // 橙汁 — 成品
  { id: "orange-juice", name: "橙汁", nameEn: "Orange Juice", category: "其他", emoji: "🧃",
    calories: 45, carbs: 10.4, protein: 0.7, fat: 0.2, fiber: 0.2,
    rawCalories: 45, rawCarbs: 10.4, rawProtein: 0.7, rawFat: 0.2, rawFiber: 0.2,
    basisDefault: "raw", cookFactor: 1 },
  // 奶茶 — 成品
  { id: "milk-tea", name: "奶茶", nameEn: "Milk Tea", category: "其他", emoji: "🧋",
    calories: 90, carbs: 14.0, protein: 2.0, fat: 3.0, fiber: 0,
    rawCalories: 90, rawCarbs: 14.0, rawProtein: 2.0, rawFat: 3.0, rawFiber: 0,
    basisDefault: "raw", cookFactor: 1 },
  // 能量棒 — 成品
  { id: "energy-bar", name: "能量棒", nameEn: "Energy Bar", category: "其他", emoji: "🍫",
    calories: 380, carbs: 60.0, protein: 15.0, fat: 10.0, fiber: 5.0,
    rawCalories: 380, rawCarbs: 60.0, rawProtein: 15.0, rawFat: 10.0, rawFiber: 5.0,
    basisDefault: "raw", cookFactor: 1 },
  // 果酱 — 成品
  { id: "jam", name: "果酱", nameEn: "Jam", category: "其他", emoji: "🍯",
    calories: 278, carbs: 69.0, protein: 0.5, fat: 0.1, fiber: 1.1,
    rawCalories: 278, rawCarbs: 69.0, rawProtein: 0.5, rawFat: 0.1, rawFiber: 1.1,
    basisDefault: "raw", cookFactor: 1 },
  // 运动饮料 — 成品
  { id: "sports-drink", name: "运动饮料", nameEn: "Sports Drink", category: "其他", emoji: "🥤",
    calories: 26, carbs: 6.5, protein: 0, fat: 0, fiber: 0,
    rawCalories: 26, rawCarbs: 6.5, rawProtein: 0, rawFat: 0, rawFiber: 0,
    basisDefault: "raw", cookFactor: 1 },
];

export function searchFoods(query: string): Food[] {
  if (!query.trim()) return foods;
  const q = query.toLowerCase().trim();
  return foods.filter(
    (f) =>
      f.name.toLowerCase().includes(q) ||
      f.nameEn.toLowerCase().includes(q) ||
      f.category.includes(q)
  );
}

export function getFoodsByCategory(category: string): Food[] {
  return foods.filter((f) => f.category === category);
}
