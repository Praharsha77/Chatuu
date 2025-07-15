"use client"

import { Button } from "@/components/ui/button"
import { MoreVertical } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"

export default function MobileTopKebabMenu() {
  const router = useRouter()

  const handleLeaveCall = () => {
    router.push("/")
  }

  return (
    <div className="absolute top-4 left-4 z-[90] sm:hidden">
      {" "}
      {/* Increased z-index to z-[90] */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="text-white bg-gray-800 hover:bg-gray-700 rounded-md h-12 w-12 flex items-center justify-center"
            aria-label="Options"
          >
            <MoreVertical className="h-6 w-6 text-white" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-darkBackground text-white border-gray-700 z-50">
          <DropdownMenuItem onClick={handleLeaveCall} className="hover:bg-primary focus:bg-primary">
            Leave Meeting
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
