import { v } from "convex/values"
import { mutation, query } from "./_generated/server"

// Get today's active challenges
export const getTodaysChallenges = query({
  args: {},
  handler: async (ctx) => {
    const today = new Date().toISOString().split("T")[0]

    return await ctx.db
      .query("dailyChallenges")
      .withIndex("by_date", (q) => q.eq("date", today))
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect()
  },
})

// Get user's challenge completions for today
export const getUserChallengeCompletions = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const today = new Date().toISOString().split("T")[0]

    return await ctx.db
      .query("challengeCompletions")
      .withIndex("by_user_date", (q) => q.eq("userId", args.userId).eq("date", today))
      .collect()
  },
})

// Complete a challenge
export const completeChallenge = mutation({
  args: {
    userId: v.id("users"),
    challengeId: v.id("dailyChallenges"),
    actualValue: v.number(),
  },
  handler: async (ctx, args) => {
    const challenge = await ctx.db.get(args.challengeId)
    if (!challenge) throw new Error("Challenge not found")

    const today = new Date().toISOString().split("T")[0]

    // Check if already completed
    const existing = await ctx.db
      .query("challengeCompletions")
      .withIndex("by_user_date", (q) => q.eq("userId", args.userId).eq("date", today))
      .filter((q) => q.eq(q.field("challengeId"), args.challengeId))
      .first()

    if (existing) {
      throw new Error("Challenge already completed today")
    }

    // Calculate points based on performance
    const performanceRatio = args.actualValue / challenge.target
    let pointsEarned = challenge.points

    if (performanceRatio >= 1.5) {
      pointsEarned = Math.round(challenge.points * 1.5) // 150% bonus for exceeding target by 50%
    } else if (performanceRatio >= 1.2) {
      pointsEarned = Math.round(challenge.points * 1.2) // 120% bonus for exceeding target by 20%
    } else if (performanceRatio < 0.8) {
      pointsEarned = Math.round(challenge.points * 0.8) // 80% points for not meeting 80% of target
    }

    // Record completion
    const completionId = await ctx.db.insert("challengeCompletions", {
      userId: args.userId,
      challengeId: args.challengeId,
      completedAt: Date.now(),
      actualValue: args.actualValue,
      pointsEarned,
      date: today,
    })

    // Update user points and check for achievements
    const user = await ctx.db.get(args.userId)
    if (user) {
      await ctx.db.patch(args.userId, {
        totalPoints: user.totalPoints + pointsEarned,
      })

      // Check for challenge streak achievements
      const completions = await ctx.db
        .query("challengeCompletions")
        .withIndex("by_user", (q) => q.eq("userId", args.userId))
        .collect()

      const uniqueDays = new Set(completions.map((c) => c.date))
      const challengeStreak = uniqueDays.size

      // Award streak achievements
      if (challengeStreak === 7 && !(await hasAchievement(ctx, args.userId, "7_day_challenge_streak"))) {
        await awardAchievement(ctx, args.userId, {
          type: "streak",
          title: "Week Warrior",
          description: "Complete challenges for 7 consecutive days",
          pointsAwarded: 100,
        })
      }
    }

    return completionId
  },
})

// Create daily challenges (admin function)
export const createDailyChallenge = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    type: v.string(),
    target: v.number(),
    points: v.number(),
    difficulty: v.string(),
    date: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const date = args.date || new Date().toISOString().split("T")[0]

    return await ctx.db.insert("dailyChallenges", {
      ...args,
      date,
      isActive: true,
    })
  },
})

// Seed daily challenges
export const seedDailyChallenges = mutation({
  args: {},
  handler: async (ctx) => {
    const today = new Date()
    const challenges = []

    // Generate challenges for the next 7 days
    for (let i = 0; i < 7; i++) {
      const date = new Date(today)
      date.setDate(date.getDate() + i)
      const dateStr = date.toISOString().split("T")[0]

      const dailyChallenges = [
        {
          title: "Morning Energizer",
          description: "Complete 20 jumping jacks to start your day",
          type: "reps",
          target: 20,
          points: 15,
          difficulty: "beginner",
          date: dateStr,
          isActive: true,
        },
        {
          title: "Core Crusher",
          description: "Hold a plank for 60 seconds",
          type: "duration",
          target: 60,
          points: 25,
          difficulty: "intermediate",
          date: dateStr,
          isActive: true,
        },
        {
          title: "Step Master",
          description: "Take 8,000 steps today",
          type: "steps",
          target: 8000,
          points: 30,
          difficulty: "beginner",
          date: dateStr,
          isActive: true,
        },
      ]

      // Rotate challenges based on day
      const dayIndex = i % 3
      challenges.push(dailyChallenges[dayIndex])
    }

    for (const challenge of challenges) {
      await ctx.db.insert("dailyChallenges", challenge)
    }

    return challenges.length
  },
})

// Helper functions
async function hasAchievement(ctx: any, userId: string, achievementType: string) {
  const achievement = await ctx.db
    .query("achievements")
    .withIndex("by_user", (q: { eq: (arg0: string, arg1: string) => any }) => q.eq("userId", userId))
    .filter((q: { eq: (arg0: any, arg1: string) => any; field: (arg0: string) => any }) => q.eq(q.field("type"), achievementType))
    .first()

  return !!achievement
}

async function awardAchievement(ctx: any, userId: string, achievement: any) {
  return await ctx.db.insert("achievements", {
    userId,
    ...achievement,
    unlockedAt: Date.now(),
  })
}
