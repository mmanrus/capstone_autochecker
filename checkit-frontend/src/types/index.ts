export interface User {
     id: string
     name: string
     email: string
     role: "student" | "professor"
     studentId?: string
     avatar?: string
   }
   
   export interface Classroom {
     id: string
     name: string
     code: string
     instructor: string
     instructorId: string
     students: number
     subjects: number
     description: string
     schedule: string
     room: string
     semester: string
   }
   
   export interface Subject {
     id: string
     name: string
     code: string
     classroomId: string
     classroom: string
     instructor: string
     instructorId: string
     schedule: string
     credits: number
     activities: number
     completedActivities: number
     nextDeadline?: string
     nextActivity?: string
     description: string
   }
   
   export interface Activity {
     id: string
     title: string
     subjectId: string
     subject: string
     subjectCode: string
     instructor: string
     instructorId: string
     description: string
     instructions: string
     dueDate: string
     dueTime: string
     status: "open" | "closed"
     submitted: boolean
     submissionProgress: string
     maxScore: number
     difficulty: "Easy" | "Medium" | "Hard"
     grade?: number
     feedback?: string
     testCases: TestCase[]
   }
   
   export interface TestCase {
     id: string
     input: string
     operation: string
     expectedResult: string
   }
   
   export interface Submission {
     id: string
     activityId: string
     studentId: string
     student: User
     submittedAt?: string
     status: "submitted" | "graded" | "not_submitted" | "late_submitted"
     grade?: number
     feedback?: string
     fileName?: string
     fileSize?: string
     code?: string
   }
   
   export interface Grade {
     id: string
     activityId: string
     activity: string
     subjectId: string
     subject: string
     subjectCode: string
     studentId: string
     score: number
     maxScore: number
     percentage: number
     submittedDate: string
     gradedDate: string
     feedback: string
   }