import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, BarChart3, Target, Award, Calendar } from "lucide-react"
import { MockDataService } from "@/lib/mock-data"

export default function PerformancePage() {
  const currentUser = MockDataService.getCurrentUser()
  const stats = MockDataService.getStudentStats(currentUser.id)
  const grades = MockDataService.getGradesForStudent(currentUser.id)
  const subjects = MockDataService.getSubjectsForStudent(currentUser.id)

  // Calculate performance metrics
  const monthlyProgress = [
    { month: "Sep", average: 78 },
    { month: "Oct", average: 82 },
    { month: "Nov", average: 85 },
    { month: "Dec", average: 87 },
    { month: "Jan", average: stats.averageGrade },
  ]

  const subjectPerformance = subjects.map((subject) => {
    const subjectGrades = grades.filter((g) => g.subjectId === subject.id)
    const average =
      subjectGrades.length > 0 ? subjectGrades.reduce((sum, g) => sum + g.percentage, 0) / subjectGrades.length : 0

    return {
      name: subject.name,
      code: subject.code,
      average: Math.round(average * 10) / 10,
      completed: subject.completedActivities,
      total: subject.activities,
      progress: (subject.completedActivities / subject.activities) * 100,
    }
  })

  const getPerformanceColor = (average: number) => {
    if (average >= 90) return "text-green-600"
    if (average >= 80) return "text-blue-600"
    if (average >= 70) return "text-orange-600"
    return "text-red-600"
  }

  const getProgressColor = (progress: number) => {
    if (progress >= 90) return "bg-green-500"
    if (progress >= 70) return "bg-blue-500"
    if (progress >= 50) return "bg-orange-500"
    return "bg-red-500"
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold">Performance Analytics</h1>
        <p className="text-muted-foreground">Track your academic progress and identify areas for improvement</p>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current GPA</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{(stats.averageGrade / 25).toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Out of 4.0</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round((stats.completedActivities / (stats.completedActivities + stats.pendingActivities)) * 100)}%
            </div>
            <Progress
              value={(stats.completedActivities / (stats.completedActivities + stats.pendingActivities)) * 100}
              className="mt-2"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Trend</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">+5.2%</div>
            <p className="text-xs text-muted-foreground">vs last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rank</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12th</div>
            <p className="text-xs text-muted-foreground">Out of 45 students</p>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Progress</CardTitle>
          <CardDescription>Your average performance over the past 5 months</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {monthlyProgress.map((month, index) => (
              <div key={month.month} className="flex items-center space-x-4">
                <div className="w-12 text-sm font-medium">{month.month}</div>
                <div className="flex-1">
                  <Progress value={month.average} className="h-3" />
                </div>
                <div className={`w-16 text-sm font-bold text-right ${getPerformanceColor(month.average)}`}>
                  {month.average}%
                </div>
                {index > 0 && (
                  <div className="w-8 flex justify-center">
                    {month.average > monthlyProgress[index - 1].average ? (
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    ) : month.average < monthlyProgress[index - 1].average ? (
                      <TrendingDown className="h-4 w-4 text-red-600" />
                    ) : (
                      <div className="h-4 w-4" />
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Subject Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Subject Performance</CardTitle>
          <CardDescription>Detailed breakdown by subject</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {subjectPerformance.map((subject, index) => (
              <div key={index} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{subject.name}</h3>
                    <p className="text-sm text-muted-foreground">{subject.code}</p>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-bold ${getPerformanceColor(subject.average)}`}>
                      {subject.average}%
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {subject.completed}/{subject.total} completed
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Grade Average</span>
                    <span>{subject.average}%</span>
                  </div>
                  <Progress value={subject.average} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Activity Progress</span>
                    <span>{Math.round(subject.progress)}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${getProgressColor(subject.progress)}`}
                      style={{ width: `${subject.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Recommendations</CardTitle>
          <CardDescription>Personalized suggestions to improve your performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <Target className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-blue-800">Focus on Database Systems</p>
                <p className="text-sm text-blue-600">
                  Your performance in DB-201 is below your average. Consider reviewing query optimization concepts.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
              <TrendingUp className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium text-green-800">Great Progress in Algorithms</p>
                <p className="text-sm text-green-600">
                  You're excelling in ITCP-101. Keep up the excellent work with data structures!
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
              <Calendar className="h-5 w-5 text-orange-600 mt-0.5" />
              <div>
                <p className="font-medium text-orange-800">Upcoming Deadlines</p>
                <p className="text-sm text-orange-600">
                  You have 3 assignments due this week. Plan your time accordingly to maintain your performance.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
