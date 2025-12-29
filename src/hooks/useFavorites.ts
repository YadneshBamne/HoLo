import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

// Generate a simple session ID for anonymous users
const getSessionId = () => {
  let sessionId = localStorage.getItem('holo_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    localStorage.setItem('holo_session_id', sessionId);
  }
  return sessionId;
};

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const sessionId = getSessionId();

  useEffect(() => {
    fetchFavorites();

    // Real-time subscription for favorites changes
    const subscription = supabase
      .channel('favorites-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'favorites',
        },
        (payload) => {
          console.log('Favorites changed:', payload);
          fetchFavorites();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchFavorites = async () => {
    try {
      // Since we don't have auth, we'll use a session ID stored in localStorage
      // In production, you'd use actual user authentication
      const { data, error } = await supabase
        .from('favorites')
        .select('product_id')
        .eq('user_session_id', sessionId);

      if (error) throw error;
      
      const favoriteIds = data?.map(fav => fav.product_id) || [];
      setFavorites(favoriteIds);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (productId: string) => {
    const isFav = favorites.includes(productId);

    try {
      if (isFav) {
        // Remove from favorites
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('product_id', productId)
          .eq('user_session_id', sessionId);

        if (error) throw error;
        
        setFavorites(prev => prev.filter(id => id !== productId));
      } else {
        // Add to favorites
        const { error } = await supabase
          .from('favorites')
          .insert({
            product_id: productId,
            user_session_id: sessionId,
          });

        if (error) throw error;
        
        setFavorites(prev => [...prev, productId]);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      alert('Failed to update favorites. Please try again.');
    }
  };

  const isFavorite = (productId: string) => {
    return favorites.includes(productId);
  };

  const clearFavorites = async () => {
    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_session_id', sessionId);

      if (error) throw error;
      
      setFavorites([]);
    } catch (error) {
      console.error('Error clearing favorites:', error);
    }
  };

  return { favorites, toggleFavorite, isFavorite, clearFavorites, loading };
}
