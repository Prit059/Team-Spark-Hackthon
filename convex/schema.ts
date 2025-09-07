import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({

  plans: defineTable({
    userId: v.string(),
    name: v.string(),
    workoutPlan: v.object({
      schedule: v.array(v.string()),
      exercises: v.array(
        v.object({
          day: v.string(),
          routines: v.array(
            v.object({
              name: v.string(),
              sets: v.optional(v.number()),
              reps: v.optional(v.number()),
              duration: v.optional(v.string()),
              description: v.optional(v.string()),
              exercises: v.optional(v.array(v.string())),
            })
          ),
        })
      ),
    }),
    dietPlan: v.object({
      dailyCalories: v.number(),
      meals: v.array(
        v.object({
          name: v.string(),
          foods: v.array(v.string()),
        })
      ),
    }),
    isActive: v.boolean(),
  })
    .index("by_user_id", ["userId"])
    .index("by_active", ["isActive"]),


    // User profiles with fitness stats
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    name: v.string(),
    image: v.optional(v.string()),
    totalWorkouts: v.number(),
    currentStreak: v.number(),
    longestStreak: v.number(),
    totalPoints: v.number(),
    level: v.number(),
    joinedAt: v.number(),
  }).index("by_clerk_id", ["clerkId"]),

  // Daily exercise progress logs
  exerciseProgress: defineTable({
    userId: v.id("users"),
    exerciseName: v.string(),
    exerciseType: v.string(), // "cardio", "strength", "flexibility", "custom"
    duration: v.number(), // minutes
    reps: v.optional(v.number()),
    sets: v.optional(v.number()),
    weight: v.optional(v.number()), // kg
    calories: v.optional(v.number()),
    notes: v.optional(v.string()),
    completedAt: v.number(),
    date: v.string(), // YYYY-MM-DD format for daily grouping
  })
    .index("by_user", ["userId"])
    .index("by_user_date", ["userId", "date"])
    .index("by_date", ["date"]),

  // Static exercise catalog
  exercises: defineTable({
    name: v.string(),
    category: v.string(), // "cardio", "strength", "flexibility"
    difficulty: v.string(), // "beginner", "intermediate", "advanced"
    muscleGroups: v.array(v.string()),
    equipment: v.array(v.string()),
    instructions: v.array(v.string()),
    tips: v.array(v.string()),
    estimatedCalories: v.number(), // per minute
    imageUrl: v.optional(v.string()),
    videoUrl: v.optional(v.string()),
  })
    .index("by_category", ["category"])
    .index("by_difficulty", ["difficulty"]),

  // Daily challenges system
  dailyChallenges: defineTable({
    title: v.string(),
    description: v.string(),
    type: v.string(), // "exercise", "duration", "reps", "streak"
    target: v.number(), // target value (minutes, reps, etc.)
    points: v.number(),
    difficulty: v.string(),
    date: v.string(), // YYYY-MM-DD
    isActive: v.boolean(),
  }).index("by_date", ["date"]),

  // User challenge completions
  challengeCompletions: defineTable({
    userId: v.id("users"),
    challengeId: v.id("dailyChallenges"),
    completedAt: v.number(),
    actualValue: v.number(), // actual performance
    pointsEarned: v.number(),
    date: v.string(),
  })
    .index("by_user", ["userId"])
    .index("by_user_date", ["userId", "date"])
    .index("by_challenge", ["challengeId"]),

  // User achievements/badges
  achievements: defineTable({
    userId: v.id("users"),
    type: v.string(), // "streak", "workout_count", "challenge", "level"
    title: v.string(),
    description: v.string(),
    iconUrl: v.optional(v.string()),
    pointsAwarded: v.number(),
    unlockedAt: v.number(),
  }).index("by_user", ["userId"]),

  // Friend connections for leaderboard
  friendships: defineTable({
    userId: v.id("users"),
    friendId: v.id("users"),
    status: v.string(), // "pending", "accepted", "blocked"
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_friend", ["friendId"]),

  // Weekly leaderboard snapshots
  leaderboards: defineTable({
    weekStart: v.string(), // YYYY-MM-DD of Monday
    userId: v.id("users"),
    weeklyWorkouts: v.number(),
    weeklyPoints: v.number(),
    weeklyMinutes: v.number(),
    rank: v.number(),
  })
    .index("by_week", ["weekStart"])
    .index("by_user_week", ["userId", "weekStart"]),
})
