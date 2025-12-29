import { useFeaturedProducts } from '../hooks/useProducts';
import ProductCard from './ProductCard';

interface FeaturedProductsProps {
  onOpenProductDrawer: (productId: string) => void;
}

export default function FeaturedProducts({ onOpenProductDrawer }: FeaturedProductsProps) {
  const { products, loading } = useFeaturedProducts();
  

  if (loading || products.length === 0) return null;
  

  return (
    <section className="mb-12">
      <h2 className="text-3xl font-bold mb-6">⭐ Featured Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product}
            onOpenDrawer={onOpenProductDrawer}
          />
        ))}
      </div>
    </section>
  );
}
