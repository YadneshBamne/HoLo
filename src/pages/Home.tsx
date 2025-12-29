import { useState, useEffect } from 'react';
import { useProducts } from '../hooks/useProducts';
import FeaturedProducts from '../components/FeaturedProducts';
import ProductGrid from '../components/ProductGrid';
import CategoryFilter from '../components/CategoryFilter';
import ProductDrawer from '../components/ProductDrawer';
import ScrollBaseAnimation from '@/components/motion-trail';
import ImageMouseTrail from '@/components/mousetrail';
import { supabase } from '../lib/supabase';
import { Sparkles, Heart, Package, Truck } from 'lucide-react';
import { AnimateSvg } from '@/svgComponents/AnimateSvg';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { products, loading } = useProducts(selectedCategory);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [productImages, setProductImages] = useState<string[]>([]);

  const handleOpenProductDrawer = (productId: string) => {
    setSelectedProductId(productId);
    setDrawerOpen(true);
  };
  const images = [
  'https://images.unsplash.com/photo-1709949908058-a08659bfa922?q=80&w=1200&auto=format',
  'https://images.unsplash.com/photo-1548192746-dd526f154ed9?q=80&w=1200&auto=format',
  'https://images.unsplash.com/photo-1693581176773-a5f2362209e6?q=80&w=1200&auto=format',
  'https://images.unsplash.com/photo-1584043204475-8cc101d6c77a?q=80&w=1200&auto=format',
  'https://images.unsplash.com/photo-1709949908058-a08659bfa922?q=80&w=1200&auto=format',
  'https://images.unsplash.com/photo-1518599904199-0ca897819ddb?q=80&w=1200&auto=format',
  'https://images.unsplash.com/photo-1706049379414-437ec3a54e93?q=80&w=1200&auto=format',
  'https://images.unsplash.com/photo-1709949908219-fd9046282019?q=80&w=1200&auto=format',
  'https://images.unsplash.com/photo-1508873881324-c92a3fc536ba?q=80&w=1200&auto=format',
];

