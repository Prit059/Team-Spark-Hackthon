"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Flame, Calendar, Trophy, Target } from "lucide-react"

interface ChallengeStreakProps {
  currentStreak: number
  longestStreak: number
  todayCompleted: number
  todayTotal: number
  weeklyCompleted: number
  totalPoints: number
}

export function ChallengeStreak({
  currentStreak,
  longestStreak,
  todayCompleted,
  todayTotal,
  weeklyCompleted,
  totalPoints,
}: ChallengeStreakProps) {
  const todayProgress = todayTotal > 0 ? (todayCompleted / todayTotal) * 100 : 0
  const nextMilestone = getNextStreakMilestone(currentStreak)

  function getNextStreakMilestone(streak: number) {
    const milestones = [3, 7, 14, 30, 50, 100]
    return milestones.find((m) => m > streak) || streak + 10
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Current Streak */}
      <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Challenge Streak</CardTitle>
          <Flame className="h-4 w-4 text-orange-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-700">{currentStreak}</div>
          <p className="text-xs text-orange-600 mt-1">Best: {longestStreak} days</p>
          <div className="flex items-center gap-1 mt-2">
            {Array.from({ length: Math.min(currentStreak, 7) }).map((_, i) => (
              <div key={i} className="w-2 h-2 bg-orange-500 rounded-full" />
            ))}
            {currentStreak > 7 && <span className="text-xs text-orange-600 ml-1">+{currentStreak - 7}</span>}
          </div>
          <div className="mt-2">
            <div className="text-xs text-orange-600">Next milestone: {nextMilestone} days</div>
            <Progress value={(currentStreak / nextMilestone) * 100} className="h-1 mt-1" />
          </div>
        </CardContent>
      </Card>

      {/* Today's Progress */}
      <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Today's Challenges</CardTitle>
          <Target className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-700">
            {todayCompleted}/{todayTotal}
          </div>
          <p className="text-xs text-blue-600 mt-1">
            {todayProgress === 100 ? "All done!" : `${Math.round(todayProgress)}% complete`}
          </p>
          <Progress value={todayProgress} className="mt-2 h-2" />
          {todayProgress === 100 && (
            <Badge variant="secondary" className="mt-2 bg-green-100 text-green-800 text-xs">
              Perfect Day!
            </Badge>
          )}
        </CardContent>
      </Card>

      {/* Weekly Stats */}
      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">This Week</CardTitle>
          <Calendar className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-700">{weeklyCompleted}</div>
          <p className="text-xs text-green-600 mt-1">Challenges completed</p>
          <div className="mt-2">
            <div className="flex justify-between text-xs">
              <span className="text-green-600">Weekly goal: 21</span>
              <span className="text-green-600">{Math.round((weeklyCompleted / 21) * 100)}%</span>
            </div>
            <Progress value={(weeklyCompleted / 21) * 100} className="h-1 mt-1" />
          </div>
        </CardContent>
      </Card>

      {/* Total Points */}
      <Card className="bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Challenge Points</CardTitle>
          <Trophy className="h-4 w-4 text-yellow-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-700">{totalPoints.toLocaleString()}</div>
          <p className="text-xs text-yellow-600 mt-1">Total earned</p>
          <div className="mt-2">
            <Badge variant="outline" className="bg-yellow-100 text-yellow-800 text-xs">
              Level {Math.floor(totalPoints / 100) + 1}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
