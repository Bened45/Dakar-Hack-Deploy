import { useState, useEffect } from 'react';

/**
 * Hook personnalisé pour détecter les requêtes média
 * @param query - La requête média à surveiller (ex: '(min-width: 768px)')
 * @returns boolean - True si la requête média correspond, false sinon
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    mediaQuery.addEventListener('change', handler);
    
    // Nettoyage de l'écouteur d'événements
    return () => {
      mediaQuery.removeEventListener('change', handler);
    };
  }, [query]);

  return matches;
}