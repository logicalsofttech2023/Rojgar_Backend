import express from "express";
import * as company_control from "../controllers/company_controller.js";

import multer from "multer";

import * as job_controller from "../controllers/jobsController.js";

const Router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// 📌 Multer Middleware (for two fields: profileImage, coverImage)
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max file size
});

Router.post(
  "/save_company",
  upload.fields([
    { name: "Company_Logo", maxCount: 1 },
    { name: "Company_Gov_Docs", maxCount: 1 },
  ]),
  company_control.SaveCompany
);
Router.post("/login_company", company_control.Login_Company);
Router.post("/find_company_by_id", company_control.getCompanyById);
Router.post("/update_company", upload.fields([
    { name: "Company_Logo", maxCount: 1 },
    { name: "Company_Gov_Docs", maxCount: 1 },
  ]), company_control.updateCompany);

Router.post("/applied_user_in_days", job_controller.AppliedJobsGivenDays);

Router.post("/applied_jobs_company", company_control.getAppliedJobbyCompany);
Router.post("/reset_password", company_control.resetPassword);
Router.post("/forgot_password", company_control.forgotPassword);
Router.get("/getAllPlans", company_control.getAllPlans);
Router.post("/purchaseJobPostPlan", company_control.purchaseJobPostPlan);
Router.get("/getPlanById", company_control.getPlanById);



export default Router;
