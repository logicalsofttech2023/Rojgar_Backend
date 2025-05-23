import { DataTypes } from "sequelize";
import sequelize from "../connection/db.js"; // Import database connection
import User from "./user_table.js";
import Job from "./Job.js";





const AppliedJob = sequelize.define("AppliedJob", {
    job_applied_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    job_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        // references: {
        //     model: Job, // References Job table
        //     key: "job_id"
        // },
        // onDelete: "CASCADE"
    },
    Company_Id:{
        type:DataTypes.INTEGER,
        allowNull:true,
    },
    work_location_type:{
        type :DataTypes.INTEGER,
        allowNull:true,
    },
    job_title: {
        type: DataTypes.STRING,
        allowNull: true
    },
    company_name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        // references: {
        //     model: User, // References User table
        //     key: "user_id"
        // },
        // onDelete: "CASCADE"
    },
  
}, {
    timestamps: true, // Disables Sequelize's default timestamps
    createdAt: "created_at",
    updatedAt: "updatedAt",
    tableName: "applied_jobs"
});
AppliedJob.belongsTo(Job, { foreignKey: "job_id", as: "Job" });
AppliedJob.belongsTo(User, { foreignKey: "user_id", as: "User" });
export default AppliedJob;
