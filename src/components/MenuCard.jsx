import React, { memo, useState } from "react";
import { Plus } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

const MenuCard = ({ item, onAdd }) => {
  const shouldReduceMotion = useReducedMotion();
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isImageError, setIsImageError] = useState(false);

  const handleImageLoad = () => setIsImageLoaded(true);
  const handleImageError = () => {
    setIsImageLoaded(true); // Stop loading state
    setIsImageError(true);
  };

  return (
    <motion.div
      layout
      initial={!shouldReduceMotion ? { opacity: 0, y: 20 } : false}
      animate={{ opacity: 1, y: 0 }}
      exit={!shouldReduceMotion ? { opacity: 0, y: 20 } : false}
      transition={{ duration: 0.3 }}
      onClick={onAdd}
      role="button"
      tabIndex={0}
      aria-label={`Add ${item.name} to order for $${item.price}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onAdd();
        }
      }}
      className="
        group relative flex flex-col gap-3 md:gap-4
        bg-[#1F1F1F] border border-white/5 overflow-hidden
        /* Visual Noise Reduction: Softer shadows */
        shadow-md md:shadow-lg
        /* Responsive Rounded Corners */
        rounded-2xl md:rounded-3xl 
        /* Responsive Padding */
        p-3 md:p-5
        /* Interactive State: Active Scale & Cursor */
        cursor-pointer transition-all duration-200
        active:scale-[0.98] active:bg-[#252525] hover:bg-[#252525]
        focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#111]
      "
    >
      
      {/* Image Section with Skeleton Placeholder */}
      <div className="relative w-full aspect-[4/3] rounded-xl md:rounded-2xl overflow-hidden bg-[#111]">
        
        {/* Loading Skeleton */}
        {!isImageLoaded && (
          <div className="absolute inset-0 bg-[#2A2A2A] animate-pulse" />
        )}

        {!isImageError ? (
          <img
            src={item.image}
            alt="" // Decorative since container has aria-label
            onLoad={handleImageLoad}
            onError={handleImageError}
            className={`
              w-full h-full object-cover transition-all duration-500 group-hover:scale-105
              ${isImageLoaded ? 'opacity-100' : 'opacity-0'}
            `}
            loading="lazy"
          />
        ) : (
          /* Fallback for broken image */
          <div className="absolute inset-0 flex items-center justify-center bg-[#222]">
            <span className="text-gray-600 text-xs">No Image</span>
          </div>
        )}

        {/* Softened Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-40" />
      </div>

      {/* Content Section */}
      <div className="flex flex-col flex-1">
        <div className="flex justify-between items-start gap-3 mb-1">
          <h3 className="text-lg md:text-xl font-bold text-white leading-tight line-clamp-2">
            {item.name}
          </h3>
          {/* Strengthened Price Hierarchy */}
          <span className="text-xl md:text-2xl font-black text-brand-primary tabular-nums shrink-0 leading-none">
            ${item.price}
          </span>
        </div>
        
        <p className="text-gray-400 text-xs md:text-sm line-clamp-2 mb-4 leading-relaxed font-medium">
          {item.description}
        </p>

        {/* Action Button (Visual Affordance) */}
        {/* Note: This is a div to avoid nested button semantics, but looks identical to a button */}
        <div 
          className="
            mt-auto w-full 
            /* Button Height: 48px mobile, 60px desktop */
            h-12 md:h-14
            bg-[#2A2A2A] rounded-xl md:rounded-2xl 
            flex items-center justify-center gap-2 
            text-white group-hover:bg-brand-primary group-hover:text-brand-dark 
            transition-colors duration-300
          "
        >
          <Plus size={20} strokeWidth={3} className="w-5 h-5 md:w-6 md:h-6" />
          <span className="font-bold text-sm md:text-base uppercase tracking-wide">Add to Order</span>
        </div>
      </div>
    </motion.div>
  );
};

export default memo(MenuCard);