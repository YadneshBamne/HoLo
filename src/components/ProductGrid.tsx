import { motion } from 'framer-motion';
import ProductCard from './ProductCard';
import { Product } from '../lib/types';

interface ProductGridProps {
  products: Product[];
  loading: boolean;
  onOpenProductDrawer: (productId: string) => void;
}

export default function ProductGrid({ 
  products, 
  loading, 
  onOpenProductDrawer 
}: ProductGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="rounded-[28px] h-[600px] animate-pulse"
            style={{
              background: 'linear-gradient(135deg, rgba(216, 161, 165, 0.1) 0%, rgba(232, 180, 184, 0.05) 100%)',
            }}
          />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-20"
      >

        <h3 className="text-2xl font-bold text-gray-900 mb-3">No products found</h3>
        <p className="text-gray-600">Try selecting a different category</p>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.map((product, index) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ 
            duration: 0.5, 
            delay: index * 0.1,
            ease: [0.25, 0.4, 0.25, 1]
          }}
        >
          <ProductCard
            product={product}
          
          />
        </motion.div>
      ))}
    </div>
  );
}
  

// import { Product } from '../lib/types';
// import ProductCard from './ProductCard';

// interface ProductGridProps {
//   products: Product[];
//   loading?: boolean;
//   onOpenProductDrawer: (productId: string) => void;
// }

// export default function ProductGrid({ products, loading, onOpenProductDrawer }: ProductGridProps) {
//   if (loading) {
//     return (
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//         {[...Array(8)].map((_, i) => (
//           <div key={i} className="card h-96 animate-pulse bg-gray-200" />
//         ))}
//       </div>
//     );
//   }

//   if (products.length === 0) {
//     return (
//       <div className="text-center py-16">
//         <p className="text-gray-500 text-lg">No products found</p>
//       </div>
//     );
//   }

//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//       {products.map((product) => (
//         <ProductCard 
//           key={product.id} 
//           product={product}
//           onOpenDrawer={onOpenProductDrawer}
//         />
//       ))}
//     </div>
//   );
// }
