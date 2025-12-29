import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { useNavigate } from 'react-router-dom';
import { AnimatedNumberInput } from './animated-number-input';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { cart, removeFromCart, updateQuantity, getCartTotal, getCartCount } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

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
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />

          {/* Cart Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.3, ease: [0.76, 0, 0.24, 1] }}
            className="fixed right-0 top-0 h-full w-96 max-w-[90vw] bg-white shadow-2xl z-50 flex flex-col font-f1 rounded-l-3xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center space-x-2">
                <ShoppingBag className="w-6 h-6 text-primary" />
                <h2 className="text-xl font-bold text-gray-900">
                  Cart ({getCartCount()})
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="text-6xl mb-4">🛒</div>
                  <p className="text-gray-500 text-lg mb-2">Your cart is empty</p>
                  <p className="text-gray-400 text-sm mb-6">
                    Add some products to get started!
                  </p>
                  <button
                    onClick={onClose}
                    className="btn-primary"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item, index) => {
                    const mainImage = item.product.product_images?.[0]?.image_url || item.product.image_url;
                    
                    return (
                      <motion.div
                        key={item.product.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ delay: index * 0.05 }}
                        className="card p-4 flex gap-4"
                      >
                        {/* Image */}
                        <div className="w-20 h-20 shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                          {mainImage ? (
                            <img
                              src={mainImage}
                              alt={item.product.name}
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              📦
                            </div>
                          )}
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm mb-1 truncate">
                            {item.product.name}
                          </h3>
                          <p className="text-primary font-bold text-sm mb-3">
                            ₹{item.product.price}
                          </p>

                          {/* Animated Number Input */}
                          <div className="scale-75 origin-left -ml-2">
                            <AnimatedNumberInput
                              value={item.quantity}
                              min={1}
                              max={99}
                              onChange={(newQuantity) => updateQuantity(item.product.id, newQuantity)}
                            />
                          </div>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="p-2 hover:bg-red-50 rounded-full transition-colors self-start"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer - Checkout Section */}
            {cart.length > 0 && (
              <div className="border-t p-6 bg-gray-50">
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">₹{getCartTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Items</span>
                    <span className="font-medium">{getCartCount()}</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between">
                    <span className="font-bold text-lg">Total</span>
                    <span className="font-bold text-lg text-primary">
                      ₹{getCartTotal().toFixed(2)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full btn-primary"
                >
                  Proceed to Checkout
                </button>

                <button
                  onClick={onClose}
                  className="w-full mt-2 text-gray-600 hover:text-gray-900 py-2 text-sm transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
