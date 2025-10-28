import { z } from 'zod';

// Schéma pour les informations du passager
export const passengerInfoSchema = z.object({
  name: z.string().min(1, "Le nom du passager est requis"),
  phone: z.string().min(8, "Le numéro de téléphone doit contenir au moins 8 chiffres"),
  email: z.string().email("Email invalide"),
});

// Schéma pour la création d'une réservation
export const reservationSchema = z.object({
  schedule_id: z.string().min(1, "L'ID de l'horaire est requis"),
  passenger_info: passengerInfoSchema,
});

// Schéma pour les détails d'une réservation
export const reservationDetailsSchema = z.object({
  id: z.string().min(1, "L'ID est requis"),
  schedule_id: z.string().min(1, "L'ID de l'horaire est requis"),
  passenger_info: passengerInfoSchema,
  status: z.enum(["pending", "confirmed", "cancelled", "completed"], {
    errorMap: () => ({ message: "Le statut doit être 'pending', 'confirmed', 'cancelled' ou 'completed'" })
  }),
  created_at: z.string().min(1, "La date de création est requise"),
  updated_at: z.string().min(1, "La date de mise à jour est requise"),
});

// Types TypeScript dérivés des schémas
export type PassengerInfo = z.infer<typeof passengerInfoSchema>;
export type ReservationData = z.infer<typeof reservationSchema>;
export type ReservationDetails = z.infer<typeof reservationDetailsSchema>;