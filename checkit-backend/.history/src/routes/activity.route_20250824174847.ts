import * as activityController from "@/controllers/activity.controller";
import { authenticateToken, authorizeRole } from "@/middleware/auth.middleware";
import { Router } from "express";

const router = Router()

router.post('/', authenticateToken, authorizeRole('professor'), activityController.createActivity)

router.put('/:id', authenticateToken, authorizeRole('professor'), activityController.updateActivity)

router.delete('/:id', authenticateToken, authorizeRole('professor'), activityController.deleteActivity)

router.get('/subject/:id', authenticateToken, activityController.getSubjectActivities)

router.get('/professor', authenticateToken, authorizeRole('professor'), activityController.getProfessorAllSubjectActivites)

router.get('/student', authenticateToken, authorizeRole('student'), activityController.getStudentAllSubjectActivities)

router.get('/subject/:subjectId/activity/:activityId', authenticateToken, activityController.getActivityById)


export default router
