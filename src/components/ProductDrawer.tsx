import { useState, useEffect } from 'react';
import { Heart, ShoppingCart, Package, AlertCircle, Star, Minus, Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../hooks/useCart';
import { useFavorites } from '../hooks/useFavorites';
import { supabase } from '../lib/supabase';
import { Product } from '../lib/types';
import ImageCarousel from './ImageCarousel';
import { Badge } from '@/components/ui/badge';

interface ProductDrawerProps {
  productId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductDrawer({ productId, isOpen, onClose }: ProductDrawerProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();

  useEffect(() => {
    if (productId && isOpen) {
      fetchProduct();
      setQuantity(1);
    }
  }, [productId, isOpen]);

  const fetchProduct = async () => {
    if (!productId) return; 

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*, categories(name), product_images(id, image_url, position)')
        .eq('id', productId)
        .single();

      if (error) throw error;
      setProduct(data);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product && product.stock_status === 'in_stock') {
      addToCart(product, quantity);
      
      const toast = document.createElement('div');
      toast.className = 'fixed top-20 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-[9999] animate-fade-in-down';
      toast.textContent = `✓ Added ${quantity} item(s) to cart!`;
      document.body.appendChild(toast);
      
      setTimeout(() => {
        toast.classList.add('animate-fade-out-up');
        setTimeout(() => toast.remove(), 300);
      }, 2000);

      setQuantity(1);
    }
  };

  const isOutOfStock = product?.stock_status === 'out_of_stock';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-3xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col"
          >
            {/* Handle Bar */}
            <div className="flex justify-center pt-4 pb-2">
              <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
            </div>

            {/* Close Button */}
            {/* <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button> */}

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center h-96">
                  <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                </div>
              ) : product ? (
                <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-6">
                  {/* Image Carousel */}
                  <div className="mb-6 relative">
                    <ImageCarousel
                      images={product.product_images || []}
                      mainImage={product.image_url}
                    />
                    {isOutOfStock && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                        <Badge variant="destructive" className="text-2xl px-8 py-4 transform -rotate-12">
                          OUT OF STOCK
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div>
                    {/* Category & Featured Badge */}
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="outline">
                        {product.categories?.name || 'Uncategorized'}
                      </Badge>
                      {product.is_featured && (
                        <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white">
                          <Star className="w-3 h-3 mr-1 fill-white" />
                          Featured
                        </Badge>
                      )}
                    </div>

                    {/* Product Name */}
                    <h1 className="text-3xl font-bold mb-3">{product.name}</h1>

                    {/* Price */}
                    <div className={`text-3xl font-bold mb-4 ${isOutOfStock ? 'text-gray-400' : 'text-primary'}`}>
                      ₹{product.price}
                    </div>

                    {/* Stock Status */}
                    <div className="mb-4">
                      {isOutOfStock ? (
                        <Badge variant="destructive" className="flex items-center w-fit">
                          <AlertCircle className="w-4 h-4 mr-2" />
                          Out of Stock
                        </Badge>
                      ) : (
                        <Badge className="bg-green-500 hover:bg-green-600 text-white flex items-center w-fit">
                          <Package className="w-4 h-4 mr-2" />
                          In Stock
                        </Badge>
                      )}
                    </div>

                    {isOutOfStock && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <p className="text-red-800 text-sm">
                          This product is currently unavailable. Please check back later.
                        </p>
                      </div>
                    )}

                    {/* Description */}
                    <div className="mb-6">
                      <h2 className="text-lg font-semibold mb-2">Description</h2>
                      <p className="text-gray-600 leading-relaxed">
                        {product.description || 'No description available for this product.'}
                      </p>
                    </div>

                    {/* Quantity Selector */}
                    {!isOutOfStock && (
                      <div className="mb-6">
                        <label className="block text-sm font-semibold mb-3">Quantity</label>
                        <div className="flex items-center space-x-4">
                          <button
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            disabled={quantity <= 1}
                            className="h-10 w-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <Badge className="h-10 min-w-10 rounded-full px-4 font-mono text-xl tabular-nums">
                            {quantity}
                          </Badge>
                          <button
                            onClick={() => setQuantity(quantity + 1)}
                            className="h-10 w-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3 mb-6">
                      <button
                        onClick={handleAddToCart}
                        disabled={isOutOfStock}
                        className={`flex-1 py-4 rounded-xl font-semibold flex items-center justify-center space-x-2 transition-colors ${
                          isOutOfStock
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-primary text-white hover:bg-primary/90'
                        }`}
                      >
                        <ShoppingCart className="w-5 h-5" />
                        <span>{isOutOfStock ? 'Out of Stock' : 'Add to Cart'}</span>
                      </button>

                      <button
                        onClick={() => toggleFavorite(product.id)}
                        className={`w-16 h-16 rounded-xl border-2 flex items-center justify-center transition-colors ${
                          isFavorite(product.id)
                            ? 'border-red-500 bg-red-50'
                            : 'border-gray-300 hover:border-red-500'
                        }`}
                      >
                        <Heart
                          className={`w-6 h-6 ${
                            isFavorite(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Product Details */}
                        {/* <div className="border-t pt-6">
                        <h3 className="font-semibold mb-4">Product Details</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between items-center">
                            <span className="text-gray-600">Category:</span>
                            <Badge variant="secondary">{product.categories?.name || 'N/A'}</Badge>
                            </div>
                            <div className="flex justify-between items-center">
                            <span className="text-gray-600">Product ID:</span>
                            <Badge variant="outline" className="font-mono">
                                {product.id.slice(0, 8)}...
                            </Badge>
                            </div>
                            <div className="flex justify-between items-center">
                            <span className="text-gray-600">Status:</span>
                            {isOutOfStock ? (
                                <Badge variant="destructive">Out of Stock</Badge>
                            ) : (
                                <Badge className="bg-green-500 hover:bg-green-600 text-white">In Stock</Badge>
                            )}
                            </div>
                            <div className="flex justify-between items-center">
                            <span className="text-gray-600">Added:</span>
                            <Badge variant="outline">
                                {new Date(product.created_at).toLocaleDateString()}
                            </Badge>
                            </div>
                        </div>
                        </div> */}
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-96">
                  <p className="text-gray-500">Product not found</p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
