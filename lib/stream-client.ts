"use client"

import { StreamVideoClient } from "@stream-io/video-react-sdk"
import { getStreamClientConfig } from "./get-stream-config" // Import the new Server Action

// Removed the global 'client' variable.
// This function will now always return a new StreamVideoClient instance.
export async function getStreamClient(userId: string, token: string) {
  // Fetch the API key and App ID securely from the server
  const { apiKey, appId } = await getStreamClientConfig()

  return new StreamVideoClient({
    apiKey,
    user: { id: userId },
    token,
  })
}
