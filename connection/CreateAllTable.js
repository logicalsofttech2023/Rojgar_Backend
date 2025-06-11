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
    await Department.sync();
    await Admin.sync();
    await AppliedJob.sync();
    await Company.sync();
    await Job.sync();
    await JobPostPlan.sync();
    await Report.sync();
    await Suggestion.sync();
    await User.sync();
    await UserJobPreferences.sync();
    console.log("All tables created successfully.");
  } catch (error) {
    console.error("Error creating tables:", error);
  }
};
