import { v } from "convex/values"
import { mutation, query } from "./_generated/server"

// Get weekly leaderboard
export const getWeeklyLeaderboard = query({
  args: {
    weekStart: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const weekStart = args.weekStart || getCurrentWeekStart()
    const limit = args.limit || 50

    const leaderboardEntries = await ctx.db
      .query("leaderboards")
      .withIndex("by_week", (q) => q.eq("weekStart", weekStart))
      .order("asc") // Order by rank (ascending)
      .take(limit)

    // Get user details for each entry
    const entriesWithUsers = await Promise.all(
      leaderboardEntries.map(async (entry) => {
        const user = await ctx.db.get(entry.userId)
        return {
          ...entry,
          user: user
            ? {
                name: user.name,
                profileImage: user.image,
                level: user.level,
              }
            : null,
        }
      }),
    )

    return entriesWithUsers
  .filter((entry) => entry.user !== null)
  .map((entry) => ({
    _id: entry._id,
    rank: entry.rank,
    weeklyWorkouts: entry.weeklyWorkouts,
    weeklyPoints: entry.weeklyPoints,
    weeklyMinutes: entry.weeklyMinutes,
    user: entry.user,
  }))

  },
})

// Get user's leaderboard position
export const getUserLeaderboardPosition = query({
  args: {
    userId: v.id("users"),
    weekStart: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const weekStart = args.weekStart || getCurrentWeekStart()

    const userEntry = await ctx.db
      .query("leaderboards")
      .withIndex("by_user_week", (q) => q.eq("userId", args.userId).eq("weekStart", weekStart))
      .first()

    if (!userEntry) return null

    // Get total participants this week
    const totalParticipants = await ctx.db
      .query("leaderboards")
      .withIndex("by_week", (q) => q.eq("weekStart", weekStart))
      .collect()

    return {
  _id: userEntry._id,
  rank: userEntry.rank,
  weeklyWorkouts: userEntry.weeklyWorkouts,
  weeklyPoints: userEntry.weeklyPoints,
  weeklyMinutes: userEntry.weeklyMinutes,
  totalParticipants: totalParticipants.length,
}

  },
})

// Get friends leaderboard
export const getFriendsLeaderboard = query({
  args: {
    userId: v.id("users"),
    weekStart: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const weekStart = args.weekStart || getCurrentWeekStart()

    // Get user's friends
    const friendships = await ctx.db
      .query("friendships")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .filter((q) => q.eq(q.field("status"), "accepted"))
      .collect()

    const friendIds = friendships.map((f) => f.friendId)
    friendIds.push(args.userId) // Include the user themselves

    // Get leaderboard entries for friends
    const friendEntries = await Promise.all(
      friendIds.map(async (friendId) => {
        const entry = await ctx.db
          .query("leaderboards")
          .withIndex("by_user_week", (q) => q.eq("userId", friendId).eq("weekStart", weekStart))
          .first()

        if (!entry) return null

        const user = await ctx.db.get(friendId)
        return {
          ...entry,
          user: user
            ? {
                name: user.name,
                profileImage: user.image,
                level: user.level,
              }
            : null,
          isCurrentUser: friendId === args.userId,
        }
      }),
    )

    // Filter out null entries and sort by points
    const validEntries = friendEntries.filter((entry) => entry !== null && entry.user !== null)
    validEntries.sort((a, b) => {
      if (!a || !b) return 0
      return b.weeklyPoints - a.weeklyPoints
    })

    // Add friend ranks
    return validEntries.map((entry, index) => ({
  _id: entry!._id,
  rank: entry!.rank,
  weeklyWorkouts: entry!.weeklyWorkouts,
  weeklyPoints: entry!.weeklyPoints,
  weeklyMinutes: entry!.weeklyMinutes,
  user: entry!.user,
  isCurrentUser: entry!.isCurrentUser,
  friendRank: index + 1,
}))

  },
})

