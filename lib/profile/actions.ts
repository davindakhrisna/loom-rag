"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma";
import { profileSchema } from "@/lib/profile/zod";

export const profileAction = async (prevMethod: unknown, formData: FormData) => {
  const session = await auth();

  if (!session || !session.user?.id) {
    return { message: "Unauthorized" };
  }

  const validatedData = profileSchema.safeParse(
    Object.fromEntries(
      formData.entries()
    )
  );

  if (!validatedData.success) {
    return {
      error: validatedData.error.flatten().fieldErrors
    };
  }

  const { name, punchcard, username } = validatedData.data;

  try {
    await prisma.user.update({
      where: {
        username: session.user.username
      },
      data: {
        name: name,
        punchcard: punchcard
      }
    });
    await prisma.user.update({
      where: {
        id: session.user.id
      },
      data: {
        username: username
      }
    })

    return { success: true, message: "Updated successfully" };
  } catch (error) {
    console.error("Error updating profile:", error);
    return { message: "Failed to update" };
  }
}

export const updateActivityVisibility = async (visible: boolean) => {
  const session = await auth()

  if (!session || !session.user?.id) {
    return { success: false, message: "Unauthorized" }
  }

  try {
    await prisma.user.update({
      where: { username: session.user.username },
      data: { activity: visible },
    })
    return { success: true, message: "Activity visibility updated" }
  } catch (error) {
    console.error("Error updating activity visibility:", error)
    return { success: false, message: "Failed to update activity visibility" }
  }
}

export const updateNotesVisibility = async (visible: boolean) => {
  const session = await auth()

  if (!session || !session.user?.id) {
    return { success: false, message: "Unauthorized" }
  }

  try {
    await prisma.user.update({
      where: { username: session.user.username },
      data: { notesvisibility: visible },
    })
    return { success: true, message: "Notes visibility updated" }
  } catch (error) {
    console.error("Error updating notes visibility:", error)
    return { success: false, message: "Failed to update notes visibility" }
  }
}
