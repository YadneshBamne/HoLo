import { useState, useEffect } from 'react';
import { useFavorites } from '../hooks/useFavorites';
import { supabase } from '../lib/supabase';
import { Product } from '../lib/types';
import ProductCard from '../components/ProductCard';
import ProductDrawer from '../components/ProductDrawer';
import { Badge } from '@/components/ui/badge';

export default function Favorites() {
  const { favorites, loading: favoritesLoading } = useFavorites();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    if (!favoritesLoading) {
      fetchFavoriteProducts();
    }
  }, [favorites, favoritesLoading]);

  const fetchFavoriteProducts = async () => {
    if (favorites.length === 0) {
      setProducts([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*, categories(name), product_images(image_url, position)')
        .in('id', favorites);

      if (error) throw error;
      
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenProductDrawer = (productId: string) => {
    setSelectedProductId(productId);
    setDrawerOpen(true);
  };

  if (favoritesLoading || loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Favorites</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card h-96 animate-pulse bg-gray-200" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">My Favorites ❤️</h1>
        <Badge className="h-8 px-4 font-mono text-base tabular-nums">
          {products.length}
        </Badge>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">💔</div>
          <p className="text-gray-500 text-lg mb-4">No favorites yet</p>
          <p className="text-gray-400 mb-6">Start adding products you love!</p>
          <a href="/" className="btn-primary inline-block">
            Discover Products
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product}
              onOpenDrawer={handleOpenProductDrawer}
            />
          ))}
        </div>
      )}

      {/* Product Drawer */}
      <ProductDrawer
        productId={selectedProductId}
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </div>
  );
}
