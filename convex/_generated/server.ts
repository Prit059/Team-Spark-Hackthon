/* eslint-disable */
/**
 * Convex schema and utilities for implementing server-side functions.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED (schema part).
 * You can safely edit schema definitions.
 *
 * To regenerate wrappers, run `npx convex dev`.
 * @module
 */

import {
  ActionBuilder,
  MutationBuilder,
  QueryBuilder,
  defineSchema,
  defineTable,
  actionGeneric,
  httpActionGeneric,
  queryGeneric,
  mutationGeneric,
  internalActionGeneric,
  internalMutationGeneric,
  internalQueryGeneric,
} from "convex/server"
import { v } from "convex/values"

/**
 * ==============================
 * Database Schema
 * ==============================
 */
export const schema = defineSchema({
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    name: v.string(),
    imageUrl: v.optional(v.string()),
    createdAt: v.number(),
    totalWorkouts: v.optional(v.number()),
    totalPoints: v.optional(v.number()),
    currentStreak: v.optional(v.number()),
    longestStreak: v.optional(v.number()),
    lastWorkoutDate: v.optional(v.string()),
  })
    .index("by_clerk_id", ["clerkId"])
    .index("by_email", ["email"]),

  exercises: defineTable({
    name: v.string(),
    category: v.string(),
    muscleGroups: v.array(v.string()),
    equipment: v.array(v.string()),
    difficulty: v.string(),
    instructions: v.array(v.string()),
    tips: v.array(v.string()),
    imageUrl: v.optional(v.string()),
    videoUrl: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_category", ["category"])
    .index("by_difficulty", ["difficulty"]),

  exerciseProgress: defineTable({
    userId: v.id("users"),
    exerciseId: v.id("exercises"),
    date: v.string(),
    sets: v.number(),
    reps: v.number(),
    weight: v.optional(v.number()),
    duration: v.optional(v.number()),
    notes: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_date", ["userId", "date"])
    .index("by_exercise", ["exerciseId"]),

  challenges: defineTable({
    title: v.string(),
    description: v.string(),
    type: v.string(),
    target: v.number(),
    points: v.number(),
    date: v.string(),
    createdAt: v.number(),
  }).index("by_date", ["date"]),

  challengeProgress: defineTable({
    userId: v.id("users"),
    challengeId: v.id("challenges"),
    progress: v.number(),
    completed: v.boolean(),
    completedAt: v.optional(v.number()),
    points: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_challenge", ["challengeId"])
    .index("by_user_challenge", ["userId", "challengeId"]),

  achievements: defineTable({
    userId: v.id("users"),
    type: v.string(),
    title: v.string(),
    description: v.string(),
    icon: v.string(),
    unlockedAt: v.number(),
    points: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_type", ["type"]),

  friendships: defineTable({
    userId: v.id("users"),
    friendId: v.id("users"),
    status: v.string(),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_friend", ["friendId"])
    .index("by_status", ["status"]),

  leaderboard: defineTable({
    userId: v.id("users"),
    period: v.string(),
    points: v.number(),
    rank: v.number(),
    updatedAt: v.number(),
  })
    .index("by_period", ["period"])
    .index("by_period_rank", ["period", "rank"])
    .index("by_user_period", ["userId", "period"]),
})

/**
 * ==============================
 * Public Wrappers
 * ==============================
 */
export const query = queryGeneric
export const mutation = mutationGeneric
export const action = actionGeneric

/**
 * ==============================
 * Internal-only Wrappers
 * ==============================
 */
export const internalQuery = internalQueryGeneric
export const internalMutation = internalMutationGeneric
export const internalAction = internalActionGeneric

/**
 * ==============================
 * HTTP Actions
 * ==============================
 */
export const httpAction = httpActionGeneric

/**
 * ==============================
 * (Optional) Legacy Builders
 * ==============================
 * If you prefer using builders instead of generics:
 */
// Remove legacy builders if QueryBuilder, MutationBuilder, and ActionBuilder are only types
// export const queryBuilder = new QueryBuilder(schema, "public")
// export const mutationBuilder = new MutationBuilder(schema, "public")
// export const actionBuilder = new ActionBuilder(schema, "public")
