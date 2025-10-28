import { useState, useEffect } from 'react';

/**
 * Hook personnalisé pour utiliser localStorage avec useState
 * @param key - La clé dans localStorage
 * @param initialValue - La valeur initiale si aucune valeur n'existe dans localStorage
 * @returns [state, setState] - Le state actuel et une fonction pour le mettre à jour
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  // Obtenir la valeur depuis localStorage ou utiliser la valeur initiale
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      // Parser le JSON ou retourner la valeur telle quelle
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // Si une erreur se produit, retourner la valeur initiale
      console.error(`Erreur lors de la lecture de localStorage pour la clé "${key}":`, error);
      return initialValue;
    }
  });

  // Retourner une version encapsulée de useState's setter function
  // qui persiste la nouvelle valeur dans localStorage.
  const setValue = (value: T) => {
    try {
      // Autoriser la valeur à être une fonction pour que nous ayons la même API que useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      // Si une erreur se produit, afficher l'erreur
      console.error(`Erreur lors de l'écriture dans localStorage pour la clé "${key}":`, error);
    }
  };

  return [storedValue, setValue];
}