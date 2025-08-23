// Centralized mock data for the classroom management system

import { Activity, Classroom, Grade, Subject, Submission, User } from "@/types"



// Mock Users
export const mockUsers: User[] = [
  {
    id: "student-1",
    name: "John Doe",
    email: "john.doe@university.edu",
    role: "student",
    studentId: "STU001",
  },
  {
    id: "student-2",
    name: "Alice Johnson",
    email: "alice.johnson@university.edu",
    role: "student",
    studentId: "STU002",
  },
  {
    id: "student-3",
    name: "Bob Smith",
    email: "bob.smith@university.edu",
    role: "student",
    studentId: "STU003",
  },
  {
    id: "student-4",
    name: "Carol Davis",
    email: "carol.davis@university.edu",
    role: "student",
    studentId: "STU004",
  },
  {
    id: "student-5",
    name: "David Wilson",
    email: "david.wilson@university.edu",
    role: "student",
    studentId: "STU005",
  },
  {
    id: "student-6",
    name: "Emma Brown",
    email: "emma.brown@university.edu",
    role: "student",
    studentId: "STU006",
  },
  {
    id: "professor-1",
    name: "Dr. Sarah Johnson",
    email: "sarah.johnson@university.edu",
    role: "professor",
  },
  {
    id: "professor-2",
    name: "Prof. Michael Chen",
    email: "michael.chen@university.edu",
    role: "professor",
  },
  {
    id: "professor-3",
    name: "Dr. Emily Rodriguez",
    email: "emily.rodriguez@university.edu",
    role: "professor",
  },
]

// Mock Classrooms
export const mockClassrooms: Classroom[] = [
  {
    id: "classroom-1",
    name: "Computer Science - Fall 2025",
    code: "CS-2025-F",
    instructor: "Dr. Sarah Johnson",
    instructorId: "professor-1",
    students: 45,
    subjects: 3,
    description: "Advanced computer science concepts and programming",
    schedule: "MWF 10:00-11:30 AM",
    room: "Tech Building 201",
    semester: "Fall 2025",
  },
  {
    id: "classroom-2",
    name: "Database Systems - Fall 2025",
    code: "DB-2025-F",
    instructor: "Prof. Michael Chen",
    instructorId: "professor-2",
    students: 38,
    subjects: 2,
    description: "Database design, implementation, and optimization",
    schedule: "TTh 2:00-3:30 PM",
    room: "Engineering 105",
    semester: "Fall 2025",
  },
  {
    id: "classroom-3",
    name: "Web Development - Fall 2025",
    code: "WD-2025-F",
    instructor: "Dr. Emily Rodriguez",
    instructorId: "professor-3",
    students: 52,
    subjects: 4,
    description: "Modern web development frameworks and practices",
    schedule: "MWF 1:00-2:30 PM",
    room: "Computer Lab A",
    semester: "Fall 2025",
  },
]

// Mock Subjects
export const mockSubjects: Subject[] = [
  {
    id: "subject-1",
    name: "Data Structures & Algorithms",
    code: "ITCP-101",
    classroomId: "classroom-1",
    classroom: "Computer Science - Fall 2025",
    instructor: "Dr. Sarah Johnson",
    instructorId: "professor-1",
    schedule: "MWF 10:00-11:30 AM",
    credits: 3,
    activities: 8,
    completedActivities: 5,
    nextDeadline: "2025-01-25",
    nextActivity: "Binary Tree Implementation",
    description: "Fundamental data structures and algorithmic problem solving",
  },
  {
    id: "subject-2",
    name: "Database Management Systems",
    code: "DB-201",
    classroomId: "classroom-2",
    classroom: "Database Systems - Fall 2025",
    instructor: "Prof. Michael Chen",
    instructorId: "professor-2",
    schedule: "TTh 2:00-3:30 PM",
    credits: 4,
    activities: 6,
    completedActivities: 4,
    nextDeadline: "2025-01-28",
    nextActivity: "Query Optimization Project",
    description: "Database design, SQL, and database administration",
  },
  {
    id: "subject-3",
    name: "React & Modern JavaScript",
    code: "WD-301",
    classroomId: "classroom-3",
    classroom: "Web Development - Fall 2025",
    instructor: "Dr. Emily Rodriguez",
    instructorId: "professor-3",
    schedule: "MWF 1:00-2:30 PM",
    credits: 3,
    activities: 10,
    completedActivities: 7,
    nextDeadline: "2025-01-30",
    nextActivity: "Component Testing Lab",
    description: "Modern frontend development with React and ES6+",
  },
]

