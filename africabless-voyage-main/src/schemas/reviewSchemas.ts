import { z } from 'zod';

// Schéma pour les avis sur les trajets/agences
export const reviewSchema = z.object({
  id: z.string().min(1, "L'ID est requis"),
  trip_id: z.string().min(1, "L'ID du trajet est requis"),
  user_id: z.string().min(1, "L'ID de l'utilisateur est requis"),
  rating: z.number().min(1, "La note minimale est 1").max(5, "La note maximale est 5"),
  comment: z.string().max(500, "Le commentaire ne peut pas dépasser 500 caractères").optional(),
  agency_id: z.string().min(1, "L'ID de l'agence est requis"),
  created_at: z.string().min(1, "La date de création est requise"),
});

// Schéma pour la création d'un avis
export const createReviewSchema = z.object({
  trip_id: z.string().min(1, "L'ID du trajet est requis"),
  rating: z.number().min(1, "La note minimale est 1").max(5, "La note maximale est 5"),
  comment: z.string().max(500, "Le commentaire ne peut pas dépasser 500 caractères").optional(),
  agency_id: z.string().min(1, "L'ID de l'agence est requis"),
});

// Schéma pour les statistiques d'avis
export const reviewStatsSchema = z.object({
  average_rating: z.number().min(0).max(5),
  total_reviews: z.number().min(0),
  rating_distribution: z.object({
    1: z.number(),
    2: z.number(),
    3: z.number(),
    4: z.number(),
    5: z.number(),
  }),
});

// Types TypeScript dérivés des schémas
export type Review = z.infer<typeof reviewSchema>;
export type CreateReviewData = z.infer<typeof createReviewSchema>;
export type ReviewStats = z.infer<typeof reviewStatsSchema>;