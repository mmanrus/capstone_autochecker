"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Save, Download, User, Calendar, FileText } from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"

// Mock submission data
const mockSubmission = {
  id: 1,
  student: {
    name: "Alice Johnson",
    email: "alice.johnson@university.edu",
    studentId: "STU001",
  },
  activity: {
    id: 1,
    title: "Binary Tree Implementation",
    subject: "Data Structures & Algorithms",
    maxScore: 100,
  },
  submittedAt: "2025-01-22 14:30",
  fileName: "binary_tree.py",
  fileSize: "2.4 KB",
  code: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class BinarySearchTree:
    def __init__(self):
        self.root = None
    
    def insert(self, val):
        """Insert a value into the BST"""
        if not self.root:
            self.root = TreeNode(val)
        else:
            self._insert_recursive(self.root, val)
    
    def _insert_recursive(self, node, val):
        if val < node.val:
            if node.left is None:
                node.left = TreeNode(val)
            else:
                self._insert_recursive(node.left, val)
        else:
            if node.right is None:
                node.right = TreeNode(val)
            else:
                self._insert_recursive(node.right, val)
    
    def search(self, val):
        """Search for a value in the BST"""
        return self._search_recursive(self.root, val)
    
    def _search_recursive(self, node, val):
        if not node:
            return False
        if node.val == val:
            return True
        elif val < node.val:
            return self._search_recursive(node.left, val)
        else:
            return self._search_recursive(node.right, val)
    
    def delete(self, val):
        """Delete a value from the BST"""
        self.root = self._delete_recursive(self.root, val)
    
    def _delete_recursive(self, node, val):
        if not node:
            return node
        
        if val < node.val:
            node.left = self._delete_recursive(node.left, val)
        elif val > node.val:
            node.right = self._delete_recursive(node.right, val)
        else:
            # Node to be deleted found
            if not node.left:
                return node.right
            elif not node.right:
                return node.left
            
            # Node with two children
            min_node = self._find_min(node.right)
            node.val = min_node.val
            node.right = self._delete_recursive(node.right, min_node.val)
        
        return node
    
    def _find_min(self, node):
        while node.left:
            node = node.left
        return node
    
    def inorder_traversal(self):
        """Return inorder traversal of the BST"""
        result = []
        self._inorder_recursive(self.root, result)
        return result
    
    def _inorder_recursive(self, node, result):
        if node:
            self._inorder_recursive(node.left, result)
            result.append(node.val)
            self._inorder_recursive(node.right, result)

# Test the implementation
if __name__ == "__main__":
    bst = BinarySearchTree()
    
    # Insert test values
    values = [50, 30, 70, 20, 40, 60, 80]
    for val in values:
        bst.insert(val)
    
    # Test search
    print(f"Search 40: {bst.search(40)}")  # Should return True
    print(f"Search 25: {bst.search(25)}")  # Should return False
    
    # Test traversal
    print(f"Inorder traversal: {bst.inorder_traversal()}")
    
    # Test delete
    bst.delete(30)
    print(f"After deleting 30: {bst.inorder_traversal()}")`,
  currentGrade: 85,
  currentFeedback: "Good implementation, but could improve error handling.",
  isGraded: true,
}

export default function GradeSubmissionPage() {
  const params = useParams()
  const router = useRouter()
  const [grade, setGrade] = useState(mockSubmission.currentGrade?.toString() || "")
  const [feedback, setFeedback] = useState(mockSubmission.currentFeedback || "")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Mock grading - in real app this would save to backend
    alert("Grade saved successfully!")
    router.push(`/dashboard/activities/${mockSubmission.activity.id}/submissions`)
  }

  const percentage = grade ? Math.round((Number.parseInt(grade) / mockSubmission.activity.maxScore) * 100) : 0

  const getGradeColor = (percentage: number) => {
    if (percentage >= 90) return "text-green-600"
    if (percentage >= 80) return "text-blue-600"
    if (percentage >= 70) return "text-orange-600"
    return "text-red-600"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="sm" asChild className="bg-transparent">
          <Link href={`/dashboard/activities/${mockSubmission.activity.id}/submissions`}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Submissions
          </Link>
        </Button>
      </div>

      <div>
        <h1 className="text-3xl font-serif font-bold">Grade Submission</h1>
        <p className="text-muted-foreground">{mockSubmission.activity.title}</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Student Info & Grading */}
        <div className="space-y-6">
          {/* Student Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Student Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label className="text-sm font-medium">Name</Label>
                <p className="text-sm text-muted-foreground">{mockSubmission.student.name}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Student ID</Label>
                <p className="text-sm text-muted-foreground">{mockSubmission.student.studentId}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Email</Label>
                <p className="text-sm text-muted-foreground">{mockSubmission.student.email}</p>
              </div>
            </CardContent>
          </Card>

          {/* Submission Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Submission Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center text-sm">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-muted-foreground">Submitted:</span>
                <span className="ml-2">{mockSubmission.submittedAt}</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{mockSubmission.fileName}</p>
                  <p className="text-xs text-muted-foreground">{mockSubmission.fileSize}</p>
                </div>
                <Button variant="outline" size="sm" className="bg-transparent">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Grading Form */}
          <Card>
            <CardHeader>
              <CardTitle>Grade Assignment</CardTitle>
              <CardDescription>Provide score and feedback for this submission</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="grade">Score</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="grade"
                      type="number"
                      min="0"
                      max={mockSubmission.activity.maxScore}
                      value={grade}
                      onChange={(e) => setGrade(e.target.value)}
                      className="w-20"
                    />
                    <span className="text-sm text-muted-foreground">/ {mockSubmission.activity.maxScore}</span>
                    {grade && (
                      <Badge variant="outline" className={getGradeColor(percentage)}>
                        {percentage}%
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="feedback">Feedback</Label>
                  <Textarea
                    id="feedback"
                    placeholder="Provide constructive feedback for the student..."
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    className="min-h-[120px]"
                  />
                </div>

                <Button type="submit" className="w-full">
                  <Save className="h-4 w-4 mr-2" />
                  {mockSubmission.isGraded ? "Update Grade" : "Save Grade"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Code Submission */}
        <div className="lg:col-span-2">
          <Card className="h-fit">
            <CardHeader>
              <CardTitle>Submitted Code</CardTitle>
              <CardDescription>Review the student's implementation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted rounded-lg p-4 overflow-auto">
                <pre className="text-sm font-mono whitespace-pre-wrap">{mockSubmission.code}</pre>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