// Mock Activities
export const mockActivities: Activity[] = [
  {
    id: "activity-1",
    title: "Binary Tree Implementation",
    subjectId: "subject-1",
    subject: "Data Structures & Algorithms",
    subjectCode: "ITCP-101",
    instructor: "Dr. Sarah Johnson",
    instructorId: "professor-1",
    description: "Implement a binary search tree with insert, delete, and search operations",
    instructions: `## Binary Search Tree Implementation

### Objective
Create a complete binary search tree implementation in your preferred programming language.

### Requirements
1. **Node Structure**: Create a TreeNode class/structure with value, left, and right properties
2. **Insert Operation**: Implement insertion maintaining BST property
3. **Delete Operation**: Handle all three cases (leaf, one child, two children)
4. **Search Operation**: Implement efficient search functionality
5. **Traversal Methods**: Implement in-order, pre-order, and post-order traversals

### Test Cases
Your implementation will be tested with the following operations:
- Insert: [50, 30, 70, 20, 40, 60, 80]
- Search: 40 (should return true)
- Delete: 30 (should maintain BST property)
- In-order traversal should return sorted order

### Submission Format
- Submit a single file with your implementation
- Include comments explaining your approach
- Ensure your code compiles and runs without errors

### Grading Criteria
- Correctness (40 points)
- Code quality and comments (30 points)
- Efficiency (20 points)
- Test case handling (10 points)`,
    dueDate: "2025-01-25",
    dueTime: "23:59",
    status: "open",
    submitted: false,
    submissionProgress: "0/1",
    maxScore: 100,
    difficulty: "Medium",
    testCases: [
      {
        id: "tc-1",
        input: "[50, 30, 70, 20, 40, 60, 80]",
        operation: "insert_all",
        expectedResult: "BST with proper structure",
      },
      {
        id: "tc-2",
        input: "40",
        operation: "search",
        expectedResult: "true",
      },
      {
        id: "tc-3",
        input: "30",
        operation: "delete",
        expectedResult: "BST maintains property after deletion",
      },
    ],
  },
  {
    id: "activity-2",
    title: "Query Optimization Project",
    subjectId: "subject-2",
    subject: "Database Management Systems",
    subjectCode: "DB-201",
    instructor: "Prof. Michael Chen",
    instructorId: "professor-2",
    description: "Optimize complex SQL queries and analyze performance improvements",
    instructions: `## Query Optimization Project

### Objective
Analyze and optimize complex SQL queries for better performance.

### Requirements
1. **Query Analysis**: Analyze the provided slow queries
2. **Index Strategy**: Design appropriate indexes
3. **Query Rewriting**: Rewrite queries for better performance
4. **Performance Testing**: Measure and document improvements

### Deliverables
- Optimized SQL queries
- Index creation scripts
- Performance analysis report`,
    dueDate: "2025-01-28",
    dueTime: "23:59",
    status: "open",
    submitted: false,
    submissionProgress: "0/1",
    maxScore: 150,
    difficulty: "Hard",
    testCases: [],
  },
  {
    id: "activity-3",
    title: "Fibonacci Sequence Implementation",
    subjectId: "subject-1",
    subject: "Data Structures & Algorithms",
    subjectCode: "ITCP-101",
    instructor: "Dr. Sarah Johnson",
    instructorId: "professor-1",
    description: "Implement fibonacci sequence using both recursive and iterative approaches",
    instructions: "Implement fibonacci sequence with both approaches and compare performance.",
    dueDate: "2025-01-20",
    dueTime: "23:59",
    status: "closed",
    submitted: true,
    submissionProgress: "1/1",
    maxScore: 50,
    difficulty: "Easy",
    grade: 95,
    feedback: "Excellent implementation! Both recursive and iterative solutions are correct and well-commented.",
    testCases: [],
  },
]

