import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Search, Menu } from 'lucide-react';
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
            ? 'bg-white/10 backdrop-blur-xl border-b border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] rounded-b-3xl' 
            : 'bg-transparent'
        }`}
        style={isScrolled ? {
          backdropFilter: 'blur(16px) saturate(180%)',
          WebkitBackdropFilter: 'blur(16px) saturate(180%)',
        } : {}}
      >
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left Side - Menu Button & Logo (No gap between them) */}
            <div className="flex items-center gap-2">
              {/* Menu Button */}


              {/* Logo Image - Right beside menu */}
              <Link 
                to="/" 
                className={`flex items-center transition-all duration-300 ${
                  isScrolled ? 'scale-100' : 'scale-110'
                }`}
              >
                {/* <SplitText
  text="Hooks on Loops"
  className="text-2xl font-f4 ml-10 font-semibold text-center"
  delay={100}
  duration={0.6}
  ease="power3.out"
  splitType="chars"
  from={{ opacity: 0, y: 40 }}
  to={{ opacity: 1, y: 0 }}
  threshold={0.1}
  rootMargin="-100px"
  textAlign="center"
/> */}
              </Link>
            </div>

            {/* Right Side - Search & Cart Icons (Far right corner) */}
            <div className="flex items-center gap-1">
              {/* Search Button */}
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 cursor-pointer rounded-full transition-all duration-300 hover:bg-white/20 text-black"
                aria-label="Search"
              >
                <Search className="w-6 h-6" />
              </button>

              {/* Cart Button with Badge */}
              <button
                onClick={() => setCartOpen(true)}
                className="relative cursor-pointer p-2 rounded-full transition-all duration-300 hover:bg-white/20 text-black"
                aria-label="Shopping cart"
              >
                <ShoppingCart className="w-6 h-6" />
                {getCartCount() > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 min-w-5 rounded-full px-1 font-mono tabular-nums text-xs bg-primary hover:bg-primary-dark text-white">
                    {getCartCount()}
                  </Badge>
                )}
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
