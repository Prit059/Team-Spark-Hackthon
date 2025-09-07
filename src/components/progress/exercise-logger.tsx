"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Dumbbell, Timer, Zap } from "lucide-react"

const exerciseSchema = z.object({
  exerciseName: z.string().min(1, "Exercise name is required"),
  exerciseType: z.enum(["cardio", "strength", "flexibility", "custom"]),
  duration: z.number().min(1, "Duration must be at least 1 minute"),
  reps: z.number().optional(),
  sets: z.number().optional(),
  weight: z.number().optional(),
  calories: z.number().optional(),
  notes: z.string().optional(),
})

type ExerciseFormData = z.infer<typeof exerciseSchema>

interface ExerciseLoggerProps {
  onLogExercise: (data: ExerciseFormData) => Promise<void>
  isLoading?: boolean
}

export function ExerciseLogger({ onLogExercise, isLoading }: ExerciseLoggerProps) {
  const [selectedType, setSelectedType] = useState<string>("")

  const form = useForm<ExerciseFormData>({
    resolver: zodResolver(exerciseSchema),
    defaultValues: {
      exerciseName: "",
      exerciseType: "cardio",
      duration: 0,
      reps: undefined,
      sets: undefined,
      weight: undefined,
      calories: undefined,
      notes: "",
    },
  })

  const onSubmit = async (data: ExerciseFormData) => {
    await onLogExercise(data)
    form.reset()
    setSelectedType("")
  }

  const exerciseType = form.watch("exerciseType")

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Dumbbell className="h-5 w-5 text-blue-600" />
          Log Exercise
        </CardTitle>
        <CardDescription>Track your workout progress and build your fitness streak</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="exerciseName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Exercise Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Push-ups, Running, Yoga" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="exerciseType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Exercise Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="cardio">
                          <div className="flex items-center gap-2">
                            <Timer className="h-4 w-4" />
                            Cardio
                          </div>
                        </SelectItem>
                        <SelectItem value="strength">
                          <div className="flex items-center gap-2">
                            <Dumbbell className="h-4 w-4" />
                            Strength
                          </div>
                        </SelectItem>
                        <SelectItem value="flexibility">
                          <div className="flex items-center gap-2">
                            <Zap className="h-4 w-4" />
                            Flexibility
                          </div>
                        </SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (min)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="30"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {exerciseType === "strength" && (
                <>
                  <FormField
                    control={form.control}
                    name="sets"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sets</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="3"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value) || undefined)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="reps"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Reps</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="12"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value) || undefined)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="weight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Weight (kg)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="50"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value) || undefined)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              <FormField
                control={form.control}
                name="calories"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Calories (optional)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="200"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value) || undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="How did it feel? Any observations..." className="resize-none" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Logging Exercise..." : "Log Exercise"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
