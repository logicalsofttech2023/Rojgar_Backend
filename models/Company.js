// Company user name , mobile number email is unique
import sequelize from "../connection/db.js";
import { DataTypes } from "sequelize";
import bcrypt from "bcryptjs";
import JobPostPlan from "./JobPostPlan.js";

const Company = sequelize.define(
  "company_table",
  {
    Company_Id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    Company_User_Name: {
      type: DataTypes.STRING(100),
      allowNull: true,
      unique: true, //
    },
    Company_Name: {
      type: DataTypes.STRING(255),
      allowNull: true, //
    },
    Company_Type: {
      type: DataTypes.STRING(100),
      allowNull: true, //
    },
    Country_Code: {
      type: DataTypes.STRING(20),
      allowNull: true, //
    },
    Mobile_Number: {
      type: DataTypes.STRING(15),
      allowNull: false,
      unique: true,
    },
    Company_Email: {
      type: DataTypes.STRING(255),
      allowNull: true, //
      unique: true,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    Company_Logo: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    Company_Website: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    Company_Description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    Company_Status: {
      type: DataTypes.ENUM("Active", "Inactive", "Pending"),
      allowNull: false,
      defaultValue: "Inactive",
    },
    Company_Start_Date: {
      type: DataTypes.DATE,
      allowNull: true, //
    },
    Company_Address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    Latitude: {
      type: DataTypes.DECIMAL(10, 6),
      allowNull: true,
    },
    Longitude: {
      type: DataTypes.DECIMAL(10, 6),
      allowNull: true,
    },
    Company_Gov_Docs: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      onUpdate: DataTypes.NOW,
    },
    FCM_ID: {
      type: DataTypes.STRING,
      allowNull: true,
      set(value) {
        if (value) {
          const salt = bcrypt.genSaltSync(10);
          this.setDataValue("FCM_ID", bcrypt.hashSync(value, salt));
        }
      },
    },
    
    reset_token: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    reset_token_expires: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    Plan_Id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "job_post_plans",
        key: "plan_id",
      },
    },
    Plan_Start_Date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    Plan_End_Date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    Remaining_Job_Posts: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    Is_Unlimited_Job_Post: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    Approval_Status: {
      type: DataTypes.ENUM("Pending", "Approved", "Rejected"),
      allowNull: false,
      defaultValue: "Pending",
    },
  },
  {
    tableName: "company_table",
    timestamps: true, // Enables createdAt and updatedAt
  }
);
Company.beforeSave(async (company, options) => {
  if (company.changed("password") && company.password) {
    company.password = await bcrypt.hash(company.password, 10);
  }
});

Company.belongsTo(JobPostPlan, {
  foreignKey: "Plan_Id",
  as: "planDetails",
});



export default Company;
