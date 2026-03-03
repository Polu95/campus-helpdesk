import express from "express";
import { createComplaint, getMyComplaints } from "./complaint.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";
import upload from "../../middlewares/upload.middleware.js";
import { adminOnly } from "../../middlewares/role.middleware.js";
import { getAllComplaints, updateComplaint } from "./complaint.controller.js";



const router = express.Router();

router.post("/", protect, upload.single("image"), createComplaint);
router.get("/my", protect, getMyComplaints);
// Admin routes
router.get("/", protect, adminOnly, getAllComplaints);
router.put("/:id", protect, adminOnly, updateComplaint);


export default router;