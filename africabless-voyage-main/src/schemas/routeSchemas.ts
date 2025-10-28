import { z } from 'zod';

// Schéma pour les filtres de recherche de trajets
export const searchFiltersSchema = z.object({
  origin: z.string().min(1, "L'origine est requise").optional(),
  destination: z.string().min(1, "La destination est requise").optional(),
  date: z.string().optional(),
  min_price: z.number().min(0, "Le prix minimum doit être positif").optional(),
  max_price: z.number().min(0, "Le prix maximum doit être positif").optional(),
}).refine(
  (data) => {
    if (data.min_price !== undefined && data.max_price !== undefined) {
      return data.min_price <= data.max_price;
    }
    return true;
  },
  {
    message: "Le prix minimum ne peut pas être supérieur au prix maximum",
    path: ["min_price"],
  }
);

// Schéma pour les itinéraires populaires
export const popularRouteSchema = z.object({
  id: z.string().min(1, "L'ID est requis"),
  origin: z.string().min(1, "L'origine est requise"),
  destination: z.string().min(1, "La destination est requise"),
  duration: z.number().min(0, "La durée doit être positive"),
  agency_name: z.string().min(1, "Le nom de l'agence est requis"),
});

// Schéma pour les détails d'un trajet
export const tripSchema = z.object({
  id: z.string().min(1, "L'ID est requis"),
  route_id: z.string().min(1, "L'ID de l'itinéraire est requis"),
  departure_time: z.string().min(1, "L'heure de départ est requise"),
  price: z.number().min(0, "Le prix doit être positif"),
  seats: z.number().min(0, "Le nombre de sièges doit être positif"),
  available_seats: z.number().min(0, "Le nombre de sièges disponibles doit être positif").optional(),
  origin: z.string().min(1, "L'origine est requise"),
  destination: z.string().min(1, "La destination est requise"),
  duration: z.number().min(0, "La durée doit être positive"),
  agency_name: z.string().min(1, "Le nom de l'agence est requis"),
  agency_rating: z.number().min(0, "La note doit être positive").max(5, "La note maximale est 5").optional(),
  agency_id: z.string().min(1, "L'ID de l'agence est requis").optional(),
});

// Types TypeScript dérivés des schémas
export type SearchFilters = z.infer<typeof searchFiltersSchema>;
export type PopularRoute = z.infer<typeof popularRouteSchema>;
export type Trip = z.infer<typeof tripSchema>;