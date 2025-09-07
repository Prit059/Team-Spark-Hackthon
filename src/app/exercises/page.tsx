"use client"

import { useState, useMemo } from "react"
import { useQuery } from "convex/react"
import { api } from "../../../convex/_generated/api"

import { ExerciseCard } from "@/components/exercises/exercise-card"
import { ExerciseFilters } from "@/components/exercises/exercise-filters"
import { AIExerciseGenerator } from "@/components/exercises/ai-exercise-generator"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { BookOpen, Sparkles, Grid3X3 } from "lucide-react"

export default function ExercisesPage() {
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    difficulty: "",
    muscleGroup: "",
    equipment: "",
  })

  const [customExercises, setCustomExercises] = useState<any[]>([])

  // Fetch exercise catalog from Convex
  const exercises = useQuery(api.exercises.getExerciseCatalog, {})

  // Combine DB + AI-generated exercises
  const allExercises = useMemo(() => {
    return [...(exercises || []), ...customExercises]
  }, [exercises, customExercises])

  // Apply filters
  const filteredExercises = useMemo(() => {
    if (!allExercises) return []

    return allExercises.filter((exercise: any) => {
      const matchesSearch =
        exercise.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        exercise.muscleGroups?.some((muscle: string) =>
          muscle.toLowerCase().includes(filters.search.toLowerCase())
        )

      const matchesCategory = !filters.category || exercise.category === filters.category
      const matchesDifficulty = !filters.difficulty || exercise.difficulty === filters.difficulty
      const matchesMuscleGroup = !filters.muscleGroup || exercise.muscleGroups?.includes(filters.muscleGroup)
      const matchesEquipment =
        !filters.equipment ||
        (filters.equipment === "none"
          ? exercise.equipment?.length === 0
          : exercise.equipment?.includes(filters.equipment))

      return (
        matchesSearch &&
        matchesCategory &&
        matchesDifficulty &&
        matchesMuscleGroup &&
        matchesEquipment
      )
    })
  }, [allExercises, filters])

  // Unique values for filter dropdowns
  const categories = useMemo(() => {
    if (!allExercises) return []
    return [...new Set(allExercises.map((ex: any) => ex.category))]
  }, [allExercises])

  const muscleGroups = useMemo(() => {
    if (!allExercises) return []
    return [...new Set(allExercises.flatMap((ex: any) => ex.muscleGroups))]
  }, [allExercises])

  const equipmentList = useMemo(() => {
    if (!allExercises) return []
    return [...new Set(allExercises.flatMap((ex: any) => ex.equipment))]
  }, [allExercises])

  // Add AI exercise
  const handleCustomExercise = (exercise: any) => {
    setCustomExercises((prev) => [
      ...prev,
      { ...exercise, _id: `custom-${Date.now()}` },
    ])
  }

  // Start workout handler
  const handleStartExercise = (exercise: any) => {
    console.log("Starting exercise:", exercise.name)
    // Later: navigate to workout session or log completion
  }

  // Loading state
  if (!exercises) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading exercise catalog...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-blue-600" />
            Exercise Guide
          </h1>
          <p className="text-muted-foreground">
            Step-by-step instructions for {allExercises.length} exercises
          </p>
        </div>
        <Badge variant="outline" className="flex items-center gap-2">
          <Grid3X3 className="h-4 w-4" />
          {filteredExercises.length} exercises
        </Badge>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="browse" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="browse">Browse Exercises</TabsTrigger>
          <TabsTrigger value="ai-generate">
            <Sparkles className="h-4 w-4 mr-2" />
            AI Generate
          </TabsTrigger>
        </TabsList>

        {/* Browse tab */}
        <TabsContent value="browse" className="space-y-6">
          {/* Filters */}
          <ExerciseFilters
            onFilterChange={setFilters}
            categories={categories}
            muscleGroups={muscleGroups}
            equipmentList={equipmentList}
          />

          {/* Grid */}
          {filteredExercises.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredExercises.map((exercise: any) => (
                <ExerciseCard
                  key={exercise._id}
                  exercise={exercise}
                  onStartExercise={handleStartExercise}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground mb-4">
                  No exercises found matching your filters.
                </p>
                <Button
                  variant="outline"
                  onClick={() =>
                    setFilters({
                      search: "",
                      category: "",
                      difficulty: "",
                      muscleGroup: "",
                      equipment: "",
                    })
                  }
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* AI Generate tab */}
        <TabsContent value="ai-generate">
          <AIExerciseGenerator onExerciseGenerated={handleCustomExercise} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
