import express from "express";
import * as jobControl from "../controllers/jobsController.js";
const router = express.Router();
import { verifyToken } from "../midlleware/authcontroller.js";

router.post("/save_job", jobControl.createJob);
router.get("/find_all", jobControl.getJobs);

router.post("/save_applied_job", verifyToken, jobControl.applyForJob);

router.post("/find_job_by_data", verifyToken, jobControl.getJobsByData);

router.get("/normal_job_counts", jobControl.getJobCounts2);
router.post("/find_applied_jobs_user", jobControl.getAppliedJobsByUser);
router.post("/find_job_count", jobControl.countJobApplications);
router.post("/user_list_for_job", jobControl.getUsersAppliedForJob);
router.post("/find_job_company", jobControl.getJobsByCompanyId);

router.get("/getLatestJobs", jobControl.getLatestJobs);
export default router;
