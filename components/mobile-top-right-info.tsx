"use client"

import { Button } from "@/components/ui/button"
import { Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import MeetingInfoDialogContent from "./meeting-info-dialog-content"

interface MobileTopRightInfoProps {
  meetingId: string
}

export default function MobileTopRightInfo({ meetingId }: MobileTopRightInfoProps) {
  return (
    <Dialog>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-white bg-gray-800 hover:bg-gray-700 rounded-md h-12 w-12 flex items-center justify-center"
                aria-label="Meeting details and share link"
              >
                <Info className="h-6 w-6 text-white" />
              </Button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Meeting Info</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <MeetingInfoDialogContent meetingId={meetingId} />
    </Dialog>
  )
}
