import { DataTypes } from "sequelize";
import sequelize from "../connection/db.js";

const UserJobPreferences = sequelize.define(
  "user_job_preferences",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    Preferred_Job_Location: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    Preferred_Job_Type: {
      type: DataTypes.ENUM(
        "Full-Time",
        "Part-Time",
        "Internship",
        "Remote",
        "Contract"
      ),
      allowNull: true,
    },
    Expected_Salary: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    Willing_To_Relocate: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    Notice_Period: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      field: "created_at",
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: "updated_at",
      defaultValue: DataTypes.NOW,
    },
    resume: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
  },
  {
    tableName: "user_job_preferences",
    timestamps: true,
  }
);




export default UserJobPreferences;
