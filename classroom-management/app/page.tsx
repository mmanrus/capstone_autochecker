import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { BookOpen, Users, GraduationCap } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <GraduationCap className="h-12 w-12 text-primary mr-3" />
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-foreground">EduManage</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            A comprehensive classroom management platform designed for modern education. Streamline your academic
            workflow with powerful tools for students and professors.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <BookOpen className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle className="text-xl">Activity Management</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base leading-relaxed">
                Create, submit, and track assignments with automated testing and grading capabilities.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Users className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle className="text-xl">Classroom Collaboration</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base leading-relaxed">
                Connect students and professors in organized classrooms with subject-based workflows.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <GraduationCap className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle className="text-xl">Performance Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base leading-relaxed">
                Track progress with detailed analytics and insights for both students and educators.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="bg-card rounded-lg p-8 max-w-md mx-auto shadow-lg">
            <h2 className="text-2xl font-serif font-bold mb-4">Ready to get started?</h2>
            <p className="text-muted-foreground mb-6">
              Join thousands of educators and students already using EduManage.
            </p>
            <div className="space-y-3">
              <Button asChild size="lg" className="w-full">
                <Link href="/login">Login to Your Account</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full bg-transparent">
                <Link href="/register">Create New Account</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
