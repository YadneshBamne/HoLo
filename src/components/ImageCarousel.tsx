import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ProductImage } from '../lib/types';

interface ImageCarouselProps {
  images: ProductImage[];
  mainImage?: string | null;
}

export default function ImageCarousel({ images, mainImage }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const allImages = images.length > 0 
    ? images.sort((a, b) => a.position - b.position).map(img => img.image_url)
    : mainImage 
    ? [mainImage]
    : [];

  if (allImages.length === 0) {
    return (
      <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
        <span className="text-gray-400 text-lg">No Image Available</span>
      </div>
    );
  }

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  return (
    <div className="relative w-full h-96 bg-gray-100 rounded-lg overflow-hidden group">
      <img
        src={allImages[currentIndex]}
        alt={`Product image ${currentIndex + 1}`}
        className="w-full h-full object-cover"
      />

      {allImages.length > 1 && (
        <>
          {/* Previous Button */}
          <button
            onClick={prevImage}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Next Button */}
          <button
            onClick={nextImage}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
            {allImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex ? 'bg-white w-6' : 'bg-white/50'
                }`}
              />
            ))}
          </div>

          {/* Image Counter */}
          <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
            {currentIndex + 1} / {allImages.length}
          </div>
        </>
      )}
    </div>
  );
}