// Mock Submissions
export const mockSubmissions: Submission[] = [
  {
    id: "submission-1",
    activityId: "activity-1",
    studentId: "student-2",
    student: mockUsers.find((u) => u.id === "student-2")!,
    submittedAt: "2025-01-22 14:30",
    status: "submitted",
    fileName: "binary_tree.py",
    fileSize: "2.4 KB",
    code: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class BinarySearchTree:
    def __init__(self):
        self.root = None
    
    def insert(self, val):
        if not self.root:
            self.root = TreeNode(val)
        else:
            self._insert_recursive(self.root, val)
    
    def search(self, val):
        return self._search_recursive(self.root, val)
    
    def delete(self, val):
        self.root = self._delete_recursive(self.root, val)`,
  },
  {
    id: "submission-2",
    activityId: "activity-1",
    studentId: "student-3",
    student: mockUsers.find((u) => u.id === "student-3")!,
    submittedAt: "2025-01-21 18:45",
    status: "graded",
    grade: 85,
    feedback: "Good implementation, but could improve error handling.",
    fileName: "bst_implementation.java",
    fileSize: "3.1 KB",
  },
]

// Mock Grades
export const mockGrades: Grade[] = [
  {
    id: "grade-1",
    activityId: "activity-3",
    activity: "Fibonacci Sequence Implementation",
    subjectId: "subject-1",
    subject: "Data Structures & Algorithms",
    subjectCode: "ITCP-101",
    studentId: "student-1",
    score: 95,
    maxScore: 50,
    percentage: 95,
    submittedDate: "2025-01-20",
    gradedDate: "2025-01-22",
    feedback: "Excellent implementation! Both recursive and iterative solutions are correct and well-commented.",
  },
  {
    id: "grade-2",
    activityId: "activity-2",
    activity: "Database Schema Design",
    subjectId: "subject-2",
    subject: "Database Management Systems",
    subjectCode: "DB-201",
    studentId: "student-1",
    score: 106,
    maxScore: 120,
    percentage: 88,
    submittedDate: "2025-01-18",
    gradedDate: "2025-01-21",
    feedback: "Good normalization approach. Consider adding more constraints for data integrity.",
  },
]

// Utility functions for data operations
export class MockDataService {
  private static currentUser: User = mockUsers[0] // Default to first student

  static setCurrentUser(user: User) {
    this.currentUser = user
  }

  static getCurrentUser(): User {
    return this.currentUser
  }

  static getClassroomsForStudent(studentId: string): Classroom[] {
    // In a real app, this would filter based on enrollment
    return mockClassrooms
  }

  static getClassroomsForProfessor(professorId: string): Classroom[] {
    return mockClassrooms.filter((c) => c.instructorId === professorId)
  }

  static getSubjectsForStudent(studentId: string): Subject[] {
    // In a real app, this would filter based on enrollment
    return mockSubjects
  }

  static getSubjectsForProfessor(professorId: string): Subject[] {
    return mockSubjects.filter((s) => s.instructorId === professorId)
  }

  static getActivitiesForStudent(studentId: string): Activity[] {
    // In a real app, this would filter based on enrollment
    return mockActivities
  }

  static getActivitiesForProfessor(professorId: string): Activity[] {
    return mockActivities.filter((a) => a.instructorId === professorId)
  }

  static getActivityById(activityId: string): Activity | undefined {
    return mockActivities.find((a) => a.id === activityId)
  }

  static getSubmissionsForActivity(activityId: string): Submission[] {
    return mockSubmissions.filter((s) => s.activityId === activityId)
  }

  static getSubmissionById(submissionId: string): Submission | undefined {
    return mockSubmissions.find((s) => s.id === submissionId)
  }

  static getGradesForStudent(studentId: string): Grade[] {
    return mockGrades.filter((g) => g.studentId === studentId)
  }

  static getStudentStats(studentId: string) {
    const grades = this.getGradesForStudent(studentId)
    const activities = this.getActivitiesForStudent(studentId)
    const subjects = this.getSubjectsForStudent(studentId)
    const classrooms = this.getClassroomsForStudent(studentId)

    const completedActivities = activities.filter((a) => a.submitted).length
    const pendingActivities = activities.filter((a) => a.status === "open" && !a.submitted).length
    const averageGrade = grades.length > 0 ? grades.reduce((sum, g) => sum + g.percentage, 0) / grades.length : 0

    return {
      enrolledClassrooms: classrooms.length,
      activeSubjects: subjects.length,
      pendingActivities,
      completedActivities,
      averageGrade: Math.round(averageGrade * 10) / 10,
    }
  }

  static getProfessorStats(professorId: string) {
    const classrooms = this.getClassroomsForProfessor(professorId)
    const subjects = this.getSubjectsForProfessor(professorId)
    const activities = this.getActivitiesForProfessor(professorId)

    const totalStudents = classrooms.reduce((sum, c) => sum + c.students, 0)
    const pendingGrading = mockSubmissions.filter(
      (s) => s.status === "submitted" && activities.some((a) => a.id === s.activityId),
    ).length

    return {
      managedClassrooms: classrooms.length,
      totalSubjects: subjects.length,
      totalStudents,
      pendingGrading,
    }
  }

  static getRecentActivitiesForStudent(studentId: string, limit = 5): Activity[] {
    return this.getActivitiesForStudent(studentId)
      .sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime())
      .slice(0, limit)
  }

  static getRecentSubmissionsForProfessor(professorId: string, limit = 5): Submission[] {
    const professorActivities = this.getActivitiesForProfessor(professorId)
    const activityIds = professorActivities.map((a) => a.id)

    return mockSubmissions
      .filter((s) => activityIds.includes(s.activityId) && s.submittedAt)
      .sort((a, b) => new Date(b.submittedAt!).getTime() - new Date(a.submittedAt!).getTime())
      .slice(0, limit)
  }

  static createActivity(activityData: Partial<Activity>): Activity {
    const newActivity: Activity = {
      id: `activity-${Date.now()}`,
      title: activityData.title || "",
      subjectId: activityData.subjectId || "",
      subject: activityData.subject || "",
      subjectCode: activityData.subjectCode || "",
      instructor: activityData.instructor || "",
      instructorId: activityData.instructorId || "",
      description: activityData.description || "",
      instructions: activityData.instructions || "",
      dueDate: activityData.dueDate || "",
      dueTime: activityData.dueTime || "",
      status: "open",
      submitted: false,
      submissionProgress: "0/1",
      maxScore: activityData.maxScore || 100,
      difficulty: activityData.difficulty || "Medium",
      testCases: activityData.testCases || [],
    }

    mockActivities.push(newActivity)
    return newActivity
  }

  static submitActivity(activityId: string, studentId: string, submissionData: any): Submission {
    const newSubmission: Submission = {
      id: `submission-${Date.now()}`,
      activityId,
      studentId,
      student: mockUsers.find((u) => u.id === studentId)!,
      submittedAt: new Date().toISOString(),
      status: "submitted",
      fileName: submissionData.fileName,
      fileSize: submissionData.fileSize,
      code: submissionData.code,
    }

    mockSubmissions.push(newSubmission)

    // Update activity submission status
    const activity = mockActivities.find((a) => a.id === activityId)
    if (activity) {
      activity.submitted = true
      activity.submissionProgress = "1/1"
    }

    return newSubmission
  }

  static gradeSubmission(submissionId: string, grade: number, feedback: string): void {
    const submission = mockSubmissions.find((s) => s.id === submissionId)
    if (submission) {
      submission.status = "graded"
      submission.grade = grade
      submission.feedback = feedback
    }
  }
}
