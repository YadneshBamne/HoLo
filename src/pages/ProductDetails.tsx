import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, ArrowLeft, Package, AlertCircle, Star } from 'lucide-react';
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
            alert('Added to cart!');
        }
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="animate-pulse">
                    <div className="h-96 bg-gray-200 rounded-lg mb-8" />
                    <div className="h-8 bg-gray-200 rounded w-1/2 mb-4" />
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-8" />
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-8 text-center">
                <p className="text-gray-500">Product not found</p>
                <button onClick={() => navigate('/')} className="btn-primary mt-4">
                    Back to Home
                </button>
            </div>
        );
    }

    const isOutOfStock = product.stock_status === 'out_of_stock';

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Back Button */}
            <button
                onClick={() => navigate(-1)}
                className="flex items-center text-gray-600 hover:text-primary mb-6 transition-colors"
            >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Image Carousel */}
                <div className="relative">
                    <ImageCarousel
                        images={product.product_images || []}
                        mainImage={product.image_url}
                    />
                    {isOutOfStock && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                            <div className="bg-red-500 text-white px-8 py-4 rounded-lg font-bold text-2xl transform -rotate-12">
                                OUT OF STOCK
                            </div>
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div>
                    {/* Category & Featured Badge */}
                    <div className="flex items-center gap-2 mb-4">
                        <span className="text-sm text-gray-500">
                            {product.categories?.name || 'Uncategorized'}
                        </span>
                        {product.is_featured && (
                            <span className="bg-yellow-100 text-yellow-800 text-xs px-3 py-1 rounded-full font-semibold flex items-center">
                                <Star className="w-3 h-3 mr-1 fill-yellow-500" />
                                Featured
                            </span>
                        )}
                    </div>

                    {/* Product Name */}
                    <h1 className="text-4xl font-bold mb-4">{product.name}</h1>

                    {/* Price */}
                    <div className={`text-4xl font-bold mb-6 ${isOutOfStock ? 'text-gray-400' : 'text-primary'}`}>
                        ₹{product.price}
                    </div>

                    {/* Stock Status */}
                    <div className="flex items-center mb-6">
                        {isOutOfStock ? (
                            <div className="flex items-center text-red-600">
                                <AlertCircle className="w-5 h-5 mr-2" />
                                <span className="font-semibold">Out of Stock</span>
                            </div>
                        ) : (
                            <div className="flex items-center text-green-600">
                                <Package className="w-5 h-5 mr-2" />
                                <span className="font-semibold">In Stock</span>
                            </div>
                        )}
                    </div>

                    {isOutOfStock && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                            <p className="text-red-800 text-sm">
                                This product is currently unavailable. Please check back later or contact the seller for more information.
                            </p>
                        </div>
                    )}

                    {/* Description */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold mb-3">Description</h2>
                        <p className="text-gray-600 leading-relaxed">
                            {product.description || 'No description available for this product.'}
                        </p>
                    </div>

                    {/* Quantity Selector */}
                    {!isOutOfStock && (
                        <div className="mb-6">
                            <label className="block text-sm font-semibold mb-2">Quantity</label>
                            <div className="flex items-center space-x-4">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                                >
                                    -
                                </button>
                                <input
                                    type="number"
                                    value={quantity}
                                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                    className="w-20 h-10 text-center border border-gray-300 rounded-lg"
                                    min="1"
                                />
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                        <button
                            onClick={handleAddToCart}
                            disabled={isOutOfStock}
                            className={`flex-1 py-4 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-colors ${isOutOfStock
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : 'bg-primary text-white hover:bg-primary/90'
                                }`}
                        >
                            <ShoppingCart className="w-5 h-5" />
                            <span>{isOutOfStock ? 'Out of Stock' : 'Add to Cart'}</span>
                        </button>

                        <button
                            onClick={() => toggleFavorite(product.id)}
                            disabled={favLoading}
                            className={`w-14 h-14 rounded-lg border-2 flex items-center justify-center transition-colors disabled:opacity-50 ${isFavorite(product.id)
                                    ? 'border-red-500 bg-red-50'
                                    : 'border-gray-300 hover:border-red-500'
                                }`}
                        >
                            <Heart
                                className={`w-6 h-6 ${isFavorite(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'
                                    }`}
                            />
                        </button>
                    </div>

                    {/* Product Details */}
                    <div className="mt-8 pt-8 border-t">
                        <h3 className="font-semibold mb-4">Product Details</h3>
                        <div className="space-y-2 text-sm text-gray-600">
                            <div className="flex justify-between">
                                <span>Category:</span>
                                <span className="font-medium">{product.categories?.name || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Product ID:</span>
                                <span className="font-medium">{product.id.slice(0, 8)}...</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Status:</span>
                                <span className={`font-medium ${isOutOfStock ? 'text-red-600' : 'text-green-600'}`}>
                                    {isOutOfStock ? 'Out of Stock' : 'In Stock'}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span>Added:</span>
                                <span className="font-medium">
                                    {new Date(product.created_at).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
