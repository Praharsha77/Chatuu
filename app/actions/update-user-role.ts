"use server"

import { StreamChat } from "stream-chat"

export async function updateUserRoleToAdmin(userId: string) {
  const apiKey = process.env.STREAM_API_KEY
  const apiSecret = process.env.STREAM_API_SECRET

  if (!apiKey || !apiSecret) {
    throw new Error("Stream API Key or Secret not set in environment variables.")
  }

  try {
    const serverClient = StreamChat.getInstance(apiKey, apiSecret)

    // Update the user's role to 'admin'
    const update = await serverClient.updateUser({
      id: userId,
      role: "admin",
    })

    console.log(`Successfully updated user ${userId} to role 'admin'.`, update)
    return { success: true, message: `User ${userId} role updated to admin.` }
  } catch (error: any) {
    console.error(`Failed to update user ${userId} role to admin:`, error)
    // Log more details about the error if available
    if (error.response) {
      console.error("StreamChat API Error Response:", error.response.data)
    }
    return { success: false, message: `Failed to update user role: ${error.message || "Unknown error"}` }
  }
}
