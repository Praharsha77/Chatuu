"use client"

import { Button } from "@/components/ui/button"
import { CircleDot } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface MobileTopRightRecordProps {
  onRecord: () => void
}

export default function MobileTopRightRecord({ onRecord }: MobileTopRightRecordProps) {
  return (
    <div className="absolute top-4 right-16 z-30 sm:hidden">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={onRecord}
              className="text-white bg-gray-800 hover:bg-gray-700 rounded-md h-12 w-12 flex items-center justify-center"
              aria-label="Toggle recording"
            >
              <CircleDot className="h-6 w-6 text-white" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Record</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}
