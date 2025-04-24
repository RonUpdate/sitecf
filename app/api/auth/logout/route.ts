import { NextResponse } from "next/server"

// Handle POST requests (actual logout)
export async function POST() {
  try {
    // For preview purposes, just return a success response
    // In a real implementation, this would handle the actual logout logic
    return NextResponse.json({
      success: true,
      message: "Logout endpoint is working correctly",
    })
  } catch (error) {
    console.error("Error in logout endpoint:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 },
    )
  }
}

// Handle GET requests (for preview/testing)
export async function GET() {
  // When previewing the endpoint, return a simple message
  return NextResponse.json(
    {
      message: "This is the logout endpoint. Use POST method to logout.",
      preview: true,
    },
    { status: 200 },
  )
}
