import { useState, useEffect } from 'react';

interface UseScrollPositionReturn {
  scrollX: number;
  scrollY: number;
}

/**
 * Hook personnalisé pour suivre la position du scroll
 * @returns Un objet contenant les positions de scroll X et Y
 */
export function useScrollPosition(): UseScrollPositionReturn {
  const [scrollPosition, setScrollPosition] = useState({
    scrollX: 0,
    scrollY: 0
  });

  useEffect(() => {
    let throttleTimer: NodeJS.Timeout | null = null;

    const handleScroll = () => {
      // Utiliser un throttling pour éviter les performances lentes
      if (throttleTimer) {
        clearTimeout(throttleTimer);
      }

      throttleTimer = setTimeout(() => {
        setScrollPosition({
          scrollX: window.scrollX || window.pageXOffset,
          scrollY: window.scrollY || window.pageYOffset
        });
      }, 100);
    };

    // Ajouter l'écouteur d'événement de scroll
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Appeler immédiatement pour obtenir la position initiale
    handleScroll();

    // Nettoyer l'écouteur d'événement
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (throttleTimer) {
        clearTimeout(throttleTimer);
      }
    };
  }, []);

  return scrollPosition;
}