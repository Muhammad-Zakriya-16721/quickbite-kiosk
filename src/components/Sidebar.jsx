// src/components/Sidebar/Sidebar.jsx
import React, { useCallback, memo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { 
  Flame, 
  Beef, 
  Pizza, 
  Sandwich, 
  Coffee, 
  IceCream 
} from "lucide-react";

const categories = [
  { id: "popular", label: "Popular", icon: Flame },
  { id: "burgers", label: "Burgers", icon: Beef },
  { id: "pizza", label: "Pizza", icon: Pizza },
  { id: "wraps", label: "Wraps", icon: Sandwich },
  { id: "drinks", label: "Drinks", icon: Coffee },
  { id: "dessert", label: "Dessert", icon: IceCream },
];

const Sidebar = ({ activeCategory, onSelectCategory }) => {
  const handleSelect = useCallback(
    (id) => {
      if (onSelectCategory) onSelectCategory(id);
    },
    [onSelectCategory]
  );

  return (
    <aside
      className="
        /* MOBILE: Bottom Navigation Bar + Safe Area */
        /* Changed justify-between to justify-center per instructions */
        fixed bottom-0 left-0 w-full h-20 pb-[env(safe-area-inset-bottom)] bg-[#111111] border-t border-white/10 z-40 flex flex-row items-center justify-center px-4 shadow-2xl
        /* DESKTOP: Left Vertical Sidebar */
        md:relative md:w-24 md:h-full md:pb-0 md:flex-col md:border-r md:border-t-0 md:py-6 md:justify-start md:px-0
      "
      aria-label="Main categories"
    >
      {/* Brand Logo - Desktop Only */}
      <div className="hidden md:block mb-6">
        <div className="w-12 h-12 bg-brand-primary rounded-full flex items-center justify-center shadow-lg shadow-brand-primary/20">
          <span className="text-xl font-black text-brand-dark">Q</span>
        </div>
      </div>

      {/* Nav (Scroll Snap on Mobile) */}
      <nav
        className="
          flex-1 w-full flex 
          /* Mobile: Horizontal Row + Scroll Snap */
          flex-row items-center gap-2 overflow-x-auto no-scrollbar snap-x snap-mandatory scroll-smooth
          /* Desktop: Vertical Column */
          md:flex-col md:overflow-y-auto md:overflow-x-hidden md:px-2 md:gap-3
        "
        role="tablist"
      >
        {categories.map((category) => (
          <MemoCategoryButton
            key={category.id}
            category={category}
            isActive={activeCategory === category.id}
            onClick={() => handleSelect(category.id)}
          />
        ))}
      </nav>

      {/* Decoration - Desktop Only */}
      <div className="hidden md:block mt-auto opacity-30 mb-3">
        <div className="w-1 h-12 bg-white/10 rounded-full mx-auto" />
      </div>
    </aside>
  );
};

const CategoryButton = ({ category, isActive, onClick }) => {
  const Icon = category.icon;
  const shouldReduceMotion = useReducedMotion();
  
  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      aria-label={category.label}
      aria-controls={`panel-${category.id}`} /* Added aria-controls */
      onClick={onClick}
      className={`
        relative flex items-center justify-center rounded-2xl transition-all duration-200 shrink-0 snap-center
        /* Focus Styles */
        focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#111]
        /* Mobile Sizing */
        w-14 h-14 
        /* Desktop Sizing */
        md:w-full md:aspect-square
        /* Active State: Removed scale-105, added ring-1 highlight */
        ${isActive ? "text-brand-dark ring-1 ring-white/10" : "text-gray-400 active:text-white"}
      `}
    >
      {/* Active Background - Conditional Motion */}
      {isActive && (
        <motion.div
          layoutId="activeCategory"
          className="absolute inset-0 bg-brand-primary rounded-2xl shadow-lg shadow-brand-primary/30"
          initial={false}
          transition={
            shouldReduceMotion 
            ? { duration: 0 } 
            : { type: "spring", stiffness: 260, damping: 20 }
          }
        />
      )}

      {/* Icon & Label */}
      <div className="relative z-10 flex flex-col items-center gap-1 pointer-events-none">
        <Icon size={24} strokeWidth={2.5} className="md:w-6 md:h-6 w-6 h-6" />
        {/* Label: Fixed visibility logic */}
        <span className="text-[10px] font-bold tracking-wide uppercase hidden sm:block">
          {category.label}
        </span>
      </div>
    </button>
  );
};

const MemoCategoryButton = memo(CategoryButton);
export default Sidebar;