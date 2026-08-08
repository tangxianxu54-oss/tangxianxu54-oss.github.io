import type { ReactNode } from "react";
import Navbar from "./Navbar";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen text-cream">
      <Navbar />
      <main className="container mx-auto max-w-6xl px-4 py-8 pb-24 md:pb-8">
        {children}
      </main>
      <footer className="border-t border-white/5 py-6 text-center text-xs text-white/30">
        <p>数据仅供参考，以每 100g 为基准 · 采用 Mifflin-St Jeor 公式</p>
      </footer>
    </div>
  );
}
