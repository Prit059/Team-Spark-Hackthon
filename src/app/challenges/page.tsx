"use client"

import { useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import { useMutation, useQuery } from "convex/react"
import { api } from "../../../convex/_generated/api"

import { ChallengeCard } from "@/components/challenges/challenge-card"
import { ChallengeStreak } from "@/components/challenges/challenge-streak"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { Trophy, Calendar, Zap, Star } from "lucide-react"
import { toast } from "sonner"
import { Id } from "../../../convex/_generated/dataModel"

export default function ChallengesPage() {
  const { user } = useUser()

  // Get current user data
  const currentUser = useQuery(api.users.getCurrentUser, user ? { clerkId: user.id } : "skip")

  // Get today's challenges
  const todaysChallenges = useQuery(api.challenges.getTodaysChallenges)

  // Get user's completions
  const userCompletions = useQuery(
    api.challenges.getUserChallengeCompletions,
    currentUser ? { userId: currentUser._id } : "skip",
  )

  // Get user achievements
  const userAchievements = useQuery(
    api.achievements.getUserAchievements,
    currentUser ? { userId: currentUser._id } : "skip",
  )

  // Mutations
  const completeChallenge = useMutation(api.challenges.completeChallenge)
  const createUser = useMutation(api.users.createUser)

  // Create user if doesn't exist
  useEffect(() => {
    if (user && !currentUser) {
      createUser({
        clerkId: user.id,
        email: user.emailAddresses[0]?.emailAddress || "",
        name: user.fullName || "",
        profileImage: user.imageUrl,
      })
    }
  }, [user, currentUser, createUser])

  // Handle completion of a challenge
  const handleCompleteChallenge = async (challengeId: string, actualValue: number) => {
    if (!currentUser) return

    try {
      await completeChallenge({
        userId: currentUser._id,
        challengeId: challengeId as Id<"dailyChallenges">,
        actualValue,
      })
      toast.success("Challenge completed! Points earned!")
    } catch (error) {
      toast.error("Failed to complete challenge")
    }
  }

  // If not signed in
  if (!user) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">Please sign in to view daily challenges</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const todayCompleted = userCompletions?.length || 0
  const todayTotal = todaysChallenges?.length || 0

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Trophy className="h-8 w-8 text-yellow-600" />
            Daily Challenges
          </h1>
          <p className="text-muted-foreground">Complete mini workouts and build your streak</p>
        </div>
        <Badge variant="outline" className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          {new Date().toLocaleDateString()}
        </Badge>
      </div>

      {/* Challenge Streak Stats */}
      {currentUser && (
        <ChallengeStreak
          currentStreak={currentUser.currentStreak || 0}
          longestStreak={currentUser.longestStreak || 0}
          todayCompleted={todayCompleted}
          todayTotal={todayTotal}
          weeklyCompleted={userCompletions?.length || 0}
          totalPoints={currentUser.totalPoints || 0}
        />
      )}

      {/* Tabs for Challenges & Achievements */}
      <Tabs defaultValue="today" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="today">Today's Challenges</TabsTrigger>
          <TabsTrigger value="achievements">
            <Star className="h-4 w-4 mr-2" />
            Achievements
          </TabsTrigger>
        </TabsList>

        {/* Today’s Challenges */}
        <TabsContent value="today" className="space-y-6">
          {todaysChallenges && todaysChallenges.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {todaysChallenges.map((challenge: any) => {
                const completion = userCompletions?.find((c: any) => c.challengeId === challenge._id)
                return (
                  <ChallengeCard
                    key={challenge._id}
                    challenge={challenge}
                    completion={completion}
                    onComplete={handleCompleteChallenge}
                  />
                )
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6 text-center">
                <Zap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Challenges Today</h3>
                <p className="text-muted-foreground mb-4">New challenges will be available tomorrow!</p>
                <Button variant="outline">Check Back Tomorrow</Button>
              </CardContent>
            </Card>
          )}

          {/* Completion Status */}
          {todayTotal > 0 && (
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-blue-600" />
                  Today's Progress
                </CardTitle>
                <CardDescription>
                  {todayCompleted === todayTotal
                    ? "Congratulations! You've completed all challenges today!"
                    : `${todayCompleted} of ${todayTotal} challenges completed`}
                </CardDescription>
              </CardHeader>
              {todayCompleted === todayTotal && (
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-100 text-green-800">Perfect Day!</Badge>
                    <Badge variant="outline">+50 Bonus Points</Badge>
                  </div>
                </CardContent>
              )}
            </Card>
          )}
        </TabsContent>

        {/* Achievements Tab */}
        <TabsContent value="achievements">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userAchievements && userAchievements.length > 0 ? (
              userAchievements.map((achievement: any) => (
                <Card
                  key={achievement._id}
                  className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Trophy className="h-8 w-8 text-yellow-600" />
                      <Badge variant="secondary">{achievement.pointsAwarded} pts</Badge>
                    </div>
                    <CardTitle className="text-lg">{achievement.title}</CardTitle>
                    <CardDescription>{achievement.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground">
                      Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="col-span-full">
                <CardContent className="pt-6 text-center">
                  <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Achievements Yet</h3>
                  <p className="text-muted-foreground">Complete challenges to unlock achievements!</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
