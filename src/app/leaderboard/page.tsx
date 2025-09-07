"use client"

import { useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import { useMutation, useQuery } from "convex/react"
import { api } from "../../../convex/_generated/api"
import { LeaderboardTable } from "@/components/leaderboard/leaderboard-table"
import { AddFriendDialog } from "@/components/leaderboard/add-friend-dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Trophy, Users, Globe, Calendar, Medal } from "lucide-react"

export default function LeaderboardPage() {
  const { user } = useUser()

  // Get current user data
  const currentUser = useQuery(api.users.getCurrentUser, user ? { clerkId: user.id } : "skip")

  // Get leaderboards
  const globalLeaderboard = useQuery(api.leaderboard.getWeeklyLeaderboard, { limit: 50 })
  const friendsLeaderboard = useQuery(
    api.leaderboard.getFriendsLeaderboard,
    currentUser ? { userId: currentUser._id } : "skip",
  )

  // Get user's position
  const userPosition = useQuery(
    api.leaderboard.getUserLeaderboardPosition,
    currentUser ? { userId: currentUser._id } : "skip",
  )

  // Get user's friends
  const userFriends = useQuery(api.leaderboard.getUserFriends, currentUser ? { userId: currentUser._id } : "skip")

  // Mutations
  const addFriend = useMutation(api.leaderboard.addFriend)
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

  const handleAddFriend = async (email: string) => {
    if (!currentUser) return
    await addFriend({
      userId: currentUser._id,
      friendEmail: email,
    })
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  if (!user) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">Please sign in to view the leaderboard</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Trophy className="h-8 w-8 text-yellow-600" />
            Leaderboard
          </h1>
          <p className="text-muted-foreground">Compete with friends and the global community</p>
        </div>
        <Badge variant="outline" className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          This Week
        </Badge>
      </div>

      {/* User Stats Card */}
      {userPosition && (
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Medal className="h-5 w-5 text-blue-600" />
              Your Performance
            </CardTitle>
            <CardDescription>Your current standing this week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">#{userPosition.rank}</div>
                <p className="text-xs text-muted-foreground">Global Rank</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{userPosition.weeklyPoints}</div>
                <p className="text-xs text-muted-foreground">Points</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{userPosition.weeklyWorkouts}</div>
                <p className="text-xs text-muted-foreground">Workouts</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{userPosition.weeklyMinutes}</div>
                <p className="text-xs text-muted-foreground">Minutes</p>
              </div>
            </div>
            <div className="mt-4 text-center">
              <Badge variant="outline">
                Top {Math.round((userPosition.rank / userPosition.totalParticipants) * 100)}% of{" "}
                {userPosition.totalParticipants} participants
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="friends" className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="friends">
              <Users className="h-4 w-4 mr-2" />
              Friends ({userFriends?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="global">
              <Globe className="h-4 w-4 mr-2" />
              Global
            </TabsTrigger>
          </TabsList>

          <AddFriendDialog onAddFriend={handleAddFriend} />
        </div>

        {/* <TabsContent value="friends" className="space-y-6">
          {userFriends && userFriends.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  Your Friends
                </CardTitle>
                <CardDescription>Connect with friends to see their progress</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {userFriends.map((friend) => (
                    <div key={friend._id} className="flex items-center gap-3 p-3 border rounded-lg">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={friend.profileImage || "/placeholder.svg"} />
                        <AvatarFallback>{getInitials(friend.name)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium">{friend.name}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>Level {friend.level}</span>
                          <span>•</span>
                          <span>{friend.currentStreak} day streak</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {friendsLeaderboard && friendsLeaderboard.length > 0 ? (
            <LeaderboardTable
              entries={friendsLeaderboard}
              title="Friends Leaderboard"
              description="Compete with your friends this week"
              currentUserId={currentUser?._id}
              showFriendRanks={true}
            />
          ) : (
            <Card>
              <CardContent className="pt-6 text-center">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Friends Yet</h3>
                <p className="text-muted-foreground mb-4">Add friends to compete and motivate each other!</p>
                <AddFriendDialog onAddFriend={handleAddFriend} />
              </CardContent>
            </Card>
          )}
        </TabsContent> */}

        {/* <TabsContent value="global">
          {globalLeaderboard ? (
            <LeaderboardTable
              entries={globalLeaderboard}
              title="Global Leaderboard"
              description="Top performers from around the world this week"
              currentUserId={currentUser?._id}
            />
          ) : (
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading global leaderboard...</p>
              </CardContent>
            </Card>
          )}
        </TabsContent> */}
      </Tabs>
    </div>
  )
}
