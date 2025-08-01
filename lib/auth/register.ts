"use server";

import { hashSync } from "bcrypt-ts";
import { prisma } from "@/lib/prisma";
import { userSchema } from "@/lib/auth/zod";
import { redirect } from "next/navigation";

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
