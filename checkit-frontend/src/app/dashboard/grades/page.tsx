import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, Minus, BookOpen, Award, Target } from "lucide-react"
import { MockDataService } from "@/lib/mock-data"

// Mock grades data
// const mockGrades = [
//   {
//     id: 1,
//     activity: "Fibonacci Sequence Implementation",
//     subject: "Data Structures & Algorithms",
//     subjectCode: "ITCP-101",
//     score: 95,
//     maxScore: 50,
//     percentage: 95,
//     submittedDate: "2025-01-20",
//     gradedDate: "2025-01-22",
//     feedback: "Excellent implementation! Both recursive and iterative solutions are correct and well-commented.",
//   },
//   {
//     id: 2,
//     activity: "Database Schema Design",
//     subject: "Database Management Systems",
//     subjectCode: "DB-201",
//     score: 106,
//     maxScore: 120,
//     percentage: 88,
//     submittedDate: "2025-01-18",
//     gradedDate: "2025-01-21",
//     feedback: "Good normalization approach. Consider adding more constraints for data integrity.",
//   },
//   {
//     id: 3,
//     activity: "React Hooks Practice",
//     subject: "React & Modern JavaScript",
//     subjectCode: "WD-301",
//     score: 69,
//     maxScore: 75,
//     percentage: 92,
//     submittedDate: "2025-01-15",
//     gradedDate: "2025-01-17",
//     feedback: "Great use of hooks! The todo app functionality is complete and well-structured.",
//   },
//   {
//     id: 4,
//     activity: "Sorting Algorithms Analysis",
//     subject: "Data Structures & Algorithms",
//     subjectCode: "ITCP-101",
//     score: 42,
//     maxScore: 60,
//     percentage: 70,
//     submittedDate: "2025-01-10",
//     gradedDate: "2025-01-12",
//     feedback: "Implementation is correct but time complexity analysis needs improvement.",
//   },
//   {
//     id: 5,
//     activity: "CSS Grid Layout",
//     subject: "React & Modern JavaScript",
//     subjectCode: "WD-301",
//     score: 58,
//     maxScore: 65,
//     percentage: 89,
//     submittedDate: "2025-01-08",
//     gradedDate: "2025-01-10",
//     feedback: "Responsive design looks great! Minor issues with mobile breakpoints.",
//   },
// ]

// Mock performance summary
// const performanceSummary = {
//   overallAverage: 87.5,
//   totalActivities: 12,
//   completedActivities: 5,
//   subjectAverages: [
//     {
//       subject: "Data Structures & Algorithms",
//       code: "ITCP-101",
//       average: 82.5,
//       activities: 2,
//       trend: "up",
//     },
//     {
//       subject: "Database Management Systems",
//       code: "DB-201",
//       average: 88,
//       activities: 1,
//       trend: "stable",
//     },
//     {
//       subject: "React & Modern JavaScript",
//       code: "WD-301",
//       average: 90.5,
//       activities: 2,
//       trend: "up",
//     },
//   ],
// }

const getGradeColor = (percentage: number) => {
  if (percentage >= 90) return "text-green-600"
  if (percentage >= 80) return "text-blue-600"
  if (percentage >= 70) return "text-orange-600"
  return "text-red-600"
}

const getGradeBadgeColor = (percentage: number) => {
  if (percentage >= 90) return "bg-green-50 text-green-700 border-green-200"
  if (percentage >= 80) return "bg-blue-50 text-blue-700 border-blue-200"
  if (percentage >= 70) return "bg-orange-50 text-orange-700 border-orange-200"
  return "bg-red-50 text-red-700 border-red-200"
}

const getTrendIcon = (trend: string) => {
  switch (trend) {
    case "up":
      return <TrendingUp className="h-4 w-4 text-green-600" />
    case "down":
      return <TrendingDown className="h-4 w-4 text-red-600" />
    default:
      return <Minus className="h-4 w-4 text-gray-600" />
  }
}

export default function GradesPage() {
  const currentUser = MockDataService.getCurrentUser()
  const grades = MockDataService.getGradesForStudent(currentUser.id)
  const stats = MockDataService.getStudentStats(currentUser.id)
  const subjects = MockDataService.getSubjectsForStudent(currentUser.id)

  // Calculate subject averages
  const subjectAverages = subjects.map((subject) => {
    const subjectGrades = grades.filter((g) => g.subjectId === subject.id)
    const average =
      subjectGrades.length > 0 ? subjectGrades.reduce((sum, g) => sum + g.percentage, 0) / subjectGrades.length : 0

    return {
      subject: subject.name,
      code: subject.code,
      average: Math.round(average * 10) / 10,
      activities: subjectGrades.length,
      trend: "stable" as const, // In real app, this would be calculated
    }
  })

  const highestScore = grades.length > 0 ? Math.max(...grades.map((g) => g.percentage)) : 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold">My Grades</h1>
        <p className="text-muted-foreground">Track your academic performance and progress</p>
      </div>

      {/* Performance Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Average</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.averageGrade}%</div>
            <p className="text-xs text-muted-foreground">Across all subjects</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Activities</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.completedActivities}/{stats.completedActivities + stats.pendingActivities}
            </div>
            <Progress
              value={(stats.completedActivities / (stats.completedActivities + stats.pendingActivities)) * 100}
              className="mt-2"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Highest Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{highestScore}%</div>
            <p className="text-xs text-muted-foreground">
              {grades.find((g) => g.percentage === highestScore)?.activity || "No grades yet"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Subject Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Subject Performance</CardTitle>
          <CardDescription>Your average performance by subject</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {subjectAverages.map((subject, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <BookOpen className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{subject.subject}</p>
                    <p className="text-sm text-muted-foreground">
                      {subject.code} • {subject.activities} activities
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className={`text-lg font-bold ${getGradeColor(subject.average)}`}>{subject.average}%</p>
                  </div>
                  {getTrendIcon(subject.trend)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Individual Grades */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Grades</CardTitle>
          <CardDescription>Your latest graded activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {grades.map((grade) => (
              <div key={grade.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className="font-medium">{grade.activity}</h3>
                    <p className="text-sm text-muted-foreground">
                      {grade.subject} ({grade.subjectCode})
                    </p>
                  </div>
                  <Badge className={getGradeBadgeColor(grade.percentage)} variant="outline">
                    {grade.score}/{grade.maxScore} ({grade.percentage}%)
                  </Badge>
                </div>

                <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                  <div>Submitted: {grade.submittedDate}</div>
                  <div>Graded: {grade.gradedDate}</div>
                </div>

                {grade.feedback && (
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm font-medium mb-1">Instructor Feedback:</p>
                    <p className="text-sm text-muted-foreground">{grade.feedback}</p>
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
