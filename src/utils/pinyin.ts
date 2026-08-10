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

// 拼音匹配：支持首字母连续匹配（如 "jxr" 匹配 "鸡胸肉"）
export function pinyinMatch(query: string, target: string): boolean {
  const q = query.toLowerCase().trim();
  if (!q) return false;
  const initials = toPinyinInitials(target);
  if (initials.includes(q)) return true;
  return false;
}
