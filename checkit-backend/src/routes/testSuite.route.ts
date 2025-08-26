import { Router } from "express"
import * as testSuiteController from '@/controllers/testSuite.controller'
import {authenticateToken, authorizeRole} from "@/middleware/auth.middleware"
const router = Router()

router.post('/', authenticateToken, authorizeRole('professor'), testSuiteController.createTestSuite)
router.put('/:id', authenticateToken, authorizeRole('professor'), testSuiteController.updateTestSuite)
router.get('/', authenticateToken, authorizeRole('professor'), testSuiteController.getAllTestSuites)
export default router