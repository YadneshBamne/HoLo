import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Search, Menu, Handbag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../hooks/useCart';
import Sidebar from './Sidebar';
import SearchModal from './SearchModal';
import CartSidebar from './CartSidebar';
import { Badge } from '@/components/ui/badge';
import SplitText from './SplitText';

export default function Navbar() {
  const { getCartCount } = useCart();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Get cart count - this will trigger re-render when cart changes
  const cartCount = getCartCount();

  // Detect scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav 
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-white border-b border-gray-200 shadow-[0_8px_32px_0_rgba(0,0,0,0.08)] rounded-b-3xl'
            : 'bg-transparent'
        }`}
      >
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left Side - Menu Button & Logo */}
            <div className="flex items-center gap-2">
              {/* Menu Button */}

              {/* Logo */}
              <Link 
                to="/" 
                className={`flex items-center transition-all duration-300 ${
                  isScrolled ? 'scale-100' : 'scale-110'
                }`}
              >
                {/* Logo content */}
              </Link>
            </div>

            {/* Right Side - Search & Cart Icons */}
            <div className="flex items-center gap-1">
              {/* Search Button */}
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 cursor-pointer rounded-full transition-all duration-300 hover:bg-white/20 text-black"
                aria-label="Search"
              >
                <Search className="w-6 h-6" />
              </button>

              {/* Cart Button with Smooth Badge Animation */}
{/* Cart Button - Ultra Smooth */}
<button
  onClick={() => setCartOpen(true)}
  className="relative cursor-pointer p-2 rounded-full transition-all duration-300 hover:bg-white/20 text-black"
  aria-label="Shopping cart"
>
  <Handbag className="w-6 h-6" />
  
  {/* Ultra Smooth Badge */}
  <AnimatePresence>
    {cartCount > 0 && (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ 
          scale: 1,
          transition: {
            type: "spring",
            stiffness: 300,
            damping: 25,
          }
        }}
        exit={{ 
          scale: 0,
          transition: {
            type: "spring",
            stiffness: 300,
            damping: 25,
          }
        }}
        className="absolute -top-1 -right-1"
      >
        <motion.div
          key={cartCount}
          initial={{ scale: 1.3 }}
          animate={{ 
            scale: 1,
            transition: { duration: 0.2 }
          }}
        >
          <Badge className="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums text-xs bg-primary hover:bg-primary-dark text-white flex items-center justify-center">
            {cartCount}
          </Badge>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
</button>

            </div>
          </div>
        </div>
      </nav>

      {/* Left Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Right Cart Sidebar */}
      <CartSidebar isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
