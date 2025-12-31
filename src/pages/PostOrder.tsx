import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Package, MapPin, Calendar, CreditCard, ShoppingBag, ArrowRight, Download } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface OrderDetails {
  id: string;
  order_number: string;
  total_amount: number;
  created_at: string;
  delivery_address: any;
  order_items: Array<{
    id: string;
    product_id: string;
    quantity: number;
    price: number;
    products: {
      name: string;
      image_url: string;
    };
  }>;
}

export default function OrderSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order_id');
  
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
            products (
              name,
              image_url
            )
        
        `)
        .eq('id', orderId)
        .single();

      if (error) throw error;
      setOrder(data);
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  const estimatedDelivery = order 
    ? new Date(new Date(order.created_at).getTime() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : '';

  if (loading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{
          background: 'linear-gradient(135deg, #FFF5F7 0%, #FFE8EC 50%, #FFF0F3 100%)',
        }}
      >
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#D8A1A5]/30 border-t-[#D8A1A5] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading order details...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen py-12 px-4 sm:px-6 lg:px-8"
      style={{
        background: 'linear-gradient(135deg, #FFF5F7 0%, #FFE8EC 50%, #FFF0F3 100%)',
      }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Success Animation Header */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.2 }}
          className="text-center mb-8"
        >
          <div className="relative inline-block">
            {/* Pulsing circles */}
            <motion.div
              animate={{ 
                scale: [1, 1.4, 1],
                opacity: [0.5, 0, 0.5] 
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute inset-0 rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(216, 161, 165, 0.3) 0%, transparent 70%)',
              }}
            />
            
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
              className="relative rounded-full p-6"
              style={{
                background: 'linear-gradient(135deg, rgba(216, 161, 165, 0.15) 0%, rgba(232, 180, 184, 0.1) 100%)',
                border: '3px solid rgba(216, 161, 165, 0.3)',
              }}
            >
              <CheckCircle className="w-20 h-20 text-[#D8A1A5]" strokeWidth={2.5} />
            </motion.div>
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-5xl font-black text-gray-900 mt-8 mb-3 tracking-tight"
          >
            Order Placed Successfully!
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed"
          >
            Thank you for your purchase! Your order has been confirmed and will be shipped soon.
          </motion.p>
        </motion.div>

        {/* Order Number Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mb-6 rounded-[28px] p-6 text-center"
          style={{
            background: 'linear-gradient(135deg, rgba(216, 161, 165, 0.95) 0%, rgba(232, 180, 184, 0.95) 100%)',
            backdropFilter: 'blur(16px)',
            boxShadow: '0 12px 40px rgba(216, 161, 165, 0.3)',
          }}
        >
          <p className="text-white/80 text-sm font-medium mb-2">Order Number</p>
          <p className="text-white text-3xl font-black tracking-wide">
            {order?.order_number || 'N/A'}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Delivery Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
            className="rounded-[28px] p-6"
            style={{
              background: 'rgba(255, 255, 255, 0.75)',
              backdropFilter: 'blur(16px)',
              border: '1.5px solid rgba(216, 161, 165, 0.25)',
              boxShadow: '0 12px 40px rgba(216, 161, 165, 0.12)',
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div 
                className="rounded-2xl p-3"
                style={{
                  background: 'linear-gradient(135deg, rgba(216, 161, 165, 0.15) 0%, rgba(232, 180, 184, 0.1) 100%)',
                }}
              >
                <Calendar className="w-6 h-6 text-[#D8A1A5]" strokeWidth={2.5} />
              </div>
              <h3 className="text-xl font-black text-gray-900">Estimated Delivery</h3>
            </div>
            <p className="text-gray-600 font-medium leading-relaxed">
              {estimatedDelivery}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              We'll send you tracking details soon
            </p>
          </motion.div>

          {/* Shipping Address */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9 }}
            className="rounded-[28px] p-6"
            style={{
              background: 'rgba(255, 255, 255, 0.75)',
              backdropFilter: 'blur(16px)',
              border: '1.5px solid rgba(216, 161, 165, 0.25)',
              boxShadow: '0 12px 40px rgba(216, 161, 165, 0.12)',
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div 
                className="rounded-2xl p-3"
                style={{
                  background: 'linear-gradient(135deg, rgba(216, 161, 165, 0.15) 0%, rgba(232, 180, 184, 0.1) 100%)',
                }}
              >
                <MapPin className="w-6 h-6 text-[#D8A1A5]" strokeWidth={2.5} />
              </div>
              <h3 className="text-xl font-black text-gray-900">Shipping Address</h3>
            </div>
            {order?.delivery_address ? (
              <div className="text-gray-600 font-medium leading-relaxed">
                <p>{order.delivery_address}</p>


                console.log(order.delivery_address)
                <p>{order.delivery_address.address_line1}</p>
                {order.delivery_address.address_line2 && (
                  <p>{order.delivery_address.address_line2}</p>
                )}
                <p>
                  {order.delivery_address.city}, {order.delivery_address.state} {order.delivery_address.postal_code}
                </p>
                <p className="mt-2 text-sm text-gray-500">
                  Phone: {order.delivery_address.phone}
                </p>
              </div>
            ) : (
              <p className="text-gray-500">No shipping address provided</p>
            )}
          </motion.div>
        </div>

        {/* Order Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="mb-6 rounded-[28px] p-6"
          style={{
            background: 'rgba(255, 255, 255, 0.75)',
            backdropFilter: 'blur(16px)',
            border: '1.5px solid rgba(216, 161, 165, 0.25)',
            boxShadow: '0 12px 40px rgba(216, 161, 165, 0.12)',
          }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div 
              className="rounded-2xl p-3"
              style={{
                background: 'linear-gradient(135deg, rgba(216, 161, 165, 0.15) 0%, rgba(232, 180, 184, 0.1) 100%)',
              }}
            >
              <Package className="w-6 h-6 text-[#D8A1A5]" strokeWidth={2.5} />
            </div>
            <h3 className="text-xl font-black text-gray-900">Order Items</h3>
          </div>

          <div className="space-y-4">
            {order?.order_items?.map((item) => (
              <div 
                key={item.id}
                className="flex items-center gap-4 p-4 rounded-2xl"
                style={{
                  background: 'rgba(255, 255, 255, 0.5)',
                  border: '1.5px solid rgba(216, 161, 165, 0.15)',
                }}
              >
                <div 
                  className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0"
                  style={{
                    background: 'linear-gradient(135deg, #FFF5F7 0%, #FFE8EC 100%)',
                  }}
                >
                  {item.products?.image_url ? (
                    <img
                      src={item.products.image_url}
                      alt={item.products.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-8 h-8 text-[#D8A1A5]/30" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 mb-1">
                    {item.products?.name || 'Product'}
                  </h4>
                  <p className="text-sm text-gray-600">
                    Quantity: <span className="font-bold text-[#D8A1A5]">{item.quantity}</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-black text-[#D8A1A5]">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Order Total */}
          <div 
            className="mt-6 pt-6 flex items-center justify-between"
            style={{
              borderTop: '2px solid rgba(216, 161, 165, 0.2)',
            }}
          >
            <span className="text-xl font-black text-gray-900">Total Amount</span>
            <span className="text-3xl font-black text-[#D8A1A5]">
              ₹{order?.total_amount?.toFixed(2)}
            </span>
          </div>
        </motion.div>

        {/* Payment Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="mb-8 rounded-[28px] p-6"
          style={{
            background: 'rgba(255, 255, 255, 0.75)',
            backdropFilter: 'blur(16px)',
            border: '1.5px solid rgba(216, 161, 165, 0.25)',
            boxShadow: '0 12px 40px rgba(216, 161, 165, 0.12)',
          }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div 
              className="rounded-2xl p-3"
              style={{
                background: 'linear-gradient(135deg, rgba(216, 161, 165, 0.15) 0%, rgba(232, 180, 184, 0.1) 100%)',
              }}
            >
              <CreditCard className="w-6 h-6 text-[#D8A1A5]" strokeWidth={2.5} />
            </div>
            <h3 className="text-xl font-black text-gray-900">Payment Status</h3>
          </div>
          <div className="flex items-center gap-2">
            <div 
              className="px-4 py-2 rounded-xl font-bold text-sm"
              style={{
                background: 'linear-gradient(135deg, rgba(216, 161, 165, 0.2) 0%, rgba(232, 180, 184, 0.15) 100%)',
                color: '#D8A1A5',
              }}
            >
              ✓ Payment Confirmed
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/')}
            className="flex-1 px-8 py-4 rounded-2xl flex items-center justify-center gap-3 font-bold text-white shadow-lg hover:shadow-xl transition-all"
            style={{
              background: 'linear-gradient(135deg, #D8A1A5 0%, #E8B4B8 100%)',
              boxShadow: '0 8px 24px rgba(216, 161, 165, 0.35)',
            }}
          >
            <ShoppingBag className="w-5 h-5" />
            <span>Continue Shopping</span>
            <ArrowRight className="w-5 h-5" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => window.print()}
            className="px-8 py-4 rounded-2xl flex items-center justify-center gap-3 font-bold text-[#D8A1A5]"
            style={{
              background: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(12px)',
              border: '1.5px solid rgba(216, 161, 165, 0.25)',
            }}
          >
            <Download className="w-5 h-5" />
            <span>Download Receipt</span>
          </motion.button>
        </motion.div>

        {/* Thank You Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
          className="mt-8 text-center"
        >
          <p className="text-gray-600 leading-relaxed">
            A confirmation email has been sent to your registered email address.
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Need help? Contact our support team anytime.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
