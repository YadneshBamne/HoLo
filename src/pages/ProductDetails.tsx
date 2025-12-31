import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, ArrowLeft, Package, AlertCircle, Star, ChevronLeft, Minus, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProduct } from '../hooks/useProducts';
import { useCart } from '../hooks/useCart';
import { useFavorites } from '../hooks/useFavorites';
import ImageCarousel from '../components/ImageCarousel';

export default function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { product, loading } = useProduct(id!);
    const [quantity, setQuantity] = useState(1);
    const { addToCart } = useCart();
    const { toggleFavorite, isFavorite, loading: favLoading } = useFavorites();

    const handleAddToCart = () => {
        if (product && product.stock_status === 'in_stock') {
            addToCart(product, quantity);
            
            const toast = document.createElement('div');
            toast.className = 'fixed top-20 right-4 bg-gradient-to-r from-[#D8A1A5] to-[#E8B4B8] text-white px-6 py-4 rounded-2xl shadow-xl z-[9999] animate-fade-in-down backdrop-blur-sm font-semibold flex items-center gap-2';
            toast.innerHTML = '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg><span>Added to cart!</span>';
            document.body.appendChild(toast);
            
            setTimeout(() => {
                toast.classList.add('animate-fade-out-up');
                setTimeout(() => toast.remove(), 300);
            }, 2000);
        }
    };

    if (loading) {
        return (
            <div 
                className="min-h-screen"
                style={{
                    background: 'linear-gradient(180deg, #FFFFFF 0%, #FCE7F3 50%, #FFF0F3 100%)',
                }}
            >
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="animate-pulse">
                        <div className="h-12 w-32 bg-gradient-to-r from-pink-200 to-pink-100 rounded-2xl mb-8" />
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            <div className="h-[600px] bg-gradient-to-br from-pink-100 to-pink-50 rounded-[28px]" />
                            <div className="space-y-6">
                                <div className="h-8 bg-gradient-to-r from-pink-200 to-pink-100 rounded-2xl w-3/4" />
                                <div className="h-12 bg-gradient-to-r from-pink-200 to-pink-100 rounded-2xl w-1/2" />
                                <div className="h-24 bg-gradient-to-r from-pink-200 to-pink-100 rounded-2xl" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div 
                className="min-h-screen flex items-center justify-center"
                style={{
                    background: 'linear-gradient(180deg, #FFFFFF 0%, #FCE7F3 50%, #FFF0F3 100%)',
                }}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                >
                    <div className="text-6xl mb-6">🧶</div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
                    <p className="text-gray-600 mb-6">Sorry, we couldn't find this product</p>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate('/')}
                        className="px-8 py-4 rounded-2xl font-bold text-white shadow-lg"
                        style={{
                            background: 'linear-gradient(135deg, #D8A1A5 0%, #E8B4B8 100%)',
                        }}
                    >
                        Back to Home
                    </motion.button>
                </motion.div>
            </div>
        );
    }

    const isOutOfStock = product.stock_status === 'out_of_stock';

    return (
        <div 
            className="min-h-screen pb-20"
            style={{
                background: 'linear-gradient(180deg, #FFFFFF 0%, #FCE7F3 50%, #FFF0F3 100%)',
            }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Back Button */}
                <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    whileHover={{ x: -5 }}
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-700 hover:text-[#D8A1A5] mb-8 transition-colors font-semibold px-4 py-2 rounded-xl"
                    style={{
                        background: 'rgba(255, 255, 255, 0.6)',
                        backdropFilter: 'blur(12px)',
                        border: '1.5px solid rgba(216, 161, 165, 0.2)',
                    }}
                >
                    <ChevronLeft className="w-5 h-5" strokeWidth={2.5} />
                    <span>Back</span>
                </motion.button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Image Carousel */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="relative rounded-[28px] overflow-hidden"
                        style={{
                            background: 'rgba(255, 255, 255, 0.75)',
                            backdropFilter: 'blur(16px)',
                            border: '1.5px solid rgba(216, 161, 165, 0.25)',
                            boxShadow: '0 12px 40px rgba(216, 161, 165, 0.12)',
                        }}
                    >
                        <ImageCarousel
                            images={product.product_images || []}
                            mainImage={product.image_url}
                        />
                        {isOutOfStock && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="absolute inset-0 flex items-center justify-center"
                                style={{
                                    background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.75) 0%, rgba(0, 0, 0, 0.85) 100%)',
                                    backdropFilter: 'blur(8px)',
                                }}
                            >
                                <div 
                                    className="px-10 py-5 rounded-2xl font-black text-2xl tracking-wide transform -rotate-12"
                                    style={{
                                        background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                                        color: 'white',
                                        boxShadow: '0 12px 32px rgba(239, 68, 68, 0.5)',
                                    }}
                                >
                                    OUT OF STOCK
                                </div>
                            </motion.div>
                        )}
                    </motion.div>

                    {/* Product Info */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        {/* Category & Featured Badge */}
                        <div className="flex items-center gap-3 mb-6">
                            <span 
                                className="px-4 py-1.5 rounded-full text-sm font-bold"
                                style={{
                                    background: 'linear-gradient(135deg, rgba(216, 161, 165, 0.15) 0%, rgba(232, 180, 184, 0.1) 100%)',
                                    color: '#D8A1A5',
                                    border: '1.5px solid rgba(216, 161, 165, 0.25)',
                                }}
                            >
                                {product.categories?.name || 'Uncategorized'}
                            </span>
                            {product.is_featured && (
                                <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: 'spring', stiffness: 200 }}
                                    className="px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-1.5"
                                    style={{
                                        background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.2) 0%, rgba(245, 158, 11, 0.15) 100%)',
                                        border: '1.5px solid rgba(251, 191, 36, 0.3)',
                                        color: '#F59E0B',
                                    }}
                                >
                                    <Star className="w-4 h-4 fill-amber-400" />
                                    Featured
                                </motion.span>
                            )}
                        </div>

                        {/* Product Name */}
                        <h1 className="text-5xl font-black mb-6 text-gray-900 leading-tight tracking-tight">
                            {product.name}
                        </h1>

                        {/* Price */}
                        <div className="mb-8">
                            <span className="text-sm text-gray-500 font-medium block mb-2">Price</span>
                            <div className={`text-5xl font-black ${isOutOfStock ? 'text-gray-400 line-through' : 'text-[#D8A1A5]'}`}>
                                ₹{product.price}
                            </div>
                        </div>

                        {/* Stock Status */}
                        <div 
                            className={`flex items-center gap-3 mb-6 px-6 py-4 rounded-2xl ${
                                isOutOfStock ? 'bg-red-50' : 'bg-green-50'
                            }`}
                            style={{
                                border: `1.5px solid ${isOutOfStock ? 'rgba(239, 68, 68, 0.2)' : 'rgba(34, 197, 94, 0.2)'}`,
                            }}
                        >
                            {isOutOfStock ? (
                                <>
                                    <AlertCircle className="w-6 h-6 text-red-600" strokeWidth={2.5} />
                                    <span className="font-bold text-red-600">Out of Stock</span>
                                </>
                            ) : (
                                <>
                                    <Package className="w-6 h-6 text-green-600" strokeWidth={2.5} />
                                    <span className="font-bold text-green-600">In Stock & Ready to Ship</span>
                                </>
                            )}
                        </div>

                        {isOutOfStock && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-8 p-5 rounded-2xl"
                                style={{
                                    background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.08) 0%, rgba(220, 38, 38, 0.05) 100%)',
                                    border: '1.5px solid rgba(239, 68, 68, 0.2)',
                                }}
                            >
                                <p className="text-red-800 font-medium leading-relaxed">
                                    This product is currently unavailable. Please check back later or contact us for more information.
                                </p>
                            </motion.div>
                        )}

                        {/* Description */}
                        <div className="mb-8">
                            <h2 className="text-2xl font-black mb-4 text-gray-900">Description</h2>
                            <p className="text-gray-600 leading-relaxed text-lg">
                                {product.description || 'No description available for this product.'}
                            </p>
                        </div>

                        {/* Quantity Selector */}
                        {!isOutOfStock && (
                            <div className="mb-8">
                                <label className="block text-lg font-bold mb-3 text-gray-900">Quantity</label>
                                <div className="flex items-center gap-4">
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-[#D8A1A5]"
                                        style={{
                                            background: 'rgba(255, 255, 255, 0.8)',
                                            border: '1.5px solid rgba(216, 161, 165, 0.3)',
                                        }}
                                    >
                                        <Minus className="w-5 h-5" strokeWidth={3} />
                                    </motion.button>
                                    <input
                                        type="number"
                                        value={quantity}
                                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                        className="w-24 h-12 text-center text-xl font-bold rounded-xl"
                                        style={{
                                            background: 'rgba(255, 255, 255, 0.8)',
                                            border: '1.5px solid rgba(216, 161, 165, 0.3)',
                                        }}
                                        min="1"
                                    />
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-[#D8A1A5]"
                                        style={{
                                            background: 'rgba(255, 255, 255, 0.8)',
                                            border: '1.5px solid rgba(216, 161, 165, 0.3)',
                                        }}
                                    >
                                        <Plus className="w-5 h-5" strokeWidth={3} />
                                    </motion.button>
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-4 mb-10">
                            <motion.button
                                whileHover={{ scale: isOutOfStock ? 1 : 1.02 }}
                                whileTap={{ scale: isOutOfStock ? 1 : 0.98 }}
                                onClick={handleAddToCart}
                                disabled={isOutOfStock}
                                className={`flex-1 py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all ${
                                    isOutOfStock
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        : 'text-white shadow-xl'
                                }`}
                                style={
                                    !isOutOfStock
                                        ? {
                                            background: 'linear-gradient(135deg, #D8A1A5 0%, #E8B4B8 100%)',
                                            boxShadow: '0 12px 32px rgba(216, 161, 165, 0.4)',
                                        }
                                        : undefined
                                }
                            >
                                <ShoppingCart className="w-6 h-6" strokeWidth={2.5} />
                                <span>{isOutOfStock ? 'Out of Stock' : 'Add to Cart'}</span>
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => toggleFavorite(product.id)}
                                disabled={favLoading}
                                className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all disabled:opacity-50 ${
                                    isFavorite(product.id)
                                        ? 'bg-red-50'
                                        : 'bg-white'
                                }`}
                                style={{
                                    border: `2px solid ${isFavorite(product.id) ? '#EF4444' : 'rgba(216, 161, 165, 0.3)'}`,
                                }}
                            >
                                <Heart
                                    className={`w-7 h-7 ${
                                        isFavorite(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'
                                    }`}
                                    strokeWidth={2.5}
                                />
                            </motion.button>
                        </div>

                        {/* Product Details */}
                        <div 
                            className="p-6 rounded-2xl"
                            style={{
                                background: 'rgba(255, 255, 255, 0.6)',
                                backdropFilter: 'blur(12px)',
                                border: '1.5px solid rgba(216, 161, 165, 0.2)',
                            }}
                        >
                            <h3 className="font-black text-xl mb-5 text-gray-900">Product Details</h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between items-center py-2 border-b border-pink-100">
                                    <span className="text-gray-600 font-medium">Category:</span>
                                    <span className="font-bold text-gray-900">{product.categories?.name || 'N/A'}</span>
                                </div>
                                {/* <div className="flex justify-between items-center py-2 border-b border-pink-100">
                                    <span className="text-gray-600 font-medium">Product ID:</span>
                                    <span className="font-mono font-bold text-gray-900">{product.id.slice(0, 8)}...</span>
                                </div> */}
                                <div className="flex justify-between items-center py-2 border-b border-pink-100">
                                    <span className="text-gray-600 font-medium">Status:</span>
                                    <span className={`font-bold ${isOutOfStock ? 'text-red-600' : 'text-green-600'}`}>
                                        {isOutOfStock ? 'Out of Stock' : 'In Stock'}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-gray-600 font-medium">Added:</span>
                                    <span className="font-bold text-gray-900">
                                        {new Date(product.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
