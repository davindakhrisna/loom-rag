"use server"

import { prisma } from '@/lib/prisma'

export async function getLevel(userId: string) {
  try {
    console.log('Querying database for user ID:', userId);
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { 
        id: true,
        level: true 
      }
    });
    
    console.log('Database query result:', user);
    return user?.level ?? 0;
  } catch (error) {
    console.error('Error in getLevel:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      userId
    });
    throw new Error('Failed to fetch user level');
  }
}
