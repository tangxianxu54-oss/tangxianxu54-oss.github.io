import { NavLink } from "react-router-dom";
import { Flame, Calculator, BookOpen } from "lucide-react";

const navItems = [
  { to: "/", label: "食物查询", icon: Flame },
  { to: "/calculator", label: "每日摄入", icon: Calculator },
  { to: "/diary", label: "当日餐单", icon: BookOpen },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-charcoal/80 backdrop-blur-xl">
      <nav className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <NavLink to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-flame to-flame-dark shadow-lg shadow-flame/30">
            <Flame className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-display text-xl tracking-wide text-cream">FITCALC</span>
            <span className="text-[10px] tracking-[0.2em] text-white/40">健身热量计算器</span>
          </div>
        </NavLink>

        <div className="flex items-center gap-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                `flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-flame text-white shadow-lg shadow-flame/30"
                    : "text-white/60 hover:bg-white/5 hover:text-cream"
                }`
              }
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </header>
  );
}
