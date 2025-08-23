"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Clock,
  CheckCircle,
  AlertCircle,
  Calendar,
  BookOpen,
  Upload,
  FileText,
  Download,
  ArrowLeft,
} from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

// Mock activity data - in real app this would be fetched based on ID
const mockActivity = {
  id: 1,
  title: "Binary Tree Implementation",
  subject: "Data Structures & Algorithms",
  subjectCode: "ITCP-101",
  instructor: "Dr. Sarah Johnson",
  description: "Implement a binary search tree with insert, delete, and search operations",
  instructions: `
## Binary Search Tree Implementation

### Objective
Create a complete binary search tree implementation in your preferred programming language.

### Requirements
1. **Node Structure**: Create a TreeNode class/structure with value, left, and right properties
2. **Insert Operation**: Implement insertion maintaining BST property
3. **Delete Operation**: Handle all three cases (leaf, one child, two children)
4. **Search Operation**: Implement efficient search functionality
5. **Traversal Methods**: Implement in-order, pre-order, and post-order traversals

### Test Cases
Your implementation will be tested with the following operations:
- Insert: [50, 30, 70, 20, 40, 60, 80]
- Search: 40 (should return true)
- Delete: 30 (should maintain BST property)
- In-order traversal should return sorted order

### Submission Format
- Submit a single file with your implementation
- Include comments explaining your approach
- Ensure your code compiles and runs without errors

### Grading Criteria
- Correctness (40 points)
- Code quality and comments (30 points)
- Efficiency (20 points)
- Test case handling (10 points)
  `,
  dueDate: "2025-01-25",
  dueTime: "11:59 PM",
  status: "open",
  submitted: false,
  submissionProgress: "0/1",
  maxScore: 100,
  difficulty: "Medium",
  testCases: [
    {
      input: "[50, 30, 70, 20, 40, 60, 80]",
      operation: "insert_all",
      expectedResult: "BST with proper structure",
    },
    {
      input: "40",
      operation: "search",
      expectedResult: "true",
    },
    {
      input: "30",
      operation: "delete",
      expectedResult: "BST maintains property after deletion",
    },
  ],
}

export default function ActivityViewPage() {
  const params = useParams()
  const [submissionText, setSubmissionText] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleSubmit = () => {
    // Mock submission - in real app this would upload to server
    alert("Assignment submitted successfully!")
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "text-green-600 bg-green-50 border-green-200"
      case "Medium":
        return "text-orange-600 bg-orange-50 border-orange-200"
      case "Hard":
        return "text-red-600 bg-red-50 border-red-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  const getStatusIcon = () => {
    if (mockActivity.status === "closed") {
      return mockActivity.submitted ? (
        <CheckCircle className="h-5 w-5 text-green-600" />
      ) : (
        <AlertCircle className="h-5 w-5 text-red-600" />
      )
    }
    return <Clock className="h-5 w-5 text-orange-600" />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="sm" asChild className="bg-transparent">
          <Link href="/dashboard/activities">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Activities
          </Link>
        </Button>
      </div>

      {/* Activity Info */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <CardTitle className="text-2xl">{mockActivity.title}</CardTitle>
              <CardDescription className="text-base">{mockActivity.description}</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              {getStatusIcon()}
              <Badge className={getDifficultyColor(mockActivity.difficulty)} variant="outline">
                {mockActivity.difficulty}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center text-sm">
              <BookOpen className="mr-2 h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Subject:</span>
              <span className="ml-2 font-medium">{mockActivity.subject}</span>
            </div>
            <div className="flex items-center text-sm">
              <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Due:</span>
              <span className="ml-2 font-medium">
                {mockActivity.dueDate} at {mockActivity.dueTime}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div>
              <p className="font-medium">Submission Progress</p>
              <p className="text-sm text-muted-foreground">{mockActivity.submissionProgress} submitted</p>
            </div>
            <div className="text-right">
              <p className="font-medium">Max Score</p>
              <p className="text-sm text-muted-foreground">{mockActivity.maxScore} points</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none">
            <pre className="whitespace-pre-wrap text-sm leading-relaxed">{mockActivity.instructions}</pre>
          </div>
        </CardContent>
      </Card>

      {/* Test Cases */}
      <Card>
        <CardHeader>
          <CardTitle>Test Cases</CardTitle>
          <CardDescription>Your submission will be evaluated against these test cases</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockActivity.testCases.map((testCase, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <Label className="font-medium">Input</Label>
                    <p className="text-muted-foreground mt-1">{testCase.input}</p>
                  </div>
                  <div>
                    <Label className="font-medium">Operation</Label>
                    <p className="text-muted-foreground mt-1">{testCase.operation}</p>
                  </div>
                  <div>
                    <Label className="font-medium">Expected Result</Label>
                    <p className="text-muted-foreground mt-1">{testCase.expectedResult}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Submission Section */}
      {mockActivity.status === "open" && (
        <Card>
          <CardHeader>
            <CardTitle>Submit Your Work</CardTitle>
            <CardDescription>Upload your implementation file or paste your code below</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* File Upload */}
            <div className="space-y-2">
              <Label htmlFor="file-upload">Upload File</Label>
              <div className="flex items-center space-x-4">
                <Input
                  id="file-upload"
                  type="file"
                  accept=".py,.js,.java,.cpp,.c,.cs,.rb,.go,.php"
                  onChange={handleFileChange}
                  className="flex-1"
                />
                {selectedFile && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <FileText className="h-4 w-4 mr-1" />
                    {selectedFile.name}
                  </div>
                )}
              </div>
            </div>

            {/* Text Submission */}
            <div className="space-y-2">
              <Label htmlFor="code-submission">Or paste your code here</Label>
              <Textarea
                id="code-submission"
                placeholder="Paste your implementation here..."
                value={submissionText}
                onChange={(e) => setSubmissionText(e.target.value)}
                className="min-h-[200px] font-mono text-sm"
              />
            </div>

            <Button onClick={handleSubmit} className="w-full" size="lg">
              <Upload className="mr-2 h-4 w-4" />
              Submit Assignment
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Submitted Work (if already submitted) */}
      {mockActivity.submitted && (
        <Card>
          <CardHeader>
            <CardTitle>Your Submission</CardTitle>
            <CardDescription>Submitted on {mockActivity.dueDate}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                <div>
                  <p className="font-medium text-green-800">Assignment Submitted</p>
                  <p className="text-sm text-green-600">Your work has been submitted successfully</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="bg-transparent">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
