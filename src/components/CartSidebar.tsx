// src/components/CartSidebar.tsx
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../hooks/useCart';
import { Link } from 'react-router-dom';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { items = [], removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full sm:w-96 z-50 flex flex-col"
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(16px)',
              boxShadow: '-8px 0 32px rgba(0, 0, 0, 0.1)',
            }}
          >
            {/* Header */}
            <div 
              className="flex items-center justify-between p-6 border-b"
              style={{ borderColor: 'rgba(216, 161, 165, 0.2)' }}
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, #D8A1A5 0%, #E8B4B8 100%)',
                  }}
                >
                  <ShoppingBag className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Shopping Cart</h2>
                  <p className="text-sm text-gray-600">
                    {items.length} {items.length === 1 ? 'item' : 'items'}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div 
                    className="w-24 h-24 rounded-3xl flex items-center justify-center mb-6"
                    style={{
                      background: 'linear-gradient(135deg, rgba(216, 161, 165, 0.15) 0%, rgba(232, 180, 184, 0.1) 100%)',
                    }}
                  >
                    <ShoppingBag className="w-12 h-12 text-[#D8A1A5]" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Your cart is empty</h3>
                  <p className="text-gray-600 mb-6">Add some beautiful handcrafted items!</p>
                  <button
                    onClick={onClose}
                    className="px-6 py-3 rounded-2xl font-bold text-white"
                    style={{
                      background: 'linear-gradient(135deg, #D8A1A5 0%, #E8B4B8 100%)',
                    }}
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 100 }}
                      className="flex gap-4 p-4 rounded-2xl"
                      style={{
                        background: 'rgba(255, 255, 255, 0.6)',
                        border: '1.5px solid rgba(216, 161, 165, 0.2)',
                      }}
                    >
                      {/* Image */}
                      <img
                        src={item.image_url || '/placeholder.png'}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-xl"
                      />

                      {/* Details */}
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 mb-1">{item.name}</h3>
                        <p className="text-sm text-[#D8A1A5] font-bold mb-2">₹{item.price}</p>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-7 h-7 rounded-lg flex items-center justify-center"
                            style={{
                              background: 'rgba(216, 161, 165, 0.1)',
                              border: '1.5px solid rgba(216, 161, 165, 0.2)',
                            }}
                          >
                            <Minus className="w-4 h-4 text-[#D8A1A5]" />
                          </button>
                          <span className="w-8 text-center font-bold">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-7 h-7 rounded-lg flex items-center justify-center"
                            style={{
                              background: 'rgba(216, 161, 165, 0.1)',
                              border: '1.5px solid rgba(216, 161, 165, 0.2)',
                            }}
                          >
                            <Plus className="w-4 h-4 text-[#D8A1A5]" />
                          </button>
                        </div>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-5 h-5 text-red-500" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer - Only show when cart has items */}
            {items.length > 0 && (
              <div 
                className="p-6 border-t"
                style={{ borderColor: 'rgba(216, 161, 165, 0.2)' }}
              >
                {/* Total */}
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-black text-[#D8A1A5]">
                    ₹{getCartTotal?.() || 0}
                  </span>
                </div>

                {/* Buttons */}
                <div className="space-y-3">
                  <Link
                    to="/checkout"
                    onClick={onClose}
                    className="block w-full py-4 rounded-2xl font-bold text-white text-center"
                    style={{
                      background: 'linear-gradient(135deg, #D8A1A5 0%, #E8B4B8 100%)',
                      boxShadow: '0 8px 24px rgba(216, 161, 165, 0.35)',
                    }}
                  >
                    Checkout
                  </Link>
                  <button
                    onClick={() => {
                      if (window.confirm('Clear all items from cart?')) {
                        clearCart();
                      }
                    }}
                    className="w-full py-3 rounded-2xl font-bold text-gray-700 border-2 border-gray-300 hover:bg-gray-50 transition-colors"
                  >
                    Clear Cart
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
