import express from "express";
import {
  createReport,
  deleteReport,
  updateReportStatus,
  countReportsByCompany,
  countReportsByUser,
  getReports,
  getAllReports,
} from "../controllers/report_controller.js";

const router = express.Router();

router.post("/create_report", createReport);
router.delete("/delete/:id", deleteReport);
router.put("/update-status/:id", updateReportStatus);
router.get("/count/company/:companyId", countReportsByCompany);
router.get("/count/user/:userId", countReportsByUser);




router.post('/report_company',getReports);
router.get('/list_reports',getAllReports);
export default router;


// Here’s a **sample code** to test your APIs using **Axios in Node.js** and **Postman request examples**.  

// ---

// ### **📌 Install Axios**
// If you haven’t installed **Axios**, run:
// ```sh
// npm install axios
// ```

// ---

// ### **1️⃣ Create a Report (POST)**
// ```javascript
// import axios from "axios";

// const createReport = async () => {
//   try {
//     const response = await axios.post("http://localhost:5000/api/reports/create", {
//       Report_Of: "Company",
//       Reported_By: "John Doe",
//       Reported_By_Id: 1,
//       Report_Text: "This company is violating policies.",
//       Report_Of_Id: 101,  // Company ID
//       Report_Sub: "Policy Violation",
//     });

//     console.log("Report Created:", response.data);
//   } catch (error) {
//     console.error("Error creating report:", error.response?.data || error.message);
//   }
// };

// createReport();
// ```
// ---

// ### **2️⃣ Delete a Report by ID (DELETE)**
// ```javascript
// const deleteReport = async (reportId) => {
//   try {
//     const response = await axios.delete(`http://localhost:5000/api/reports/delete/${reportId}`);
//     console.log("Report Deleted:", response.data);
//   } catch (error) {
//     console.error("Error deleting report:", error.response?.data || error.message);
//   }
// };

// // Example: Delete report with ID 5
// deleteReport(5);
// ```
// ---

// ### **3️⃣ Update Report Status (PUT)**
// ```javascript
// const updateReportStatus = async (reportId, status) => {
//   try {
//     const response = await axios.put(`http://localhost:5000/api/reports/update-status/${reportId}`, {
//       Report_Status: status,
//     });

//     console.log("Report Status Updated:", response.data);
//   } catch (error) {
//     console.error("Error updating status:", error.response?.data || error.message);
//   }
// };

// // Example: Update report status of report ID 2 to "Resolved"
// updateReportStatus(2, "Resolved");
// ```
// ---

// ### **4️⃣ Count Reports by Company ID (GET)**
// ```javascript
// const countReportsByCompany = async (companyId) => {
//   try {
//     const response = await axios.get(`http://localhost:5000/api/reports/count/company/${companyId}`);
//     console.log(`Reports for Company ${companyId}:`, response.data);
//   } catch (error) {
//     console.error("Error fetching report count:", error.response?.data || error.message);
//   }
// };

// // Example: Count reports for Company ID 101
// countReportsByCompany(101);
// ```
// ---

// ### **5️⃣ Count Reports by User ID (GET)**
// ```javascript
// const countReportsByUser = async (userId) => {
//   try {
//     const response = await axios.get(`http://localhost:5000/api/reports/count/user/${userId}`);
//     console.log(`Reports by User ${userId}:`, response.data);
//   } catch (error) {
//     console.error("Error fetching report count:", error.response?.data || error.message);
//   }
// };

// // Example: Count reports made by User ID 1
// countReportsByUser(1);
// ```
// ---

// ## **📌 Postman API Requests**
// If you're using **Postman**, use these request settings:

// 1️⃣ **Create Report (POST)**
// - URL: `http://localhost:5000/api/reports/create`
// - Method: `POST`
// - Body (JSON):
//   ```json
//   {
//     "Report_Of": "Company",
//     "Reported_By": "John Doe",
//     "Reported_By_Id": 1,
//     "Report_Text": "This company is violating policies.",
//     "Report_Of_Id": 101,
//     "Report_Sub": "Policy Violation"
//   }
//   ```

// ---

// 2️⃣ **Delete Report (DELETE)**
// - URL: `http://localhost:5000/api/reports/delete/5`
// - Method: `DELETE`

// ---

// 3️⃣ **Update Report Status (PUT)**
// - URL: `http://localhost:5000/api/reports/update-status/2`
// - Method: `PUT`
// - Body (JSON):
//   ```json
//   {
//     "Report_Status": "Resolved"
//   }
//   ```

// ---

// 4️⃣ **Count Reports by Company ID (GET)**
// - URL: `http://localhost:5000/api/reports/count/company/101`
// - Method: `GET`

// ---

// 5️⃣ **Count Reports by User ID (GET)**
// - URL: `http://localhost:5000/api/reports/count/user/1`
// - Method: `GET`

// ---

// ## **✅ Summary**
// - You now have **fully working APIs** for report management.
// - The sample **Axios scripts** let you test APIs directly in **Node.js**.
// - Use **Postman** for manual API testing.

// 🚀 **Try running them and let me know if you need modifications!** 🚀