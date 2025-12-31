import { Heart, ShoppingCart, ChevronLeft, ChevronRight, Star, PackageX, Check } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSwipeable } from 'react-swipeable';
import { useNavigate } from 'react-router-dom';
import { Product } from '../lib/types';
import { useCart } from '../hooks/useCart';
import { useFavorites } from '../hooks/useFavorites';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const navigate = useNavigate();
  const { addToCart, isInCart, getItemQuantity } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Get all images
  const allImages = product.product_images && product.product_images.length > 0
    ? product.product_images.sort((a, b) => a.position - b.position).map(img => img.image_url)
    : product.image_url 
    ? [product.image_url]
    : [];

  const hasMultipleImages = allImages.length > 1;
  const isOutOfStock = product.stock_status === 'out_of_stock';
  const inCart = isInCart(product.id);
  const cartQuantity = getItemQuantity(product.id);

  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  // Swipe handlers
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => hasMultipleImages && nextImage(),
    onSwipedRight: () => hasMultipleImages && prevImage(),
    trackMouse: true,
    preventScrollOnSwipe: true,
  });

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) {
      const toast = document.createElement('div');
      toast.className = 'fixed top-20 right-4 bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-2xl shadow-xl z-[9999] animate-fade-in-down backdrop-blur-sm font-semibold';
      toast.textContent = '⚠ This product is out of stock';
      document.body.appendChild(toast);
      setTimeout(() => {
        toast.classList.add('animate-fade-out-up');
        setTimeout(() => toast.remove(), 300);
      }, 2500);
      return;
    }
    addToCart(product);
    
    const toast = document.createElement('div');
    toast.className = 'fixed top-20 right-4 bg-gradient-to-r from-[#D8A1A5] to-[#E8B4B8] text-white px-6 py-4 rounded-2xl shadow-xl z-[9999] animate-fade-in-down backdrop-blur-sm font-semibold flex items-center gap-2';
    toast.innerHTML = '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg><span>Added to cart!</span>';
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.classList.add('animate-fade-out-up');
      setTimeout(() => toast.remove(), 300);
    }, 2000);
  };

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await toggleFavorite(product.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -10, transition: { duration: 0.3 } }}
      onClick={handleCardClick}
      className="relative cursor-pointer rounded-[28px] overflow-hidden group w-full max-w-md"
      style={{
        background: 'rgba(255, 255, 255, 0.75)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1.5px solid rgba(216, 161, 165, 0.25)',
        boxShadow: '0 12px 40px rgba(216, 161, 165, 0.12), 0 4px 12px rgba(0, 0, 0, 0.03)',
      }}
    >
      {/* Out of Stock Overlay */}
      <AnimatePresence>
        {isOutOfStock && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-10 flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.75) 0%, rgba(0, 0, 0, 0.85) 100%)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <motion.div
              initial={{ scale: 0.8, rotate: -5 }}
              animate={{ scale: 1, rotate: 0 }}
              className="text-center space-y-3"
            >
              <div className="flex justify-center">
                <div className="bg-white/10 backdrop-blur-md rounded-full p-4">
                  <PackageX className="w-12 h-12 text-white" strokeWidth={2} />
                </div>
              </div>
              <div 
                className="px-8 py-3 rounded-2xl font-black text-lg tracking-wide"
                style={{
                  background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                  color: 'white',
                  boxShadow: '0 8px 24px rgba(239, 68, 68, 0.4)',
                }}
              >
                OUT OF STOCK
              </div>
              <p className="text-white/80 text-sm font-medium">Currently Unavailable</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image Carousel - Full Size */}
      <div 
        {...swipeHandlers}
        className="relative h-96 overflow-hidden select-none"
        style={{
          background: 'linear-gradient(135deg, #FFF5F7 0%, #FFE8EC 50%, #FFF0F3 100%)',
        }}
      >
        {allImages.length > 0 ? (
          <>
            <AnimatePresence mode="wait">
              <motion.img
                key={currentImageIndex}
                src={allImages[currentImageIndex]}
                alt={product.name}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className={`w-full h-full object-cover ${
                  isOutOfStock ? 'opacity-30 grayscale' : 'group-hover:scale-105'
                } transition-all duration-500`}
                draggable={false}
                style={{
                  filter: isOutOfStock ? 'grayscale(100%)' : 'none',
                }}
              />
            </AnimatePresence>

            {/* Navigation Arrows */}
            {hasMultipleImages && !isOutOfStock && (
              <>
                <motion.button
                  whileHover={{ scale: 1.1, x: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all z-20 rounded-full p-3"
                  style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(12px)',
                    boxShadow: '0 4px 16px rgba(216, 161, 165, 0.25)',
                    border: '1.5px solid rgba(216, 161, 165, 0.2)',
                  }}
                >
                  <ChevronLeft className="w-5 h-5 text-[#D8A1A5]" strokeWidth={3} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1, x: 2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all z-20 rounded-full p-3"
                  style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(12px)',
                    boxShadow: '0 4px 16px rgba(216, 161, 165, 0.25)',
                    border: '1.5px solid rgba(216, 161, 165, 0.2)',
                  }}
                >
                  <ChevronRight className="w-5 h-5 text-[#D8A1A5]" strokeWidth={3} />
                </motion.button>

                {/* Dot Indicators */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-20 bg-black/20 backdrop-blur-md rounded-full px-3 py-2">
                  {allImages.map((_, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.3 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentImageIndex(index);
                      }}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        index === currentImageIndex 
                          ? 'bg-white w-8' 
                          : 'bg-white/50 w-2 hover:bg-white/75'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-pink-300">
            <PackageX className="w-16 h-16 mb-3 opacity-50" />
            <p className="font-medium">No Image Available</p>
          </div>
        )}

        {/* Featured Star Icon */}
        {product.is_featured && !isOutOfStock && (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 12 }}
            className="absolute top-4 left-4 rounded-2xl p-2.5 z-20"
            style={{
              background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.25) 0%, rgba(245, 158, 11, 0.25) 100%)',
              backdropFilter: 'blur(12px)',
              boxShadow: '0 4px 16px rgba(251, 191, 36, 0.2)',
              border: '1.5px solid rgba(251, 191, 36, 0.3)',
            }}
          >
            <Star className="w-6 h-6 text-amber-500 fill-amber-400" strokeWidth={2.5} />
          </motion.div>
        )}

        {/* In Cart Badge - NEW */}
        {inCart && !isOutOfStock && (
          <motion.div
            initial={{ scale: 0, x: 50 }}
            animate={{ scale: 1, x: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="absolute top-4 right-4 rounded-2xl p-2.5 z-20 flex items-center gap-2"
            style={{
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.95) 0%, rgba(5, 150, 105, 0.95) 100%)',
              backdropFilter: 'blur(12px)',
              boxShadow: '0 4px 16px rgba(16, 185, 129, 0.4)',
              border: '1.5px solid rgba(255, 255, 255, 0.3)',
            }}
          >
            <Check className="w-4 h-4 text-white" strokeWidth={3} />
            <span className="text-white text-xs font-bold">{cartQuantity}</span>
          </motion.div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Category Badge */}
        <div 
          className="inline-flex items-center mb-4 px-4 py-1.5 rounded-full text-xs font-bold tracking-wide"
          style={{
            background: 'linear-gradient(135deg, rgba(216, 161, 165, 0.15) 0%, rgba(232, 180, 184, 0.1) 100%)',
            color: '#D8A1A5',
            border: '1.5px solid rgba(216, 161, 165, 0.25)',
          }}
        >
          {product.categories?.name || 'Uncategorized'}
        </div>
        
        {/* Product Name with Favorite Button */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="font-black text-xl flex-1 line-clamp-2 text-gray-900 leading-tight tracking-tight">
            {product.name}
          </h3>
          
          {/* Favorite Button - Next to Title */}
          {!isOutOfStock && (
            <motion.button
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleToggleFavorite}
              className="rounded-full p-2.5 flex-shrink-0"
              style={{
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(12px)',
                boxShadow: '0 4px 12px rgba(216, 161, 165, 0.15)',
                border: '1.5px solid rgba(216, 161, 165, 0.2)',
              }}
            >
              <Heart
                className={`w-5 h-5 transition-all duration-300 ${
                  isFavorite(product.id) 
                    ? 'fill-[#D8A1A5] text-[#D8A1A5]' 
                    : 'text-gray-400 hover:text-[#D8A1A5]'
                }`}
                strokeWidth={2.5}
              />
            </motion.button>
          )}
        </div>
        
        {/* Description */}
        <p className="text-gray-600 text-sm mb-6 line-clamp-2 leading-relaxed">
          {product.description || 'Beautifully handcrafted with love and care'}
        </p>
        
        {/* Price and CTA */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 font-medium mb-1">Price</span>
            <span className={`text-3xl font-black tracking-tight ${isOutOfStock ? 'text-gray-400 line-through' : 'text-[#D8A1A5]'}`}>
              ₹{product.price}
            </span>
          </div>
          
          <motion.button
            whileHover={{ scale: isOutOfStock ? 1 : 1.05 }}
            whileTap={{ scale: isOutOfStock ? 1 : 0.95 }}
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`px-6 py-3.5 rounded-2xl flex items-center gap-2.5 transition-all font-bold text-sm shadow-lg ${
              isOutOfStock
                ? 'bg-gradient-to-r from-gray-200 to-gray-300 text-gray-500 cursor-not-allowed'
                : 'text-white hover:shadow-xl'
            }`}
            style={
              !isOutOfStock
                ? {
                    background: inCart 
                      ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
                      : 'linear-gradient(135deg, #D8A1A5 0%, #E8B4B8 100%)',
                    boxShadow: inCart
                      ? '0 8px 24px rgba(16, 185, 129, 0.35)'
                      : '0 8px 24px rgba(216, 161, 165, 0.35)',
                  }
                : undefined
            }
          >
            {isOutOfStock ? (
              <>
                <PackageX className="w-4 h-4" />
                <span>Unavailable</span>
              </>
            ) : inCart ? (
              <>
                <Check className="w-4 h-4" strokeWidth={3} />
                <span>Add More</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" />
                <span>Add to Cart</span>
              </>
            )}
          </motion.button>
        </div>
      </div>

      {/* Animated Border Glow on Hover */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-[28px]"
        style={{
          background: 'linear-gradient(135deg, transparent 0%, rgba(216, 161, 165, 0.08) 50%, transparent 100%)',
        }}
      />
    </motion.div>
  );
}
