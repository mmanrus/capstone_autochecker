import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { User, Bell, HelpCircle, FileText, SettingsIcon } from "lucide-react"
import { MockDataService } from "@/lib/mock-data"

export default function SettingsPage() {
  const currentUser = MockDataService.getCurrentUser()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account and application preferences</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Account Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="h-5 w-5 mr-2" />
              Account Information
            </CardTitle>
            <CardDescription>Your profile and account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Name</span>
                <span className="text-sm text-muted-foreground">{currentUser.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Email</span>
                <span className="text-sm text-muted-foreground">{currentUser.email}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Role</span>
                <Badge variant="secondary">
                  {currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)}
                </Badge>
              </div>
              {currentUser.studentId && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Student ID</span>
                  <span className="text-sm text-muted-foreground">{currentUser.studentId}</span>
                </div>
              )}
            </div>
            <Button variant="outline" className="w-full bg-transparent">
              Edit Profile
            </Button>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="h-5 w-5 mr-2" />
              Notifications
            </CardTitle>
            <CardDescription>Manage your notification preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Assignment reminders</span>
                <Badge variant="outline" className="text-green-600">
                  Enabled
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Grade notifications</span>
                <Badge variant="outline" className="text-green-600">
                  Enabled
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Email updates</span>
                <Badge variant="outline" className="text-gray-600">
                  Disabled
                </Badge>
              </div>
            </div>
            <Button variant="outline" className="w-full bg-transparent">
              Manage Notifications
            </Button>
          </CardContent>
        </Card>

        {/* Help & Support */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <HelpCircle className="h-5 w-5 mr-2" />
              Help & Support
            </CardTitle>
            <CardDescription>Get help and access documentation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start bg-transparent">
              <FileText className="mr-2 h-4 w-4" />
              User Guide
            </Button>
            <Button variant="outline" className="w-full justify-start bg-transparent">
              <HelpCircle className="mr-2 h-4 w-4" />
              FAQ
            </Button>
            <Button variant="outline" className="w-full justify-start bg-transparent">
              <Bell className="mr-2 h-4 w-4" />
              Contact Support
            </Button>
          </CardContent>
        </Card>

        {/* Application Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <SettingsIcon className="h-5 w-5 mr-2" />
              Application Settings
            </CardTitle>
            <CardDescription>Customize your app experience</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Dark mode</span>
                <Badge variant="outline" className="text-gray-600">
                  System
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Language</span>
                <Badge variant="outline">English</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Time zone</span>
                <Badge variant="outline">UTC-5</Badge>
              </div>
            </div>
            <Button variant="outline" className="w-full bg-transparent">
              Customize Settings
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
