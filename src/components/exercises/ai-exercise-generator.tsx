"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Loader2, Sparkles, Clock, Target } from "lucide-react"

interface AIExerciseGeneratorProps {
  onExerciseGenerated: (exercise: any) => void
}

export function AIExerciseGenerator({ onExerciseGenerated }: AIExerciseGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [prompt, setPrompt] = useState("")
  const [generatedExercise, setGeneratedExercise] = useState<any>(null)

  const generateExercise = async () => {
    if (!prompt.trim()) return

    setIsGenerating(true)

    // Simulate AI generation (replace with actual AI call)
    setTimeout(() => {
      const mockExercise = {
        name: "AI Generated Exercise",
        category: "custom",
        difficulty: "intermediate",
        muscleGroups: ["core", "legs"],
        equipment: [],
        instructions: [
          "Start in a standing position with feet shoulder-width apart",
          "Engage your core and maintain proper posture",
          "Perform the movement with controlled motion",
          "Return to starting position and repeat",
        ],
        tips: [
          "Focus on proper form over speed",
          "Breathe steadily throughout the exercise",
          "Stop if you feel any pain",
        ],
        estimatedCalories: 8,
        description: `Custom exercise based on: "${prompt}"`,
      }

      setGeneratedExercise(mockExercise)
      setIsGenerating(false)
    }, 2000)
  }

  const handleUseExercise = () => {
    if (generatedExercise) {
      onExerciseGenerated(generatedExercise)
      setGeneratedExercise(null)
      setPrompt("")
    }
  }

  return (
    <Card className="border-2 border-dashed border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-600" />
          AI Exercise Generator
        </CardTitle>
        <CardDescription>
          Can't find the exercise you're looking for? Describe it and let AI create a custom guide for you.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!generatedExercise ? (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium">Describe your exercise</label>
              <Textarea
                placeholder="e.g., 'A core exercise that combines planks with leg movements' or 'Upper body workout using resistance bands'"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-[80px]"
              />
            </div>

            <Button
              onClick={generateExercise}
              disabled={!prompt.trim() || isGenerating}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating Exercise...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Custom Exercise
                </>
              )}
            </Button>
          </>
        ) : (
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-4 border">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-lg">{generatedExercise.name}</h3>
                <Badge variant="outline" className="bg-purple-100 text-purple-800">
                  AI Generated
                </Badge>
              </div>

              <p className="text-sm text-muted-foreground mb-3">{generatedExercise.description}</p>

              <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                <span className="flex items-center gap-1">
                  <Target className="h-3 w-3" />
                  {generatedExercise.muscleGroups.join(", ")}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />~{generatedExercise.estimatedCalories} cal/min
                </span>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-sm">Instructions:</h4>
                <ol className="text-sm space-y-1">
                  {generatedExercise.instructions.map((instruction: string, index: number) => (
                    <li key={index} className="flex gap-2">
                      <span className="text-purple-600 font-medium">{index + 1}.</span>
                      <span>{instruction}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleUseExercise} className="flex-1">
                Use This Exercise
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setGeneratedExercise(null)
                  setPrompt("")
                }}
              >
                Generate New
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
