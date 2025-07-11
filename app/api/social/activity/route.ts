import { type NextRequest, NextResponse } from "next/server"

const MOCK_SOCIAL_ACTIVITIES: Record<string, any[]> = {
  "1": [
    {
      id: "activity_1_1",
      userId: "1",
      type: "ritual_completed",
      data: {
        ritualName: "Dawn Resonance",
        duration: 1800,
        resonanceGained: 25,
      },
      isPublic: true,
      createdAt: "2024-12-20T06:30:00Z",
      likes: 8,
      comments: 3,
      isLiked: false,
    },
    {
      id: "activity_1_2",
      userId: "1",
      type: "artifact_acquired",
      data: {
        artifactName: "Ethereal Soundscape #47",
        artist: "Cosmic Drifter",
        rarity: "Rare",
      },
      isPublic: true,
      createdAt: "2024-12-19T14:20:00Z",
      likes: 12,
      comments: 5,
      isLiked: true,
    },
  ],
  "2": [
    {
      id: "activity_2_1",
      userId: "2",
      type: "achievement_unlocked",
      data: {
        achievementName: "Ritual Master",
        description: "Complete 50 rituals",
        rarity: "Epic",
      },
      isPublic: true,
      createdAt: "2024-12-21T10:15:00Z",
      likes: 23,
      comments: 8,
      isLiked: false,
    },
    {
      id: "activity_2_2",
      userId: "2",
      type: "tier_advanced",
      data: {
        fromTier: "Adept",
        toTier: "Keeper",
        newTitle: "The Resonance Guardian",
      },
      isPublic: true,
      createdAt: "2024-12-20T18:45:00Z",
      likes: 34,
      comments: 12,
      isLiked: true,
    },
  ],
}

const MOCK_ACTIVITY_COMMENTS: Record<string, any[]> = {
  activity_1_1: [
    {
      id: "comment_1_1_1",
      activityId: "activity_1_1",
      userId: "2",
      content: "Beautiful ritual! The dawn frequencies are always so powerful 🌅",
      createdAt: "2024-12-20T07:15:00Z",
      likes: 3,
      isLiked: false,
    },
    {
      id: "comment_1_1_2",
      activityId: "activity_1_1",
      userId: "3",
      content: "I need to try this combination of artifacts. Thanks for the inspiration!",
      createdAt: "2024-12-20T08:30:00Z",
      likes: 1,
      isLiked: true,
    },
  ],
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const type = searchParams.get("type") || "feed" // feed, user, friends
    const targetUserId = searchParams.get("targetUserId")

    await new Promise((resolve) => setTimeout(resolve, 200))

    switch (type) {
      case "feed":
        // Get activities from user's friends
        const friendIds = ["1", "2", "3", "4"] // Mock friend IDs
        const feedActivities = friendIds
          .flatMap((id) => MOCK_SOCIAL_ACTIVITIES[id] || [])
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 20)

        const activitiesWithProfiles = feedActivities.map((activity) => ({
          ...activity,
          userProfile: {
            id: activity.userId,
            displayName: `User ${activity.userId}`,
            avatar: `/placeholder.svg?height=40&width=40`,
          },
        }))

        return NextResponse.json({ activities: activitiesWithProfiles })

      case "user":
        const userActivities = MOCK_SOCIAL_ACTIVITIES[targetUserId || userId || ""] || []
        const userActivitiesWithProfile = userActivities.map((activity) => ({
          ...activity,
          userProfile: {
            id: activity.userId,
            displayName: `User ${activity.userId}`,
            avatar: `/placeholder.svg?height=40&width=40`,
          },
        }))

        return NextResponse.json({ activities: userActivitiesWithProfile })

      case "comments":
        const activityId = searchParams.get("activityId")
        if (!activityId) {
          return NextResponse.json({ error: "Activity ID is required" }, { status: 400 })
        }

        const comments = MOCK_ACTIVITY_COMMENTS[activityId] || []
        const commentsWithProfiles = comments.map((comment) => ({
          ...comment,
          userProfile: {
            id: comment.userId,
            displayName: `User ${comment.userId}`,
            avatar: `/placeholder.svg?height=32&width=32`,
          },
        }))

        return NextResponse.json({ comments: commentsWithProfiles })

      default:
        return NextResponse.json({ error: "Invalid type parameter" }, { status: 400 })
    }
  } catch (error) {
    console.error("Error fetching activity data:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, activityId, userId, content } = body

    await new Promise((resolve) => setTimeout(resolve, 200))

    switch (action) {
      case "like":
        // Toggle like on activity
        const activities = Object.values(MOCK_SOCIAL_ACTIVITIES).flat()
        const activity = activities.find((a) => a.id === activityId)

        if (!activity) {
          return NextResponse.json({ error: "Activity not found" }, { status: 404 })
        }

        activity.isLiked = !activity.isLiked
        activity.likes += activity.isLiked ? 1 : -1

        return NextResponse.json({ success: true, isLiked: activity.isLiked, likes: activity.likes })

      case "comment":
        const newComment = {
          id: `comment_${Date.now()}`,
          activityId,
          userId,
          content,
          createdAt: new Date().toISOString(),
          likes: 0,
          isLiked: false,
        }

        if (!MOCK_ACTIVITY_COMMENTS[activityId]) {
          MOCK_ACTIVITY_COMMENTS[activityId] = []
        }
        MOCK_ACTIVITY_COMMENTS[activityId].push(newComment)

        // Increment comment count on activity
        const commentActivities = Object.values(MOCK_SOCIAL_ACTIVITIES).flat()
        const commentActivity = commentActivities.find((a) => a.id === activityId)
        if (commentActivity) {
          commentActivity.comments += 1
        }

        return NextResponse.json({ success: true, comment: newComment })

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("Error processing activity action:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
