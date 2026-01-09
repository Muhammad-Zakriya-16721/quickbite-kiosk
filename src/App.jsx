import { useState, useMemo, useEffect, useCallback } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ShoppingBag, X, ChevronRight } from "lucide-react";

// EXISTING IMPORTS (Unchanged)
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import MenuGrid from "./components/MenuGrid";
import CartPanel from "./components/CartPanel";
import OrderSuccess from "./components/OrderSuccess";

function App() {
  const [category, setCategory] = useState("popular");
  const [cartItems, setCartItems] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMobileCartOpen, setIsMobileCartOpen] = useState(false);
  
  // Motion Preference Hook (Rule #11)
  const shouldReduceMotion = useReducedMotion();

  // 1. Stable Order Number
  const orderNo = useMemo(() => {
    return `#${Math.floor(1000 + Math.random() * 9000)}`;
  }, []);

  // 2. Load Cart (Rule #13: Error Handling)
  useEffect(() => {
    const savedCart = localStorage.getItem("quickbite-cart");
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        console.error("Cart data corrupted, resetting.", e);
        localStorage.removeItem("quickbite-cart");
      }
    }
    setIsLoaded(true);
  }, []);

  // 3. Save Cart & Scroll Lock (Rule #6)
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem("quickbite-cart", JSON.stringify(cartItems));
      } catch (e) {
        console.error("Storage failed", e);
      }
    }
    
    // Lock body scroll when mobile cart is open to prevent background scrolling
    if (isMobileCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [cartItems, isLoaded, isMobileCartOpen]);

  // Derived Totals
  const totalItems = useMemo(() => cartItems.reduce((acc, item) => acc + item.quantity, 0), [cartItems]);
  const totalPrice = useMemo(() => cartItems.reduce((acc, item) => acc + (Number(item.price) * item.quantity), 0), [cartItems]);

  // --- HANDLERS (Memoized per Rule #7) ---

  const handleAddToCart = useCallback((item) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) => 
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  }, []);

  const handleUpdateQuantity = useCallback((id, delta) => {
    setCartItems((prev) => 
      prev.map((item) => {
        if (item.id === id) {
          return { ...item, quantity: Math.max(0, item.quantity + delta) };
        }
        return item;
      }).filter((item) => item.quantity > 0)
    );
  }, []);

  const handleClearCart = useCallback(() => {
    setCartItems([]);
    setIsMobileCartOpen(false);
  }, []);

  const handleCheckout = useCallback(() => {
    setShowSuccess(true);
    setIsMobileCartOpen(false);
  }, []);

  const handleCloseSuccess = useCallback(() => {
    setShowSuccess(false);
    setCartItems([]); 
    localStorage.removeItem("quickbite-cart");
    setCategory("popular");
  }, []);

  // Animation Variants (Respecting Reduced Motion)
  const drawerVariants = {
    hidden: { x: "100%" },
    visible: { x: 0 },
    exit: { x: "100%" }
  };

  const simpleFade = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  return (
    // Rule #1: min-h-[100svh] prevents mobile browser jumpiness. overflow-x-hidden prevents accidental scroll.
    <div className="h-[100svh] w-full bg-brand-dark text-white font-sans overflow-x-hidden flex flex-col md:flex-row">
      
      {/* 1. Sidebar */}
      {/* Rule #2: Visual Separation is handled within Sidebar's own border/shadow */}
      <Sidebar activeCategory={category} onSelectCategory={setCategory} />

      {/* 2. Main Content Area */}
      {/* Rule #3: Single Vertical Scroll Context */}
      <main className="flex-1 flex flex-col h-full relative min-w-0 z-0">
        {/* Rule #4: Header is sticky inside the component, but we ensure z-index here */}
        <div className="relative z-30">
          <Header />
        </div>
        
        {/* SCROLLABLE GRID CONTAINER */}
        <div 
          className="
            flex-1 overflow-y-auto scroll-smooth no-scrollbar relative
            /* Rule #9: Bottom padding logic is inside MenuGrid, but we add extra safety here */
          "
        >
          {/* Scroll Gradient Indicator (Top) - Rule #3 */}
          <div className="fixed top-[88px] left-0 right-0 h-8 bg-gradient-to-b from-brand-dark/20 to-transparent pointer-events-none z-10" />

          <div className="px-4 md:px-8 pt-4">
             {/* Rule #8: Category Transition Wrapper */}
             <AnimatePresence mode="wait">
                <motion.div
                  key={category}
                  initial={!shouldReduceMotion ? { opacity: 0, x: 10 } : { opacity: 0 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={!shouldReduceMotion ? { opacity: 0, x: -10 } : { opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <MenuGrid 
                    selectedCategory={category} 
                    onAddToCart={handleAddToCart} 
                  />
                </motion.div>
             </AnimatePresence>
          </div>

          {/* Scroll Gradient Indicator (Bottom) - Rule #3 */}
          <div className="fixed bottom-20 left-0 right-0 h-12 bg-gradient-to-t from-brand-dark to-transparent pointer-events-none z-10 md:hidden" />
        </div>
      </main>

      {/* 3. DESKTOP Cart Panel */}
      {/* Rule #7: Left border, shadow, entrance animation */}
      <motion.div 
        initial={!shouldReduceMotion ? { x: 20, opacity: 0 } : false}
        animate={{ x: 0, opacity: 1 }}
        className="hidden lg:flex w-[400px] h-full border-l border-white/5 shadow-2xl z-20"
      >
         <CartPanel 
            cartItems={cartItems}
            onUpdateQuantity={handleUpdateQuantity}
            onCheckout={handleCheckout}
            onClearCart={handleClearCart}
            orderNo={orderNo}
         />
      </motion.div>

      {/* 4. MOBILE: Floating "View Cart" Button (FAB) */}
      <AnimatePresence>
        {totalItems > 0 && !isMobileCartOpen && (
          <motion.button
            initial={{ scale: 0, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0, y: 20 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMobileCartOpen(true)}
            // Rule #5 & #9: Safe Area Bottom & Pulse
            className="
              lg:hidden fixed z-40 
              bottom-[calc(6rem+env(safe-area-inset-bottom))] right-4 
              bg-brand-primary text-brand-dark 
              pl-5 pr-6 py-4 rounded-full shadow-2xl shadow-brand-primary/30
              flex items-center gap-3 font-bold text-lg
              border border-white/10 backdrop-blur-sm
            "
          >
            <div className="relative">
              <ShoppingBag size={24} strokeWidth={2.5} />
              <span className="absolute -top-2 -right-2 bg-white text-black text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-brand-primary">
                {totalItems}
              </span>
            </div>
            <span className="tracking-tight">View Cart</span>
            
            {/* Price Tag Bubble */}
            <span className="bg-black/10 px-2 py-1 rounded text-sm font-black tabular-nums">
              ${(totalPrice * 1.1).toFixed(2)}
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* 5. MOBILE: Cart Drawer (Overlay) */}
      <AnimatePresence>
        {isMobileCartOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              variants={simpleFade}
              initial="hidden" animate="visible" exit="exit"
              onClick={() => setIsMobileCartOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 lg:hidden"
            />
            
            {/* Drawer Container */}
            <motion.div
              variants={!shouldReduceMotion ? drawerVariants : simpleFade}
              initial="hidden" animate="visible" exit="exit"
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              // Rule #6: Rounded top-left corner
              className="
                fixed top-0 right-0 h-full w-full sm:w-[420px] z-50 lg:hidden flex flex-col 
                bg-[#1A1A1A] sm:rounded-l-3xl shadow-2xl overflow-hidden
              "
            >
              {/* Drawer Header with Grab Handle Visual */}
              <div className="bg-[#1A1A1A] p-4 flex flex-col items-center border-b border-white/5 relative shrink-0">
                 {/* Rule #6: Grab Handle */}
                 <div className="w-12 h-1.5 bg-white/20 rounded-full mb-4 sm:hidden" />
                 
                 <div className="w-full flex justify-between items-center">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      Current Order <span className="text-gray-500 text-sm font-normal">({totalItems} items)</span>
                    </h2>
                    <button 
                      onClick={() => setIsMobileCartOpen(false)}
                      className="p-3 bg-[#2A2A2A] rounded-full text-white active:scale-95 transition-transform"
                      aria-label="Close cart"
                    >
                      <X size={20} />
                    </button>
                 </div>
              </div>

              {/* Drawer Body - Reusing CartPanel */}
              <div className="flex-1 overflow-hidden relative">
                <CartPanel 
                  cartItems={cartItems}
                  onUpdateQuantity={handleUpdateQuantity}
                  onCheckout={handleCheckout}
                  onClearCart={handleClearCart}
                  orderNo={orderNo}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 6. Order Success Modal - z-[60] handled inside component */}
      <OrderSuccess 
        isOpen={showSuccess} 
        orderNo={orderNo} 
        onClose={handleCloseSuccess} 
        autoCloseMs={8000} 
      />
      
    </div>
  );
}

export default App;