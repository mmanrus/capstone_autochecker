import * as userController from '../controllers/user.controller'
import { Router } from 'express';
//import { authenticateToken, authorizeRole } from '../middleware/auth.middleware.js'

const router = Router();

// Public routes
// Log in a user
router.post('/login', userController.loginUser)
// Create a new user
router.post('/', userController.createUser)

router.post('/refresh', userController.getNewAccessToken)