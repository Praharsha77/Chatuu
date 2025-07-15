"use client"

import MobileTopRightInfo from "./mobile-top-right-info"
import MobileTopRightChat from "./mobile-top-right-chat"

interface MobileTopRightControlsProps {
  meetingId: string
  isChatOpen: boolean
  onToggleChat: () => void
}

export default function MobileTopRightControls({ meetingId, isChatOpen, onToggleChat }: MobileTopRightControlsProps) {
  return (
    <div className="absolute top-4 right-4 z-30 sm:hidden flex space-x-2">
      {" "}
      {/* Added flex and space-x-2 */}
      <MobileTopRightChat isChatOpen={isChatOpen} onToggleChat={onToggleChat} />
      <MobileTopRightInfo meetingId={meetingId} />
    </div>
  )
}
