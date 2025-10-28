import { useLocalStorage } from './useLocalStorage';
import { Trip } from '@/schemas';

/**
 * Hook personnalisé pour gérer les trajets favoris
 * @returns {Array} [favorites, addFavorite, removeFavorite, isFavorite]
 */
export function useFavorites() {
  const [favorites, setFavorites] = useLocalStorage<Trip[]>('favoriteTrips', []);

  /**
   * Ajouter un trajet aux favoris
   * @param trip - Le trajet à ajouter aux favoris
   */
  const addFavorite = (trip: Trip) => {
    setFavorites(prev => {
      // Vérifier si le trajet est déjà dans les favoris
      const isAlreadyFavorite = prev.some(fav => fav.id === trip.id);
      
      if (isAlreadyFavorite) {
        return prev;
      }
      
      // Ajouter le trajet aux favoris
      return [...prev, trip];
    });
  };

  /**
   * Retirer un trajet des favoris
   * @param tripId - L'ID du trajet à retirer des favoris
   */
  const removeFavorite = (tripId: string) => {
    setFavorites(prev => prev.filter(trip => trip.id !== tripId));
  };

  /**
   * Vérifier si un trajet est dans les favoris
   * @param tripId - L'ID du trajet à vérifier
   * @returns boolean - True si le trajet est dans les favoris, false sinon
   */
  const isFavorite = (tripId: string) => {
    return favorites.some(trip => trip.id === tripId);
  };

  return [favorites, addFavorite, removeFavorite, isFavorite] as const;
}