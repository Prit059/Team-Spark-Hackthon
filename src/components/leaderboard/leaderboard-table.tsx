"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Trophy, Medal, Crown, Dumbbell, Clock } from "lucide-react"

interface LeaderboardEntry {
  _id: string
  rank: number
  weeklyWorkouts: number
  weeklyPoints: number
  weeklyMinutes: number
  user: {
    name: string
    profileImage?: string
    level: number
  }
  isCurrentUser?: boolean
  friendRank?: number
}

interface LeaderboardTableProps {
  entries: LeaderboardEntry[]
  title: string
  description: string
  currentUserId?: string
  showFriendRanks?: boolean
}

export function LeaderboardTable({
  entries,
  title,
  description,
  currentUserId,
  showFriendRanks = false,
}: LeaderboardTableProps) {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-5 w-5 text-yellow-500" />
      case 2:
        return <Trophy className="h-5 w-5 text-gray-400" />
      case 3:
        return <Medal className="h-5 w-5 text-amber-600" />
      default:
        return <span className="text-sm font-semibold text-muted-foreground">#{rank}</span>
    }
  }

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white"
      case 2:
        return "bg-gradient-to-r from-gray-300 to-gray-500 text-white"
      case 3:
        return "bg-gradient-to-r from-amber-400 to-amber-600 text-white"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  if (entries.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No participants this week</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-600" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Top 3 Podium */}
        {entries.length >= 3 && !showFriendRanks && (
          <div className="mb-6">
            <div className="flex items-end justify-center gap-4 mb-4">
              {/* 2nd Place */}
              <div className="text-center">
                <div className="relative">
                  <Avatar className="h-16 w-16 border-4 border-gray-300">
                    <AvatarImage src={entries[1].user.profileImage || "/placeholder.svg"} />
                    <AvatarFallback>{getInitials(entries[1].user.name)}</AvatarFallback>
                  </Avatar>
                  <div className="absolute -top-2 -right-2">
                    <Trophy className="h-6 w-6 text-gray-400" />
                  </div>
                </div>
                <div className="mt-2">
                  <p className="font-semibold text-sm">{entries[1].user.name}</p>
                  <Badge className="bg-gray-100 text-gray-800 text-xs">{entries[1].weeklyPoints} pts</Badge>
                </div>
                <div className="w-20 h-16 bg-gradient-to-t from-gray-300 to-gray-400 mt-2 rounded-t-lg flex items-end justify-center pb-2">
                  <span className="text-white font-bold">2</span>
                </div>
              </div>

              {/* 1st Place */}
              <div className="text-center">
                <div className="relative">
                  <Avatar className="h-20 w-20 border-4 border-yellow-400">
                    <AvatarImage src={entries[0].user.profileImage || "/placeholder.svg"} />
                    <AvatarFallback>{getInitials(entries[0].user.name)}</AvatarFallback>
                  </Avatar>
                  <div className="absolute -top-3 -right-3">
                    <Crown className="h-8 w-8 text-yellow-500" />
                  </div>
                </div>
                <div className="mt-2">
                  <p className="font-bold">{entries[0].user.name}</p>
                  <Badge className="bg-yellow-100 text-yellow-800">{entries[0].weeklyPoints} pts</Badge>
                </div>
                <div className="w-20 h-20 bg-gradient-to-t from-yellow-400 to-yellow-600 mt-2 rounded-t-lg flex items-end justify-center pb-2">
                  <span className="text-white font-bold text-lg">1</span>
                </div>
              </div>

              {/* 3rd Place */}
              <div className="text-center">
                <div className="relative">
                  <Avatar className="h-16 w-16 border-4 border-amber-400">
                    <AvatarImage src={entries[2].user.profileImage || "/placeholder.svg"} />
                    <AvatarFallback>{getInitials(entries[2].user.name)}</AvatarFallback>
                  </Avatar>
                  <div className="absolute -top-2 -right-2">
                    <Medal className="h-6 w-6 text-amber-600" />
                  </div>
                </div>
                <div className="mt-2">
                  <p className="font-semibold text-sm">{entries[2].user.name}</p>
                  <Badge className="bg-amber-100 text-amber-800 text-xs">{entries[2].weeklyPoints} pts</Badge>
                </div>
                <div className="w-20 h-12 bg-gradient-to-t from-amber-400 to-amber-600 mt-2 rounded-t-lg flex items-end justify-center pb-2">
                  <span className="text-white font-bold">3</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Full Leaderboard Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Rank</TableHead>
              <TableHead>User</TableHead>
              <TableHead className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <Trophy className="h-4 w-4" />
                  Points
                </div>
              </TableHead>
              <TableHead className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <Dumbbell className="h-4 w-4" />
                  Workouts
                </div>
              </TableHead>
              <TableHead className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <Clock className="h-4 w-4" />
                  Minutes
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.map((entry) => (
              <TableRow key={entry._id} className={entry.isCurrentUser ? "bg-blue-50 border-blue-200" : ""}>
                <TableCell>
                  <div className="flex items-center justify-center">
                    <Badge className={getRankBadge(showFriendRanks ? entry.friendRank || entry.rank : entry.rank)}>
                      {showFriendRanks ? entry.friendRank || entry.rank : entry.rank}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={entry.user.profileImage || "/placeholder.svg"} />
                      <AvatarFallback className="text-xs">{getInitials(entry.user.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">
                        {entry.user.name}
                        {entry.isCurrentUser && (
                          <Badge variant="outline" className="ml-2 text-xs">
                            You
                          </Badge>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground">Level {entry.user.level}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <span className="font-semibold">{entry.weeklyPoints.toLocaleString()}</span>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <span className="font-medium">{entry.weeklyWorkouts}</span>
                </TableCell>
                <TableCell className="text-center">
                  <span className="font-medium">{entry.weeklyMinutes}</span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