const INFINITY_PATH =
  "M20.00 50.00 C25.89 26.82, 60.00 10.00, 70.00 50.00 C79.97 89.11, 118.88 81.63, 119.97 49.11 C116.68 24.08, 79.97 9.11, 70.00 50.00 C60.00 90.00, 19.13 75.97, 20.00 50.00";


  // Fetch product images for mouse trail
  useEffect(() => {
    const fetchProductImages = async () => {
      const { data } = await supabase
        .from('products')
        .select('image_url, product_images(image_url)')
        .limit(15);
      
      if (data) {
        const images: string[] = [];
        data.forEach(product => {
          if (product.image_url) images.push(product.image_url);
          if (product.product_images) {
            product.product_images.forEach((img: any) => {
              if (img.image_url) images.push(img.image_url);
            });
          }
        });
        setProductImages(images.slice(0, 12));
      }
    };
    
    fetchProductImages();
  }, []);

  // SVG Sparkle Component
  const SparkleIcon = () => (
    <svg 
      width="54" 
      height="54" 
      viewBox="0 0 1 1" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className="inline-block mx-4"
    >
      <path
        d="M1 0.5C0.867392 0.5 0.740215 0.447322 0.646447 0.353553C0.552678 0.259785 0.5 0.132608 0.5 0C0.5 0.132608 0.447322 0.259785 0.353553 0.353553C0.259785 0.447322 0.132608 0.5 0 0.5C0.132608 0.5 0.259785 0.552678 0.353553 0.646447C0.447322 0.740215 0.5 0.867392 0.5 1C0.5 0.867392 0.552678 0.740215 0.646447 0.646447C0.740215 0.552678 0.867392 0.5 1 0.5Z"
        fill="currentColor"
      />
    </svg>
  );

    const CircleIcon = () => (
    <svg 
      width="34" 
      height="34" 
      viewBox="0 0 1 1" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className="inline-block mx-4"
    >
       <path
    d="M0.947092 0.947095C1.03456 0.859637 1.00979 0.683139 0.899936 0.500056C1.00979 0.31671 1.03456 0.140476 0.947355 0.053018C0.859365 -0.0347038 0.682859 -0.00967809 0.500029 0.100172C0.316673 -0.00967809 0.14043 -0.0347038 0.0529666 0.0527545C-0.0347599 0.14074 -0.00973284 0.316973 0.100123 0.500056C-0.00973284 0.683139 -0.0344965 0.859637 0.0527031 0.947095C0.14043 1.03455 0.316673 1.00979 0.500029 0.899941C0.683122 1.00979 0.859629 1.03455 0.947092 0.947358V0.947095Z"
    fill="black"
  />
</svg>
  );
    const SharpyIcon = () => (
    <svg 
      width="34" 
      height="34" 
      viewBox="0 0 1 1" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className="inline-block mx-4"
    >
       <path
    d="M0.475097 0.0206081C0.480612 -0.00686926 0.519388 -0.00686941 0.524903 0.0206079L0.571269 0.251605C0.575051 0.270448 0.597161 0.278588 0.61201 0.266604L0.793792 0.119895C0.815436 0.102427 0.845153 0.127617 0.83198 0.152266L0.721096 0.359768C0.712075 0.37665 0.723822 0.397229 0.742771 0.397739L0.975238 0.403995C1.00289 0.404739 1.00963 0.443354 0.983905 0.453651L0.767467 0.540292C0.74985 0.547345 0.745772 0.570735 0.75994 0.58347L0.93413 0.740035C0.954822 0.758634 0.935419 0.792584 0.909186 0.783681L0.688795 0.708892C0.670805 0.702787 0.652793 0.718074 0.655584 0.737078L0.689853 0.970393C0.693926 0.998124 0.657484 1.01152 0.643038 0.987606L0.521679 0.786683C0.511768 0.770275 0.488232 0.770275 0.478321 0.786683L0.356962 0.987606C0.342516 1.01152 0.306074 0.998123 0.310147 0.970393L0.344416 0.737078C0.347207 0.718074 0.329195 0.702787 0.311205 0.708892L0.0908143 0.783681C0.0645805 0.792584 0.0451779 0.758634 0.0658702 0.740035L0.24006 0.58347C0.254228 0.570735 0.25015 0.547345 0.232533 0.540292L0.016095 0.453651C-0.00962926 0.443354 -0.00288931 0.404739 0.0247622 0.403995L0.257229 0.397739C0.276178 0.397229 0.287925 0.37665 0.278904 0.359768L0.16802 0.152266C0.154848 0.127617 0.184564 0.102427 0.206208 0.119895L0.38799 0.266604C0.402839 0.278588 0.424949 0.270448 0.428731 0.251605L0.475097 0.0206081Z"
    fill="black"
  />
</svg>
  );

  return (
    <div className="min-h-screen">
      {/* Hero Section - Full Screen */}
{/* Hero Section - HIRAX STUDIO Style */}
{/* Hero Section - Illustration Background */}
<section className="relative overflow-hidden h-screen w-full bg-[#FFFFFF]">
  {/* Background Illustration - Full Screen */}
  <div className="absolute inset-0">
    <div className="absolute inset-0" />
    <img
      src="./illustration.png"
      alt="Crochet illustration"
      className="w-full h-screen object-cover pl-50"
    />
  </div>

  {/* Decorative Blurs */}
  <div className="absolute inset-0 opacity-10 z-20">
    <div className="absolute top-20 left-20 w-72 h-72 bg-[#FFFFFF] rounded-full blur-3xl" />
    <div className="absolute bottom-20 right-20 w-96 h-96 bg-primary-dark rounded-full blur-3xl" />
  </div>
  
  <div className="relative h-full flex items-center max-w-7xl mx-auto px-2 z-30">
    {/* Left Side Content */}
    <div className="max-w-2xl space-y-10">
      {/* Main Heading */}
      <div className="space-y-2">
   <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-black drop-shadow-2xl leading-none font-f1">
    H
    <span className="blink-eye shine-eye font-extrabold text-[#D8A1A5]">O</span>
    <span className="blink-eye blink-delay shine-eye text-[#D8A1A5]">O</span>
    KS
  </h1>
        <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-black drop-shadow-2xl leading-none font-f1">
          ON
        </h1>
<h1 className="flex items-center text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black font-f1 leading-none">
  L
  <AnimateSvg
    height="1.4em"
    viewBox="10 0 120 100"
    className=""
    path={INFINITY_PATH}
    strokeColor="#D8A1A5"
    strokeWidth={14}
    animationDuration={2}
    enableHoverAnimation
    hoverAnimationType="redraw"
    initialAnimation
  />
  PS
</h1>

       <style>{`
  @keyframes blink {
    0%, 87%, 100% {
      transform: scaleY(1);
    }
    89% {
      transform: scaleY(0.6);
    }
    91%, 93% {
      transform: scaleY(0.04);
    }
    95% {
      transform: scaleY(0.6);
    }
    97% {
      transform: scaleY(1);
    }
  }

  @keyframes eye-shine {
    0%, 100% {
      filter: brightness(1);
    }
    50% {
      filter: brightness(1.2);
    }
  }

  .blink-eye {
    display: inline-block;
    animation: blink 4.8s infinite cubic-bezier(0.45, 0.05, 0.55, 0.95);
    transform-origin: center;
    transition: all 0.1s ease;
  }

  .shine-eye {
    animation: blink 4.8s infinite cubic-bezier(0.45, 0.05, 0.55, 0.95),
               eye-shine 3s infinite ease-in-out;
  }

  .blink-delay {
    animation-delay: 180ms;
  }
`}</style>
      </div>

      {/* Subtitle */}
      <div className="space-y-2">
        <p className="text-xl md:text-2xl text-black tracking-[0.2em] uppercase font-light">
          Handmade Crochet
        </p>
        <p className="text-lg md:text-xl text-black max-w-lg leading-relaxed">
          Each piece lovingly crafted by hand with premium yarn and attention to every detail
        </p>
      </div>

      {/* CTA Button */}
      {/* <div className="pt-4">
        <a 
          href="#products" 
          className="inline-flex items-center px-10 py-4 bg-white text-primary-dark font-semibold text-lg rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
        >
          <Package className="w-5 h-5 mr-2" />
          Explore Collection
        </a>
      </div> */}

      {/* Features List */}
      {/* <div className="flex gap-8 pt-4">
        <div className="flex items-center gap-2 text-black">
          <Heart className="w-5 h-5" />
          <span className="text-sm">Handcrafted</span>
        </div>
        <div className="flex items-center gap-2 text-black">
          <Sparkles className="w-5 h-5" />
          <span className="text-sm">Premium Yarn</span>
        </div>
        <div className="flex items-center gap-2 text-black">
          <Truck className="w-5 h-5" />
          <span className="text-sm">Fast Shipping</span>
        </div>
      </div> */}
    </div>
  </div>

  {/* Wave SVG Bottom */}
  {/* <div className="absolute bottom-0 left-0 right-0 z-30">
    <svg viewBox="0 0 1440 120" className="w-full h-auto">
      <path
        fill="#F2DFE1"
        d="M0,64 Q360,0 720,64 T1440,64 L1440,120 L0,120 Z"
      />
    </svg>
  </div> */}
</section>



      {/* Scrolling Text Marquee */}
      <section className="py-12 mt-30 bg-primary-lighter overflow-hidden">
        <ScrollBaseAnimation
          delay={500}
          baseVelocity={-3}
          clasname="font-bold font-f1 mb-10 text-4xl md:text-8xl text-primary-dark"
        >
          Handmade with Love <SparkleIcon /> Premium Quality Yarn <SparkleIcon /> Fast Shipping <SparkleIcon />
        </ScrollBaseAnimation>
        <div className="mt-4">
          <ScrollBaseAnimation
            delay={500}
            baseVelocity={3}
            clasname="font-bold font-f1 tracking-[-0.07em] mb-8 mt-2 text-4xl md:text-6xl text-primary"
          >
            Unique Designs <SharpyIcon /> Customizable <SharpyIcon /> Perfect Gifts <SharpyIcon />
          </ScrollBaseAnimation>
        </div>
      </section>

      {/* Mouse Trail Interactive Section - Full Screen */}
      <section className="h-screen w-full flex items-center overflow-hidden justify-center rounded-t-5xl">
         <ImageMouseTrail
        items={images}
        maxNumberOfImages={5}
        distance={20}
        imgClass='sm:w-80 w-48 sm:h-88 h-46'
      >
        <article className='relative z-50 '>
          <h1 className='lg:text-4xl md:text-3xl text-3xl text-center font-f5 tracking-wide font-semibold'>
            Experience Interactive Designs with <br />
            Dynamic Mouse Trails
          </h1>
        </article>
      </ImageMouseTrail>
      </section>

      {/* Features Section */}
{/* Features Section - Redesigned */}
<section className="py-20 bg-primary-lighter w-full">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    {/* Section Title */}
    <div className="text-center mb-12">
      <div className="inline-block mb-4">
        <svg 
          width="40" 
          height="40" 
          viewBox="0 0 1 1" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="mx-auto"
        >
          <path
            d="M0.5 0.1 L0.3 0.4 L0.5 0.4 L0.7 0.4 L0.5 0.1 M0.2 0.5 L0.5 0.5 L0.8 0.5 M0.35 0.6 L0.5 0.9 L0.65 0.6"
            stroke="#D8A1A5"
            strokeWidth="0.05"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
        Why Customers Love Us
      </h2>
    </div>

    {/* Features Grid */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-0">
      {/* Feature 1 */}
      <div className="bg-white p-8 text-center border-r border-gray-200 last:border-r-0 hover:bg-primary-lighter/30 transition-all duration-300 group">
        <div className="inline-flex items-center justify-center w-20 h-20 mb-6">
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="40" cy="40" r="35" stroke="#D8A1A5" strokeWidth="2" strokeDasharray="4 4"/>
            <path d="M30 35 L35 40 L30 45 M35 30 Q40 35 35 40 Q40 45 35 50" stroke="#D8A1A5" strokeWidth="2.5" strokeLinecap="round"/>
            <circle cx="50" cy="30" r="3" fill="#D8A1A5"/>
            <circle cx="55" cy="40" r="2.5" fill="#D8A1A5"/>
            <circle cx="50" cy="50" r="3" fill="#D8A1A5"/>
          </svg>
        </div>
        <h3 className="text-lg font-bold text-gray-800 mb-3">
          Handmade with Care
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed">
          Each piece is lovingly crafted by hand with attention to detail
        </p>
      </div>

      {/* Feature 2 */}
      <div className="bg-white p-8 text-center border-r border-gray-200 last:border-r-0 hover:bg-primary-lighter/30 transition-all duration-300 group">
        <div className="inline-flex items-center justify-center w-20 h-20 mb-6">
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="40" cy="40" r="35" stroke="#D8A1A5" strokeWidth="2"/>
            <text x="40" y="50" fontSize="28" fontWeight="bold" fill="#D8A1A5" textAnchor="middle">100%</text>
            <path d="M30 25 Q35 20 40 25 Q45 20 50 25" stroke="#D8A1A5" strokeWidth="2" strokeLinecap="round" fill="none"/>
          </svg>
        </div>
        <h3 className="text-lg font-bold text-gray-800 mb-3">
          Natural Ingredients Only
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed">
          Using only the finest natural yarn and eco-friendly materials
        </p>
      </div>

      {/* Feature 3 */}
      <div className="bg-white p-8 text-center border-r border-gray-200 last:border-r-0 hover:bg-primary-lighter/30 transition-all duration-300 group">
        <div className="inline-flex items-center justify-center w-20 h-20 mb-6">
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M40 25 Q30 30 30 40 Q30 50 40 55 Q50 50 50 40 Q50 30 40 25" stroke="#D8A1A5" strokeWidth="2.5" fill="none"/>
            <circle cx="40" cy="40" r="8" stroke="#D8A1A5" strokeWidth="2" fill="none"/>
            <path d="M35 40 L38 43 L45 36" stroke="#D8A1A5" strokeWidth="2" strokeLinecap="round" fill="none"/>
          </svg>
        </div>
        <h3 className="text-lg font-bold text-gray-800 mb-3">
          Premium Quality
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed">
          Rich in quality and crafted for lasting beauty and durability
        </p>
      </div>

      {/* Feature 4 */}
      <div className="bg-white p-8 text-center hover:bg-primary-lighter/30 transition-all duration-300 group">
        <div className="inline-flex items-center justify-center w-20 h-20 mb-6">
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M25 45 Q25 35 35 35 L45 35 Q55 35 55 45" stroke="#D8A1A5" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
            <circle cx="40" cy="28" r="6" stroke="#D8A1A5" strokeWidth="2" fill="none"/>
            <path d="M30 50 L35 45 M50 50 L45 45" stroke="#D8A1A5" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="40" cy="50" r="3" fill="#D8A1A5"/>
          </svg>
        </div>
        <h3 className="text-lg font-bold text-gray-800 mb-3">
          Cruelty-Free
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed">
          Never tested on animals, made with love and ethical practices
        </p>
      </div>
    </div>
  </div>
</section>


      {/* Featured Products Section */}
      {/* <section className="py-20 bg-white w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Featured Collection
            </h2>
            <p className="text-xl text-gray-600">
              Discover our handpicked favorites
            </p>
          </div>
          <FeaturedProducts onOpenProductDrawer={handleOpenProductDrawer} />
        </div>
      </section> */}

      {/* All Products Section */}
      <section id="products" className="py-20 mb-30 bg-primary-lighter w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Our Collection
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Browse through our beautiful handcrafted items
            </p>
          </div>
          
          {/* Category Filter */}
          <div className="mb-12">
            <CategoryFilter
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          </div>

          {/* Product Grid */}
          <ProductGrid 
            products={products} 
            loading={loading}
            onOpenProductDrawer={handleOpenProductDrawer}
          />
        </div>
      </section>

      {/* Newsletter Section */}
      {/* <section className="py-20 bg-gradient-to-r from-primary to-primary-light w-full">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Stay Updated
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Subscribe to get updates on new arrivals and special offers
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-4 rounded-full text-gray-800 focus:outline-none focus:ring-4 focus:ring-white/50"
            />
            <button className="px-8 py-4 bg-white text-primary-dark font-semibold rounded-full hover:bg-gray-100 transition-colors shadow-lg">
              Subscribe
            </button>
          </div>
        </div>
      </section> */}

      {/* Product Drawer */}
      <ProductDrawer
        productId={selectedProductId}
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </div>
  );
}
