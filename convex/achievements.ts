import { v } from "convex/values"
import { query } from "./_generated/server"

// Get user achievements
export const getUserAchievements = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("achievements")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect()
  },
})

// Get all available achievements (for progress tracking)
export const getAvailableAchievements = query({
  args: {},
  handler: async (ctx) => {
    // This would typically return a static list of all possible achievements
    // For now, we'll return the achievements that have been unlocked by any user
    const achievements = await ctx.db.query("achievements").collect()

    // Group by type and return unique achievement templates
    const uniqueAchievements = achievements.reduce(
      (acc, achievement) => {
        const key = `${achievement.type}-${achievement.title}`
        if (!acc[key]) {
          acc[key] = {
            type: achievement.type,
            title: achievement.title,
            description: achievement.description,
            pointsAwarded: achievement.pointsAwarded,
          }
        }
        return acc
      },
      {} as Record<string, any>,
    )

    return Object.values(uniqueAchievements)
  },
})
