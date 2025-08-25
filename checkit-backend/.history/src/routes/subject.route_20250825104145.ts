import * as subjectControllers from "@/controllers/subject.controller";
import { authenticateToken, authorizeRole } from "@/middleware/auth.middleware";
import { Router } from "express";

const router = Router();

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
