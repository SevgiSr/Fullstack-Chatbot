import { useEffect, useState } from "react";
import { MoonIcon, SunIcon } from "./Icons";

const Theme = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    const isDark = localStorage.getItem("theme") === "dark";
    setIsDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    if (isDarkMode) {
      localStorage.setItem("theme", "light");
      document.documentElement.classList.remove("dark");
    } else {
      localStorage.setItem("theme", "dark");
      document.documentElement.classList.add("dark");
    }
    setIsDarkMode(!isDarkMode);
  };

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center w-full px-3 py-2 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
    >
      {isDarkMode ? (
        <SunIcon className="w-5 h-5 mr-3" />
      ) : (
        <MoonIcon className="w-5 h-5 mr-3" />
      )}
      {isDarkMode ? "Light Mode" : "Dark Mode"}
    </button>
  );
};

export default Theme;
