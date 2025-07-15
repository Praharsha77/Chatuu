"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { v4 as uuidv4 } from "uuid"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { generateStreamToken } from "@/lib/tokens"
import Image from "next/image"
import { updateUserRoleToAdmin } from "@/app/actions/update-user-role" // Import the new Server Action

export default function CreateJoinForm() {
  const [username, setUsername] = useState("")
  const [meetingId, setMeetingId] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const queryMeetingId = searchParams.get("meetingId")
    if (queryMeetingId) {
      setMeetingId(queryMeetingId)
    }
  }, [searchParams])

  const handleStartCall = async (isNewMeet: boolean) => {
    if (!username) {
      alert("Please enter your name.")
      return
    }

    let currentMeetingId = meetingId
    if (isNewMeet) {
      currentMeetingId = uuidv4()
    } else if (!currentMeetingId) {
      alert("Please enter a meeting ID to join.")
      return
    }

    setIsLoading(true)
    try {
      const sanitizeUserId = (name: string) => {
        return name
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9@_-]/g, "")
      }

      const sanitizedUsername = sanitizeUserId(username)

      // OPTIONAL: Update user role to admin for testing purposes
      // This is for testing the chat permissions. Remove in production.
      const roleUpdateResult = await updateUserRoleToAdmin(sanitizedUsername)
      if (!roleUpdateResult.success) {
        console.warn("Failed to update user role to admin:", roleUpdateResult.message)
        // You might want to alert the user or handle this error more gracefully
      } else {
        console.log(roleUpdateResult.message)
      }

      const token = await generateStreamToken(sanitizedUsername)
      localStorage.setItem("stream_user_id", sanitizedUsername)
      localStorage.setItem("stream_user_token", token)
      router.push(`/meet/${currentMeetingId}`)
    } catch (error) {
      console.error("Failed to generate token or start call:", error)
      alert("Failed to start/join call. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-darkBackground p-4 overflow-hidden">
      {/* Background Image */}
      <Image
        src="/images/blue-flame-bg.png"
        alt="Blue flame background"
        layout="fill" // Fills the parent container
        objectFit="cover" // Covers the area, cropping if necessary
        quality={100} // High quality for background
        className="absolute inset-0 z-0" // Position absolutely, behind content
        priority // Preload this image as it's a background
      />

      {/* Overlay for better contrast, if needed */}
      <div className="absolute inset-0 z-10 bg-black opacity-30"></div>

      <div className="relative z-20 w-full max-w-md p-8 space-y-6 rounded-lg shadow-lg bg-white blurred-white-stroke">
        <h1 className="text-3xl font-bold text-center text-gray-900">Chatuu 🔥</h1>
        <div className="space-y-4">
          <div>
            <Label htmlFor="username" className="text-gray-700">
              Your Name
            </Label>
            <Input
              id="username"
              type="text"
              placeholder="Enter your name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-white text-gray-900 placeholder-gray-500"
              required
            />
          </div>
          <div>
            <Label htmlFor="meetingId" className="text-gray-700">
              Meeting ID (Optional for new meet)
            </Label>
            <Input
              id="meetingId"
              type="text"
              placeholder="Enter meeting ID to join"
              value={meetingId}
              onChange={(e) => setMeetingId(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-white text-gray-900 placeholder-gray-500"
            />
          </div>
          <div className="flex flex-col space-y-2">
            <Button
              onClick={() => handleStartCall(true)}
              disabled={isLoading || !username}
              className="w-full py-2 px-4 bg-primary text-white rounded-md hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              {isLoading ? "Creating..." : "Create New Meet"}
            </Button>
            <Button
              onClick={() => handleStartCall(false)}
              disabled={isLoading || !username || !meetingId}
              variant="outline" // Changed to outline variant
              className="w-full py-2 px-4 text-primary border-primary hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary" // Styled for secondary look
            >
              {isLoading ? "Joining..." : "Join Existing Meet"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
