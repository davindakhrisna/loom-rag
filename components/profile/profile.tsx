"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Settings, Shield, Bot, User } from "lucide-react"
import { Session } from "next-auth"


interface ProfileProps {
  session: Session | null;
}

export default function ProfilePage({ session }: ProfileProps) {
  const [name, setName] = useState(session?.user?.name || "Guest")
  const [aiPersonality, setAiPersonality] = useState(session?.user?.punchcard || "I am a helpful AI assistant.")
  const [privacySettings, setPrivacySettings] = useState({
    notesVisible: session?.user?.notesvisibility || false,
    activityVisible: session?.user?.activity || false,
  })

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center py-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Profile Settings</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your profile and preferences</p>
        </div>

        {/* Current Profile Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Current Profile
            </CardTitle>
            <CardDescription>Your current profile information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-16 items-center justify-center rounded-full">
                <User className="size-6" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{session?.user?.name}</h3>
                <p className="text-gray-600 dark:text-gray-400">@{session?.user?.username}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Profile Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>Update your name and username</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                />
              </div>
              <Button className="w-full">Save Changes</Button>
            </CardContent>
          </Card>

          {/* Privacy Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Privacy Settings
              </CardTitle>
              <CardDescription>Control your privacy preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notes Visibility</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Make your notes visible to others</p>
                </div>
                <Switch
                  checked={privacySettings.notesVisible}
                  onCheckedChange={(checked) => setPrivacySettings((prev) => ({ ...prev, notesVisible: checked }))}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Activity Visibility</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Show your activity to others</p>
                </div>
                <Switch
                  checked={privacySettings.activityVisible}
                  onCheckedChange={(checked) => setPrivacySettings((prev) => ({ ...prev, activityVisible: checked }))}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Personality Punchcard */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              AI Personality Punchcard
            </CardTitle>
            <CardDescription>Customize how your AI assistant behaves and responds</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="personality">AI Personality Description</Label>
              <Textarea
                id="personality"
                value={aiPersonality}
                onChange={(e) => setAiPersonality(e.target.value)}
                placeholder="Describe how you want your AI to behave..."
                className="min-h-[100px]"
              />
            </div>
            <Button>Update AI Personality</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
