import AppliedJob from "./AppliedJobs.js";
import Job from "./Job.js";
import User from "./user_table.js";





Job.hasMany(AppliedJob, { foreignKey: "job_id", onDelete: "CASCADE" });
User.hasMany(AppliedJob, { foreignKey: "user_id", onDelete: "CASCADE" });

export default {AppliedJob,Job,User};