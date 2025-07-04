import { useEffect, useState } from "react";
import { MoonIcon, SunIcon } from "./Icons";

const ThemeSwitcher = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  useEffect(() => {
    const theme = localStorage.getItem("theme") || "dark";
    setIsDarkMode(theme === "dark");
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, []);
  const toggleTheme = () => {
    const newIsDarkMode = !isDarkMode;
    localStorage.setItem("theme", newIsDarkMode ? "dark" : "light");
    document.documentElement.classList.toggle("dark", newIsDarkMode);
    setIsDarkMode(newIsDarkMode);
  };
  return (
    <button
      onClick={toggleTheme}
      className="flex items-center gap-x-2 w-full px-2 py-2 text-sm font-medium rounded-md text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700/50 transition-colors"
    >
      {isDarkMode ? (
        <SunIcon className="w-5 h-5" />
      ) : (
        <MoonIcon className="w-5 h-5" />
      )}
      <span>{isDarkMode ? "Light Mode" : "Dark Mode"}</span>
    </button>
  );
};

export default ThemeSwitcher;
