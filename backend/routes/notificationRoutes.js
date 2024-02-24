import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  allNotification,
  deleteNotification,
  sendNotification,
} from "../controllers/notificationControllers.js";

const router = express.Router();

router.route("/").post(protect, sendNotification);
router.route("/").get(protect, allNotification);
router.route("/:id").delete(protect, deleteNotification);

export default router;
