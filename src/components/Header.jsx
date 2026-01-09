// src/components/Header/Header.jsx
import React, { useState, useEffect, useRef } from "react";
import { Globe } from "lucide-react";

const Header = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [language, setLanguage] = useState("EN");
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = language === "UR" ? "ur" : "en";
      document.documentElement.dir = language === "UR" ? "rtl" : "ltr";
    }
  }, [language]);

  const toggleLanguage = () => setLanguage((p) => (p === "EN" ? "UR" : "EN"));

  const formattedTime = currentTime.toLocaleTimeString(language === "UR" ? "ur-PK" : "en-US", {
    hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true,
  });

  return (
    <header
      role="banner"
      className="
        flex items-center justify-between 
        px-4 md:px-8 
        /* Adjusted Padding: py-2 on mobile, py-3 sm, py-6 md */
        py-2 sm:py-3 md:py-6
        pt-[env(safe-area-inset-top)]
        bg-brand-dark/80 backdrop-blur-md sticky top-0 z-30 border-b border-white/5 
        /* Adjusted Shadow: shadow-md on mobile, shadow-2xl on desktop */
        shadow-md md:shadow-2xl
      "
    >
      {/* LEFT: Title */}
      <div className="flex flex-col justify-center">
        <h1 className="font-bold text-white tracking-tight leading-none">
          <span className="hidden sm:block text-sm md:text-3xl lg:text-4xl opacity-60 font-medium mb-1">
            Welcome to
          </span>
          <span className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl text-brand-primary block">
            QuickBite
          </span>
        </h1>
      </div>

      {/* RIGHT: Actions */}
      <div className="flex items-center gap-3 md:gap-6">
        
        {/* Language Toggle */}
        <button
          type="button"
          onClick={toggleLanguage}
          aria-label="Change language"
          aria-pressed={language === "UR"}
          className="
            flex items-center gap-2 md:gap-3 bg-[#2A2A2A] 
            /* Increased Vertical Padding for Touch Target (py-3) */
            px-3 py-3 md:px-6 md:py-4 
            rounded-xl md:rounded-2xl border border-white/10 shadow-inner
            hover:bg-[#333] active:scale-95 transition-all
            focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#111]
          "
        >
          <Globe className="w-4 h-4 md:w-6 md:h-6 text-brand-primary" />
          <span className={`font-bold text-white ${language === 'UR' ? 'font-urdu text-base md:text-xl pb-1' : 'text-sm md:text-lg'}`}>
            {language === "EN" ? "EN" : "اردو"}
          </span>
        </button>

        {/* Live Clock Section */}
        {/* Increased min-width to 100px/160px */}
        <div className="flex flex-col items-end min-w-[100px] md:min-w-[160px]" aria-live="polite">
          <span className="text-xl md:text-4xl font-bold text-white leading-none tracking-widest tabular-nums">
             {formattedTime}
          </span>
          
          <div className="flex items-center gap-2 mt-1 md:mt-2">
            {/* Ping animation removed, only static dot remains */}
            <span className="relative flex h-2 w-2 md:h-3 md:w-3">
              <span className="relative inline-flex rounded-full h-full w-full bg-green-500"></span>
            </span>
            <span className="text-[10px] md:text-base text-brand-primary font-bold tracking-widest opacity-90">
              OPEN 24/7
            </span>
          </div>
        </div>

      </div>
    </header>
  );
};

export default Header;