// Controller: recebe pedidos HTTP e delega para a camada de serviços

import {
  registerUser,
  loginUser,
  logoutUser,
  forgotPasswordService,
  resetPasswordService
} from "../services/auth.service.js";


import {
  forgotPasswordSchema,
  loginSchema,
  logoutSchema,
  registerSchema,
  resetPasswordSchema
} from "../schemas/auth.schema.js";


import { validateSchema } from "../utils/validation.js";



// ============================
// REGISTER
// ============================
export async function register(req, res, next) {
  try {

    const body = validateSchema(registerSchema, req.body);


    const result = await registerUser(body);


    return res.status(201).json(result);

  } catch (err) {
    next(err);
  }
}


// ============================
// LOGIN
// ============================
export async function login(req, res, next) {
  try {

    const body = validateSchema(loginSchema, req.body);

    const result = await loginUser(body);


    return res.json(result);

  } catch (err) {
    next(err);
  }
}


// ============================
// LOGOUT
// ============================
export async function logout(req, res, next) {
  try {
    const { refreshToken } = req.body;
    const result = await logoutUser(refreshToken);
    return res.json(result);
  } catch (err) {
    next(err);
  }
}


// ============================
// FORGOT PASSWORD
// ============================
export async function forgotPassword(req, res, next) {
  try {
    
    
    const { email } = validateSchema(forgotPasswordSchema, req.body);
    
    const result = await forgotPasswordService(email);
   
    return res.json(result);
  
  } catch (err) {
    next(err);
  }
}


// ============================
// RESET PASSWORD
// ============================
export async function resetPassword(req, res, next) {
  try {

   
    const { token, newPassword } = validateSchema(resetPasswordSchema, req.body);
    
    
    const result = await resetPasswordService(token, newPassword);
   
    return res.json(result);
  
  } catch (err) {
    next(err);
  }
}
