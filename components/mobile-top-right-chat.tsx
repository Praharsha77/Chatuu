"use client"

import { Button } from "@/components/ui/button"
import { MessageCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface MobileTopRightChatProps {
  isChatOpen: boolean
  onToggleChat: () => void
}

export default function MobileTopRightChat({ isChatOpen, onToggleChat }: MobileTopRightChatProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleChat}
            className={`text-white ${isChatOpen ? "bg-primary" : "bg-gray-800 hover:bg-gray-700"} rounded-md h-12 w-12 flex items-center justify-center`}
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
  )
}
