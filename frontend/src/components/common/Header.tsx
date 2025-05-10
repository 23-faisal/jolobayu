import logo from "../../../public/logo.webp";
import { Link } from "react-router-dom";
import { useTheme } from "../context/theme-provider";
import { Sun, Moon } from "lucide-react";
import CitySearch from "./CitySearch";

const Header = () => {
  const { theme, setTheme } = useTheme();

  // Function to toggle between light and dark theme
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/90 backdrop-blue py-2 supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/">
          <img src={logo} alt="jolubayu" />
        </Link>

        <div className="flex items-center gap-6">
          {/* search */}

          <div>
            <CitySearch />
          </div>

          {/* theme toggle */}
          <div
            onClick={toggleTheme}
            className={`  flex items-center cursor-pointer transition-transform duration-500  ${
              theme === "dark" ? "rotate-180" : "rotate-0"
            } `}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="h-6 w-6 text-yellow-500 rotate-0 transition-all" />
            ) : (
              <Moon className="h-6 w-6 text-blue-500 rotate-0 transition-all" />
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
