import express from "express";
import { generateQuestions, evaluateAnswer } from "../Controllers/interview.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.route("/generate").post(isAuthenticated, generateQuestions);
router.route("/evaluate").post(isAuthenticated, evaluateAnswer);

export default router;
