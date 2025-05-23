import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
import Job from "../models/Job.js";
import AppliedJob from '../models/AppliedJobs.js';
import User from '../models/user_table.js';





import { Op } from 'sequelize';
import Joi from 'joi';
import Company from '../models/Company.js';
dotenv.config();


const jobValidationSchema = Joi.object({
    job_title: Joi.string().trim().min(2).required().messages({
        "string.empty": "Job Title is required",
        "string.min": "Job Title must be at least 2 characters",
    }),
    company_name: Joi.string().trim().min(2).required().messages({
        "string.empty": "Company Name is required",
        "string.min": "Company Name must be at least 2 characters",
    }),
    salary: Joi.alternatives().try(
        Joi.number().positive().required(),
        Joi.string()
            .trim()
            .regex(/^(\d+(\.\d+)?[kK]?)(\s*-\s*\d+(\.\d+)?[kK]?)?$/)
            .required()
    ).messages({
        "alternatives.match": "Salary must be a positive number or a valid format like '10K' or '10K - 100K'",
        "number.base": "Salary must be a valid number",
        "number.positive": "Salary must be a positive number",
        "string.pattern.base": "Salary must be in a valid format (e.g., '10K' or '10K - 100K')",
        "any.required": "Salary is required",
    }),

}).unknown(true);
export const createJob = async (req, res) => {
    try {
        const { error, value } = jobValidationSchema.validate(req.body, { abortEarly: false });
        if (error) {
            return res.status(400).json({
                error: "Validation Error",
                details: error.details.map((err) => err.message),
            });
        }
        const newJob = await Job.create(req.body); // Storing all fields, including optional ones
        return res.status(201).json({
            status: true,
            message: "Job created successfully",
            job: newJob,
        });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};












export const getJobs = async (req, res) => {
    try {
        const jobs = await Job.findAll();
        res.status(200).json({ stat: true, d: jobs });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};





















export const getJobCounts2 = async (req, res) => {
    try {
       
        const jobTypes = ["Full Time", "Part Time", "Contract", "Internship", "Freelance"];
        const workLocationTypes = ["Work From Home", "Work From Office", "Hybrid"];

        // Fetch job type counts
        const jobTypeCounts = await Job.findAll({
            attributes: [
                "job_type",
                [Job.sequelize.fn("COUNT", Job.sequelize.col("job_id")), "count"]
            ],
            group: ["job_type"]
        });

        // Fetch work location counts
        const workLocationCounts = await Job.findAll({
            attributes: [
                "work_location_type",
                [Job.sequelize.fn("COUNT", Job.sequelize.col("job_id")), "count"]
            ],
            group: ["work_location_type"]
        });

        // Fetch experience-based job counts
        const experienceCounts = await Job.findAll({
            attributes: [
                [
                    Job.sequelize.literal(
                        "CASE WHEN Experience_Years = 0 THEN 'Freshers' ELSE 'Experienced' END"
                    ), "experience_category"
                ],
                [Job.sequelize.fn("COUNT", Job.sequelize.col("job_id")), "count"]
            ],
            group: ["experience_category"]
        });

        // Format job type counts with 0 fallback
        const formattedJobTypeCounts = {};
        jobTypes.forEach(type => {
            formattedJobTypeCounts[type] = 0;
        });
        jobTypeCounts.forEach(job => {
            formattedJobTypeCounts[job.dataValues.job_type] = job.dataValues.count;
        });

        // Format work location counts with 0 fallback
        const formattedWorkLocationCounts = {};
        workLocationTypes.forEach(type => {
            formattedWorkLocationCounts[type] = 0;
        });
        workLocationCounts.forEach(job => {
            formattedWorkLocationCounts[job.dataValues.work_location_type] = job.dataValues.count;
        });

        // Format experience-based job counts with 0 fallback
        const formattedExperienceCounts = { Freshers: 0, Experienced: 0 };
        experienceCounts.forEach(exp => {
            formattedExperienceCounts[exp.dataValues.experience_category] = exp.dataValues.count;
        });

        return res.status(200).json({
            success: true,
            jobTypeCounts: formattedJobTypeCounts,
            workLocationCounts: formattedWorkLocationCounts,
            experienceCounts: formattedExperienceCounts
        });
    } catch (error) {
        console.error("Error fetching job counts:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export const getJobCounts = async (req, res) => {
    try {
        const jobTypeCounts = await Job.findAll({
            attributes: [
                "job_type",
                [Job.sequelize.fn("COUNT", Job.sequelize.col("job_id")), "count"]
            ],
            group: ["job_type"]
        });

        const workLocationCounts = await Job.findAll({
            attributes: [
                "work_location_type",
                [Job.sequelize.fn("COUNT", Job.sequelize.col("job_id")), "count"]
            ],
            group: ["work_location_type"]
        });

        const formattedJobTypeCounts = {};
        jobTypeCounts.forEach((job) => {
            formattedJobTypeCounts[job.dataValues.job_type] = job.dataValues.count;
        });

        const formattedWorkLocationCounts = {};
        workLocationCounts.forEach((job) => {
            formattedWorkLocationCounts[job.dataValues.work_location_type] = job.dataValues.count;
        });

        return res.status(200).json({
            success: true,
            jobTypeCounts: formattedJobTypeCounts,
            workLocationCounts: formattedWorkLocationCounts
        });
    } catch (error) {
        console.error("Error fetching job counts:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error",error:error });
    }
};
export const applyForJob = async (req, res) => {
    try {
        const { job_id, user_id } = req.body;
         
        // If job_id or user_id is missing, return without an error message
        if (!user_id) {
            return res.status(200).json({ stat: false, message: "User ID is missing. " });
        }
        if (!job_id) {
            return res.status(200).json({stat:false, message: "Job ID is missing. May be Job has been deleted by user" });
        }



        const user = await User.findOne({ where: { user_id } });
        if (!user) {
            return res.status(200).json({stat:false, message: "User not found. No action taken." });
        }
        const AppliedBefore = await AppliedJob.findOne({ where: { user_id, job_id } });
        if (AppliedBefore) { 
            return res.status(200).json({ stat:false,  flag: "applied", message: "User has already applied." });
        }
        const job = await Job.findOne({ where: { job_id:job_id } });
       
       
        if (!job) {
            return res.status(200).json({stat:false, message: "Job not found. May be user has deleted this job" });
        }



        try {


            const appliedJob = await AppliedJob.create({
                job_id: job.job_id,
                Company_Id: job.Company_Id,
                job_title: job.job_title,
                company_name: job.company_name,
                user_id: user.user_id, // User applying for the job
            });
            return res.status(201).json({
                stat:true,
                message: "Job application successful",
                d:appliedJob
            });
        } catch (error) {
            return res.status(400).json({ stat: false, message: error.message });
        }


    } catch (error) {
        console.error("Error applying for job:", error);
        return res.status(500).json({stat:false,message: "Internal Server Error" });
    }
};
export const getAppliedJobsByUser = async (req, res) => {
    try {
        const { user_id } = req.body; // Fetching user_id from req.body (POST request)

        if (!user_id) {
            return res.status(400).json({ error: "User ID is required" });
        }

        try {
            const appliedJobs = await AppliedJob.findAll({
                where: { user_id },
                include: [
                    {
                        model: Job,
                        attributes: ["job_id", "job_title", "company_name", "location", "salary"] // Fetch related job details
                    }
                ]
            });
            if (appliedJobs.length === 0) {
                return res.status(404).json({ error: "No jobs found for this user" });
            }

            return res.status(200).json(appliedJobs);

        } catch (error) {
            return res.status(400).json({ status: false, message: error.message });
        }



    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};
export const getJobsByCompanyId = async (req, res) => {
    try {
        const { companyId } = req.body;

        if (!companyId || isNaN(companyId)) {
            return res.status(400).json({ status: false, message: "Invalid Company ID" });
        }

        const companyExists = await Company.findByPk(companyId);
        if (!companyExists) {
            return res.status(404).json({ status: false, message: "Company not found" });
        }

        const jobs = await Job.findAll({
            where: { Company_Id: companyId },
            attributes: ["Job_Id", "Job_Title", "Job_Description", "Job_Type", "Salary", "Location", "created_at", "updated_at"],
            order: [["created_at", "DESC"]],
        });
        const jobsWithAppliedCount = await Promise.all(jobs.map(async (job) => {


            const appliedCount = await AppliedJob.count({

                where: { job_id: job.dataValues.Job_Id }
            });

            return { ...job.toJSON(), appliedCount }; // Merge count into job object
        }));
        return res.status(200).json({ status: true, data: jobsWithAppliedCount });
    } catch (error) {
        console.error("Error fetching job list:", error);
        return res.status(500).json({ status: false, message: "Internal Server Error" });
    }
};





export const AppliedJobsGivenDays = async (req, res) => {
    try {
        const { company_id, days } = req.body;

        // Validate request parameters
        if (!company_id || !days) {
            return res.status(400).json({ stat: false, message: "All Fields are required" });
        }
        if (isNaN(days) || days <= 0) {
            return res.status(400).json({ stat: false, message: "Invalid number of days" });
        }


        // Calculate date range
        const dateLimit = new Date();
        dateLimit.setDate(dateLimit.getDate() - parseInt(days));
        const jobExists = await AppliedJob.findOne({ where: { Company_Id: company_id } });

        if (!jobExists) {
            return res.status(404).json({ stat: false, message: "Company has not posted any job yet." });
        }
        try {


            const appliedJobs = await AppliedJob.findAll({
                where: {
                    Company_Id: company_id,
                    created_at: { [Op.gte]: dateLimit },
                },
                include: [
                    {
                        model: User,
                        as: "User",
                        attributes: ["user_id", "Name", "Email", "Mobile_Number"]
                    }
                ],
                order: [["created_at", "DESC"]]
            });

            if (appliedJobs.length === 0) {
                return res.status(404).json({ stat: false, message: "No applications found for the given criteria." });
            }
            return res.status(200).json({ stat: true, message: "Success", data: appliedJobs });
        } catch (error) {
            return res.status(400).json({ stat: false, message: `Error Occured ${error}` });
        }




    } catch (error) {
        console.error("Error fetching applied jobs:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
export const getJobsByData = async (req, res) => {
    try { 
        const { job_id } = req.body; // Extract filters from request body
       
        // let whereCondition = {}; // Empty object for dynamic conditions

        // // Apply filters based on provided input
        // if (job_id) {
        //     whereCondition.job_id = job_id;
        // } else if (Company_Id) {
        //     whereCondition.Company_Id = Company_Id;
        // }

        // Fetch jobs from database using Sequelize
        // const jobs = await Job.findAll({ where: whereCondition });

        try {
            const jobs = await Job.findOne({ where: 
                { job_id: job_id } });
            
            if (jobs.length === 0) {
                return res.status(404).json({ stat:false, message: "No jobs found" });
            }
            return res.status(200).json({ status: true, message: jobs });
        } catch (error) {
            return res.status(400).json({ status: false, message: `Error Occured ${error}` });
        }


        // If no jobs found, return a 404 response


        // Return the jobs in response

    } catch (error) {
        console.error("Error fetching jobs:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const countJobApplications = async (req, res) => {
    try {
        const { job_id } = req.body; // Assuming job_id comes from request body

        // Validate if job_id is provided
        if (!job_id) {
            return res.status(400).json({
                status: false,
                message: "Job ID is required!",
            });
        }

        // Count the number of times this job_id has been applied for
        const appliedCount = await AppliedJob.count({
            where: { job_id }
        });

        return res.status(200).json({
            status: true,
            message: `Total applications for job ID ${job_id}: ${appliedCount}`,
            total_applications: appliedCount
        });

    } catch (error) {
        console.error("Error fetching job applications count:", error);
        return res.status(500).json({
            status: false,
            message: "Internal Server Error!",
        });
    }
};
export const getLatestJobs = async (req, res) => {
    try {
        // Fetch latest 10 jobs with associated company logo
        const jobs = await Job.findAll({
            order: [["created_at", "DESC"]],
            limit: 10,
            attributes: [
                "job_id",
                "company_name",
                "job_title",
                "job_type",
                // "night_shift",
                "work_location_type",
                "location",
                "pay_type",
                "salary",
                // "perks",
                // "minimum_education",
                // "english_level",
                // "total_experience",
                "job_description",
                // "walk_in_interview",
                // "contact_preference",
                "created_at"
            ],
            include: [
                {
                    model: Company,
                    as: "company",
                    attributes: ["Company_Logo"]
                }
            ]
        });

        if (!jobs.length) {
            return res.status(404).json({ success: false, message: "No jobs found" });
        }

        // Formatting response with a result object
        const result = jobs.map(job => {
            const jobData = job.toJSON();

            return {
                job_id: jobData.job_id,
                company_name: jobData.company_name,
                job_title: jobData.job_title,
                job_type: jobData.job_type,
                // night_shift: jobData.night_shift,
                work_location_type: jobData.work_location_type,
                location: jobData.location,
                pay_type: jobData.pay_type,
                salary: jobData.salary,
                // perks: jobData.perks,
                // minimum_education: jobData.minimum_education,
                // english_level: jobData.english_level,
                // total_experience: jobData.total_experience,
                job_description: jobData.job_description,
                // walk_in_interview: jobData.walk_in_interview,
                // contact_preference: jobData.contact_preference,
                created_at: jobData.created_at,
                company_logo: jobData.company?.Company_Logo || null  // Returning as key-value pair
            };
        });

        return res.status(200).json({
            success: true,
            latest: result,
        });

    } catch (error) {
        console.error("Error fetching latest jobs:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};










export const getUsersAppliedForJob = async (req, res) => {
    try {
        const { job_id } = req.body; // Assuming job_id comes from request body


        if (!job_id) {
            return res.status(400).json({
                status: false,
                message: "Job ID is required!",
            });
        }

        // Fetch users who applied for the given job_id
        const appliedUsers = await AppliedJob.findAll({
            where: { job_id },
            include: [
                {
                    model: User,
                    as: "User",
                    attributes: ["user_id", "Name", "Email", "Mobile_Number", "Education_level", "Experience_Years"], // Fetch only required fields
                }
            ]
        });

        // Check if there are any applicants
        if (appliedUsers.length === 0) {
            return res.status(404).json({
                stat: false,
                message: "No users have applied for this job.",
            });
        }

        return res.status(200).json({
            stat: true,
            message: `Users who applied for job`,
            data: appliedUsers.map(appliedJob => appliedJob.User), // Extract user details
        });

    } catch (error) {
        console.error("Error fetching users who applied for the job:", error);
        return res.status(500).json({
            status: false,
            message: "Internal Server Error!",
        });
    }
};
