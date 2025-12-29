import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Category } from '../lib/types';

interface CategoryFilterProps {
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string | null) => void;
}

export default function CategoryFilter({ selectedCategory, onSelectCategory }: CategoryFilterProps) {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .order('name');
    
    if (data) setCategories(data);
  };

  return (
    <div className="flex flex-wrap justify-center gap-3">
      <button
        onClick={() => onSelectCategory(null)}
        className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
          selectedCategory === null
            ? 'bg-primary text-white shadow-lg scale-105'
            : 'bg-white text-gray-700 hover:bg-primary-lighter hover:text-primary-dark shadow-md'
        }`}
      >
        All Products
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onSelectCategory(category.id)}
          className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
            selectedCategory === category.id
              ? 'bg-primary text-white shadow-lg scale-105'
              : 'bg-white text-gray-700 hover:bg-primary-lighter hover:text-primary-dark shadow-md'
          }`}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}
