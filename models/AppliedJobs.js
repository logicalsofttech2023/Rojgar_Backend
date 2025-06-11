import { DataTypes } from "sequelize";
import sequelize from "../connection/db.js"; // Import database connection
import User from "./user_table.js";
import Job from "./Job.js";

const AppliedJob = sequelize.define(
  "AppliedJob",
  {
    job_applied_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    job_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
          model: Job,
          key: "job_id"
      },
      onDelete: "CASCADE"
    },
    Company_Id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    work_location_type: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    job_title: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    company_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
          model: User,
          key: "user_id"
      },
      onDelete: "CASCADE"
    },
    JobPreferenceById: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    application_status: {
      type: DataTypes.ENUM("Pending", "Approved", "Rejected"),
      defaultValue: "Pending",
      allowNull: false,
    },
  },
  {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updatedAt",
    tableName: "applied_jobs",
  }
);
AppliedJob.belongsTo(Job, { foreignKey: "job_id", as: "Job" });
AppliedJob.belongsTo(User, { foreignKey: "user_id", as: "User" });

export default AppliedJob;