// Update weekly leaderboard (called when user completes workouts)
export const updateWeeklyLeaderboard = mutation({
  args: {
    userId: v.id("users"),
    weekStart: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const weekStart = args.weekStart || getCurrentWeekStart()
    const weekStartDate = new Date(weekStart)
    const weekEndDate = new Date(weekStartDate)
    weekEndDate.setDate(weekEndDate.getDate() + 6)

    // Calculate user's weekly stats
    const weeklyExercises = await ctx.db
      .query("exerciseProgress")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .filter((q) =>
        q.and(
          q.gte(q.field("completedAt"), weekStartDate.getTime()),
          q.lte(q.field("completedAt"), weekEndDate.getTime()),
        ),
      )
      .collect()

    const weeklyWorkouts = weeklyExercises.length
    const weeklyMinutes = weeklyExercises.reduce((sum, ex) => sum + ex.duration, 0)

    // Calculate weekly points from challenges
    const weeklyCompletions = await ctx.db
      .query("challengeCompletions")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .filter((q) =>
        q.and(
          q.gte(q.field("completedAt"), weekStartDate.getTime()),
          q.lte(q.field("completedAt"), weekEndDate.getTime()),
        ),
      )
      .collect()

    const weeklyPoints = weeklyCompletions.reduce((sum, completion) => sum + completion.pointsEarned, 0)

    // Update or create leaderboard entry
    const existingEntry = await ctx.db
      .query("leaderboards")
      .withIndex("by_user_week", (q) => q.eq("userId", args.userId).eq("weekStart", weekStart))
      .first()

    if (existingEntry) {
      await ctx.db.patch(existingEntry._id, {
        weeklyWorkouts,
        weeklyPoints,
        weeklyMinutes,
      })
    } else {
      await ctx.db.insert("leaderboards", {
        weekStart,
        userId: args.userId,
        weeklyWorkouts,
        weeklyPoints,
        weeklyMinutes,
        rank: 0, // Will be calculated in updateRankings
      })
    }

    // Update rankings for the week
    await updateRankings(ctx, weekStart)
  },
})

// Add friend
export const addFriend = mutation({
  args: {
    userId: v.id("users"),
    friendEmail: v.string(),
  },
  handler: async (ctx, args) => {
    // Find friend by email
    const friend = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.friendEmail))
      .first()

    if (!friend) {
      throw new Error("User not found")
    }

    if (friend._id === args.userId) {
      throw new Error("Cannot add yourself as a friend")
    }

    // Check if friendship already exists
    const existingFriendship = await ctx.db
      .query("friendships")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .filter((q) => q.eq(q.field("friendId"), friend._id))
      .first()

    if (existingFriendship) {
      throw new Error("Friendship already exists")
    }

    // Create friendship (auto-accepted for simplicity)
    await ctx.db.insert("friendships", {
      userId: args.userId,
      friendId: friend._id,
      status: "accepted",
      createdAt: Date.now(),
    })

    // Create reverse friendship
    await ctx.db.insert("friendships", {
      userId: friend._id,
      friendId: args.userId,
      status: "accepted",
      createdAt: Date.now(),
    })

    return friend
  },
})

// Get user's friends
export const getUserFriends = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const friendships = await ctx.db
      .query("friendships")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .filter((q) => q.eq(q.field("status"), "accepted"))
      .collect()

    const friends = await Promise.all(
      friendships.map(async (friendship) => {
        const friend = await ctx.db.get(friendship.friendId)
        return friend
          ? {
              _id: friend._id,
              name: friend.name,
              email: friend.email,
              profileImage: friend.image,
              level: friend.level,
              totalWorkouts: friend.totalWorkouts,
              currentStreak: friend.currentStreak,
            }
          : null
      }),
    )

    return friends.filter((friend) => friend !== null)
  },
})

// Helper functions
function getCurrentWeekStart(): string {
  const now = new Date()
  const day = now.getDay()
  const diff = now.getDate() - day + (day === 0 ? -6 : 1) // Monday as week start
  const monday = new Date(now.setDate(diff))
  return monday.toISOString().split("T")[0]
}

async function updateRankings(ctx: any, weekStart: string) {
  const entries = await ctx.db
    .query("leaderboards")
    .withIndex("by_week", (q: { eq: (arg0: string, arg1: string) => any }) => q.eq("weekStart", weekStart))
    .collect()

  // Sort by points (descending), then by workouts (descending), then by minutes (descending)
  entries.sort((a: { weeklyPoints: number; weeklyWorkouts: number; weeklyMinutes: number }, b: { weeklyPoints: number; weeklyWorkouts: number; weeklyMinutes: number }) => {
    if (b.weeklyPoints !== a.weeklyPoints) return b.weeklyPoints - a.weeklyPoints
    if (b.weeklyWorkouts !== a.weeklyWorkouts) return b.weeklyWorkouts - a.weeklyWorkouts
    return b.weeklyMinutes - a.weeklyMinutes
  })

  // Update ranks
  for (let i = 0; i < entries.length; i++) {
    await ctx.db.patch(entries[i]._id, { rank: i + 1 })
  }
}
