import sequelize from "../connection/db.js";
import { DataTypes } from "sequelize";
import AppliedJob from "./AppliedJobs.js";





import Company from "./Company.js";
const Job = sequelize.define(

    "jobs",
    {
        job_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        Company_Id:{
           type:DataTypes.INTEGER,
           allowNull:true
        },
        company_name: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        job_title: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        job_type: {
            type: DataTypes.ENUM("Full Time", "Part Time", "Contract", "Internship", "Freelance"),
            allowNull: true,
        },
        night_shift: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
        },
        work_location_type: {
            type: DataTypes.ENUM("Work From Office", "Work From Home", "Hybrid"),
            allowNull: true,
        },
        location: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        City:{
            type:DataTypes.STRING(255),
            allowNull:true
        },
        State:{
            type:DataTypes.STRING(255),
            allowNull:true
        },
        Country:{
            type:DataTypes.STRING(255),
            allowNull:true
        },
        pay_type: {
            type: DataTypes.ENUM("Fixed Only", "Fixed + Incentive", "Incentive Only"),
            allowNull: true,
        },
        salary: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
        Experience_Years:{
          type:DataTypes.INTEGER,
          allowNull:true,      

       },
        perks: {
            type: DataTypes.JSON,
            allowNull: true,
        },
        joining_fee: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
        },
        joinFee:{
            type:DataTypes.STRING(255),
            allowNull:true,
        },
        minimum_education: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        english_level: {
            type: DataTypes.ENUM("Beginner", "Intermediate", "Advanced", "Fluent"),
            allowNull: true,
        },
        total_experience: {
            type: DataTypes.STRING(201),
            allowNull: true,
        },
        additional_requirements: {
            type: DataTypes.JSON,
            allowNull: true,
        },
        job_description: {
            type: DataTypes.STRING(2000),
            allowNull: true,
        },
        walk_in_interview: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        contact_preference: {
            type: DataTypes.ENUM("Yes, to myself", "Yes, to other recruiter", "recruiter will call"),
            allowNull: true,
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
        timestamps: true,
        tableName:"jobs",
        createdAt: "created_at",
        updatedAt: "updated_at",
    }
);
Job.belongsTo(Company, { foreignKey: "Company_Id", as: "company" });

export default Job;
