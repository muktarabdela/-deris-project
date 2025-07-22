// components/theme-toggle.tsx
"use client";

import { useTheme } from "@/hooks/theme-provider";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-md border shadow-sm bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground"
            aria-label="Toggle theme"
        >
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
        </button>
    );
}
