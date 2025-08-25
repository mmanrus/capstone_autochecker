import * as submissionController from "@/controllers/submission.controller";
import multer from 'multer';
import path from "path";
import fs from "fs"
import {
  authenticateToken,
  authorizeRole,
  authorizeUser,
} from "@/middleware/auth.middleware";
import { Router } from "express";





// Configure the storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // We assume `req.user` is available from `authenticateToken` middleware
    const userId = req.user?.userId;

    if (!userId) {
      return cb(new Error("User ID not available for upload destination."), "");
    }

    const uploadDirectory = path.join("uploads", userId.toString());

    // Create the directory if it doesn't exist
    fs.mkdir(uploadDirectory, { recursive: true }, (err) => {
      if (err) {
        return cb(err, "");
      }
      cb(null, uploadDirectory);
    });
  },
  filename: (req, file, cb) => {
    const filename = `${file.originalname}`;
    cb(null, filename);
  },
});

const upload = multer({ storage: storage });


const router = Router();

router.post(
  "/subject/:subjectId/activity/:activityId",
  authenticateToken,
  authorizeRole(["student", "professor"]),
  upload.single('submissionFile'),
  submissionController.submit
);

router.put(
  "/subject/:subjectId/activity/:activityId/submission/:submissionId",
  authenticateToken,
  authorizeRole(["student", "professor"]),
  authorizeUser("submission", "submissionId"),
  submissionController.resubmit
);

router.get(
  "/subject/:subjectId/activity/:activityId/submission/:submissionId",
  authenticateToken,
  authorizeRole(["student", "professor"]),
  authorizeUser("submission", "submissionId"),
  submissionController.resubmit
);


export default router