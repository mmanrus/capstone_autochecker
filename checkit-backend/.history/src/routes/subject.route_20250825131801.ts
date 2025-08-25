import * as subjectControllers from "@/controllers/subject.controller";
import { authenticateToken, authorizeRole } from "@/middleware/auth.middleware";
import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs"
const router = Router();

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
    const filename = `${Date.now()}-${file.originalname}`;
    cb(null, filename);
  },
});
router.post(
  "/",
  authenticateToken,
  authorizeRole("professor"),
  subjectControllers.createSubject
);
router.post(
  "/join",
  authenticateToken,
  authorizeRole("student"),
  subjectControllers.joinSubjectClass
);
router.put(
  "/:id",
  authenticateToken,
  authorizeRole("professor"),
  subjectControllers.updateSubject
);

router.delete(
  "/:id",
  authenticateToken,
  authorizeRole("proffessor"),
  subjectControllers.deleteSubject
);

router.get(
  "/assigned",
  authenticateToken,
  authorizeRole("proffessor"),
  subjectControllers.getAssignedSubjects
);

router.get(
  "/enrolled",
  authenticateToken,
  authorizeRole("student"),
  subjectControllers.getEnrolledSubjects
);

router.get(
  "/:id",
  authenticateToken,
  subjectControllers.getSubjectById
);
export default router;
