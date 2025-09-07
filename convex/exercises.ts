import { v } from "convex/values"
import { mutation, query } from "./_generated/server"

// Log exercise progress
export const logExercise = mutation({
  args: {
    userId: v.id("users"),
    exerciseName: v.string(),
    exerciseType: v.string(),
    duration: v.number(),
    reps: v.optional(v.number()),
    sets: v.optional(v.number()),
    weight: v.optional(v.number()),
    calories: v.optional(v.number()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now()
    const today = new Date().toISOString().split("T")[0]

    // Log the exercise
    const exerciseId = await ctx.db.insert("exerciseProgress", {
      ...args,
      completedAt: now,
      date: today,
    })

    // Update user stats
    const user = await ctx.db.get(args.userId)
    if (user) {
      // Check if this is first workout today
      const todayWorkouts = await ctx.db
        .query("exerciseProgress")
        .withIndex("by_user_date", (q) => q.eq("userId", args.userId).eq("date", today))
        .collect()

      const isFirstWorkoutToday = todayWorkouts.length === 1

      if (isFirstWorkoutToday) {
        // Update streak and total workouts
        const newStreak = user.currentStreak + 1
        await ctx.db.patch(args.userId, {
          totalWorkouts: user.totalWorkouts + 1,
          currentStreak: newStreak,
          longestStreak: Math.max(user.longestStreak, newStreak),
          totalPoints: user.totalPoints + 10, // Base points for workout
        })
      }
    }

    return exerciseId
  },
})

// Get user's exercise history
export const getExerciseHistory = query({
  args: {
    userId: v.id("users"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("exerciseProgress")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .take(args.limit || 50)
  },
})

// Get exercise catalog
export const getExerciseCatalog = query({
  args: {
    category: v.optional(v.string()),
    difficulty: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let exercises;
    if (typeof args.category === "string") {
      exercises = await ctx.db
        .query("exercises")
        .withIndex("by_category", (q) => q.eq("category", args.category as string))
        .collect();
    } else {
      exercises = await ctx.db.query("exercises").collect();
    }

    if (args.difficulty) {
      return exercises.filter((e) => e.difficulty === args.difficulty)
    }

    return exercises
  },
})

// Get exercise by name (for AI fallback)
export const getExerciseByName = query({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("exercises")
      .filter((q) => q.eq(q.field("name"), args.name))
      .first()
  },
})

// Search exercises by text
export const searchExercises = query({
  args: { searchTerm: v.string() },
  handler: async (ctx, args) => {
    const exercises = await ctx.db.query("exercises").collect()

    return exercises.filter(
      (exercise) =>
        exercise.name.toLowerCase().includes(args.searchTerm.toLowerCase()) ||
        exercise.muscleGroups.some((muscle) => muscle.toLowerCase().includes(args.searchTerm.toLowerCase())) ||
        exercise.category.toLowerCase().includes(args.searchTerm.toLowerCase()),
    )
  },
})

// Add custom exercise (from AI generation)
export const addCustomExercise = mutation({
  args: {
    name: v.string(),
    category: v.string(),
    difficulty: v.string(),
    muscleGroups: v.array(v.string()),
    equipment: v.array(v.string()),
    instructions: v.array(v.string()),
    tips: v.array(v.string()),
    estimatedCalories: v.number(),
    isCustom: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    // Remove isCustom from the inserted object, since it's not in the schema
    return await ctx.db.insert("exercises", {
      ...args,
    })
  },
})

// Seed initial exercises
export const seedExercises = mutation({
  args: {},
  handler: async (ctx) => {
    const exercises = [
      {
        name: "Push-ups",
        category: "strength",
        difficulty: "beginner",
        muscleGroups: ["chest", "shoulders", "triceps"],
        equipment: [],
        instructions: [
          "Start in plank position with hands shoulder-width apart",
          "Lower your body until chest nearly touches the floor",
          "Push back up to starting position",
          "Keep your core tight throughout the movement",
        ],
        tips: ["Keep your body in a straight line", "Don't let your hips sag"],
        estimatedCalories: 8,
      },
      {
        name: "Squats",
        category: "strength",
        difficulty: "beginner",
        muscleGroups: ["quadriceps", "glutes", "hamstrings"],
        equipment: [],
        instructions: [
          "Stand with feet shoulder-width apart",
          "Lower your body as if sitting back into a chair",
          "Keep your chest up and knees behind toes",
          "Return to standing position",
        ],
        tips: ["Keep weight in your heels", "Don't let knees cave inward"],
        estimatedCalories: 6,
      },
      {
        name: "Jumping Jacks",
        category: "cardio",
        difficulty: "beginner",
        muscleGroups: ["full body"],
        equipment: [],
        instructions: [
          "Start standing with feet together, arms at sides",
          "Jump feet apart while raising arms overhead",
          "Jump back to starting position",
          "Maintain steady rhythm",
        ],
        tips: ["Land softly on balls of feet", "Keep core engaged"],
        estimatedCalories: 12,
      },
    ]

    for (const exercise of exercises) {
      await ctx.db.insert("exercises", exercise)
    }
  },
})
