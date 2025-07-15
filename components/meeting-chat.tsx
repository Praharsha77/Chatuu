"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X, Send, Users } from "lucide-react"
import { StreamChat } from "stream-chat"

interface ChatMessage {
  id: string
  user: {
    id: string
    name: string
  }
  text: string
  created_at: string
}

interface MeetingChatProps {
  isOpen: boolean
  onClose: () => void
  meetingId: string
  currentUser: string
  userToken: string // Now explicitly passed
}

export default function MeetingChat({ isOpen, onClose, meetingId, currentUser, userToken }: MeetingChatProps) {
  const [chatClient, setChatClient] = useState<StreamChat | null>(null)
  const [channel, setChannel] = useState<any>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [newMessage, setNewMessage] = useState("")
  const [participantsCount, setParticipantsCount] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    const initializeChat = async () => {
      console.log("MeetingChat: Initializing chat...")
      console.log("MeetingChat: currentUser:", currentUser)
      console.log("MeetingChat: userToken (exists):", !!userToken)
      console.log("MeetingChat: meetingId:", meetingId)

      if (!isOpen || !currentUser || !userToken || !meetingId) {
        console.log("MeetingChat: Missing required props for chat initialization. Returning.")
        if (chatClient) {
          chatClient.disconnectUser()
          setChatClient(null)
          setChannel(null)
          setMessages([])
          setIsConnected(false)
          setParticipantsCount(0)
        }
        return
      }

      try {
        const response = await fetch("/api/stream-config")
        const { apiKey } = await response.json()
        console.log("MeetingChat: Fetched API Key from /api/stream-config:", apiKey ? apiKey : "Not Set") // Log actual key

        // Log the API Key being used to initialize Stream Chat client
        console.log("MeetingChat: Initializing StreamChat with API Key:", apiKey)

        const client = StreamChat.getInstance(apiKey)

        await client.connectUser(
          {
            id: currentUser,
            name: currentUser,
          },
          userToken,
        )
        setIsConnected(true)
        setChatClient(client)
        console.log("MeetingChat: User connected to Stream Chat.")

        const chatChannel = client.channel("messaging", `meeting-${meetingId}`, {
          name: `Meeting ${meetingId} Chat`,
          members: [currentUser],
        })

        await chatChannel.watch()
        setChannel(chatChannel)
        console.log("MeetingChat: Channel watched.")

        const state = await chatChannel.query({
          messages: { limit: 50 },
        })
        setMessages(state.messages as ChatMessage[])
        console.log("MeetingChat: Initial messages loaded.")

        setParticipantsCount(chatChannel.state.watcher_count || 0)
        console.log("MeetingChat: Initial participants count (watchers):", chatChannel.state.watcher_count)

        chatChannel.on("message.new", (event) => {
          if (event.message) {
            setMessages((prev) => [...prev, event.message as ChatMessage])
            console.log("MeetingChat: New message received:", event.message.text)
          }
        })

        chatChannel.on("user.watching.start", () => {
          setParticipantsCount(chatChannel.state.watcher_count || 0)
          console.log("MeetingChat: User started watching. New count:", chatChannel.state.watcher_count)
        })
        chatChannel.on("user.watching.stop", () => {
          setParticipantsCount(chatChannel.state.watcher_count || 0)
          console.log("MeetingChat: User stopped watching. New count:", chatChannel.state.watcher_count)
        })
        chatChannel.on("member.added", () => {
          setParticipantsCount(chatChannel.state.watcher_count || 0)
          console.log("MeetingChat: Member added. New count:", chatChannel.state.watcher_count)
        })
        chatChannel.on("member.removed", () => {
          setParticipantsCount(chatChannel.state.watcher_count || 0)
          console.log("MeetingChat: Member removed. New count:", chatChannel.state.watcher_count)
        })
      } catch (error: any) {
        console.error("MeetingChat: Failed to initialize chat:", error)
        console.error("MeetingChat: Error message:", error.message)
        console.error("MeetingChat: Error code:", error.code)
        console.error("MeetingChat: Error response:", error.response)
        setIsConnected(false)
      }
    }

    initializeChat()

    return () => {
      if (chatClient) {
        console.log("MeetingChat: Disconnecting user from Stream Chat.")
        chatClient.disconnectUser()
      }
    }
  }, [isOpen, currentUser, userToken, meetingId])

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !channel || !isConnected) {
      console.warn("MeetingChat: Cannot send message. Not connected or message is empty.")
      return
    }

    try {
      await channel.sendMessage({
        text: newMessage.trim(),
      })
      setNewMessage("")
      console.log("MeetingChat: Message sent.")
    } catch (error) {
      console.error("Failed to send message:", error)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed right-4 bottom-24 w-80 h-96 bg-darkBackground border border-gray-700 rounded-lg shadow-lg z-40 flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-gray-700 flex-shrink-0">
        <div className="flex items-center space-x-2">
          <h3 className="text-white font-semibold">Meeting Chat</h3>
          <div className="flex items-center space-x-1 text-xs text-gray-400">
            <Users className="h-3 w-3" />
            <span>{participantsCount}</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`} />
          <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-gray-700 p-1 h-auto">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 p-4 overflow-y-auto space-y-3">
        {!isConnected && (
          <div className="text-yellow-400 text-sm text-center p-2 bg-yellow-400/10 rounded">Connecting to chat...</div>
        )}

        {messages.length === 0 && isConnected ? (
          <div className="text-gray-400 text-sm text-center">No messages yet. Start the conversation!</div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="space-y-1">
              <div className="flex items-center space-x-2">
                <span
                  className={`font-medium text-sm ${msg.user?.id === currentUser ? "text-primary" : "text-green-400"}`}
                >
                  {msg.user?.id === currentUser ? "You" : msg.user?.name || msg.user?.id}
                </span>
                <span className="text-gray-500 text-xs">
                  {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
              <div
                className={`text-white text-sm rounded-lg p-2 ml-2 ${
                  msg.user?.id === currentUser ? "bg-primary/20 border border-primary/30" : "bg-gray-800"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-gray-700 flex-shrink-0">
        <div className="flex space-x-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={isConnected ? "Type a message..." : "Connecting..."}
            disabled={!isConnected}
            className="flex-1 bg-darkBackground/60 text-white border-gray-600 focus:ring-primary focus:border-primary"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || !isConnected}
            size="sm"
            className="bg-primary hover:bg-primary/80 text-white px-3"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
