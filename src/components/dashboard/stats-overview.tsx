// "use client"

// import { useQuery } from "convex/react"
// import { api } from "../../../convex/_generated/api"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { TrendingUp, Target, Trophy, Flame } from "lucide-react"

// export function StatsOverview() {
//   const userStats = useQuery(api.progress.getUserStats)
//   const currentStreak = useQuery(api.progress.getCurrentStreak)
//   const todayChallenge = useQuery(api.challenges.getTodaysChallenges)

//   if (!userStats || currentStreak === undefined || todayChallenge === undefined) {
//     return <div>Loading stats...</div>
//   }


//   const stats = [
//     {
//       title: "Total Workouts",
//       value: userStats.totalWorkouts,
//       icon: TrendingUp,
//       color: "text-blue-600",
//       bgColor: "bg-blue-50",
//     },
//     {
//       title: "Current Streak",
//       value: `${currentStreak || 0} days`,
//       icon: Flame,
//       color: "text-orange-600",
//       bgColor: "bg-orange-50",
//     },
//     {
//       title: "This Week",
//       value: userStats.weeklyWorkouts,
//       icon: Target,
//       color: "text-green-600",
//       bgColor: "bg-green-50",
//     },
//     {
//       title: "Total Points",
//       value: userStats.totalPoints,
//       icon: Trophy,
//       color: "text-purple-600",
//       bgColor: "bg-purple-50",
//     },
//   ]

//   return (
//     <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//       {stats.map((stat) => (
//         <Card key={stat.title}>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
//             <div className={`p-2 rounded-lg ${stat.bgColor}`}>
//               <stat.icon className={`h-4 w-4 ${stat.color}`} />
//             </div>
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{stat.value}</div>
//             {stat.title === "Current Streak" && currentStreak && currentStreak > 0 && (
//               <Badge variant="success" className="mt-2">
//                 🔥 On Fire!
//               </Badge>
//             )}
//           </CardContent>
//         </Card>
//       ))}

//       {todayChallenge && (
//         <Card className="md:col-span-2 lg:col-span-4">
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <Target className="h-5 w-5 text-blue-600" />
//               Today's Challenge
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="flex items-center justify-between">
//               <div>
//                 <h3 className="font-semibold">{todayChallenge.title}</h3>
//                 <p className="text-sm text-gray-600">{todayChallenge.description}</p>
//               </div>
//               <Badge variant={todayChallenge.completed ? "success" : "outline"}>
//                 {todayChallenge.completed ? "Completed" : "Pending"}
//               </Badge>
//             </div>
//           </CardContent>
//         </Card>
//       )}
//     </div>
//   )
// }
