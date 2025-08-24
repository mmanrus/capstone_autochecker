import * as activityController from "@/controllers/activity.controller";
import { authenticateToken, authorizeRole } from "@/middleware/auth.middleware";
import { Router } from "express";

const router = Router()

router.post('/', authenticateToken, authorizeRole('professor'), activityController.createActivity)


router.put('/:id', authenticateToken, authorizeRole('professor'), activityController.createActivity)

