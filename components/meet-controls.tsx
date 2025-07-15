"use client"

import { Button } from "@/components/ui/button"

import { CallControls } from "@stream-io/video-react-sdk"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { MessageCircle, Info } from "lucide-react"
import MeetingChat from "./meeting-chat" // Corrected import statement
import MeetingInfoDialogContent from "./meeting-info-dialog-content" // Corrected import statement

interface MeetControlsProps {
  meetingId: string
  call: any // Ensure 'call' prop is correctly typed and passed
  isChatOpen: boolean
  onToggleChat: () => void
}

export default function MeetControls({ meetingId, call, isChatOpen, onToggleChat }: MeetControlsProps) {
  const [shareLink, setShareLink] = useState("")
  const [copied, setCopied] = useState(false)
  const [currentUser, setCurrentUser] = useState("")
  const [userToken, setUserToken] = useState("")
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== "undefined" && meetingId) {
      setShareLink(`${window.location.origin}/meet/${meetingId}`)
      const userId = localStorage.getItem("stream_user_id") || ""
      const token = localStorage.getItem("stream_user_token") || ""
      setCurrentUser(userId)
      setUserToken(token)
    }
  }, [meetingId])

  const handleLeaveCall = () => {
    router.push("/")
  }

  const handleCopyLink = () => {
    if (shareLink) {
      navigator.clipboard.writeText(shareLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-darkBackground p-4 flex items-center justify-between z-30">
      {/* Left-aligned placeholder or empty div if nothing else is needed on the left */}
      <div className="flex-1"></div>
      {/* CallControls (mic, video, screen share, end call) - Centered */}
      <div className="flex justify-center space-x-2">
        <CallControls onLeave={handleLeaveCall} />
      </div>
      {/* Info/Share Link Dialog Trigger & Chat Toggle - Right Corner */}
      <div className="flex justify-end flex-1 space-x-2">
        {/* Chat Toggle Button (Desktop Only) */}
        <div className="hidden sm:block">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onToggleChat}
                  className={`text-white hover:bg-primary ${isChatOpen ? "bg-primary" : ""}`}
                  aria-label="Toggle chat"
                >
                  <MessageCircle className="h-6 w-6 text-white" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Toggle chat</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        {/* Info Dialog (Desktop Only) */}
        <div className="hidden sm:block">
          <Dialog>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white hover:bg-primary"
                      aria-label="Meeting details and share link"
                    >
                      <Info className="h-6 w-6 text-white" />
                    </Button>
                  </DialogTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Copy link to add collaborators</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <MeetingInfoDialogContent meetingId={meetingId} />
          </Dialog>
        </div>
      </div>
      {/* Mobile View: No "More" button here, handled by top-left kebab and top-right chat/info */}
      {/* This div is now empty as per instructions */}
      <div className="flex sm:hidden">
        {/* This space is intentionally left blank for mobile, as chat and info are now top-right */}
      </div>
      {/* Meeting Chat Component */}
      <MeetingChat
        isOpen={isChatOpen}
        onClose={onToggleChat}
        meetingId={meetingId}
        currentUser={currentUser}
        userToken={userToken}
      />
    </div>
  )
}
