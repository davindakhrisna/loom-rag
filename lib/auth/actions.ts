"use server";

import { hashSync } from "bcrypt-ts";
import { prisma } from "@/lib/prisma";
import { userSchema, loginSchema } from "@/lib/auth/zod";
import { redirect } from "next/navigation";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";

export const Register = async (prevMethod: unknown, formData: FormData) => {

  // Validasi Form Register
  const validatedData = userSchema.safeParse(
    Object.fromEntries(
      formData.entries()
    )
  );

  if (!validatedData.success) {
    return {
      error: validatedData.error.flatten().fieldErrors
    };
  }

  // Hashing Password
  const { name, username, password } = validatedData.data;
  const hashedPassword = hashSync(password, 10);

  // Olah data user prisma ke DB
  try {
    await prisma.user.create({
      data: {
        name,
        username,
        password: hashedPassword
      }
    })
  } catch {
    return { message: "Registration Failed" };
  }
  redirect("/login");
}

export const Login = async (prevMethod: unknown, formData: FormData) => {
  const validatedData = loginSchema.safeParse(
    Object.fromEntries(
      formData.entries()
    )
  );

  if (!validatedData.success) {
    return {
      error: validatedData.error.flatten().fieldErrors
    };
  }

  const { username, password } = validatedData.data;

  try {
    await signIn("credentials", { username, password, redirectTo: "/dashboard" });
  }
  catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { message: "Invalid Credentials" };
        default:
          return { message: "Something went wrong" };
      }
    }
    throw error;
  }
}
