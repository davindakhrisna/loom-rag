"use client"

import { useState, useActionState, useEffect } from "react"
import { SessionProps } from "@/types/session"
import { Settings, Shield, Bot, User } from "lucide-react"
import { profileAction, updateActivityVisibility, updateNotesVisibility } from "@/lib/profile/actions"
import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"

export default function ProfilePage({ session }: SessionProps) {

  const [state, formAction] = useActionState(profileAction, null);
  const [name, setName] = useState(session?.user?.name || "Guest")
  const [username, setUsername] = useState(session?.user?.username || "Guest")
  const [aiPersonality, setAiPersonality] = useState(session?.user?.punchcard || "I am a helpful AI assistant.")
  const [privacySettings, setPrivacySettings] = useState({
    notesVisible: session?.user?.notesvisibility || false,
    activityVisible: session?.user?.activityvisibility || false,
  })

  const handleActivityToggle = async () => {
    const result = await updateActivityVisibility(!privacySettings.activityVisible);
    if (result.success) {
      setPrivacySettings(prev => ({
        ...prev,
        activityVisible: !prev.activityVisible
      }));
    }
  };

  const handleNotesToggle = async () => {
    const result = await updateNotesVisibility(!privacySettings.notesVisible);

    if (result.success) {
      setPrivacySettings(prev => ({
        ...prev,
        notesVisible: !prev.notesVisible
      }));
    }
  };

  useEffect(() => {
    if (state?.success) {
      signOut();
    }
  }, [state?.success])

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center py-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Profile Settings</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your profile and preferences</p>
        </div>

        {/* Failed Message */}
        {state?.message && !state.success && (
          <div className="py-2 flex justify-center items-center rounded-sm border border-red-500">
            <span className="text-sm font-light text-center block text-red-500">{state?.message}</span>
          </div>
        )}

        {/* Name Message */}
        {state?.error?.name && (
          <div className="py-2 flex justify-center items-center rounded-sm border border-red-500">
            <span className="text-sm font-light text-center block text-red-500">{state?.error?.name}</span>
          </div>
        )}

        {/* Punchcard Message */}
        {state?.error?.punchcard && (
          <div className="py-2 flex justify-center items-center rounded-sm border border-red-500">
            <span className="text-sm font-light text-center block text-red-500">{state?.error?.punchcard}</span>
          </div>
        )}

        <form action={formAction} className="space-y-6">
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
                <CardDescription>Update your full name and username</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input
                    id="name"
                    type="name"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Username</Label>
                  <Input
                    id="username"
                    type="username"
                    name="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your full name"
                  />
                </div>
              </CardContent>
            </Card>

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
                    onCheckedChange={handleNotesToggle}
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
                    onCheckedChange={handleActivityToggle}
                  />
                </div>
              </CardContent>
            </Card>
          </div>


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
                <Textarea
                  id="punchcard"
                  name="punchcard"
                  value={aiPersonality}
                  onChange={(e) => setAiPersonality(e.target.value)}
                  placeholder="Describe how you want your AI to behave..."
                  className="min-h-[100px]"
                />
              </div>
              <Button type="submit" className="w-full">Save All Changes</Button>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  )
}
