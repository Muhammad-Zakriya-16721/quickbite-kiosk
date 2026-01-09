// src/components/Menu/MenuGrid.jsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle } from "lucide-react";
import MenuCard from "./MenuCard";
import { menuItems } from "../data/menuItems";

const MenuGrid = ({ selectedCategory, onAddToCart }) => {
  
  const filteredItems = menuItems.filter((item) => {
    if (selectedCategory === "popular") return item.popular;
    return item.category === selectedCategory;
  });

  return (
    <div 
      className="
        w-full relative min-h-full
        /* Safe Area Padding for Mobile Bottom Nav */
        pb-[calc(6rem+env(safe-area-inset-bottom))] 
        md:pb-12
      "
    >
      
      {/* Category Header - Strengthened Hierarchy */}
      <div className="sticky top-0 z-20 bg-brand-dark/95 backdrop-blur-sm py-4 mb-6 md:mb-10 border-b border-white/5">
        <div className="flex items-end gap-4 px-1">
          <h2 className="text-3xl md:text-5xl font-black text-white capitalize tracking-tighter leading-none">
            {selectedCategory}
          </h2>
          <span className="text-brand-primary text-base md:text-xl font-bold pb-1 border-l-2 border-brand-primary/30 pl-4">
             {filteredItems.length} <span className="text-gray-500 font-medium text-sm md:text-base uppercase tracking-wide">Selections</span>
          </span>
        </div>
      </div>

      {filteredItems.length > 0 ? (
        <motion.div 
          layout
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          /* RESPONSIVE GRID LAYOUT - Capped at 3 columns for big touch targets */
          className="
            grid 
            /* Increased Gap on Mobile for safety */
            gap-5 md:gap-8
            grid-cols-1        /* Mobile: 1 Column */
            sm:grid-cols-2     /* Large Phone/Tablet: 2 Columns */
            lg:grid-cols-2     /* Desktop (with Cart open): 2 Columns */
            xl:grid-cols-3     /* Large Desktop: 3 Columns (Max) */
          "
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => (
              <MenuCard 
                key={item.id} 
                item={item} 
                onAdd={() => onAddToCart(item)} 
              />
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        /* Empty State - Instructive & Professional */
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-32 text-center opacity-60"
        >
          <div className="bg-[#2A2A2A] p-6 rounded-full mb-6">
            <AlertCircle size={48} className="text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">No items in this category</h3>
          <p className="text-gray-400 text-lg">Please select a different category from the menu.</p>
        </motion.div>
      )}

      {/* Bottom Scroll Gradient Hint (Visual cue for long lists) */}
      <div className="fixed bottom-0 left-0 w-full h-24 bg-gradient-to-t from-brand-dark to-transparent pointer-events-none md:hidden z-10" />
    </div>
  );
};

export default MenuGrid;