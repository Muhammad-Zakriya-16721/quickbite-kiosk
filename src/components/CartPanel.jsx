// src/components/Cart/CartPanel.jsx
import React, { useMemo, useEffect, useState } from "react";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, AlertCircle } from "lucide-react";
import { motion, AnimatePresence, useAnimation, useReducedMotion } from "framer-motion";

const fmt = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

const CartPanel = ({ cartItems, onUpdateQuantity, onCheckout, onClearCart, orderNo }) => {
  const controls = useAnimation();
  const shouldReduceMotion = useReducedMotion();
  
  // State for Clear Cart Safety Mechanism
  const [isClearConfirming, setIsClearConfirming] = useState(false);

  // Subtle Border Glow Animation (Replaced Heartbeat)
  useEffect(() => {
    if (cartItems.length > 0 && !shouldReduceMotion) {
      controls.start({
        borderColor: ["rgba(255,255,255,0.05)", "rgba(255, 199, 0, 0.5)", "rgba(255,255,255,0.05)"],
        transition: { duration: 0.4, ease: "easeInOut" }
      });
    }
    // Reset confirmation state when cart changes
    if (cartItems.length === 0) setIsClearConfirming(false);
  }, [cartItems, controls, shouldReduceMotion]);

  // Handle Clear Cart Click with Safety Check
  const handleClearClick = () => {
    if (isClearConfirming) {
      onClearCart();
      setIsClearConfirming(false);
    } else {
      setIsClearConfirming(true);
      // Auto-reset confirmation after 3 seconds if not clicked
      setTimeout(() => setIsClearConfirming(false), 3000);
    }
  };

  const subtotal = useMemo(
    () => cartItems.reduce((acc, item) => acc + (Number(item.price) || 0) * item.quantity, 0),
    [cartItems]
  );
  const tax = useMemo(() => subtotal * 0.1, [subtotal]);
  const total = useMemo(() => subtotal + tax, [subtotal, tax]);

  return (
    <motion.aside 
      id="cart-panel" 
      animate={controls}
      className="
        w-full h-full flex flex-col bg-[#1A1A1A] border-l border-white/5 relative z-40
        /* Adjusted Shadow: shadow-md mobile, shadow-2xl desktop */
        shadow-md md:shadow-2xl
        pb-[env(safe-area-inset-bottom)]
      "
    >
      <div aria-live="polite" className="sr-only">
        Total {fmt.format(total)}
      </div>

      {/* HEADER */}
      <div className="p-4 md:p-6 border-b border-white/5 flex items-center justify-between bg-[#1A1A1A]">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">My Order</h2>
          <p className="text-gray-500 text-xs mt-1 font-medium tracking-wider uppercase">
            Order {orderNo}
          </p>
        </div>
        
        {cartItems.length > 0 ? (
          <button 
            type="button"
            onClick={handleClearClick}
            aria-label={isClearConfirming ? "Confirm clear cart" : "Clear all items"}
            className={`
              p-3 rounded-xl border transition-all active:scale-95 flex items-center gap-2
              focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#1A1A1A]
              /* Safety Visual State */
              ${isClearConfirming 
                ? "bg-red-600 border-red-500 text-white w-auto px-4" 
                : "bg-[#2A2A2A] border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white"
              }
            `}
          >
             {isClearConfirming ? (
               <>
                 <span className="text-sm font-bold">Confirm?</span>
               </>
             ) : (
               <Trash2 size={20} />
             )}
          </button>
        ) : (
          <div className="bg-brand-dark p-3 rounded-xl border border-white/5">
             <ShoppingBag size={20} className="text-brand-primary" />
          </div>
        )}
      </div>

      {/* ITEMS LIST */}
      <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-3 no-scrollbar">
        {/* Removed mode="popLayout" to reduce jumps */}
        <AnimatePresence>
          {cartItems.length === 0 ? (
            <motion.div 
              initial={!shouldReduceMotion ? { opacity: 0 } : false} 
              animate={{ opacity: 1 }} 
              className="h-full flex flex-col items-center justify-center text-center p-8 opacity-40"
            >
              <ShoppingBag size={48} className="mb-4 text-gray-600 md:w-16 md:h-16" strokeWidth={1} />
              <p className="text-base md:text-lg font-bold text-gray-400">Your tray is empty</p>
              <p className="text-xs md:text-sm text-gray-500">Tap items to add them here</p>
            </motion.div>
          ) : (
            cartItems.map((item) => (
              <CartItem key={item.id} item={item} onUpdateQuantity={onUpdateQuantity} shouldReduceMotion={shouldReduceMotion} />
            ))
          )}
        </AnimatePresence>
      </div>

      {/* FOOTER */}
      <div className="p-4 md:p-6 bg-[#1A1A1A] border-t border-white/5 mt-auto">
        <div className="space-y-2 md:space-y-3 mb-4 md:mb-6">
          <div className="flex justify-between text-gray-400 text-xs md:text-sm">
            <span>Subtotal</span>
            <span className="tabular-nums">{fmt.format(subtotal)}</span>
          </div>
          <div className="flex justify-between text-gray-400 text-xs md:text-sm">
            <span>Tax (10%)</span>
            <span className="tabular-nums">{fmt.format(tax)}</span>
          </div>
          <div className="flex justify-between text-white text-lg md:text-xl font-bold pt-3 md:pt-4 border-t border-white/10">
            <span>Total</span>
            <span className="text-brand-primary tabular-nums">{fmt.format(total)}</span>
          </div>
        </div>

        <button 
          type="button"
          onClick={onCheckout}
          disabled={cartItems.length === 0}
          className="
            w-full bg-brand-primary rounded-xl md:rounded-2xl 
            flex items-center justify-between px-6 md:px-8 text-brand-dark font-black text-base md:text-lg 
            hover:brightness-110 active:scale-95 transition-all 
            disabled:opacity-50 disabled:cursor-not-allowed group
            focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#1A1A1A]
            /* Increased Vertical Padding: py-4 mobile, py-5 desktop */
            py-4 md:py-5
          "
        >
          <span>Pay Now</span>
          <span className="bg-black/10 p-2 rounded-full group-hover:bg-black/20 transition-colors">
            <ArrowRight size={20} />
          </span>
        </button>
      </div>
    </motion.aside>
  );
};

const CartItem = React.memo(({ item, onUpdateQuantity, shouldReduceMotion }) => {
  const handleImageError = (e) => {
    e.target.style.display = 'none';
  };

  return (
    <motion.div
      layout
      initial={!shouldReduceMotion ? { opacity: 0, x: 20 } : false}
      animate={{ opacity: 1, x: 0 }}
      exit={!shouldReduceMotion ? { opacity: 0, x: -20 } : false}
      className="bg-[#1F1F1F] p-3 rounded-2xl flex gap-3 border border-white/5 group"
    >
      <img 
        src={item.image} 
        alt={item.name} 
        onError={handleImageError}
        className="w-16 h-16 md:w-20 md:h-20 rounded-xl object-cover bg-black/20" 
        loading="lazy" 
      />
      
      <div className="flex-1 flex flex-col justify-between py-1">
        <div className="flex justify-between items-start gap-2">
          <h4 className="text-white font-bold text-sm md:text-base line-clamp-2 leading-tight">{item.name}</h4>
          {/* Strengthened Visual Hierarchy for Price */}
          <span className="text-brand-primary font-bold text-base md:text-lg tabular-nums">
            {fmt.format((Number(item.price)||0) * item.quantity)}
          </span>
        </div>

        <div className="flex items-center gap-3 mt-2">
          <button 
            type="button"
            onClick={() => onUpdateQuantity(item.id, -1)}
            aria-label="Decrease quantity"
            className="
              /* Increased Button Size: w-10 h-10 mobile, w-11 h-11 desktop */
              w-10 h-10 md:w-11 md:h-11 
              rounded-xl bg-[#2A2A2A] flex items-center justify-center text-gray-400 
              hover:text-white hover:bg-[#333] transition-colors
              focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary
            "
          >
            {item.quantity === 1 ? <Trash2 size={18} /> : <Minus size={18} />}
          </button>
          
          <span className="text-white font-bold w-6 text-center text-sm md:text-base tabular-nums">
            {item.quantity}
          </span>
          
          <button 
             type="button"
             onClick={() => onUpdateQuantity(item.id, 1)}
             aria-label="Increase quantity"
             className="
                /* Increased Button Size */
                w-10 h-10 md:w-11 md:h-11
                rounded-xl bg-[#2A2A2A] flex items-center justify-center text-gray-400 
                hover:text-white hover:bg-[#333] transition-colors
                focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary
             "
          >
            <Plus size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  );
});

export default CartPanel;