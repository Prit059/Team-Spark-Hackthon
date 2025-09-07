import { v } from "convex/values"
import { query } from "./_generated/server"

// Get daily progress summary
export const getDailyProgress = query({
  args: {
    userId: v.id("users"),
    date: v.string(), // YYYY-MM-DD
  },
  handler: async (ctx, args) => {
const exercises = await ctx.db
  .query("exerciseProgress")
  .withIndex("by_user_date", (q) => q.eq(args.userId, args.date)) // ✅ correct
  .collect()



    const totalDuration = exercises.reduce((sum, ex) => sum + ex.duration, 0)
    const totalCalories = exercises.reduce((sum, ex) => sum + (ex.calories || 0), 0)
    const exerciseTypes = [...new Set(exercises.map((ex) => ex.exerciseType))]

    return {
      exercises,
      totalDuration,
      totalCalories,
      exerciseCount: exercises.length,
      exerciseTypes,
    }
  },
})

// Get weekly progress analytics
export const getWeeklyProgress = query({
  args: {
    userId: v.id("users"),
    weekStart: v.string(), // YYYY-MM-DD of Monday
  },
  handler: async (ctx, args) => {
    const weekStartDate = new Date(args.weekStart)
    const weekEndDate = new Date(weekStartDate)
    weekEndDate.setDate(weekEndDate.getDate() + 6)

    const exercises = await ctx.db
      .query("exerciseProgress")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .filter((q) =>
        q.and(
          q.gte(q.field("completedAt"), weekStartDate.getTime()),
          q.lte(q.field("completedAt"), weekEndDate.getTime()),
        ),
      )
      .collect()

    // Group by day
    const dailyStats = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(weekStartDate)
      date.setDate(date.getDate() + i)
      const dateStr = date.toISOString().split("T")[0]

      const dayExercises = exercises.filter((ex) => ex.date === dateStr)

      return {
        date: dateStr,
        dayName: date.toLocaleDateString("en-US", { weekday: "short" }),
        exercises: dayExercises.length,
        duration: dayExercises.reduce((sum, ex) => sum + ex.duration, 0),
        calories: dayExercises.reduce((sum, ex) => sum + (ex.calories || 0), 0),
      }
    })

    return {
      dailyStats,
      totalWorkouts: exercises.length,
      totalDuration: exercises.reduce((sum, ex) => sum + ex.duration, 0),
      totalCalories: exercises.reduce((sum, ex) => sum + (ex.calories || 0), 0),
      averageWorkoutDuration:
        exercises.length > 0 ? Math.round(exercises.reduce((sum, ex) => sum + ex.duration, 0) / exercises.length) : 0,
    }
  },
})

// Get progress trends (last 30 days)
export const getProgressTrends = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const exercises = await ctx.db
      .query("exerciseProgress")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .filter((q) => q.gte(q.field("completedAt"), thirtyDaysAgo.getTime()))
      .collect()

    // Group by exercise type
    const typeStats = exercises.reduce(
      (acc, ex) => {
        if (!acc[ex.exerciseType]) {
          acc[ex.exerciseType] = { count: 0, duration: 0, calories: 0 }
        }
        acc[ex.exerciseType].count++
        acc[ex.exerciseType].duration += ex.duration
        acc[ex.exerciseType].calories += ex.calories || 0
        return acc
      },
      {} as Record<string, { count: number; duration: number; calories: number }>,
    )

    return {
      totalWorkouts: exercises.length,
      exerciseTypeBreakdown: (Object.entries(typeStats) as [string, { count: number; duration: number; calories: number }][])
  .map(([type, stats]) => ({
    type,
    ...stats,
  })),

      recentExercises: exercises.slice(-10).reverse(),
    }
  },
})

// Example query to get overall user stats
export const getUserStats = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const workouts = await ctx.db
      .query("workouts")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect()

    const totalWorkouts = workouts.length
    const weeklyWorkouts = workouts.filter(
      (w) => Date.now() - w._creationTime < 7 * 24 * 60 * 60 * 1000
    ).length

    const totalPoints = workouts.reduce((sum, w) => sum + (w.points || 0), 0)

    return {
      totalWorkouts,
      weeklyWorkouts,
      totalPoints,
    }
  },
})

export const getCurrentStreak = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const workouts = await ctx.db
      .query("workouts")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect()

    if (workouts.length === 0) return 0

    // Convert workout timestamps into days
    const days = workouts.map((w) =>
      Math.floor(w._creationTime / (1000 * 60 * 60 * 24))
    )

    let streak = 1
    for (let i = 1; i < days.length; i++) {
      if (days[i - 1] - days[i] === 1) {
        streak++
      } else {
        break
      }
    }
    return streak
  },
})