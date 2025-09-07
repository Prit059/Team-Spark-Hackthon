"use client"

import { useState } from "react"
import { useUser } from "@clerk/nextjs"
import { useMutation, useQuery } from "convex/react"
import { api } from "../../../convex/_generated/api"
import { ExerciseLogger } from "@/components/progress/exercise-logger"
import { ProgressDashboard } from "@/components/progress/progress-dashboard"
import { WeeklyChart } from "@/components/progress/weekly-chart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, TrendingUp } from "lucide-react"
import { toast } from "sonner"

export default function ProgressPage() {
  const { user } = useUser()
  const [selectedMetric, setSelectedMetric] = useState<"exercises" | "duration" | "calories">("exercises")

  // Get current user data
  const currentUser = useQuery(api.users.getCurrentUser, user ? { clerkId: user.id } : "skip")

  // Get user stats
  const userStats = useQuery(api.users.getUserStats, currentUser ? { userId: currentUser._id } : "skip")

  // Get weekly progress
  const getWeekStart = () => {
    const now = new Date()
    const day = now.getDay()
    const diff = now.getDate() - day + (day === 0 ? -6 : 1)
    return new Date(now.setDate(diff)).toISOString().split("T")[0]
  }

  const weeklyProgress = useQuery(
    api.progress.getWeeklyProgress,
    currentUser
      ? {
          userId: currentUser._id,
          weekStart: getWeekStart(),
        }
      : "skip",
  )

  // Mutations
  const logExercise = useMutation(api.exercises.logExercise)
  const createUser = useMutation(api.users.createUser)

  // Create user if doesn't exist
  useState(() => {
    if (user && !currentUser) {
      createUser({
        clerkId: user.id,
        email: user.emailAddresses[0]?.emailAddress || "",
        name: user.fullName || "",
        profileImage: user.imageUrl,
      })
    }
  })

  const handleLogExercise = async (data: any) => {
    if (!currentUser) return

    try {
      await logExercise({
        userId: currentUser._id,
        ...data,
      })
      toast.success("Exercise logged successfully!")
    } catch (error) {
      toast.error("Failed to log exercise")
    }
  }

  if (!user) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">Please sign in to track your progress</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Progress Tracking</h1>
          <p className="text-muted-foreground">Log your workouts and track your fitness journey</p>
        </div>
        <Badge variant="outline" className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          {new Date().toLocaleDateString()}
        </Badge>
      </div>

      {/* Progress Dashboard */}
      {userStats && <ProgressDashboard stats={userStats} />}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Exercise Logger */}
        <div className="lg:col-span-2">
          <ExerciseLogger onLogExercise={handleLogExercise} isLoading={false} />
        </div>

        {/* Quick Stats */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Quick Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {userStats && (
                <>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total Workouts</span>
                    <span className="font-semibold">{userStats.totalWorkouts}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Current Level</span>
                    <Badge>{userStats.level}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total Points</span>
                    <span className="font-semibold">{userStats.totalPoints}</span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Weekly Chart */}
      {weeklyProgress && (
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold">Weekly Overview</h2>
            <div className="flex gap-2">
              <Button
                variant={selectedMetric === "exercises" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedMetric("exercises")}
              >
                Exercises
              </Button>
              <Button
                variant={selectedMetric === "duration" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedMetric("duration")}
              >
                Duration
              </Button>
              <Button
                variant={selectedMetric === "calories" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedMetric("calories")}
              >
                Calories
              </Button>
            </div>
          </div>

          <WeeklyChart data={weeklyProgress.dailyStats} metric={selectedMetric} />
        </div>
      )}
    </div>
  )
}
