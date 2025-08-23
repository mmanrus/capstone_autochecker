"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Users, ClipboardList, Clock, CheckCircle, AlertCircle, TrendingUp, BarChart3 } from "lucide-react"
import Link from "next/link"
import { MockDataService } from "@/lib/mock-data"

function DashboardContent() {
  // For demo purposes, we'll use a mock user. In real app, this would come from auth context
  const mockUser = MockDataService.getCurrentUser()
  const isStudent = mockUser.role === "student"

  // Get stats using the centralized data service
  const stats = isStudent
    ? MockDataService.getStudentStats(mockUser.id)
    : MockDataService.getProfessorStats(mockUser.id)

  // Get recent activities/submissions
  const recentItems = isStudent
    ? MockDataService.getRecentActivitiesForStudent(mockUser.id, 3)
    : MockDataService.getRecentSubmissionsForProfessor(mockUser.id, 3)

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold">Welcome back, {mockUser.name}</h1>
          <p className="text-muted-foreground">
            {isStudent
              ? "Track your academic progress and upcoming activities"
              : "Manage your classes and student progress"}
          </p>
        </div>
        <Badge variant="secondary" className="text-sm">
          {mockUser.role.charAt(0).toUpperCase() + mockUser.role.slice(1)}
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {isStudent ? (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Enrolled Classrooms</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.enrolledClassrooms}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Subjects</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeSubjects}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Activities</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.pendingActivities}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Grade</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.averageGrade}%</div>
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Managed Classrooms</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.managedClassrooms}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Subjects</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalSubjects}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalStudents}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Grading</CardTitle>
                <ClipboardList className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.pendingGrading}</div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{isStudent ? "Recent Activities" : "Recent Submissions"}</CardTitle>
            <CardDescription>
              {isStudent
                ? "Your latest assignments and their status"
                : "Latest student submissions requiring attention"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isStudent
              ? recentItems.map((activity: any) => (
                  <div key={activity.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="space-y-1">
                      <p className="font-medium">{activity.title}</p>
                      <p className="text-sm text-muted-foreground">{activity.subject}</p>
                      <p className="text-xs text-muted-foreground">Due: {activity.dueDate}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {activity.status === "open" && !activity.submitted ? (
                        <Badge variant="outline" className="text-orange-600">
                          <Clock className="w-3 h-3 mr-1" />
                          Pending
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-green-600">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Submitted
                        </Badge>
                      )}
                    </div>
                  </div>
                ))
              : recentItems.map((submission: any) => (
                  <div key={submission.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="space-y-1">
                      <p className="font-medium">{MockDataService.getActivityById(submission.activityId)?.title}</p>
                      <p className="text-sm text-muted-foreground">by {submission.student.name}</p>
                      <p className="text-xs text-muted-foreground">Submitted: {submission.submittedAt}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {submission.status === "submitted" ? (
                        <Badge variant="outline" className="text-orange-600">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          Needs Grading
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-green-600">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Graded
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              {isStudent ? "Common tasks and shortcuts" : "Manage your classes efficiently"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {isStudent ? (
              <>
                <Button asChild className="w-full justify-start">
                  <Link href="/dashboard/activities">
                    <ClipboardList className="mr-2 h-4 w-4" />
                    View All Activities
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start bg-transparent">
                  <Link href="/dashboard/grades">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Check Grades
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start bg-transparent">
                  <Link href="/dashboard/subjects">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Browse Subjects
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <Button asChild className="w-full justify-start">
                  <Link href="/dashboard/activities/create">
                    <ClipboardList className="mr-2 h-4 w-4" />
                    Create New Activity
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start bg-transparent">
                  <Link href="/dashboard/grades">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Grade Submissions
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start bg-transparent">
                  <Link href="/dashboard/classrooms">
                    <Users className="mr-2 h-4 w-4" />
                    Manage Classrooms
                  </Link>
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return <DashboardContent />
}
