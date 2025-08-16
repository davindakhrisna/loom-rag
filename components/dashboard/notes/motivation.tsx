
import Link from "next/link"
import { Heart, Asterisk, Star } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function ActionButton() {
  return (
    <Button className="w-full cursor-pointer">
      <Link href="/dashboard" className="w-full flex items-center justify-center gap-1">
        <Asterisk />
        Your Current Level: 69
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
    <Button className="w-full cursor-pointer p-7" variant="outline">
      <Link href="/community" className="w-full flex items-center justify-center gap-1">
        <Star />
        See how others are going
      </Link>
    </Button>
  )
}
