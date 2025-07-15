"use server"

export async function getStreamClientConfig() {
  const apiKey = process.env.STREAM_API_KEY // Now a server-only variable
  const appId = "1405066" // Updated to the provided App ID

  // Log the API Key and App ID being used on the server for video client
  console.log("getStreamClientConfig: API Key:", apiKey ? "Set" : "Not Set")
  console.log("getStreamClientConfig: App ID:", appId)

  if (!apiKey || !appId) {
    throw new Error("Stream API Key or App ID not set in environment variables.")
  }

  return { apiKey, appId }
}
