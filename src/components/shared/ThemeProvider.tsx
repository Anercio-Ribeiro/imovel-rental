"use client";
// src/components/shared/ThemeProvider.tsx
import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";
interface ThemeContextValue { theme: Theme; toggleTheme: () => void; setTheme: (t: Theme) => void; }

const ThemeContext = createContext<ThemeContextValue>({ theme: "light", toggleTheme: () => {}, setTheme: () => {} });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Start with "light" to match server render — no hydration mismatch
  const [theme, setThemeState] = useState<Theme>("light");

  useEffect(() => {
    // After mount, read what the inline script already applied
    const isDark = document.documentElement.classList.contains("dark");
    setThemeState(isDark ? "dark" : "light");
  }, []);

  const setTheme = (t: Theme) => {
    setThemeState(t);
    document.documentElement.classList.toggle("dark", t === "dark");
    try { localStorage.setItem("theme", t); } catch {}
  };

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  return <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme() { return useContext(ThemeContext); }

// Inline script for <head> — sets class before React hydrates (no flash, no mismatch)
export const themeScript = `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||((!t)&&window.matchMedia('(prefers-color-scheme:dark)').matches)){document.documentElement.classList.add('dark');}}catch(e){}})();`;
