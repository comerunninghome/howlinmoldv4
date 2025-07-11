import { type NextRequest, NextResponse } from "next/server"

const MOCK_PROFILE_SHARES: Record<string, any> = {}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, shareType, shareData, expiresIn } = body

    await new Promise((resolve) => setTimeout(resolve, 200))

    const shareId = `share_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/share/${shareId}`

    const profileShare = {
      id: shareId,
      userId,
      shareType,
      shareData,
      shareUrl,
      expiresAt: expiresIn ? new Date(Date.now() + expiresIn * 1000).toISOString() : undefined,
      viewCount: 0,
      createdAt: new Date().toISOString(),
    }

    MOCK_PROFILE_SHARES[shareId] = profileShare

    return NextResponse.json({
      success: true,
      share: profileShare,
    })
  } catch (error) {
    console.error("Error creating profile share:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const shareId = searchParams.get("shareId")

    if (!shareId) {
      return NextResponse.json({ error: "Share ID is required" }, { status: 400 })
    }

    await new Promise((resolve) => setTimeout(resolve, 100))

    const share = MOCK_PROFILE_SHARES[shareId]

    if (!share) {
      return NextResponse.json({ error: "Share not found" }, { status: 404 })
    }

    // Check if expired
    if (share.expiresAt && new Date(share.expiresAt) < new Date()) {
      return NextResponse.json({ error: "Share has expired" }, { status: 410 })
    }

    // Increment view count
    share.viewCount += 1

    return NextResponse.json({ share })
  } catch (error) {
    console.error("Error fetching profile share:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
