"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, X } from "lucide-react"

interface ExerciseFiltersProps {
  onFilterChange: (filters: {
    search: string
    category: string
    difficulty: string
    muscleGroup: string
    equipment: string
  }) => void
  categories: string[]
  muscleGroups: string[]
  equipmentList: string[]
}

export function ExerciseFilters({ onFilterChange, categories, muscleGroups, equipmentList }: ExerciseFiltersProps) {
  const [filters, setFilters] = useState({
    search: "",
    category: "all",
    difficulty: "all",
    muscleGroup: "all",
    equipment: "all",
  })

  const [activeFilters, setActiveFilters] = useState<string[]>([])

  const updateFilter = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)

    // Update active filters for display
    const active = Object.entries(newFilters)
      .filter(([_, v]) => v !== "all")
      .map(([k, v]) => `${k}: ${v}`)
    setActiveFilters(active)
  }

  const clearFilter = (filterKey: string) => {
    updateFilter(filterKey, "all")
  }

  const clearAllFilters = () => {
    const clearedFilters = {
      search: "",
      category: "all",
      difficulty: "all",
      muscleGroup: "all",
      equipment: "all",
    }
    setFilters(clearedFilters)
    setActiveFilters([])
    onFilterChange(clearedFilters)
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search exercises..."
              value={filters.search}
              onChange={(e) => updateFilter("search", e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filter Dropdowns */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Select value={filters.category} onValueChange={(value) => updateFilter("category", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.difficulty} onValueChange={(value) => updateFilter("difficulty", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.muscleGroup} onValueChange={(value) => updateFilter("muscleGroup", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Muscle Group" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Muscles</SelectItem>
                {muscleGroups.map((muscle) => (
                  <SelectItem key={muscle} value={muscle}>
                    {muscle.charAt(0).toUpperCase() + muscle.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.equipment} onValueChange={(value) => updateFilter("equipment", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Equipment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Equipment</SelectItem>
                <SelectItem value="none">No Equipment</SelectItem>
                {equipmentList.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item.charAt(0).toUpperCase() + item.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Active Filters */}
          {activeFilters.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Active filters:</span>
              {activeFilters.map((filter, index) => (
                <Badge key={index} variant="secondary" className="gap-1">
                  {filter}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => {
                      const [key] = filter.split(": ")
                      clearFilter(key)
                    }}
                  />
                </Badge>
              ))}
              <Button variant="ghost" size="sm" onClick={clearAllFilters} className="h-6 px-2">
                Clear all
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
