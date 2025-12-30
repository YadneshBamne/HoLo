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
            ? 'text-white shadow-lg scale-105'
            : 'bg-white text-gray-700 shadow-md hover:shadow-lg'
        }`}
        style={
          selectedCategory === null
            ? {
                background: 'linear-gradient(135deg, #D8A1A5 0%, #E8B4B8 100%)',
                boxShadow: '0 8px 24px rgba(216, 161, 165, 0.4)',
              }
            : {
                border: '1.5px solid rgba(216, 161, 165, 0.2)',
              }
        }
      >
        All Products
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onSelectCategory(category.id)}
          className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
            selectedCategory === category.id
              ? 'text-white shadow-lg scale-105'
              : 'bg-white text-gray-700 shadow-md hover:shadow-lg'
          }`}
          style={
            selectedCategory === category.id
              ? {
                  background: 'linear-gradient(135deg, #D8A1A5 0%, #E8B4B8 100%)',
                  boxShadow: '0 8px 24px rgba(216, 161, 165, 0.4)',
                }
              : {
                  border: '1.5px solid rgba(216, 161, 165, 0.2)',
                }
          }
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}
