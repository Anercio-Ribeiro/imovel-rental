"use client";
// src/components/shared/ThemeToggle.tsx
import { useTheme } from "./ThemeProvider";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      aria-label={theme === "dark" ? "Tema claro" : "Tema escuro"}
      className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${className}`}
      style={{
        border: "1px solid var(--border-color)",
        background: "var(--bg-surface)",
        color: "var(--text-muted)",
      }}
      onMouseEnter={e => { e.currentTarget.style.background = "var(--bg-surface2 ,#efefef)"; }}
      onMouseLeave={e => { e.currentTarget.style.background = "var(--bg-surface)"; }}>
      {theme === "dark"
        ? <Sun className="w-4 h-4 text-yellow-500" />
        : <Moon className="w-4 h-4" />}
    </button>
  );
}
