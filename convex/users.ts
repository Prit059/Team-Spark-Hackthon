import { mutation,query } from "./_generated/server";
import { v } from "convex/values";

export const syncUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    clerkId: v.string(),
    image: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), args.clerkId))
      .first();

    if (existingUser) return;

    return await ctx.db.insert("users", {
      ...args,
      totalWorkouts: 0,
      currentStreak: 0,
      longestStreak: 0,
      totalPoints: 0,
      level: 1,
      joinedAt: Date.now(),
    });
  },
});

export const updateUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    clerkId: v.string(),
    image: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (!existingUser) return;

    return await ctx.db.patch(existingUser._id, args);
  },
});


// Create or update user profile from Clerk
export const createUser = mutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    name: v.string(),
    profileImage: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first()

    if (existingUser) {
      // Update existing user
      await ctx.db.patch(existingUser._id, {
        email: args.email,
        name: args.name,
        image: args.profileImage,
      })
      return existingUser._id
    }

    // Create new user
    return await ctx.db.insert("users", {
      clerkId: args.clerkId,
      email: args.email,
      name: args.name,
      image: args.profileImage,
      totalWorkouts: 0,
      currentStreak: 0,
      longestStreak: 0,
      totalPoints: 0,
      level: 1,
      joinedAt: Date.now(),
    })
  },
})

// Get current user profile
export const getCurrentUser = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first()
  },
})

// Get user stats for dashboard
export const getUserStats = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId)
    if (!user) return null

    // Get today's workouts
    const today = new Date().toISOString().split("T")[0]
    const todayWorkouts = await ctx.db
  .query("exerciseProgress")
  .withIndex("by_user_date", (q) => q.eq(args.userId, today)) // ✅ pass both values here
  .collect()

    // Get this week's stats
    const weekStart = getWeekStart(new Date())
    const weekWorkouts = await ctx.db
      .query("exerciseProgress")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .filter((q) => q.gte(q.field("completedAt"), weekStart.getTime()))
      .collect()

    return {
      ...user,
      todayWorkouts: todayWorkouts.length,
      weeklyWorkouts: weekWorkouts.length,
      weeklyMinutes: weekWorkouts.reduce((sum, w) => sum + w.duration, 0),
    }
  },
})

function getWeekStart(date: Date): Date {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1) // Monday as week start
  return new Date(d.setDate(diff))
}

