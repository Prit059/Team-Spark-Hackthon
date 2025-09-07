"use client"

import TerminalOverlay from "@/components/TerminalOverlay"
import { Button } from "@/components/ui/button"
import UserPrograms from "@/components/UserPrograms"
import { ArrowRightIcon, Dumbbell, Target, Trophy, TrendingUp } from "lucide-react"
import Link from "next/link"
import { Authenticated, Unauthenticated } from "convex/react"
import { SignInButton } from "@clerk/nextjs"
import { StatsOverview } from "@/components/dashboard/stats-overview"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

function HeroSection() {
  return (
    <section className="relative z-10 py-24 flex-grow">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative">
          {/* Corner Decoration */}
          <div className="absolute -top-10 left-0 w-40 h-40 border-l-2 border-t-2" />

          {/* LEFT CONTENT */}
          <div className="lg:col-span-7 space-y-8 relative">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
              <div><span className="text-foreground">Transform</span></div>
              <div><span className="text-primary">Your Body</span></div>
              <div className="pt-2"><span className="text-foreground">With Advanced</span></div>
              <div className="pt-2">
                <span className="text-foreground">AI</span>
                <span className="text-primary"> Technology</span>
              </div>
            </h1>

            {/* Separator */}
            <div className="h-px w-full bg-gradient-to-r from-primary via-secondary to-primary opacity-50"></div>

            <p className="text-xl text-muted-foreground w-2/3">
              Talk to our AI assistant and get personalized diet plans and workout routines
              designed just for you
            </p>

            {/* Stats */}
            <div className="flex items-center gap-10 py-6 font-mono">
              <div className="flex flex-col">
                <div className="text-2xl text-primary">500+</div>
                <div className="text-xs uppercase tracking-wider">ACTIVE USERS</div>
              </div>
              <div className="h-12 w-px bg-gradient-to-b from-transparent via-border to-transparent"></div>
              <div className="flex flex-col">
                <div className="text-2xl text-primary">3min</div>
                <div className="text-xs uppercase tracking-wider">GENERATION</div>
              </div>
              <div className="h-12 w-px bg-gradient-to-b from-transparent via-border to-transparent"></div>
              <div className="flex flex-col">
                <div className="text-2xl text-primary">100%</div>
                <div className="text-xs uppercase tracking-wider">PERSONALIZED</div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Button
                size="lg"
                asChild
                className="overflow-hidden bg-primary text-primary-foreground px-8 py-6 text-lg font-medium"
              >
                <Link href={"/generate-program"} className="flex items-center font-mono">
                  Build Your Program
                  <ArrowRightIcon className="ml-2 size-5" />
                </Link>
              </Button>
            </div>
          </div>

          {/* RIGHT CONTENT */}
          <div className="lg:col-span-5 relative">
            {/* Corner Pieces */}
            <div className="absolute -inset-4 pointer-events-none">
              <div className="absolute top-0 left-0 w-16 h-16 border-l-2 border-t-2 border-border" />
              <div className="absolute top-0 right-0 w-16 h-16 border-r-2 border-t-2 border-border" />
              <div className="absolute bottom-0 left-0 w-16 h-16 border-l-2 border-b-2 border-border" />
              <div className="absolute bottom-0 right-0 w-16 h-16 border-r-2 border-b-2 border-border" />
            </div>

            {/* Image Container */}
            <div className="relative aspect-square max-w-lg mx-auto">
              <div className="relative overflow-hidden rounded-lg bg-cyber-black">
                <img
                  src="/hero-ai3.png"
                  alt="AI Fitness Coach"
                  className="size-full object-cover object-center"
                />
                {/* Scan Line */}
                <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,transparent_calc(50%-1px),var(--cyber-glow-primary)_50%,transparent_calc(50%+1px),transparent_100%)] bg-[length:100%_8px] animate-scanline pointer-events-none" />

                {/* Decorations */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-1/3 left-1/3 w-1/3 h-1/3 border border-primary/40 rounded-full" />
                  <div className="absolute top-1/2 left-0 w-1/4 h-px bg-primary/50" />
                  <div className="absolute top-1/2 right-0 w-1/4 h-px bg-primary/50" />
                  <div className="absolute top-0 left-1/2 h-1/4 w-px bg-primary/50" />
                  <div className="absolute bottom-0 left-1/2 h-1/4 w-px bg-primary/50" />
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
              </div>

              {/* Terminal Overlay */}
              <TerminalOverlay />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Transform Your Fitness Journey with AI
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Track your progress, discover new exercises, complete daily challenges,
            and compete with friends in the ultimate fitness experience.
          </p>
          <SignInButton>
            <Button size="lg" className="text-lg px-8 py-3">Start Your Journey</Button>
          </SignInButton>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {[
            { icon: TrendingUp, title: "Track Progress", description: "Monitor your daily workouts and see your improvement over time" },
            { icon: Dumbbell, title: "Exercise Guide", description: "Access hundreds of exercises with step-by-step instructions" },
            { icon: Target, title: "Daily Challenges", description: "Complete fun challenges to stay motivated and earn points" },
            { icon: Trophy, title: "Leaderboard", description: "Compete with friends and climb the fitness rankings" },
          ].map((feature, index) => (
            <Card key={index} className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

function Dashboard() {
  return (
    <div className="space-y-6 container mx-auto py-12">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's your fitness overview.</p>
      </div>

      <StatsOverview />

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <Link href="/progress">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <TrendingUp className="mr-2 h-4 w-4" /> Log Today's Workout
              </Button>
            </Link>
            <Link href="/challenges">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Target className="mr-2 h-4 w-4" /> View Daily Challenge
              </Button>
            </Link>
            <Link href="/exercises">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Dumbbell className="mr-2 h-4 w-4" /> Browse Exercises
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Recent Activity</CardTitle></CardHeader>
          <CardContent>
            <p className="text-gray-600">Your recent workouts and achievements will appear here.</p>
          </CardContent>
        </Card>
      </div>

      <UserPrograms />
    </div>
  )
}

export default function HomePage() {
  return (
    <>
      <Unauthenticated>
        <LandingPage />
        <HeroSection />
      </Unauthenticated>
      <Authenticated>
        <Dashboard />
      </Authenticated>
    </>
  )
}
