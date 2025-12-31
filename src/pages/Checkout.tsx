import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Package, ArrowLeft } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { supabase } from '../lib/supabase';
import { CheckoutFormData } from '../lib/types';

export default function Checkout() {
  const navigate = useNavigate();
  const { items = [], getCartTotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CheckoutFormData>({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    delivery_address: '',
    notes: '',
  });

  if (items.length === 0) {
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
          className="text-center max-w-md mx-auto px-4"
        >
          <div 
            className="w-32 h-32 rounded-3xl mx-auto mb-6 flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, rgba(216, 161, 165, 0.15) 0%, rgba(232, 180, 184, 0.1) 100%)',
            }}
          >
            <ShoppingBag className="w-16 h-16 text-[#D8A1A5]" />
          </div>
          <h2 className="text-3xl font-black text-gray-900 mb-4">Your Cart is Empty</h2>
          <p className="text-gray-600 mb-8">Add some beautiful handcrafted items to get started!</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/')}
            className="px-8 py-4 rounded-2xl font-bold text-white"
            style={{
              background: 'linear-gradient(135deg, #D8A1A5 0%, #E8B4B8 100%)',
              boxShadow: '0 8px 24px rgba(216, 161, 165, 0.35)',
            }}
          >
            Continue Shopping
          </motion.button>
        </motion.div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create order
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_name: formData.customer_name,
          customer_email: formData.customer_email || null,
          customer_phone: formData.customer_phone,
          delivery_address: formData.delivery_address,
          total_amount: getCartTotal(),
          status: 'pending',
          notes: formData.notes || null,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = items.map((item) => ({
        order_id: orderData.id,
        product_id: item.id,
        quantity: item.quantity,
        price_at_purchase: item.price,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Clear cart
      clearCart();

      // Success toast
      const toast = document.createElement('div');
      toast.className = 'fixed top-20 right-4 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-4 rounded-2xl shadow-xl z-[9999] animate-fade-in-down backdrop-blur-sm font-semibold flex items-center gap-2';
      toast.innerHTML = '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg><span>Order placed successfully!</span>';
      document.body.appendChild(toast);
      
      setTimeout(() => {
        toast.classList.add('animate-fade-out-up');
        setTimeout(() => toast.remove(), 300);
      }, 3000);

      navigate('/');
    } catch (error: any) {
      console.error('Error placing order:', error);
      
      const toast = document.createElement('div');
      toast.className = 'fixed top-20 right-4 bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-4 rounded-2xl shadow-xl z-[9999] animate-fade-in-down backdrop-blur-sm font-semibold';
      toast.textContent = 'Failed to place order. Please try again.';
      document.body.appendChild(toast);
      
      setTimeout(() => {
        toast.classList.add('animate-fade-out-up');
        setTimeout(() => toast.remove(), 300);
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div 
      className="min-h-screen py-12"
      style={{
        background: 'linear-gradient(180deg, #FFFFFF 0%, #FCE7F3 50%, #FFF0F3 100%)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
          <ArrowLeft className="w-5 h-5" strokeWidth={2.5} />
          <span>Back</span>
        </motion.button>

        <h1 className="text-4xl font-black text-gray-900 mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handleSubmit}
              className="p-8 rounded-[28px] space-y-6"
              style={{
                background: 'rgba(255, 255, 255, 0.75)',
                backdropFilter: 'blur(16px)',
                border: '1.5px solid rgba(216, 161, 165, 0.25)',
                boxShadow: '0 12px 40px rgba(216, 161, 165, 0.12)',
              }}
            >
              <h2 className="text-2xl font-black text-gray-900 mb-6">Delivery Information</h2>

              <div>
                <label className="block text-sm font-bold mb-2 text-gray-900">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="customer_name"
                  value={formData.customer_name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl focus:ring-2 focus:ring-[#D8A1A5] focus:border-transparent transition-all"
                  style={{
                    border: '1.5px solid rgba(216, 161, 165, 0.3)',
                  }}
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2 text-gray-900">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="customer_phone"
                  value={formData.customer_phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl focus:ring-2 focus:ring-[#D8A1A5] focus:border-transparent transition-all"
                  style={{
                    border: '1.5px solid rgba(216, 161, 165, 0.3)',
                  }}
                  placeholder="+91 XXXXX XXXXX"
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2 text-gray-900">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  name="customer_email"
                  value={formData.customer_email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl focus:ring-2 focus:ring-[#D8A1A5] focus:border-transparent transition-all"
                  style={{
                    border: '1.5px solid rgba(216, 161, 165, 0.3)',
                  }}
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2 text-gray-900">
                  Delivery Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="delivery_address"
                  value={formData.delivery_address}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl focus:ring-2 focus:ring-[#D8A1A5] focus:border-transparent transition-all"
                  style={{
                    border: '1.5px solid rgba(216, 161, 165, 0.3)',
                  }}
                  placeholder="Enter your complete delivery address"
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2 text-gray-900">
                  Additional Notes (Optional)
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl focus:ring-2 focus:ring-[#D8A1A5] focus:border-transparent transition-all"
                  style={{
                    border: '1.5px solid rgba(216, 161, 165, 0.3)',
                  }}
                  placeholder="Any special instructions or requests"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-2xl font-black text-white text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: 'linear-gradient(135deg, #D8A1A5 0%, #E8B4B8 100%)',
                  boxShadow: '0 8px 24px rgba(216, 161, 165, 0.35)',
                }}
              >
                {loading ? 'Placing Order...' : 'Place Order'}
              </motion.button>
            </motion.form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-6 rounded-[28px] sticky top-24"
              style={{
                background: 'rgba(255, 255, 255, 0.75)',
                backdropFilter: 'blur(16px)',
                border: '1.5px solid rgba(216, 161, 165, 0.25)',
                boxShadow: '0 12px 40px rgba(216, 161, 165, 0.12)',
              }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, #D8A1A5 0%, #E8B4B8 100%)',
                  }}
                >
                  <Package className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-black text-gray-900">Order Summary</h2>
              </div>

              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <div>
                      <p className="font-bold text-gray-900">{item.name}</p>
                      <p className="text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-black text-[#D8A1A5]">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div 
                className="border-t pt-4 space-y-3"
                style={{ borderColor: 'rgba(216, 161, 165, 0.2)' }}
              >
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-bold">₹{getCartTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivery:</span>
                  <span className="text-green-600 font-bold">Contact seller</span>
                </div>
                <div 
                  className="border-t pt-3 flex justify-between"
                  style={{ borderColor: 'rgba(216, 161, 165, 0.2)' }}
                >
                  <span className="font-black text-lg">Total:</span>
                  <span className="font-black text-2xl text-[#D8A1A5]">
                    ₹{getCartTotal().toFixed(2)}
                  </span>
                </div>
              </div>

              <div 
                className="mt-6 p-4 rounded-xl"
                style={{
                  background: 'rgba(216, 161, 165, 0.1)',
                }}
              >
                <p className="text-xs text-gray-600 leading-relaxed">
                  * The seller will contact you to confirm the order and discuss delivery details.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
