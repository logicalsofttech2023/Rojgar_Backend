import Department from "../models/Department.js";
import Admin from "../models/Admin.js";
import AppliedJob from "../models/AppliedJobs.js";
import sequelize from "./db.js";
import Company from "../models/Company.js";
import Job from "../models/Job.js";
import JobPostPlan from "../models/JobPostPlan.js";
import Report from "../models/Report.js";
import Suggestion from "../models/Suggetion.js";
import User from "../models/user_table.js";
import UserJobPreferences from "../models/userJobPreferences.js";

export const createAllTables = async () => {
  try {
    // Parent tables first
    await Department.sync({ alter: true });
    await JobPostPlan.sync({ alter: true });
    await Company.sync({ alter: true }); // Company depends on JobPostPlan

    // Then dependent tables
    await Job.sync({ alter: true }); // Job depends on Company
    await AppliedJob.sync({ alter: true }); // AppliedJob depends on Job/User
    await User.sync({ alter: true });
    await UserJobPreferences.sync({ alter: true }); // Depends on User
    await Admin.sync({ alter: true });
    await Report.sync({ alter: true });
    await Suggestion.sync({ alter: true });

    console.log("✅ All tables created successfully.");
  } catch (error) {
    console.error("❌ Error creating tables:", error);
  }
};

