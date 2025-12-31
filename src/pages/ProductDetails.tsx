import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Heart, ShoppingCart, Package, Minus, Plus, ArrowLeft, Loader2 } from 'lucide-react';
import { useSwipeable } from 'react-swipeable';
import { useCart } from '../hooks/useCart';
import { useFavorites } from '../hooks/useFavorites';
import { supabase } from '../lib/supabase';
import { Product } from '../lib/types';

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // ✅ Call ALL hooks at the top level BEFORE any early returns
  const { addToCart, isInCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });

  // Fetch product data
  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*, categories(name), product_images(image_url, position)')
        .eq('id', id)
        .single();

      if (error) throw error;
      setProduct(data);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate image-related values safely
  const allImages = product?.product_images && product.product_images.length > 0
    ? product.product_images.sort((a, b) => a.position - b.position).map(img => img.image_url)
    : product?.image_url 
    ? [product.image_url]
    : [];

  const hasMultipleImages = allImages.length > 1;
  const isOutOfStock = product?.stock_status === 'out_of_stock';
  const inCart = product ? isInCart(product.id) : false;
  const isFav = product ? isFavorite(product.id) : false;

  // Handle image load to get dimensions
  useEffect(() => {
    if (product && allImages.length > 0) {
      const img = new Image();
      img.src = allImages[currentImageIndex];
      img.onload = () => {
        setImageDimensions({
          width: img.naturalWidth,
          height: img.naturalHeight,
        });
        setImageLoaded(true);
      };
    }
  }, [currentImageIndex, product, allImages]);

  // Calculate container aspect ratio
  const aspectRatio = imageDimensions.width / imageDimensions.height || 1;
  const maxHeight = 600;
  const containerHeight = aspectRatio > 1 
    ? Math.min(maxHeight, imageDimensions.height)
    : maxHeight;

  const nextImage = () => {
    setImageLoaded(false);
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setImageLoaded(false);
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => hasMultipleImages && nextImage(),
    onSwipedRight: () => hasMultipleImages && prevImage(),
    trackMouse: true,
    preventScrollOnSwipe: true,
  });

  const handleAddToCart = () => {
    if (isOutOfStock || !product) return;
    addToCart(product, quantity);
    
    const toast = document.createElement('div');
    toast.className = 'fixed top-20 right-4 bg-gradient-to-r from-[#D8A1A5] to-[#E8B4B8] text-white px-6 py-4 rounded-2xl shadow-xl z-[9999] animate-fade-in-down backdrop-blur-sm font-semibold flex items-center gap-2';
    toast.innerHTML = `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg><span>Added ${quantity} to cart!</span>`;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.classList.add('animate-fade-out-up');
      setTimeout(() => toast.remove(), 300);
    }, 2000);
  };

  const handleToggleFavorite = () => {
    if (!product) return;
    toggleFavorite(product.id);
  };

  const incrementQuantity = () => setQuantity(q => q + 1);
  const decrementQuantity = () => setQuantity(q => Math.max(1, q - 1));

  // NOW it's safe to do early returns - all hooks are called above
  if (loading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{
          background: 'linear-gradient(135deg, #FFF5F7 0%, #FFE8EC 50%, #FFF0F3 100%)',
        }}
      >
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#D8A1A5] animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{
          background: 'linear-gradient(135deg, #FFF5F7 0%, #FFE8EC 50%, #FFF0F3 100%)',
        }}
      >
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
          <p className="text-gray-600 mb-6">This product doesn't exist or has been removed</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/')}
            className="px-6 py-3 rounded-2xl text-white font-bold"
            style={{
              background: 'linear-gradient(135deg, #D8A1A5 0%, #E8B4B8 100%)',
              boxShadow: '0 8px 24px rgba(216, 161, 165, 0.35)',
            }}
          >
            Back to Home
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen py-8 px-4 sm:px-6 lg:px-8"
      style={{
        background: 'linear-gradient(135deg, #FFF5F7 0%, #FFE8EC 50%, #FFF0F3 100%)',
      }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.05, x: -5 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(-1)}
          className="mb-6 px-4 py-2 rounded-2xl flex items-center gap-2 font-bold text-[#D8A1A5]"
          style={{
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(12px)',
            border: '1.5px solid rgba(216, 161, 165, 0.25)',
          }}
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Section */}
          <div className="relative">
            <motion.div
              {...swipeHandlers}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative overflow-hidden rounded-[28px] select-none"
              style={{
                background: 'rgba(255, 255, 255, 0.75)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1.5px solid rgba(216, 161, 165, 0.25)',
                boxShadow: '0 12px 40px rgba(216, 161, 165, 0.12)',
                height: imageLoaded ? `${containerHeight}px` : '600px',
                transition: 'height 0.3s ease-out',
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
                      animate={{ opacity: imageLoaded ? 1 : 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      onLoad={() => setImageLoaded(true)}
                      className="w-full h-full object-contain"
                      style={{
                        filter: isOutOfStock ? 'grayscale(100%)' : 'none',
                      }}
                      draggable={false}
                    />
                  </AnimatePresence>

                  {!imageLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Loader2 className="w-12 h-12 text-[#D8A1A5] animate-spin" />
                    </div>
                  )}

                  {hasMultipleImages && !isOutOfStock && (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.1, x: -2 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full p-3 z-20"
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
                        className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-3 z-20"
                        style={{
                          background: 'rgba(255, 255, 255, 0.95)',
                          backdropFilter: 'blur(12px)',
                          boxShadow: '0 4px 16px rgba(216, 161, 165, 0.25)',
                          border: '1.5px solid rgba(216, 161, 165, 0.2)',
                        }}
                      >
                        <ChevronRight className="w-5 h-5 text-[#D8A1A5]" strokeWidth={3} />
                      </motion.button>

                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-20 bg-black/20 backdrop-blur-md rounded-full px-3 py-2">
                        {allImages.map((_, index) => (
                          <motion.button
                            key={index}
                            whileHover={{ scale: 1.3 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => {
                              setImageLoaded(false);
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

                  {!isOutOfStock && (
                    <motion.div
                      initial={{ scale: 0, x: -50 }}
                      animate={{ scale: 1, x: 0 }}
                      className="absolute top-4 left-4 px-4 py-2 rounded-2xl flex items-center gap-2 z-20"
                      style={{
                        background: 'linear-gradient(135deg, rgba(219, 164, 168, 0.95) 0%, rgba(200, 140, 145, 0.95) 100%)',

                        backdropFilter: 'blur(12px)',
                        boxShadow: '0 8px 30px rgba(219, 164, 168, 0.35)',
                      }}
                    >
                      <Package className="w-4 h-4 text-white" />
                      <span className="text-white text-sm font-bold">In Stock & Ready to Ship</span>
                    </motion.div>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <Package className="w-16 h-16 mx-auto mb-3 opacity-30" />
                    <p className="font-medium">No Image Available</p>
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* Product Info Section */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-[28px] p-8"
              style={{
                background: 'rgba(255, 255, 255, 0.75)',
                backdropFilter: 'blur(16px)',
                border: '1.5px solid rgba(216, 161, 165, 0.25)',
                boxShadow: '0 12px 40px rgba(216, 161, 165, 0.12)',
              }}
            >
              <div 
                className="inline-flex items-center mb-4 px-4 py-1.5 rounded-full text-xs font-bold"
                style={{
                  background: 'linear-gradient(135deg, rgba(216, 161, 165, 0.15) 0%, rgba(232, 180, 184, 0.1) 100%)',
                  color: '#D8A1A5',
                  border: '1.5px solid rgba(216, 161, 165, 0.25)',
                }}
              >
                {product.categories?.name || 'Uncategorized'}
              </div>

              <h1 className="text-4xl font-black text-gray-900 mb-3 leading-tight tracking-tight">
                {product.name}
              </h1>

              <div className="mb-6">
                <span className="text-sm text-gray-500 font-medium">Price</span>
                <div className="text-5xl font-black text-[#D8A1A5] tracking-tight">
                  ₹{product.price}
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-black text-gray-900 mb-3">Description</h3>
                <p className="text-gray-600 leading-relaxed">
                  {product.description || 'Beautifully handcrafted with love and care'}
                </p>
              </div>

              {!isOutOfStock && (
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Quantity</h3>
                  <div className="flex items-center gap-3">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={decrementQuantity}
                      className="rounded-2xl p-3"
                      style={{
                        background: 'rgba(255, 255, 255, 0.8)',
                        border: '1.5px solid rgba(216, 161, 165, 0.25)',
                      }}
                    >
                      <Minus className="w-5 h-5 text-[#D8A1A5]" strokeWidth={3} />
                    </motion.button>
                    <div 
                      className="px-8 py-3 rounded-2xl text-xl font-black text-gray-900 min-w-[80px] text-center"
                      style={{
                        background: 'rgba(255, 255, 255, 0.8)',
                        border: '1.5px solid rgba(216, 161, 165, 0.25)',
                      }}
                    >
                      {quantity}
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={incrementQuantity}
                      className="rounded-2xl p-3"
                      style={{
                        background: 'rgba(255, 255, 255, 0.8)',
                        border: '1.5px solid rgba(216, 161, 165, 0.25)',
                      }}
                    >
                      <Plus className="w-5 h-5 text-[#D8A1A5]" strokeWidth={3} />
                    </motion.button>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <motion.button
                  whileHover={{ scale: isOutOfStock ? 1 : 1.02 }}
                  whileTap={{ scale: isOutOfStock ? 1 : 0.98 }}
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className={`flex-1 px-8 py-4 rounded-2xl flex items-center justify-center gap-3 font-bold text-white shadow-lg ${
                    isOutOfStock ? 'cursor-not-allowed opacity-50' : 'hover:shadow-xl'
                  }`}
                  style={{
                    background: isOutOfStock
                      ? 'linear-gradient(135deg, #9CA3AF 0%, #6B7280 100%)'
                      : 'linear-gradient(135deg, #D8A1A5 0%, #E8B4B8 100%)',
                    boxShadow: isOutOfStock ? 'none' : '0 8px 24px rgba(216, 161, 165, 0.35)',
                  }}
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>{isOutOfStock ? 'Out of Stock' : inCart ? 'Add More' : 'Add to Cart'}</span>
                </motion.button>

                {!isOutOfStock && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleToggleFavorite}
                    className="rounded-2xl p-4"
                    style={{
                      background: 'rgba(255, 255, 255, 0.8)',
                      backdropFilter: 'blur(12px)',
                      border: '1.5px solid rgba(216, 161, 165, 0.25)',
                    }}
                  >
                    <Heart
                      className={`w-6 h-6 transition-all ${
                        isFav 
                          ? 'fill-[#D8A1A5] text-[#D8A1A5]' 
                          : 'text-gray-400'
                      }`}
                      strokeWidth={2.5}
                    />
                  </motion.button>
                )}
              </div>

              <div 
                className="mt-8 p-6 rounded-2xl"
                style={{
                  background: 'rgba(255, 255, 255, 0.5)',
                  border: '1.5px solid rgba(216, 161, 165, 0.15)',
                }}
              >
                <h3 className="text-xl font-black text-gray-900 mb-4">Product Details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">Category:</span>
                    <span className="text-gray-900 font-bold">{product.categories?.name || 'Uncategorized'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">Status:</span>
                    <span className={`font-bold ${isOutOfStock ? 'text-red-500' : 'text-green-600'}`}>
                      {isOutOfStock ? 'Out of Stock' : 'In Stock'}
                    </span>
                  </div>
                  {product.created_at && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 font-medium">Added:</span>
                      <span className="text-gray-900 font-bold">
                        {new Date(product.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
