import sequelize from "../connection/db.js";
import { DataTypes } from "sequelize";

const JobPostPlan = sequelize.define(
  "job_post_plans",
  {
    plan_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    plan_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    plan_type: {
      type: DataTypes.ENUM("duration_based", "per_post"),
      allowNull: false,
    },
    plan_job_count: {
      type: DataTypes.STRING("unlimited", "limited"),
      allowNull: false,
    },
    duration: {
      type: DataTypes.STRING("1Month", "6Months", "1Year"),
      allowNull: true,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "job_post_plans",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);



export default JobPostPlan;
