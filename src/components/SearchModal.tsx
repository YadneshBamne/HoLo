  import { motion, AnimatePresence } from 'framer-motion';
  import { X, Search } from 'lucide-react';
  import { useState, useEffect } from 'react';
  import { useNavigate } from 'react-router-dom';
  import { supabase } from '../lib/supabase';
  import { Product } from '../lib/types';

  interface SearchModalProps {
    isOpen: boolean;
    onClose: () => void;
  }

  export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [results, setResults] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
      if (!isOpen) {
        setSearchQuery('');
        setResults([]);
      }
    }, [isOpen]);

    useEffect(() => {
      const searchProducts = async () => {
        if (searchQuery.length < 2) {
          setResults([]);
          return;
        }

        setLoading(true);
        try {
          const { data, error } = await supabase
            .from('products')
            .select('*, categories(name), product_images(image_url, position)')
            .or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
            .limit(8);

          if (error) throw error;
          setResults(data || []);
        } catch (error) {
          console.error('Search error:', error);
        } finally {
          setLoading(false);
        }
      };

      const debounce = setTimeout(searchProducts, 300);
      return () => clearTimeout(debounce);
    }, [searchQuery]);

    const handleProductClick = (productId: string) => {
      navigate(`/product/${productId}`);
      onClose();
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
              className="fixed inset-0 bg-black/50 z-50"
              onClick={onClose}
            />

            {/* Search Modal */}
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.3, ease: [0.76, 0, 0.24, 1] }}
              className="fixed top-20 left-1/2 -translate-x-1/2 w-[90vw] max-w-2xl bg-white rounded-2xl shadow-2xl z-50 overflow-hidden"
            >
              {/* Search Input */}
              <div className="p-6 border-b flex items-center space-x-4">
                <Search className="w-6 h-6 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="flex-1 text-lg outline-none"
                  autoFocus
                />
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* Results */}
              <div className="max-h-96 overflow-y-auto">
                {loading && (
                  <div className="p-8 text-center text-gray-500">Searching...</div>
                )}

                {!loading && searchQuery.length >= 2 && results.length === 0 && (
                  <div className="p-8 text-center text-gray-500">
                    No products found for "{searchQuery}"
                  </div>
                )}

                {!loading && results.length > 0 && (
                  <div className="p-4">
                    {results.map((product) => {
                      const mainImage = product.product_images?.[0]?.image_url || product.image_url;
                      
                      return (
                        <button
                          key={product.id}
                          onClick={() => handleProductClick(product.id)}
                          className="w-full flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors text-left"
                        >
                          <div className="w-16 h-16 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                            {mainImage ? (
                              <img
                                src={mainImage}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                📦
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 truncate">{product.name}</h4>
                            <p className="text-sm text-gray-500 truncate">
                              {product.categories?.name || 'Uncategorized'}
                            </p>
                          </div>
                          <div className="text-primary font-bold">₹{product.price}</div>
                        </button>
                      );
                    })}
                  </div>
                )}

                {!loading && searchQuery.length < 2 && (
                  <div className="p-8 text-center text-gray-400">
                    Type at least 2 characters to search
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  }
