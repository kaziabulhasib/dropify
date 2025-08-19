import * as z from "zod";

export const signUpSchema = z
  .object({
    email: z
      .string()
      .min(1, { message: "email is required" })
      .email({ message: "please enter a valid email" }),

    password: z
      .string()
      .min(1, { message: "password is required" })
      .min(8, { message: "password should be atleast 8 character long" }),

    passwordConfirmation: z
      .string()
      .min(1, { message: "please confirm your password" }),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "password did not matched",
    path: ["passwordConfirmation"],
  });
