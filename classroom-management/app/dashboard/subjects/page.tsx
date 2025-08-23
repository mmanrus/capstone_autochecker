import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Clock, Users, ChevronRight, Calendar } from "lucide-react"
import Link from "next/link"
import { MockDataService } from "@/lib/mock-data"

export default function SubjectsPage() {
  const currentUser = MockDataService.getCurrentUser()
  const subjects =
    currentUser.role === "student"
      ? MockDataService.getSubjectsForStudent(currentUser.id)
      : MockDataService.getSubjectsForProfessor(currentUser.id)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold">My Subjects</h1>
        <p className="text-muted-foreground">
          {currentUser.role === "student"
            ? "All subjects across your enrolled classrooms"
            : "Subjects you're teaching this semester"}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {subjects.map((subject) => (
          <Card key={subject.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{subject.name}</CardTitle>
                  <CardDescription className="text-sm">{subject.description}</CardDescription>
                </div>
                <Badge variant="outline">{subject.code}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Users className="mr-2 h-4 w-4" />
                  {subject.instructor}
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="mr-2 h-4 w-4" />
                  {subject.schedule}
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <BookOpen className="mr-2 h-4 w-4" />
                  {subject.credits} credits
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">
                    {subject.completedActivities}/{subject.activities} activities
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{
                      width: `${(subject.completedActivities / subject.activities) * 100}%`,
                    }}
                  />
                </div>
              </div>

              {subject.nextActivity && (
                <div className="p-3 bg-muted rounded-lg">
                  <div className="flex items-center text-sm text-muted-foreground mb-1">
                    <Calendar className="mr-2 h-4 w-4" />
                    Next: {subject.nextDeadline}
                  </div>
                  <p className="text-sm font-medium">{subject.nextActivity}</p>
                </div>
              )}

              <Button asChild size="sm" className="w-full">
                <Link href={`/dashboard/activities`}>
                  View Activities
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
