// Schemas Zod responsáveis por validar dados de entrada

import { z } from "zod";

// ===============================
// Validação para registo
// ===============================
export const registerSchema = z.object({
  email: z.string().email("Invalid email"),
  firstName: z.string().min(2, "Short name"),
  lastName: z.string().min(2, "Short last name"),
  nickName: z.string()
    .trim()
    .min(2, "Short nickname")
    .regex(/^\S+$/, "Nickname cannot contain spaces"),
  password: z.string().min(6, "Your password must have at least 6 characters"),
});

// ===============================
// Validação para login
// ===============================
export const loginSchema = z.object({
  identifier: z.string().min(1, "Email or nickname is required"),
  password: z.string().min(1, "Password is required"),
});



// ===============================
// Validação para logout
// ===============================
export const logoutSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token is required"),
});

// ===============================
// Validação para recuperar password
// ===============================
export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email"),
});

// ===============================
// Validação para redefinir password
// ===============================
export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token is required"),
  newPassword: z.string().min(6, "Your password must have at least 6 characters"),
});