import express from "express";
import {
  registerUser,
  loginUser,
  createAdmin,
} from "./auth.controller.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

// Temporary (development only)
router.post("/create-admin", createAdmin);

export default router;