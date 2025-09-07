/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type { ApiFromModules, FilterApi, FunctionReference } from "convex/server"
import type * as achievements from "../achievements.js"
import type * as auth from "../auth.config.js"
import type * as challenges from "../challenges.js"
import type * as exercises from "../exercises.js"
import type * as leaderboard from "../leaderboard.js"
import type * as progress from "../progress.js"
import type * as users from "../users.js"

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```ts
 * import { api } from "../convex/_generated/api"
 * const user = await useQuery(api.users.getCurrentUser, { clerkId })
 * ```
 */
declare const fullApi: ApiFromModules<{
  achievements: typeof achievements
  "auth.config": typeof auth
  challenges: typeof challenges
  exercises: typeof exercises
  leaderboard: typeof leaderboard
  progress: typeof progress
  users: typeof users
}>

// Public API (your frontend can call these)
export declare const api: FilterApi<typeof fullApi, FunctionReference<any, "public">>

// Internal API (server-only functions, if you define any later)
export declare const internal: FilterApi<typeof fullApi, FunctionReference<any, "internal">>
