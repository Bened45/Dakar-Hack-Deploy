import { useState, useEffect } from 'react';
import { useMediaQuery } from './useMediaQuery';

interface UseResponsiveReturn {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isLargeScreen: boolean;
}

/**
 * Hook personnalisé pour détecter la taille de l'écran
 * @returns Un objet contenant les états de responsive
 */
export function useResponsive(): UseResponsiveReturn {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  // Utiliser le hook useMediaQuery pour détecter les breakpoints
  const mobile = useMediaQuery('(max-width: 767px)');
  const tablet = useMediaQuery('(min-width: 768px) and (max-width: 1023px)');
  const desktop = useMediaQuery('(min-width: 1024px) and (max-width: 1279px)');
  const largeScreen = useMediaQuery('(min-width: 1280px)');

  useEffect(() => {
    setIsMobile(mobile);
    setIsTablet(tablet);
    setIsDesktop(desktop);
    setIsLargeScreen(largeScreen);
  }, [mobile, tablet, desktop, largeScreen]);

  return {
    isMobile,
    isTablet,
    isDesktop,
    isLargeScreen
  };
}