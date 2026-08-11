import { useState, useMemo, useDeferredValue, useEffect } from "react";
import { Search, Flame, Plus, ChevronDown } from "lucide-react";
import { foods, CATEGORIES, type Food, type WeightBasis } from "@/data/foods";
import FoodCard from "@/components/FoodCard";
import AddFoodModal from "@/components/AddFoodModal";
import { useStore, type MealType, type CustomFood } from "@/store/useStore";
import { getCachedInitials, precomputeInitials, pinyinMatchCached } from "@/utils/pinyin";

// 懒加载每页数量
const PAGE_SIZE = 40;

export default function FoodSearch() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("全部");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingFood, setEditingFood] = useState<CustomFood | null>(null);

  const customFoods = useStore((s) => s.customFoods);
  const removeCustomFood = useStore((s) => s.removeCustomFood);
  const addEntry = useStore((s) => s.addEntry);

  // 合并内置与自定义食物
  const allFoods = useMemo<Food[]>(
    () => [...customFoods, ...foods],
    [customFoods]
  );

  // ★ 优化1：拼音首字母预计算缓存 —— 只在 allFoods 变化时计算一次
  const pinyinMap = useMemo(() => {
    // 先批量预计算所有食物名的拼音（填入全局缓存）
    precomputeInitials(allFoods.map((f) => f.name));
    // 构建 id → initials 的查找表
    const map = new Map<string, string>();
    for (const f of allFoods) {
      map.set(f.id, getCachedInitials(f.name));
    }
    return map;
  }, [allFoods]);

  // ★ 优化2：搜索防抖 —— useDeferredValue 让输入保持流畅，
  //   搜索在空闲时执行，不阻塞用户打字
  const deferredQuery = useDeferredValue(query);
  // 当前显示的条数（搜索词或分类变化时重置）
  const [displayCount, setDisplayCount] = useState(PAGE_SIZE);

  const filteredFoods = useMemo(() => {
    const q = deferredQuery.toLowerCase().trim();
    let result = allFoods;
    if (q) {
      result = result.filter(
        (f) =>
          f.name.toLowerCase().includes(q) ||
          f.nameEn.toLowerCase().includes(q) ||
          f.category.includes(q) ||
          // ★ 优化1：使用缓存的拼音首字母匹配，避免每次重新计算
          pinyinMatchCached(q, pinyinMap.get(f.id) ?? "")
      );
    }
    if (activeCategory !== "全部") {
      result = result.filter((f) => f.category === activeCategory);
    }
    return result;
  }, [deferredQuery, activeCategory, allFoods, pinyinMap]);

  // 搜索词或分类变化时重置显示数量
  useEffect(() => {
    setDisplayCount(PAGE_SIZE);
  }, [deferredQuery, activeCategory]);

  // ★ 优化3：列表懒加载 —— 只渲染前 displayCount 条，避免一次性渲染 300+ 卡片
  const visibleFoods = useMemo(
    () => filteredFoods.slice(0, displayCount),
    [filteredFoods, displayCount]
  );
  const hasMore = displayCount < filteredFoods.length;

  // 滚动触底自动加载
  useEffect(() => {
    if (!hasMore) return;
    const onScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.body.scrollHeight - 400
      ) {
        setDisplayCount((c) => c + PAGE_SIZE);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [hasMore]);

  const handleAdd = (food: Food, grams: number, mealType: MealType, basis: WeightBasis) => {
    const ratio = grams / 100;
    const nut =
      basis === "raw"
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
    addEntry({
      foodId: food.id,
      foodName: food.name,
      foodEmoji: food.emoji,
      grams,
      weightBasis: basis,
      calories: Math.round(nut.calories * ratio),
      carbs: Math.round(nut.carbs * ratio * 10) / 10,
      protein: Math.round(nut.protein * ratio * 10) / 10,
      fat: Math.round(nut.fat * ratio * 10) / 10,
      fiber: Math.round(nut.fiber * ratio * 10) / 10,
      mealType,
    });
  };

  const isCustom = (food: Food): food is CustomFood =>
    "isCustom" in food && food.isCustom === true;

  const openAddModal = () => {
    setEditingFood(null);
    setModalOpen(true);
  };

  const openEditModal = (food: CustomFood) => {
    setEditingFood(food);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingFood(null);
  };

  return (
    <div className="animate-fade-in">
      {/* Hero 区 */}
      <section className="mb-8 text-center">
        <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-flame/20 bg-flame/5 px-3 py-1 text-xs text-flame-light">
          <Flame className="h-3 w-3" />
          以每 100g 为基准 · 精准营养数据
        </div>
        <h1 className="font-display text-5xl tracking-wide text-cream sm:text-6xl">
          食物 <span className="text-gradient-flame">热量</span> 与营养查询
        </h1>
        <p className="mt-2 text-sm text-white/50">
          搜索 {allFoods.length} 种食物（含 {customFoods.length} 种自定义），支持中英文及拼音首字母
        </p>
      </section>

      {/* 搜索栏 + 添加按钮 */}
      <div className="relative mb-6 flex gap-3">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/30" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜索食物（中文 / 英文 / 拼音首字母 如 jxr）..."
            className="w-full rounded-2xl border border-white/10 bg-charcoal-light/60 py-3.5 pl-12 pr-4 text-cream outline-none backdrop-blur-sm transition-all placeholder:text-white/30 focus:border-flame focus:ring-2 focus:ring-flame/20"
          />
        </div>
        <button
          onClick={openAddModal}
          className="flex flex-shrink-0 items-center gap-1.5 rounded-2xl bg-gradient-to-r from-mint to-mint-dark px-5 py-3.5 font-medium text-charcoal shadow-lg shadow-mint/30 transition-all hover:shadow-mint/50"
        >
          <Plus className="h-5 w-5" />
          <span className="hidden sm:inline">添加食物</span>
        </button>
      </div>

      {/* 分类筛选 */}
      <div className="mb-6 flex flex-wrap gap-2">
        {["全部", ...CATEGORIES].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`rounded-full px-4 py-1.5 text-sm transition-all ${
              activeCategory === cat
                ? "bg-flame text-white shadow-lg shadow-flame/30"
                : "border border-white/10 bg-white/5 text-white/50 hover:text-cream"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 食物列表 */}
      {filteredFoods.length === 0 ? (
        <div className="py-20 text-center text-white/30">
          <Search className="mx-auto mb-3 h-10 w-10 opacity-30" />
          <p>未找到匹配的食物，试试其他关键词或添加自定义食物</p>
        </div>
      ) : (
        <>
          <p className="mb-4 text-xs text-white/40">
            共 {filteredFoods.length} 种食物 · 点击卡片展开输入克数
            {hasMore && (
              <span className="ml-1 text-white/30">
                （已显示 {visibleFoods.length}，滚动加载更多）
              </span>
            )}
          </p>
          <div className="grid gap-3 md:grid-cols-2">
            {visibleFoods.map((food) => (
              <FoodCard
                key={food.id}
                food={food}
                onAdd={(grams, mealType, basis) => handleAdd(food, grams, mealType, basis)}
                onDelete={
                  isCustom(food) ? () => removeCustomFood(food.id) : undefined
                }
                onEdit={
                  isCustom(food) ? () => openEditModal(food) : undefined
                }
              />
            ))}
          </div>
          {/* 手动加载更多按钮（移动端滚动 fallback） */}
          {hasMore && (
            <div className="mt-6 text-center">
              <button
                onClick={() => setDisplayCount((c) => c + PAGE_SIZE)}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm text-white/60 transition-all hover:bg-white/10 hover:text-cream"
              >
                <ChevronDown className="h-4 w-4" />
                加载更多（剩余 {filteredFoods.length - visibleFoods.length} 种）
              </button>
            </div>
          )}
        </>
      )}

      {/* 添加/编辑食物弹窗 */}
      <AddFoodModal
        open={modalOpen}
        onClose={closeModal}
        initialFood={editingFood}
      />
    </div>
  );
}
