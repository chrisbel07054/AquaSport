import { z } from "zod"

// Esquema de validación para el formulario de login
export const loginSchema = z.object({
  email: z.string().min(1, { message: "El email es requerido" }).email({ message: "Email inválido" }),
  password: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres" }),
})

// Esquema de validación para el formulario de registro
export const registerSchema = z
  .object({
    nombre: z
      .string()
      .min(2, { message: "El nombre debe tener al menos 2 caracteres" })
      .max(50, { message: "El nombre no puede exceder los 50 caracteres" }),
    email: z.string().min(1, { message: "El email es requerido" }).email({ message: "Email inválido" }),
    password: z
      .string()
      .min(6, { message: "La contraseña debe tener al menos 6 caracteres" })
      .max(100, { message: "La contraseña no puede exceder los 100 caracteres" }),
    confirmPassword: z.string().min(1, { message: "Confirmar contraseña es requerido" }),
    genero: z
      .string()
      .min(1, { message: "El género no puede estar vacío" })
      .refine((value) => value === "masculino" || value === "femenino", {
        message: "El género debe ser 'masculino' o 'femenino'",
      }),
    edad: z
      .number()
      .min(18, { message: "La edad mínima para competir es 18 años" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });


// Esquema de validación para el formulario de crear/editar torneo
export const torneoSchema = z.object({
  nombre: z
    .string()
    .min(5, { message: "El nombre debe tener al menos 5 caracteres" })
    .max(100, { message: "El nombre no puede exceder los 100 caracteres" }),
  deporte: z.string().min(1, { message: "Debes seleccionar un deporte" }),
  fecha: z
    .string()
    .min(1, { message: "La fecha es requerida" })
    .refine((fecha) => new Date(fecha) > new Date(), {
      message: "La fecha debe ser posterior a hoy",
    }),
  ubicacion: z
    .string()
    .min(5, { message: "La ubicación debe tener al menos 5 caracteres" })
    .max(100, { message: "La ubicación no puede exceder los 100 caracteres" }),
  cupo: z
    .number({
      invalid_type_error: "El cupo debe ser un número",
      required_error: "El cupo es requerido",
    })
    .min(1, { message: "El cupo debe ser al menos 1" })
    .max(10000, { message: "El cupo no puede exceder 10000" }),
  precio: z
    .number({
      invalid_type_error: "El precio debe ser un número",
    })
    .min(0, { message: "El precio no puede ser negativo" })
    .optional(),
  descripcion: z
    .string()
    .min(20, { message: "La descripción debe tener al menos 20 caracteres" })
    .max(1000, { message: "La descripción no puede exceder los 1000 caracteres" }),
})

// Esquema de validación para el formulario de editar perfil.
export const profileSchema = z.object({
  nombre: z
    .string()
    .min(2, { message: "El nombre debe tener al menos 2 caracteres" })
    .max(50, { message: "El nombre no puede exceder los 50 caracteres" }),
  email: z.string().min(1, { message: "El email es requerido" }).email({ message: "Email inválido" }),
  genero: z.enum(["masculino", "femenino"], {
    required_error: "Debes seleccionar un género",
  }),
  edad: z
    .number({
      required_error: "La edad es requerida",
      invalid_type_error: "La edad debe ser un número",
    })
    .min(18, { message: "Debes tener al menos 18 años para participar" })
    .max(50, { message: "La edad ingresada no es válida" }),
})