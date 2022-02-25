import { z } from "zod"

export const email = z
  .string()
  .email()
  .transform((string) => string.toLowerCase().trim())

const minPasswordLength = 10

export const password = z
  .string()
  .min(minPasswordLength)
  .transform((string) => string.trim())

export const Signup = z.object({
  email,
  password,
})

export const Login = z.object({
  email,
  password: z.string(),
})

export const ForgotPassword = z.object({
  email,
})

export const ResetPassword = z
  .object({
    password: password,
    passwordConfirmation: password,
    token: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords don't match",
    path: ["passwordConfirmation"], // set the path of the error
  })

export const ChangePassword = z.object({
  currentPassword: z.string(),
  newPassword: password,
})
