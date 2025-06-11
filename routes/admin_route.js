import express from "express";
import * as adminControl from "../controllers/admin_controller.js";
import { verifyToken } from "../midlleware/authcontroller.js";
const router = express.Router();

router.get("/count_records", adminControl.getCountRecords);
router.post("/get_admin_details", adminControl.getAdminDetails);
router.post("/login_admin", adminControl.loginAdmin);
router.post("/create_admin", adminControl.createAdmin);
router.post("/update_company_status", adminControl.updateCompanyStatus);
router.post("/logout", adminControl.logoutAdmin);
router.post("/change_pass_admin", adminControl.changeAdminPassword);
router.post("edit_admin", adminControl.EditAdmin);
router.get("/list_companies", adminControl.listCompanies);
router.get("/list_users", adminControl.listUsers);
router.get("/list_companyStatics", adminControl.getCompanyStatistics);
router.get("/list_userStatics", adminControl.getUserStatistics);
router.post("/updateCompanyApprovalStatus", adminControl.updateCompanyApprovalStatus);
router.post("/updateJobApprovalStatus", adminControl.updateJobApprovalStatus);

router.post("/createJobPostPlan", adminControl.createJobPostPlan);
router.get("/getAllJobPostPlans", adminControl.getAllJobPostPlans);
router.get("/getJobPostPlanById", adminControl.getJobPostPlanById);
router.post("/updateJobPostPlan", adminControl.updateJobPostPlan);
router.post("/deleteJobPostPlan", adminControl.deleteJobPostPlan);
export default router;
