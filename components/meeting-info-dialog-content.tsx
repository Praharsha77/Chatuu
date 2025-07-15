"use client"

import { useState, useEffect } from "react"
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Copy } from "lucide-react"

interface MeetingInfoDialogContentProps {
  meetingId: string
}

export default function MeetingInfoDialogContent({ meetingId }: MeetingInfoDialogContentProps) {
  const [meetingLink, setMeetingLink] = useState("")
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const currentUrl = window.location.origin
    const link = `${currentUrl}/meet/${meetingId}`
    setMeetingLink(link)
  }, [meetingId])

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(meetingLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy link: ", err)
      alert("Failed to copy link. Please copy manually.")
    }
  }

  return (
    <DialogContent className="sm:max-w-[425px] bg-darkBackground text-white border-gray-700">
      <DialogHeader>
        <DialogTitle className="text-white">Meeting Details</DialogTitle>
        <DialogDescription className="text-gray-400">
          Share this link with others to invite them to the meeting.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="flex flex-col space-y-2">
          <Label htmlFor="share-link-dialog" className="text-white">
            Meeting Link
          </Label>
          <div className="flex items-center space-x-2">
            <Input
              id="share-link-dialog"
              type="text"
              value={meetingLink}
              readOnly
              className="flex-1 bg-darkBackground/60 text-white border-darkBackground/60 focus:ring-primary focus:border-primary"
              aria-label="Meeting share link"
            />
            <Button
              onClick={handleCopyLink}
              className="bg-primary hover:bg-primary/80 text-white px-4 py-2 rounded-md"
              aria-label="Copy meeting link"
            >
              {copied ? "Copied!" : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>
    </DialogContent>
  )
}
