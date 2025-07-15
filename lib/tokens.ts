"use server"

import * as jose from "jose" // Changed import to import the entire 'jose' namespace

export async function generateStreamToken(userId: string) {
  const apiSecret = process.env.STREAM_API_SECRET

  if (!apiSecret) {
    throw new Error("Stream API Secret not set in environment variables.")
  }

  const secret = new TextEncoder().encode(apiSecret)
  const expirationTime = Math.floor(Date.now() / 1000) + 60 * 60 // Token valid for 1 hour
  const issuedAt = Math.floor(Date.now() / 1000)

  const payload = {
    user_id: userId,
    type: "user", // Required for Stream user tokens
    grants: {
      channel: {
        read: true,
        write: true,
      },
      user: {
        connect: true,
      },
      chat: {
        read: true,
        write: true,
      },
    },
  }

  // TEMPORARY DEBUGGING: Log the full payload before signing the token.
  // This will show exactly what grants are being included in the JWT.
  // DO NOT keep this in production code.
  console.log("generateStreamToken: Token Payload (TEMPORARY DEBUG):", JSON.stringify(payload, null, 2))

  const token = await new jose.SignJWT(payload) // Used jose.SignJWT
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuedAt(issuedAt)
    .setExpirationTime(expirationTime)
    .sign(secret)

  return token
}
