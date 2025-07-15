"use client"

import { Button } from "@/components/ui/button"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { StreamVideo, StreamCall, StreamTheme, LoadingIndicator } from "@stream-io/video-react-sdk"
import { getStreamClient } from "@/lib/stream-client"
import MeetControls from "@/components/meet-controls"
import CallDisplayLayout from "@/components/call-display-layout"
import Image from "next/image"
import MobileTopRightControls from "@/components/mobile-top-right-controls"

import "@stream-io/video-react-sdk/dist/css/styles.css"

export default function MeetPage() {
  const { id: meetingId } = useParams()
  const router = useRouter()
  const [client, setClient] = useState<any>(null)
  const [call, setCall] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isChatOpen, setIsChatOpen] = useState(false)

  useEffect(() => {
    const initializeStream = async () => {
      const userId = localStorage.getItem("stream_user_id")
      const userToken = localStorage.getItem("stream_user_token")

      if (!userId || !userToken || !meetingId) {
        router.replace(`/?meetingId=${meetingId}`)
        setLoading(false)
        return
      }

      try {
        const streamClient = await getStreamClient(userId, userToken)
        setClient(streamClient)

        const newCall = streamClient.call("default", meetingId as string)
        setCall(newCall)

        newCall
          .join({ create: true })
          .then(() => {
            setLoading(false)
          })
          .catch((e: any) => {
            console.error("Failed to join call:", e)
            setError(
              `Failed to join call: ${e.message || "Unknown error"}. Please verify your Stream API credentials and network connection.`,
            )
            setLoading(false)
          })

        return () => {
          // No need to call newCall.leave() here, CallControls handles it.
        }
      } catch (e: any) {
        console.error("Error initializing Stream client or call:", e)
        setError(
          `Error setting up call: ${e.message || "Unknown error"}. Ensure your Stream API credentials are correctly set in Vercel environment variables.`,
        )
        setLoading(false)
      }
    }

    initializeStream()
  }, [meetingId, router])

  const handleToggleChat = () => {
    setIsChatOpen((prev) => !prev)
  }

  if (!client && !call && !error && loading) {
    return (
      <div className="relative flex items-center justify-center min-h-screen text-white overflow-hidden">
        <Image
          src="/images/blue-flame-bg-meeting.jpeg"
          alt="Blue flame background"
          layout="fill"
          objectFit="cover"
          quality={100}
          className="absolute inset-0 z-0"
          priority
        />
        <div className="absolute inset-0 z-10 bg-black opacity-30"></div>
        <div className="relative z-20 flex flex-col items-center">
          <LoadingIndicator />
          <p className="ml-2">Redirecting to home to set your name...</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="relative flex items-center justify-center min-h-screen text-white overflow-hidden">
        <Image
          src="/images/blue-flame-bg-meeting.jpeg"
          alt="Blue flame background"
          layout="fill"
          objectFit="cover"
          quality={100}
          className="absolute inset-0 z-0"
          priority
        />
        <div className="absolute inset-0 z-10 bg-black opacity-30"></div>
        <div className="relative z-20 flex flex-col items-center">
          <LoadingIndicator />
          <p className="ml-2">Loading meeting...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="relative flex flex-col items-center justify-center min-h-screen bg-red-900 text-white p-4 text-center overflow-hidden">
        <Image
          src="/images/blue-flame-bg-meeting.jpeg"
          alt="Blue flame background"
          layout="fill"
          objectFit="cover"
          quality={100}
          className="absolute inset-0 z-0"
          priority
        />
        <div className="absolute inset-0 z-10 bg-black opacity-30"></div>
        <div className="relative z-20 flex flex-col items-center">
          <h2 className="text-2xl font-bold mb-4">Error</h2>
          <p>{error}</p>
          <Button onClick={() => router.push("/")} className="mt-4 bg-white text-red-900 hover:bg-gray-200">
            Go to Home
          </Button>
        </div>
      </div>
    )
  }

  if (!client || !call) {
    return (
      <div className="relative flex items-center justify-center min-h-screen text-white overflow-hidden">
        <Image
          src="/images/blue-flame-bg-meeting.jpeg"
          alt="Blue flame background"
          layout="fill"
          objectFit="cover"
          quality={100}
          className="absolute inset-0 z-0"
          priority
        />
        <div className="absolute inset-0 z-10 bg-black opacity-30"></div>
        <div className="relative z-20 flex flex-col items-center">
          <p>Initializing...</p>
        </div>
      </div>
    )
  }

  return (
    <StreamVideo client={client}>
      <StreamTheme>
        <StreamCall call={call}>
          <div className="relative h-screen w-full flex flex-col text-white overflow-hidden">
            {/* Background Image for the meeting */}
            <Image
              src="/images/blue-flame-bg-meeting.jpeg"
              alt="Blue flame background"
              layout="fill"
              objectFit="cover"
              quality={100}
              className="absolute inset-0 z-0"
              priority
            />
            {/* Overlay for better contrast */}
            <div className="absolute inset-0 z-10 bg-black opacity-30"></div>

            {/* Mobile-only top controls */}
            <MobileTopRightControls
              meetingId={meetingId as string}
              isChatOpen={isChatOpen}
              onToggleChat={handleToggleChat}
            />

            <div className="flex-1 relative z-20">
              <CallDisplayLayout call={call} />
            </div>
            <MeetControls
              meetingId={meetingId as string}
              call={call}
              isChatOpen={isChatOpen}
              onToggleChat={handleToggleChat}
            />
          </div>
        </StreamCall>
      </StreamTheme>
    </StreamVideo>
  )
}
