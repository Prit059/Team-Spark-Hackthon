"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Clock, Zap, Users, Play, CheckCircle } from "lucide-react"

interface Exercise {
  _id: string
  name: string
  category: string
  difficulty: string
  muscleGroups: string[]
  equipment: string[]
  instructions: string[]
  tips: string[]
  estimatedCalories: number
  imageUrl?: string
  videoUrl?: string
}

interface ExerciseCardProps {
  exercise: Exercise
  onStartExercise?: (exercise: Exercise) => void
}

export function ExerciseCard({ exercise, onStartExercise }: ExerciseCardProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)

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

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "cardio":
        return <Zap className="h-4 w-4" />
      case "strength":
        return <Users className="h-4 w-4" />
      case "flexibility":
        return <Clock className="h-4 w-4" />
      default:
        return <Play className="h-4 w-4" />
    }
  }

  const handleNextStep = () => {
    if (currentStep < exercise.instructions.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      setIsCompleted(true)
      if (onStartExercise) {
        onStartExercise(exercise)
      }
    }
  }

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <Card className="h-full hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <CardTitle className="text-lg">{exercise.name}</CardTitle>
            <div className="flex items-center gap-2">
              {getCategoryIcon(exercise.category)}
              <span className="text-sm text-muted-foreground capitalize">{exercise.category}</span>
            </div>
          </div>
          <Badge className={getDifficultyColor(exercise.difficulty)} variant="outline">
            {exercise.difficulty}
          </Badge>
        </div>
        <CardDescription>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />~{exercise.estimatedCalories} cal/min
            </span>
            <span>{exercise.muscleGroups.slice(0, 2).join(", ")}</span>
          </div>
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Muscle Groups */}
        <div>
          <p className="text-sm font-medium mb-2">Target Muscles</p>
          <div className="flex flex-wrap gap-1">
            {exercise.muscleGroups.map((muscle) => (
              <Badge key={muscle} variant="secondary" className="text-xs">
                {muscle}
              </Badge>
            ))}
          </div>
        </div>

        {/* Equipment */}
        {exercise.equipment.length > 0 && (
          <div>
            <p className="text-sm font-medium mb-2">Equipment</p>
            <div className="flex flex-wrap gap-1">
              {exercise.equipment.map((item) => (
                <Badge key={item} variant="outline" className="text-xs">
                  {item}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Step-by-step Guide Dialog */}
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full" onClick={() => setCurrentStep(0)}>
              <Play className="h-4 w-4 mr-2" />
              Start Exercise Guide
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {getCategoryIcon(exercise.category)}
                {exercise.name}
              </DialogTitle>
              <DialogDescription>Step-by-step guide • {exercise.difficulty} level</DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Progress Indicator */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Step {currentStep + 1} of {exercise.instructions.length}
                </span>
                <div className="flex gap-1">
                  {exercise.instructions.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full ${index <= currentStep ? "bg-blue-600" : "bg-gray-200"}`}
                    />
                  ))}
                </div>
              </div>

              {/* Current Step */}
              <Card className="border-2 border-blue-200 bg-blue-50">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                      {currentStep + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm leading-relaxed">{exercise.instructions[currentStep]}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tips Section */}
              {exercise.tips.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-medium text-yellow-800 mb-2">💡 Pro Tips</h4>
                  <ScrollArea className="max-h-20">
                    <ul className="space-y-1">
                      {exercise.tips.map((tip, index) => (
                        <li key={index} className="text-sm text-yellow-700">
                          • {tip}
                        </li>
                      ))}
                    </ul>
                  </ScrollArea>
                </div>
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between pt-4 border-t">
                <Button variant="outline" onClick={handlePrevStep} disabled={currentStep === 0}>
                  Previous
                </Button>

                <div className="flex items-center gap-2">
                  {isCompleted ? (
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="h-5 w-5" />
                      <span className="font-medium">Completed!</span>
                    </div>
                  ) : (
                    <Button onClick={handleNextStep}>
                      {currentStep === exercise.instructions.length - 1 ? "Complete" : "Next Step"}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
