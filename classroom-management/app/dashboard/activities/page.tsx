import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, CheckCircle, AlertCircle, Calendar, BookOpen, ChevronRight, Plus } from "lucide-react"
import Link from "next/link"
import { MockDataService } from "@/lib/mock-data"

// Mock data for student's activities
// const mockActivities = [
//   {
//     id: 1,
//     title: "Binary Tree Implementation",
//     subject: "Data Structures & Algorithms",
//     subjectCode: "ITCP-101",
//     description: "Implement a binary search tree with insert, delete, and search operations",
//     dueDate: "2025-01-25",
//     dueTime: "11:59 PM",
//     status: "open",
//     submitted: false,
//     submissionProgress: "0/1",
//     maxScore: 100,
//     difficulty: "Medium",
//   },
//   {
//     id: 2,
//     title: "Query Optimization Project",
//     subject: "Database Management Systems",
//     subjectCode: "DB-201",
//     description: "Optimize complex SQL queries and analyze performance improvements",
//     dueDate: "2025-01-28",
//     dueTime: "11:59 PM",
//     status: "open",
//     submitted: false,
//     submissionProgress: "0/1",
//     maxScore: 150,
//     difficulty: "Hard",
//   },
//   {
//     id: 3,
//     title: "Component Testing Lab",
//     subject: "React & Modern JavaScript",
//     subjectCode: "WD-301",
//     description: "Write comprehensive unit tests for React components using Jest and Testing Library",
//     dueDate: "2025-01-30",
//     dueTime: "11:59 PM",
//     status: "open",
//     submitted: false,
//     submissionProgress: "0/1",
//     maxScore: 80,
//     difficulty: "Medium",
//   },
//   {
//     id: 4,
//     title: "Fibonacci Sequence Implementation",
//     subject: "Data Structures & Algorithms",
//     subjectCode: "ITCP-101",
//     description: "Implement fibonacci sequence using both recursive and iterative approaches",
//     dueDate: "2025-01-20",
//     dueTime: "11:59 PM",
//     status: "closed",
//     submitted: true,
//     submissionProgress: "1/1",
//     maxScore: 50,
//     difficulty: "Easy",
//     grade: 95,
//   },
//   {
//     id: 5,
//     title: "Database Schema Design",
//     subject: "Database Management Systems",
//     subjectCode: "DB-201",
//     description: "Design a normalized database schema for an e-commerce application",
//     dueDate: "2025-01-18",
//     dueTime: "11:59 PM",
//     status: "closed",
//     submitted: true,
//     submissionProgress: "1/1",
//     maxScore: 120,
//     difficulty: "Medium",
//     grade: 88,
//   },
//   {
//     id: 6,
//     title: "React Hooks Practice",
//     subject: "React & Modern JavaScript",
//     subjectCode: "WD-301",
//     description: "Build a todo app using various React hooks (useState, useEffect, useContext)",
//     dueDate: "2025-01-15",
//     dueTime: "11:59 PM",
//     status: "closed",
//     submitted: true,
//     submissionProgress: "1/1",
//     maxScore: 75,
//     difficulty: "Easy",
//     grade: 92,
//   },
// ]

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

const getStatusIcon = (activity: any) => {
  if (activity.status === "closed") {
    return activity.submitted ? (
      <CheckCircle className="h-5 w-5 text-green-600" />
    ) : (
      <AlertCircle className="h-5 w-5 text-red-600" />
    )
  }
  return <Clock className="h-5 w-5 text-orange-600" />
}

const getStatusText = (activity: any) => {
  if (activity.status === "closed") {
    return activity.submitted ? "Submitted" : "Missed"
  }
  return "Open"
}

const getStatusColor = (activity: any) => {
  if (activity.status === "closed") {
    return activity.submitted ? "text-green-600" : "text-red-600"
  }
  return "text-orange-600"
}

export default function ActivitiesPage() {
  const currentUser = MockDataService.getCurrentUser()
  const activities =
    currentUser.role === "student"
      ? MockDataService.getActivitiesForStudent(currentUser.id)
      : MockDataService.getActivitiesForProfessor(currentUser.id)

  const openActivities = activities.filter((activity) => activity.status === "open")
  const closedActivities = activities.filter((activity) => activity.status === "closed")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold">
            {currentUser.role === "student" ? "My Activities" : "Manage Activities"}
          </h1>
          <p className="text-muted-foreground">
            {currentUser.role === "student"
              ? "Track your assignments and submissions across all subjects"
              : "Create and manage assignments for your subjects"}
          </p>
        </div>
        {currentUser.role === "professor" && (
          <Button asChild>
            <Link href="/dashboard/activities/create">
              <Plus className="h-4 w-4 mr-2" />
              Create Activity
            </Link>
          </Button>
        )}
      </div>

      {/* Open Activities */}
      <div className="space-y-4">
        <h2 className="text-xl font-serif font-semibold">
          {currentUser.role === "student" ? "Open Activities" : "Active Activities"}
        </h2>
        {openActivities.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {openActivities.map((activity) => (
              <Card key={activity.id} className="hover:shadow-lg transition-shadow border-l-4 border-l-orange-500">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{activity.title}</CardTitle>
                      <CardDescription>{activity.description}</CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">{getStatusIcon(activity)}</div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <BookOpen className="mr-2 h-4 w-4" />
                      {activity.subject}
                    </div>
                    <Badge variant="outline">{activity.subjectCode}</Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="mr-2 h-4 w-4" />
                      Due: {activity.dueDate} at {activity.dueTime}
                    </div>
                    <Badge className={getDifficultyColor(activity.difficulty)} variant="outline">
                      {activity.difficulty}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      <span className="text-muted-foreground">
                        {currentUser.role === "student" ? "Progress: " : "Max Score: "}
                      </span>
                      <span className="font-medium">
                        {currentUser.role === "student" ? activity.submissionProgress : activity.maxScore}
                      </span>
                    </div>
                  </div>

                  <Button asChild size="sm" className="w-full">
                    <Link href={`/dashboard/activities/${activity.id}`}>
                      {currentUser.role === "student" ? "View Activity" : "Manage Activity"}
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <p className="text-lg font-medium">
                {currentUser.role === "student" ? "All caught up!" : "No active activities"}
              </p>
              <p className="text-muted-foreground">
                {currentUser.role === "student"
                  ? "You have no open activities at the moment."
                  : "Create your first activity to get started."}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Closed Activities */}
      {closedActivities.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-serif font-semibold">Recent Activities</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {closedActivities.map((activity) => (
              <Card key={activity.id} className="hover:shadow-lg transition-shadow opacity-75">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{activity.title}</CardTitle>
                      <CardDescription>{activity.description}</CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(activity)}
                      <span className={`text-sm font-medium ${getStatusColor(activity)}`}>
                        {getStatusText(activity)}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <BookOpen className="mr-2 h-4 w-4" />
                      {activity.subject}
                    </div>
                    <Badge variant="outline">{activity.subjectCode}</Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">Due: {activity.dueDate}</div>
                    {activity.grade && (
                      <div className="text-sm">
                        <span className="text-muted-foreground">Grade: </span>
                        <span className="font-bold text-primary">
                          {activity.grade}/{activity.maxScore}
                        </span>
                      </div>
                    )}
                  </div>

                  <Button asChild variant="outline" size="sm" className="w-full bg-transparent">
                    <Link href={`/dashboard/activities/${activity.id}`}>
                      View Details
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
