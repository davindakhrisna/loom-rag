"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line } from "recharts"
import { CalendarDays, FileText, TrendingUp, User, CheckCircle, XCircle, BarChart3, Plus, Brain } from "lucide-react"

// Mock data for charts
const weeklyProgress = [
  { day: "Mon", notes: 5 },
  { day: "Tue", notes: 8 },
  { day: "Wed", notes: 3 },
  { day: "Thu", notes: 12 },
  { day: "Fri", notes: 7 },
  { day: "Sat", notes: 9 },
  { day: "Sun", notes: 4 },
]

const monthlyTrend = [
  { month: "Jan", total: 45 },
  { month: "Feb", total: 52 },
  { month: "Mar", total: 38 },
  { month: "Apr", total: 67 },
  { month: "May", total: 73 },
  { month: "Jun", total: 81 },
]

export default function Dashboard() {
  const [date, setDate] = useState<Date | undefined>(new Date())

  // Mock user data
  const userData = {
    name: "Alex Johnson",
    level: 7,
    currentDayProgress: true,
    streak: 12,
    totalNotes: 247,
  }

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center py-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Profile Settings</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your profile and preferences</p>
        </div>


        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="shadow-lg border-0 bg-card">
            <CardHeader className="text-center pb-4">
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <User className="w-10 h-10 text-primary-foreground" />
              </div>
              <CardTitle className="text-2xl font-bold">{userData.name}</CardTitle>
              <CardDescription className="text-base">Level {userData.level} Note Taker</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <span className="font-medium">Today&quot;s Progress</span>
                {userData.currentDayProgress ? (
                  <Badge className="bg-green-500 hover:bg-green-600">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Complete
                  </Badge>
                ) : (
                  <Badge variant="secondary">
                    <XCircle className="w-4 h-4 mr-1" />
                    Pending
                  </Badge>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold">{userData.streak}</div>
                  <div className="text-sm text-muted-foreground">Day Streak</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold">{userData.totalNotes}</div>
                  <div className="text-sm text-muted-foreground">Total Notes</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-2 text-lg">
                <CalendarDays className="w-4" />
                See Your Notes
              </CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                captionLayout="dropdown"
              />
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-lg border-0 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-2 text-lg">
              <BarChart3 className="w-4 h-4" />
              Your Level By The Past 7 Days
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                notes: {
                  label: "Notes",
                  color: "hsl(var(--primary))",
                },
              }}
              className="h-[300px] w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyProgress} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar
                    dataKey="notes"
                    fill="hsl(var(--primary))"
                    radius={[6, 6, 0, 0]}
                    className="fill-primary"
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
