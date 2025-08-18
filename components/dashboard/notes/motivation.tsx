"use client"

import Link from "next/link"
import { Heart, Asterisk, Book } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Session } from "next-auth"
import { useEffect, useState } from "react"
import { getLevel } from "@/lib/dashboard/notes/motivation/actions"

interface MotivationProps {
  session: Session | null;
}

export function ActionButton({ session }: MotivationProps) {
  const [level, setLevel] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLevel = async () => {
      if (!session?.user?.id) {
        setIsLoading(false);
        return;
      }

      try {
        const userLevel = await getLevel(session.user.id);
        setLevel(userLevel);
      } catch (err) {
        console.error('Failed to fetch level:', err);
        setError('Failed to load level');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLevel();
  }, [session?.user?.id]);

  return (
    <Button className="w-full cursor-pointer">
      <Link href="/dashboard" className="w-full flex items-center justify-center gap-1">
        <Asterisk />
        {isLoading ? (
          'Loading level...'
        ) : error ? (
          'Error loading level'
        ) : (
          `Your Current Level: ${level}`
        )}
      </Link>
    </Button>
  )
}

export function MotivationBlock() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-lg dark:text-white">
          <Heart className="w-5 h-5 mr-2 text-red-500" />
          Daily Motivation
        </CardTitle>
      </CardHeader>
      <CardContent>
        <blockquote className="text-sm italic text-gray-600 dark:text-gray-300 leading-relaxed">
          &quot;Everything you do and its consequences, is your choice.&quot;
        </blockquote>
      </CardContent>
    </Card>
  )
}

export function ActionCommunity() {
  return (
    <Button className="w-full cursor-pointer p-8" variant="outline">
      <Link href="/dashboard" className="w-full flex items-center justify-center gap-1">
        <Book />
        See All Your Notes
      </Link>
    </Button>
  )
}
