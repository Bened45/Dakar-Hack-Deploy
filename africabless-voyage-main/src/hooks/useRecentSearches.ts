import { useLocalStorage } from './useLocalStorage';

interface SearchHistoryItem {
  id: string;
  origin: string;
  destination: string;
  date: string;
  timestamp: number;
}

/**
 * Hook personnalisé pour gérer l'historique des recherches récentes
 * @returns {Array} [recentSearches, addSearch, clearSearches]
 */
export function useRecentSearches() {
  const [recentSearches, setRecentSearches] = useLocalStorage<SearchHistoryItem[]>('recentSearches', []);

  /**
   * Ajouter une recherche à l'historique
   * @param origin - Ville de départ
   * @param destination - Ville de destination
   * @param date - Date du voyage
   */
  const addSearch = (origin: string, destination: string, date: string) => {
    const newSearch: SearchHistoryItem = {
      id: Math.random().toString(36).substr(2, 9),
      origin,
      destination,
      date,
      timestamp: Date.now()
    };

    setRecentSearches(prev => {
      // Filtrer les recherches existantes pour éviter les doublons
      const filtered = prev.filter(
        search => !(search.origin === origin && search.destination === destination && search.date === date)
      );
      
      // Ajouter la nouvelle recherche au début
      const updated = [newSearch, ...filtered];
      
      // Garder seulement les 5 recherches les plus récentes
      return updated.slice(0, 5);
    });
  };

  /**
   * Effacer toutes les recherches récentes
   */
  const clearSearches = () => {
    setRecentSearches([]);
  };

  return [recentSearches, addSearch, clearSearches] as const;
}