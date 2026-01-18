import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js"
import {getAllJobs, postJob,getAdminJobs,getJobById} from "../Controllers/job.controller.js";
const router = express.Router();
router.route("/post").post(isAuthenticated,postJob);
router.route("/get").get(isAuthenticated,getAllJobs);
router.route("/getadminJobs").get(isAuthenticated,getAdminJobs);
router.route("/get/:id").get(isAuthenticated,getJobById);




export default router;