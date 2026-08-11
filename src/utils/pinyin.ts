// 拼音搜索工具 —— 基于 pinyin-pro 库
import { pinyin } from "pinyin-pro";

// 将字符串转为拼音首字母串（全小写），非中文字符原样保留
export function toPinyinInitials(str: string): string {
  let result = "";
  for (const ch of str) {
    // pinyin() 对非汉字返回原字符
    const py = pinyin(ch, { pattern: "first", toneType: "none", type: "array" });
    if (Array.isArray(py) && py.length > 0 && py[0] && py[0] !== ch) {
      result += py[0].toLowerCase();
    } else {
      // 非汉字，保留小写
      result += ch.toLowerCase();
    }
  }
  return result;
}

/**
 * 拼音首字母缓存 —— 避免每次搜索都对 300+ 食物名重复调用 pinyin-pro。
 * key = 食物名，value = 拼音首字母串
 */
const initialsCache = new Map<string, string>();

/** 获取某个字符串的拼音首字母（带缓存，相同字符串只计算一次） */
export function getCachedInitials(str: string): string {
  let cached = initialsCache.get(str);
  if (cached === undefined) {
    cached = toPinyinInitials(str);
    initialsCache.set(str, cached);
  }
  return cached;
}

/** 批量预计算拼音首字母并填入缓存（适合应用启动时调用） */
export function precomputeInitials(strings: string[]): void {
  for (const s of strings) {
    if (!initialsCache.has(s)) {
      initialsCache.set(s, toPinyinInitials(s));
    }
  }
}

// 拼音匹配：支持首字母连续匹配（如 "jxr" 匹配 "鸡胸肉"）
// 注意：此函数每次调用都会重新计算 target 的拼音，适合偶尔调用。
// 高频搜索场景请使用 pinyinMatchCached。
export function pinyinMatch(query: string, target: string): boolean {
  const q = query.toLowerCase().trim();
  if (!q) return false;
  const initials = toPinyinInitials(target);
  if (initials.includes(q)) return true;
  return false;
}

/**
 * 高频搜索专用的拼音匹配 —— 使用预计算的 initials 字符串，避免重复计算。
 * @param query 搜索词（小写）
 * @param initials 预计算的拼音首字母串（通过 getCachedInitials 获取）
 */
export function pinyinMatchCached(query: string, initials: string): boolean {
  return initials.includes(query);
}
