import { type NextRequest, NextResponse } from "next/server"
import { matchGenre, type RecordMetadata, isVaultEligible } from "@/lib/genreMatcher"

export async function POST(req: NextRequest) {
  try {
    const record = (await req.json()) as RecordMetadata

    if (!record || !record.artist || !record.title) {
      return NextResponse.json({ error: "Artist and Title are required" }, { status: 400 })
    }

    const matchedGenres = matchGenre(record)
    const vaultEligible = isVaultEligible(matchedGenres)

    return NextResponse.json({
      matchedGenres,
      isVaultEligible: vaultEligible,
      recordProcessed: { artist: record.artist, title: record.title },
    })
  } catch (error) {
    console.error("Error in matchGenres API:", error)
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}
