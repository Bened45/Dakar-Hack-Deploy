import { z } from 'zod';

// Schéma pour les informations de connexion
export const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
});

// Schéma pour l'inscription
export const signupSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  phone: z.string().min(8, "Le numéro de téléphone doit contenir au moins 8 chiffres"),
});

// Schéma pour les informations du profil utilisateur
export const userProfileSchema = z.object({
  fullName: z.string().min(1, "Le nom complet est requis"),
  email: z.string().email("Email invalide"),
  phone: z.string().min(8, "Le numéro de téléphone doit contenir au moins 8 chiffres"),
  address: z.string().optional(),
  language: z.enum(["fr", "wo"], { 
    errorMap: () => ({ message: "La langue doit être 'fr' ou 'wo'" }) 
  }).optional(),
});

// Schéma pour la mise à jour du mot de passe
export const passwordChangeSchema = z.object({
  current_password: z.string().min(6, "Le mot de passe actuel doit contenir au moins 6 caractères"),
  new_password: z.string().min(6, "Le nouveau mot de passe doit contenir au moins 6 caractères"),
}).refine(
  (data) => data.current_password !== data.new_password,
  {
    message: "Le nouveau mot de passe doit être différent de l'ancien",
    path: ["new_password"],
  }
);

// Types TypeScript dérivés des schémas
export type LoginData = z.infer<typeof loginSchema>;
export type SignupData = z.infer<typeof signupSchema>;
export type UserProfileData = z.infer<typeof userProfileSchema>;
export type PasswordChangeData = z.infer<typeof passwordChangeSchema>;