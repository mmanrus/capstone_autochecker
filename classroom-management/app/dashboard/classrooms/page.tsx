import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, BookOpen, Calendar, ChevronRight } from "lucide-react"
import Link from "next/link"
import { MockDataService } from "@/lib/mock-data"

export default function ClassroomsPage() {
  const currentUser = MockDataService.getCurrentUser()
  const classrooms =
    currentUser.role === "student"
      ? MockDataService.getClassroomsForStudent(currentUser.id)
      : MockDataService.getClassroomsForProfessor(currentUser.id)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold">My Classrooms</h1>
        <p className="text-muted-foreground">
          {currentUser.role === "student"
            ? "View all classrooms you're enrolled in"
            : "Manage your assigned classrooms"}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {classrooms.map((classroom) => (
          <Card key={classroom.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-xl">{classroom.name}</CardTitle>
                  <CardDescription>{classroom.description}</CardDescription>
                </div>
                <Badge variant="outline">{classroom.code}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Users className="mr-2 h-4 w-4" />
                  {classroom.instructor}
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="mr-2 h-4 w-4" />
                  {classroom.schedule}
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <BookOpen className="mr-2 h-4 w-4" />
                  {classroom.subjects} subjects • {classroom.students} students
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="text-sm text-muted-foreground">{classroom.room}</div>
                <Button asChild size="sm">
                  <Link href={`/dashboard/subjects`}>
                    View Subjects
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
