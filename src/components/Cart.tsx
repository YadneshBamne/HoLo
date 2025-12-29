import { X, Plus, Minus } from 'lucide-react';
import { useCart } from '../hooks/useCart';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, getCartTotal } = useCart();

  if (cart.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 text-lg mb-4">Your cart is empty</p>
        <a href="/" className="btn-primary inline-block">
          Continue Shopping
        </a>
      </div>
    );
  }

  return (
    <div>
      <div className="space-y-4">
        {cart.map((item) => {
          const mainImage = item.product.product_images?.[0]?.image_url || item.product.image_url;
          
          return (
            <div key={item.product.id} className="card p-4 flex gap-4">
              {/* Image */}
              <div className="w-24 h-24 flex-shrink-0">
                {mainImage ? (
                  <img
                    src={mainImage}
                    alt={item.product.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-gray-400 text-xs">No Image</span>
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-lg">{item.product.name}</h3>
                    <p className="text-sm text-gray-500">{item.product.categories?.name}</p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="p-1 rounded hover:bg-gray-100"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="font-semibold w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="p-1 rounded hover:bg-gray-100"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <span className="text-xl font-bold text-primary">
                    ₹{(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Total */}
      <div className="card p-6 mt-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-semibold">Total:</span>
          <span className="text-3xl font-bold text-primary">₹{getCartTotal().toFixed(2)}</span>
        </div>
        <a href="/checkout" className="btn-primary w-full text-center block">
          Proceed to Checkout
        </a>
      </div>
    </div>
  );
}
