"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Calendar, Flame, Target, Trophy } from "lucide-react"

interface ProgressStats {
  todayWorkouts: number
  weeklyWorkouts: number
  weeklyMinutes: number
  currentStreak: number
  longestStreak: number
  totalPoints: number
  level: number
}

interface ProgressDashboardProps {
  stats: ProgressStats
  dailyGoal?: number
  weeklyGoal?: number
}

export function ProgressDashboard({ stats, dailyGoal = 1, weeklyGoal = 5 }: ProgressDashboardProps) {
  const dailyProgress = Math.min((stats.todayWorkouts / dailyGoal) * 100, 100)
  const weeklyProgress = Math.min((stats.weeklyWorkouts / weeklyGoal) * 100, 100)
  const levelProgress = ((stats.totalPoints % 100) / 100) * 100

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Today's Progress */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Today's Workouts</CardTitle>
          <Target className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.todayWorkouts}</div>
          <div className="flex items-center justify-between mt-2">
            <p className="text-xs text-muted-foreground">Goal: {dailyGoal}</p>
            <Badge variant={dailyProgress >= 100 ? "default" : "secondary"}>{Math.round(dailyProgress)}%</Badge>
          </div>
          <Progress value={dailyProgress} className="mt-2" />
        </CardContent>
      </Card>

      {/* Weekly Progress */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Weekly Progress</CardTitle>
          <Calendar className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.weeklyWorkouts}</div>
          <div className="flex items-center justify-between mt-2">
            <p className="text-xs text-muted-foreground">{stats.weeklyMinutes} minutes</p>
            <Badge variant={weeklyProgress >= 100 ? "default" : "secondary"}>{Math.round(weeklyProgress)}%</Badge>
          </div>
          <Progress value={weeklyProgress} className="mt-2" />
        </CardContent>
      </Card>

      {/* Current Streak */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
          <Flame className="h-4 w-4 text-orange-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.currentStreak}</div>
          <p className="text-xs text-muted-foreground mt-2">Best: {stats.longestStreak} days</p>
          <div className="flex items-center gap-1 mt-2">
            {Array.from({ length: Math.min(stats.currentStreak, 7) }).map((_, i) => (
              <div key={i} className="w-2 h-2 bg-orange-500 rounded-full" />
            ))}
            {stats.currentStreak > 7 && (
              <span className="text-xs text-muted-foreground ml-1">+{stats.currentStreak - 7}</span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Level & Points */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Level {stats.level}</CardTitle>
          <Trophy className="h-4 w-4 text-yellow-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalPoints}</div>
          <div className="flex items-center justify-between mt-2">
            <p className="text-xs text-muted-foreground">Next level</p>
            <Badge variant="outline">{Math.round(levelProgress)}%</Badge>
          </div>
          <Progress value={levelProgress} className="mt-2" />
        </CardContent>
      </Card>
    </div>
  )
}
