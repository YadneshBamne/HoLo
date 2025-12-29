import { Heart, ShoppingCart, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSwipeable } from 'react-swipeable';
import { Product } from '../lib/types';
import { useCart } from '../hooks/useCart';
import { useFavorites } from '../hooks/useFavorites';
import { Badge } from '@/components/ui/badge';

interface ProductCardProps {
  product: Product;
  onOpenDrawer: (productId: string) => void;
}

export default function ProductCard({ product, onOpenDrawer }: ProductCardProps) {
  const { addToCart } = useCart();
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

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) {
      alert('This product is currently out of stock');
      return;
    }
    addToCart(product);
    
    const toast = document.createElement('div');
    toast.className = 'fixed top-20 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-[9999] animate-fade-in-down';
    toast.textContent = '✓ Added to cart!';
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
    <div 
      onClick={() => onOpenDrawer(product.id)}
      className="card overflow-hidden group relative cursor-pointer"
    >
      {/* Out of Stock Overlay */}
      {isOutOfStock && (
        <div className="absolute inset-0 bg-black/50 z-10 flex items-center justify-center">
          <Badge variant="destructive" className="text-lg px-6 py-3 transform -rotate-12">
            OUT OF STOCK
          </Badge>
        </div>
      )}

      {/* Image Carousel */}
      <div 
        {...swipeHandlers}
        className="relative h-64 overflow-hidden bg-gray-100 select-none"
      >
        {allImages.length > 0 ? (
          <>
            <AnimatePresence mode="wait">
              <motion.img
                key={currentImageIndex}
                src={allImages[currentImageIndex]}
                alt={product.name}
                className={`w-full h-full object-cover p-2 ${
                  isOutOfStock ? 'opacity-50' : ''
                }`}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.3 }}
                draggable={false}
              />
            </AnimatePresence>

            {/* Navigation Arrows */}
            {hasMultipleImages && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-20 shadow-lg"
                >
                  <ChevronLeft className="w-4 h-4 text-gray-800" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-20 shadow-lg"
                >
                  <ChevronRight className="w-4 h-4 text-gray-800" />
                </button>

                {/* Dot Indicators */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1.5 z-20">
                  {allImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentImageIndex(index);
                      }}
                      className={`w-1.5 h-1.5 rounded-full transition-all ${
                        index === currentImageIndex 
                          ? 'bg-white w-4' 
                          : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>

                {/* Image Counter Badge */}
                <Badge className="absolute top-2 right-2 h-6 rounded-full px-2 font-mono text-xs">
                  {currentImageIndex + 1} / {allImages.length}
                </Badge>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}

        {/* Featured Star Icon */}
        {product.is_featured && !isOutOfStock && (
          <div className="absolute top-2 left-2  rounded-full p-2  z-20">
            <Star className="w-8 h-8 text-white fill-yellow-400" />
          </div>
        )}

        {/* Stock Status Badge */}
        {isOutOfStock && (
          <Badge variant="destructive" className="absolute top-2 left-2 z-20">
            Out of Stock
          </Badge>
        )}

        {/* Favorite Button */}
        <button
          onClick={handleToggleFavorite}
          className="absolute top-2 right-2 bg-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-20"
        >
          <Heart
            className={`w-5 h-5 ${
              isFavorite(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'
            }`}
          />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        <Badge variant="outline" className="mb-2 text-xs">
          {product.categories?.name || 'Uncategorized'}
        </Badge>
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description || 'No description available'}
        </p>
        
        <div className="flex items-center justify-between">
          <span className={`text-2xl font-bold ${isOutOfStock ? 'text-gray-400' : 'text-primary'}`}>
            ₹{product.price}
          </span>
          
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
              isOutOfStock
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-primary text-white hover:bg-primary/90'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>{isOutOfStock ? 'Unavailable' : 'Add'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
