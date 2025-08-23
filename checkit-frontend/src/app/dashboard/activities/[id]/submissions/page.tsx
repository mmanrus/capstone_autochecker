import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { CheckCircle, Clock, AlertCircle, Search, Download, Eye, ArrowLeft, Users } from "lucide-react"
import Link from "next/link"

// Mock submissions data
const mockSubmissions = [
  {
    id: 1,
    student: {
      name: "Alice Johnson",
      email: "alice.johnson@university.edu",
      studentId: "STU001",
    },
    submittedAt: "2025-01-22 14:30",
    status: "submitted",
    grade: null,
    feedback: "",
    fileName: "binary_tree.py",
    fileSize: "2.4 KB",
  },
  {
    id: 2,
    student: {
      name: "Bob Smith",
      email: "bob.smith@university.edu",
      studentId: "STU002",
    },
    submittedAt: "2025-01-21 18:45",
    status: "graded",
    grade: 85,
    feedback: "Good implementation, but could improve error handling.",
    fileName: "bst_implementation.java",
    fileSize: "3.1 KB",
  },
  {
    id: 3,
    student: {
      name: "Carol Davis",
      email: "carol.davis@university.edu",
      studentId: "STU003",
    },
    submittedAt: "2025-01-23 09:15",
    status: "submitted",
    grade: null,
    feedback: "",
    fileName: "tree_operations.cpp",
    fileSize: "2.8 KB",
  },
  {
    id: 4,
    student: {
      name: "David Wilson",
      email: "david.wilson@university.edu",
      studentId: "STU004",
    },
    submittedAt: null,
    status: "not_submitted",
    grade: null,
    feedback: "",
    fileName: null,
    fileSize: null,
  },
  {
    id: 5,
    student: {
      name: "Emma Brown",
      email: "emma.brown@university.edu",
      studentId: "STU005",
    },
    submittedAt: "2025-01-20 16:20",
    status: "graded",
    grade: 92,
    feedback: "Excellent work! Clean code and efficient algorithms.",
    fileName: "binary_search_tree.js",
    fileSize: "2.1 KB",
  },
  {
    id: 6,
    student: {
      name: "Frank Miller",
      email: "frank.miller@university.edu",
      studentId: "STU006",
    },
    submittedAt: "2025-01-24 11:00",
    status: "late_submitted",
    grade: null,
    feedback: "",
    fileName: "bst.py",
    fileSize: "1.9 KB",
  },
]

// Mock activity data
const mockActivity = {
  id: 1,
  title: "Binary Tree Implementation",
  subject: "Data Structures & Algorithms",
  subjectCode: "ITCP-101",
  dueDate: "2025-01-25",
  maxScore: 100,
  totalStudents: 45,
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "graded":
      return <CheckCircle className="h-5 w-5 text-green-600" />
    case "submitted":
    case "late_submitted":
      return <Clock className="h-5 w-5 text-orange-600" />
    case "not_submitted":
      return <AlertCircle className="h-5 w-5 text-red-600" />
    default:
      return <Clock className="h-5 w-5 text-gray-600" />
  }
}

const getStatusText = (status: string) => {
  switch (status) {
    case "graded":
      return "Graded"
    case "submitted":
      return "Needs Grading"
    case "late_submitted":
      return "Late Submission"
    case "not_submitted":
      return "Not Submitted"
    default:
      return "Unknown"
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "graded":
      return "text-green-600 bg-green-50 border-green-200"
    case "submitted":
      return "text-orange-600 bg-orange-50 border-orange-200"
    case "late_submitted":
      return "text-purple-600 bg-purple-50 border-purple-200"
    case "not_submitted":
      return "text-red-600 bg-red-50 border-red-200"
    default:
      return "text-gray-600 bg-gray-50 border-gray-200"
  }
}

export default function SubmissionsPage() {
  const submittedCount = mockSubmissions.filter((s) => s.status !== "not_submitted").length
  const gradedCount = mockSubmissions.filter((s) => s.status === "graded").length
  const needsGradingCount = mockSubmissions.filter(
    (s) => s.status === "submitted" || s.status === "late_submitted",
  ).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="sm" asChild className="bg-transparent">
          <Link href={`/dashboard/activities/${mockActivity.id}`}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Activity
          </Link>
        </Button>
      </div>

      <div>
        <h1 className="text-3xl font-serif font-bold">{mockActivity.title}</h1>
        <p className="text-muted-foreground">
          {mockActivity.subject} ({mockActivity.subjectCode}) • Due: {mockActivity.dueDate}
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockActivity.totalStudents}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Submitted</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{submittedCount}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((submittedCount / mockActivity.totalStudents) * 100)}% completion
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Needs Grading</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{needsGradingCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Graded</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{gradedCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Student Submissions</CardTitle>
          <CardDescription>Review and grade student submissions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search students..." className="pl-10" />
            </div>
            <Button variant="outline" className="bg-transparent">
              Export Grades
            </Button>
          </div>

          <div className="space-y-4">
            {mockSubmissions.map((submission) => (
              <div key={submission.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(submission.status)}
                      <div>
                        <p className="font-medium">{submission.student.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {submission.student.studentId} • {submission.student.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <Badge className={getStatusColor(submission.status)} variant="outline">
                      {getStatusText(submission.status)}
                    </Badge>

                    {submission.grade !== null && (
                      <div className="text-right">
                        <p className="font-bold text-primary">
                          {submission.grade}/{mockActivity.maxScore}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {Math.round((submission.grade / mockActivity.maxScore) * 100)}%
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {submission.submittedAt && (
                  <div className="mt-3 flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      <span>Submitted: {submission.submittedAt}</span>
                      {submission.fileName && (
                        <span className="ml-4">
                          File: {submission.fileName} ({submission.fileSize})
                        </span>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      {submission.fileName && (
                        <Button variant="outline" size="sm" className="bg-transparent">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      )}
                      <Button asChild size="sm">
                        <Link href={`/dashboard/activities/${mockActivity.id}/submissions/${submission.id}/grade`}>
                          <Eye className="h-4 w-4 mr-2" />
                          {submission.status === "graded" ? "View Grade" : "Grade"}
                        </Link>
                      </Button>
                    </div>
                  </div>
                )}

                {submission.feedback && (
                  <div className="mt-3 p-3 bg-muted rounded-lg">
                    <p className="text-sm font-medium mb-1">Feedback:</p>
                    <p className="text-sm text-muted-foreground">{submission.feedback}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
