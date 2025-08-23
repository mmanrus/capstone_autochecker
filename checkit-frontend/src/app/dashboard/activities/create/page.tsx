"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Trash2, ArrowLeft, Save, Copy } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { MockDataService } from "@/lib/mock-data"

interface TestCase {
  id: string
  input: string
  operation: string
  result: string
}

export default function CreateActivityPage() {
  const router = useRouter()
  const currentUser = MockDataService.getCurrentUser()
  const subjects = MockDataService.getSubjectsForProfessor(currentUser.id)
  const existingActivities = MockDataService.getActivitiesForProfessor(currentUser.id)

  const [formData, setFormData] = useState({
    title: "",
    subjectId: "",
    closeDate: "",
    closeTime: "",
    instructions: "",
    maxScore: "",
    difficulty: "",
  })

  const [testCases, setTestCases] = useState<TestCase[]>([{ id: "1", input: "", operation: "", result: "" }])
  const [isReuseModalOpen, setIsReuseModalOpen] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleReuseActivity = (activity: any) => {
    setFormData({
      title: `${activity.title} (Copy)`,
      subjectId: activity.subjectId,
      closeDate: "",
      closeTime: "",
      instructions: activity.instructions,
      maxScore: activity.maxScore.toString(),
      difficulty: activity.difficulty,
    })

    const convertedTestCases = activity.testCases.map((tc: any, index: number) => ({
      id: (index + 1).toString(),
      input: tc.input,
      operation: tc.operation,
      result: tc.expectedResult,
    }))

    if (convertedTestCases.length > 0) {
      setTestCases(convertedTestCases)
    }

    setIsReuseModalOpen(false)
  }

  const addTestCase = () => {
    const newId = (testCases.length + 1).toString()
    setTestCases((prev) => [...prev, { id: newId, input: "", operation: "", result: "" }])
  }

  const removeTestCase = (id: string) => {
    if (testCases.length > 1) {
      setTestCases((prev) => prev.filter((tc) => tc.id !== id))
    }
  }

  const updateTestCase = (id: string, field: keyof TestCase, value: string) => {
    setTestCases((prev) => prev.map((tc) => (tc.id === id ? { ...tc, [field]: value } : tc)))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const selectedSubject = subjects.find((s) => s.id === formData.subjectId)
    if (!selectedSubject) return

    const newActivity = MockDataService.createActivity({
      title: formData.title,
      subjectId: formData.subjectId,
      subject: selectedSubject.name,
      subjectCode: selectedSubject.code,
      instructor: currentUser.name,
      instructorId: currentUser.id,
      description: formData.title,
      instructions: formData.instructions,
      dueDate: formData.closeDate,
      dueTime: formData.closeTime,
      maxScore: Number.parseInt(formData.maxScore),
      difficulty: formData.difficulty as "Easy" | "Medium" | "Hard",
      testCases: testCases.map((tc) => ({
        id: tc.id,
        input: tc.input,
        operation: tc.operation,
        expectedResult: tc.result,
      })),
    })

    alert("Activity created successfully!")
    router.push("/dashboard/activities")
  }

  const selectedSubject = subjects.find((s) => s.id === formData.subjectId)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" asChild className="bg-transparent">
            <Link href="/dashboard/activities">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Activities
            </Link>
          </Button>
        </div>

        {/* Reuse Activity button */}
        <Dialog open={isReuseModalOpen} onOpenChange={setIsReuseModalOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="bg-transparent">
              <Copy className="h-4 w-4 mr-2" />
              Reuse Existing Activity
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Reuse Existing Activity</DialogTitle>
              <DialogDescription>
                Select an existing activity to use as a template. All fields will be populated with the selected
                activity's data.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {existingActivities.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No existing activities found. Create your first activity to enable reuse functionality.
                </p>
              ) : (
                existingActivities.map((activity) => (
                  <Card
                    key={activity.id}
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => handleReuseActivity(activity)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold">{activity.title}</h3>
                            <Badge
                              variant={
                                activity.difficulty === "Easy"
                                  ? "secondary"
                                  : activity.difficulty === "Medium"
                                    ? "default"
                                    : "destructive"
                              }
                            >
                              {activity.difficulty}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {activity.subject} ({activity.subjectCode})
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Max Score: {activity.maxScore} • Test Cases: {activity.testCases.length}
                          </p>
                          <p className="text-sm text-muted-foreground line-clamp-2">{activity.description}</p>
                        </div>
                        <Button size="sm" variant="ghost">
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div>
        <h1 className="text-3xl font-serif font-bold">Create New Activity</h1>
        <p className="text-muted-foreground">Design an assignment with automated testing capabilities</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Activity Details</CardTitle>
            <CardDescription>Basic information about the assignment</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Activity Title</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="e.g., Binary Tree Implementation"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Select value={formData.subjectId} onValueChange={(value) => handleSelectChange("subjectId", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject.id} value={subject.id}>
                        {subject.name} ({subject.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedSubject && (
                  <Badge variant="outline" className="mt-2">
                    {selectedSubject.code}
                  </Badge>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="closeDate">Close Date</Label>
                <Input
                  id="closeDate"
                  name="closeDate"
                  type="date"
                  value={formData.closeDate}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="closeTime">Close Time</Label>
                <Input
                  id="closeTime"
                  name="closeTime"
                  type="time"
                  value={formData.closeTime}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxScore">Max Score</Label>
                <Input
                  id="maxScore"
                  name="maxScore"
                  type="number"
                  placeholder="100"
                  value={formData.maxScore}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="difficulty">Difficulty Level</Label>
              <Select value={formData.difficulty} onValueChange={(value) => handleSelectChange("difficulty", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Easy">Easy</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Instructions</CardTitle>
            <CardDescription>Detailed instructions for students (supports Markdown)</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              name="instructions"
              placeholder="## Objective
Describe what students need to accomplish...

## Requirements
1. First requirement
2. Second requirement

## Submission Format
- File format requirements
- Naming conventions"
              value={formData.instructions}
              onChange={handleInputChange}
              className="min-h-[300px] font-mono text-sm"
              required
            />
          </CardContent>
        </Card>

        {/* Test Suite */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Test Suite</CardTitle>
                <CardDescription>Define test cases for automated evaluation</CardDescription>
              </div>
              <Button type="button" onClick={addTestCase} size="sm" variant="outline" className="bg-transparent">
                <Plus className="h-4 w-4 mr-2" />
                Add Test Case
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {testCases.map((testCase, index) => (
              <div key={testCase.id} className="p-4 border rounded-lg space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Test Case {index + 1}</h4>
                  {testCases.length > 1 && (
                    <Button
                      type="button"
                      onClick={() => removeTestCase(testCase.id)}
                      size="sm"
                      variant="outline"
                      className="bg-transparent text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Input</Label>
                    <Textarea
                      placeholder="e.g., [5, 3, 7, 1, 9]"
                      value={testCase.input}
                      onChange={(e) => updateTestCase(testCase.id, "input", e.target.value)}
                      className="min-h-[80px] font-mono text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Operation</Label>
                    <Textarea
                      placeholder="e.g., sort_array()"
                      value={testCase.operation}
                      onChange={(e) => updateTestCase(testCase.id, "operation", e.target.value)}
                      className="min-h-[80px] font-mono text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Expected Result</Label>
                    <Textarea
                      placeholder="e.g., [1, 3, 5, 7, 9]"
                      value={testCase.result}
                      onChange={(e) => updateTestCase(testCase.id, "result", e.target.value)}
                      className="min-h-[80px] font-mono text-sm"
                    />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" asChild className="bg-transparent">
            <Link href="/dashboard/activities">Cancel</Link>
          </Button>
          <Button type="submit" size="lg">
            <Save className="h-4 w-4 mr-2" />
            Create Activity
          </Button>
        </div>
      </form>
    </div>
  )
}
