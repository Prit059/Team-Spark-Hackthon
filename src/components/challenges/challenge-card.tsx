"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Trophy, Target, Clock, Footprints, CheckCircle, Star } from "lucide-react"

interface Challenge {
  _id: string
  title: string
  description: string
  type: string
  target: number
  points: number
  difficulty: string
}

interface ChallengeCompletion {
  challengeId: string
  actualValue: number
  pointsEarned: number
}

interface ChallengeCardProps {
  challenge: Challenge
  completion?: ChallengeCompletion
  onComplete: (challengeId: string, actualValue: number) => Promise<void>
  isLoading?: boolean
}

export function ChallengeCard({ challenge, completion, onComplete, isLoading }: ChallengeCardProps) {
  const [actualValue, setActualValue] = useState<number>(0)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const isCompleted = !!completion
  const progress = completion ? Math.min((completion.actualValue / challenge.target) * 100, 100) : 0

  const getChallengeIcon = (type: string) => {
    switch (type) {
      case "reps":
        return <Target className="h-5 w-5" />
      case "duration":
        return <Clock className="h-5 w-5" />
      case "steps":
        return <Footprints className="h-5 w-5" />
      default:
        return <Trophy className="h-5 w-5" />
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-100 text-green-800 border-green-200"
      case "intermediate":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "advanced":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getTargetUnit = (type: string) => {
    switch (type) {
      case "reps":
        return "reps"
      case "duration":
        return "seconds"
      case "steps":
        return "steps"
      default:
        return "units"
    }
  }

  const handleComplete = async () => {
    if (actualValue > 0) {
      await onComplete(challenge._id, actualValue)
      setIsDialogOpen(false)
      setActualValue(0)
    }
  }

  const getBonusMultiplier = () => {
    if (!completion) return 1
    const ratio = completion.actualValue / challenge.target
    if (ratio >= 1.5) return 1.5
    if (ratio >= 1.2) return 1.2
    if (ratio < 0.8) return 0.8
    return 1
  }

  return (
    <Card className={`relative overflow-hidden ${isCompleted ? "border-green-200 bg-green-50" : ""}`}>
      {isCompleted && (
        <div className="absolute top-2 right-2">
          <CheckCircle className="h-6 w-6 text-green-600" />
        </div>
      )}

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-lg ${isCompleted ? "bg-green-100" : "bg-blue-100"}`}>
              {getChallengeIcon(challenge.type)}
            </div>
            <div>
              <CardTitle className="text-lg">{challenge.title}</CardTitle>
              <CardDescription className="text-sm">{challenge.description}</CardDescription>
            </div>
          </div>
          <Badge className={getDifficultyColor(challenge.difficulty)} variant="outline">
            {challenge.difficulty}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Target and Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Target</span>
            <span className="font-medium">
              {challenge.target} {getTargetUnit(challenge.type)}
            </span>
          </div>

          {isCompleted && (
            <>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Your Result</span>
                <span className="font-medium text-green-600">
                  {completion.actualValue} {getTargetUnit(challenge.type)}
                </span>
              </div>
              <Progress value={progress} className="h-2" />
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{Math.round(progress)}% of target</span>
                {getBonusMultiplier() !== 1 && (
                  <Badge variant="secondary" className="text-xs">
                    {getBonusMultiplier()}x bonus!
                  </Badge>
                )}
              </div>
            </>
          )}
        </div>

        {/* Points */}
        <div className="flex items-center justify-between p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-yellow-600" />
            <span className="text-sm font-medium">Reward</span>
          </div>
          <div className="text-right">
            {isCompleted ? (
              <div>
                <span className="font-bold text-yellow-600">{completion.pointsEarned} points</span>
                {getBonusMultiplier() !== 1 && (
                  <div className="text-xs text-muted-foreground">
                    Base: {challenge.points} × {getBonusMultiplier()}
                  </div>
                )}
              </div>
            ) : (
              <span className="font-bold text-yellow-600">{challenge.points} points</span>
            )}
          </div>
        </div>

        {/* Action Button */}
        {!isCompleted && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full">Complete Challenge</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {getChallengeIcon(challenge.type)}
                  {challenge.title}
                </DialogTitle>
                <DialogDescription>{challenge.description}</DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="text-sm text-blue-800">
                    <strong>Target:</strong> {challenge.target} {getTargetUnit(challenge.type)}
                  </div>
                  <div className="text-sm text-blue-600 mt-1">
                    Complete the challenge and enter your actual performance below
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="actual-value">Your Result</Label>
                  <div className="flex gap-2">
                    <Input
                      id="actual-value"
                      type="number"
                      placeholder={`Enter ${getTargetUnit(challenge.type)}`}
                      value={actualValue || ""}
                      onChange={(e) => setActualValue(Number(e.target.value))}
                      min="0"
                    />
                    <span className="flex items-center text-sm text-muted-foreground px-3">
                      {getTargetUnit(challenge.type)}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleComplete} disabled={actualValue <= 0 || isLoading} className="flex-1">
                    {isLoading ? "Completing..." : "Complete Challenge"}
                  </Button>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {isCompleted && (
          <div className="text-center py-2">
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Challenge Completed!
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
