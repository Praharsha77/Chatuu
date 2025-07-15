"use client"

import { SpeakerLayout, ParticipantView } from "@stream-io/video-react-sdk"

interface CallDisplayLayoutProps {
  call: any // Accept the call object as a prop
}

export default function CallDisplayLayout({ call }: CallDisplayLayoutProps) {
  // Access participants directly from the call object's state
  const allParticipants = call?.state?.participants || []
  const pinnedParticipants = call?.state?.pinnedParticipants || []

  if (pinnedParticipants.length > 0) {
    const mainParticipant = pinnedParticipants[0]
    const otherParticipants = allParticipants.filter((p) => p.sessionId !== mainParticipant.sessionId)

    return (
      <div className="flex flex-col h-full w-full">
        <div className="flex-1 relative">
          {/* Main Pinned Participant View */}
          <ParticipantView participant={mainParticipant} />
        </div>
        {otherParticipants.length > 0 && (
          <div className="h-1/4 w-full bg-gray-900 flex items-center justify-center p-2 overflow-x-auto">
            {/* Manually render ParticipantView for other participants in a flex row */}
            <div className="flex gap-2 h-full">
              {otherParticipants.map((participant) => (
                <div key={participant.userId} className="h-full aspect-video flex-shrink-0">
                  <ParticipantView participant={participant} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  // Default to SpeakerLayout if no one is pinned
  return <SpeakerLayout />
}
