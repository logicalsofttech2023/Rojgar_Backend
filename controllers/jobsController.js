import dotenv from "dotenv";
import Job from "../models/Job.js";
import AppliedJob from "../models/AppliedJobs.js";
import User from "../models/user_table.js";
import { Op } from "sequelize";
import Joi from "joi";
import Company from "../models/Company.js";
import dayjs from "dayjs";

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
  salary: Joi.alternatives()
    .try(
      Joi.number().positive().required(),
      Joi.string()
        .trim()
        .regex(/^(\d+(\.\d+)?[kK]?)(\s*-\s*\d+(\.\d+)?[kK]?)?$/)
        .required()
    )
    .messages({
      "alternatives.match":
        "Salary must be a positive number or a valid format like '10K' or '10K - 100K'",
      "number.base": "Salary must be a valid number",
      "number.positive": "Salary must be a positive number",
      "string.pattern.base":
        "Salary must be in a valid format (e.g., '10K' or '10K - 100K')",
      "any.required": "Salary is required",
    }),
}).unknown(true);
export const createJob = async (req, res) => {
  try {
    const { error, value } = jobValidationSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).json({
        error: "Validation Error",
        details: error.details.map((err) => err.message),
      });
    }

    const { Company_Id } = req.body;

    const company = await Company.findByPk(Company_Id);

    if (!company) {
      return res.status(404).json({
        error: "Company not found",
      });
    }

    // If plan is duration_based → check if Plan_End_Date is in future
    if (company.Is_Unlimited_Job_Post) {
      const today = dayjs();
      const endDate = dayjs(company.Plan_End_Date);
      if (!company.Plan_End_Date || today.isAfter(endDate)) {
        return res.status(403).json({
          error: "Plan expired. Please renew to post jobs.",
        });
      }
    }

    // If plan is per_post → check Remaining_Job_Posts > 0
    if (!company.Is_Unlimited_Job_Post) {
      if (!company.Remaining_Job_Posts || company.Remaining_Job_Posts <= 0) {
        return res.status(403).json({
          error: "No job posts remaining. Please purchase a new plan.",
        });
      }

      // Decrement remaining posts
      company.Remaining_Job_Posts -= 1;
      await company.save();
    }

    // Ensure Approval_Status is set to default or from request
    const jobPayload = {
      ...req.body,
      Approval_Status: req.body.Approval_Status || "Pending",
    };

    const newJob = await Job.create(jobPayload);
    return res.status(201).json({
      status: true,
      message: "Job created successfully",
      job: newJob,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
};

export const getJobs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      location,
      jobType,
      workLocationType,
      job_title,
      user_id, // 👈 Accept user_id from query
    } = req.query;

    const offset = (page - 1) * limit;

    // Dynamic where condition
    const whereClause = {
      Approval_Status: "Approved",
    };

    if (search) {
      whereClause.job_title = { [Op.like]: `%${search}%` };
    }

    if (jobType) {
      whereClause.job_type = jobType;
    }

    if (workLocationType) {
      whereClause.work_location_type = workLocationType;
    }

    if (location) {
      whereClause.location = { [Op.like]: `%${location}%` };
    }

    if (job_title) {
      whereClause.job_title = { [Op.like]: `%${job_title}%` };
    }

    const { count, rows } = await Job.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Company,
          as: "company_table",
          attributes: ["Company_Logo", "Company_Name"],
        },
      ],
      offset,
      limit: parseInt(limit),
      order: [["created_at", "DESC"]],
    });

    let jobsWithStatus = rows;

    let appliedJobIds = [];

    // 🔍 Check application status for each job if user_id is provided
    if (user_id) {
      const appliedJobs = await AppliedJob.findAll({
        where: { user_id },
        attributes: ["job_id"],
      });

      appliedJobIds = appliedJobs.map((job) => job.job_id);

      jobsWithStatus = rows.map((job) => ({
        ...job.toJSON(),
        isApplied: user_id ? appliedJobIds.includes(job.job_id) : false,
      }));
    }

    return res.status(200).json({
      stat: true,
      d: jobsWithStatus,
      totalPages: Math.ceil(count / limit),
      totalCount: count,
      currentPage: parseInt(page),
    });
  } catch (error) {
    console.error("Error in getJobs:", error);
    return res.status(500).json({
      error: "Internal Server Error",
      details: error.message,
    });
  }
};

export const getJobCounts2 = async (req, res) => {
  try {
    const jobTypes = [
      "Full Time",
      "Part Time",
      "Contract",
      "Internship",
      "Freelance",
    ];
    const workLocationTypes = ["Work From Home", "Work From Office", "Hybrid"];

    // Fetch job type counts
    const jobTypeCounts = await Job.findAll({
      attributes: [
        "job_type",
        [Job.sequelize.fn("COUNT", Job.sequelize.col("job_id")), "count"],
      ],
      group: ["job_type"],
    });

    // Fetch work location counts
    const workLocationCounts = await Job.findAll({
      attributes: [
        "work_location_type",
        [Job.sequelize.fn("COUNT", Job.sequelize.col("job_id")), "count"],
      ],
      group: ["work_location_type"],
    });

    // Fetch experience-based job counts
    const experienceCounts = await Job.findAll({
      attributes: [
        [
          Job.sequelize.literal(
            "CASE WHEN Experience_Years = 0 THEN 'Freshers' ELSE 'Experienced' END"
          ),
          "experience_category",
        ],
        [Job.sequelize.fn("COUNT", Job.sequelize.col("job_id")), "count"],
      ],
      group: ["experience_category"],
    });

    // Format job type counts with 0 fallback
    const formattedJobTypeCounts = {};
    jobTypes.forEach((type) => {
      formattedJobTypeCounts[type] = 0;
    });
    jobTypeCounts.forEach((job) => {
      formattedJobTypeCounts[job.dataValues.job_type] = job.dataValues.count;
    });

    // Format work location counts with 0 fallback
    const formattedWorkLocationCounts = {};
    workLocationTypes.forEach((type) => {
      formattedWorkLocationCounts[type] = 0;
    });
    workLocationCounts.forEach((job) => {
      formattedWorkLocationCounts[job.dataValues.work_location_type] =
        job.dataValues.count;
    });

    // Format experience-based job counts with 0 fallback
    const formattedExperienceCounts = { Freshers: 0, Experienced: 0 };
    experienceCounts.forEach((exp) => {
      formattedExperienceCounts[exp.dataValues.experience_category] =
        exp.dataValues.count;
    });

    return res.status(200).json({
      success: true,
      jobTypeCounts: formattedJobTypeCounts,
      workLocationCounts: formattedWorkLocationCounts,
      experienceCounts: formattedExperienceCounts,
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
        [Job.sequelize.fn("COUNT", Job.sequelize.col("job_id")), "count"],
      ],
      group: ["job_type"],
    });

    const workLocationCounts = await Job.findAll({
      attributes: [
        "work_location_type",
        [Job.sequelize.fn("COUNT", Job.sequelize.col("job_id")), "count"],
      ],
      group: ["work_location_type"],
    });

    const formattedJobTypeCounts = {};
    jobTypeCounts.forEach((job) => {
      formattedJobTypeCounts[job.dataValues.job_type] = job.dataValues.count;
    });

    const formattedWorkLocationCounts = {};
    workLocationCounts.forEach((job) => {
      formattedWorkLocationCounts[job.dataValues.work_location_type] =
        job.dataValues.count;
    });

    return res.status(200).json({
      success: true,
      jobTypeCounts: formattedJobTypeCounts,
      workLocationCounts: formattedWorkLocationCounts,
    });
  } catch (error) {
    console.error("Error fetching job counts:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error", error: error });
  }
};
export const applyForJob = async (req, res) => {
  try {
    const { job_id, user_id, JobPreferenceById } = req.body;

    // 🔸 Validate input
    if (!user_id) {
      return res.status(400).json({
        stat: false,
        message: "User ID is missing.",
      });
    }

    if (!job_id) {
      return res.status(400).json({
        stat: false,
        message:
          "Job ID is missing. Maybe the job has been deleted by the user.",
      });
    }

    // 🔍 Check if user exists
    const user = await User.findOne({ where: { user_id } });
    if (!user) {
      return res.status(404).json({
        stat: false,
        message: "User not found.",
      });
    }

    // 🔍 Check if user already applied
    const AppliedBefore = await AppliedJob.findOne({
      where: { user_id, job_id },
    });

    if (AppliedBefore) {
      return res.status(409).json({
        stat: false,
        flag: "applied",
        message: "User has already applied for this job.",
      });
    }

    // 🔍 Check if job exists
    const job = await Job.findOne({ where: { job_id } });
    if (!job) {
      return res.status(404).json({
        stat: false,
        message: "Job not found. Maybe it was deleted.",
      });
    }

    // ✅ Create new applied job entry
    const appliedJob = await AppliedJob.create({
      job_id: job.job_id,
      Company_Id: job.Company_Id,
      JobPreferenceById: JobPreferenceById || null,
      job_title: job.job_title,
      company_name: job.company_name,
      user_id: user.user_id,
    });

    return res.status(201).json({
      stat: true,
      message: "Job application successful",
      data: appliedJob,
    });
  } catch (error) {
    console.error("Error applying for job:", error);
    return res.status(500).json({
      stat: false,
      message: "Internal Server Error",
      error: error.message,
    });
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
            attributes: [
              "job_id",
              "job_title",
              "company_name",
              "location",
              "salary",
            ], // Fetch related job details
          },
        ],
      });
      if (appliedJobs.length === 0) {
        return res.status(404).json({ error: "No jobs found for this user" });
      }

      return res.status(200).json(appliedJobs);
    } catch (error) {
      return res.status(400).json({ status: false, message: error.message });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
};

export const getJobsByCompanyId = async (req, res) => {
  try {
    const { companyId } = req.body;

    if (!companyId || isNaN(companyId)) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid Company ID" });
    }

    const companyExists = await Company.findByPk(companyId);
    if (!companyExists) {
      return res
        .status(404)
        .json({ status: false, message: "Company not found" });
    }

    const jobs = await Job.findAll({
      where: { Company_Id: companyId },
      attributes: [
        "Job_Id",
        "Job_Title",
        "Job_Description",
        "Job_Type",
        "Salary",
        "Location",
        "Approval_Status",
        "created_at",
        "updated_at",
      ],
      order: [["created_at", "DESC"]],
    });
    const jobsWithAppliedCount = await Promise.all(
      jobs.map(async (job) => {
        const appliedCount = await AppliedJob.count({
          where: { job_id: job.dataValues.Job_Id },
        });

        return { ...job.toJSON(), appliedCount }; // Merge count into job object
      })
    );
    return res.status(200).json({ status: true, data: jobsWithAppliedCount });
  } catch (error) {
    console.error("Error fetching job list:", error);
    return res
      .status(500)
      .json({ status: false, message: "Internal Server Error" });
  }
};

export const AppliedJobsGivenDays = async (req, res) => {
  try {
    const { company_id, days } = req.body;

    // Validate request parameters
    if (!company_id || !days) {
      return res
        .status(400)
        .json({ stat: false, message: "All Fields are required" });
    }
    if (isNaN(days) || days <= 0) {
      return res
        .status(400)
        .json({ stat: false, message: "Invalid number of days" });
    }

    // Calculate date range
    const dateLimit = new Date();
    dateLimit.setDate(dateLimit.getDate() - parseInt(days));
    const jobExists = await AppliedJob.findOne({
      where: { Company_Id: company_id },
    });

    if (!jobExists) {
      return res
        .status(404)
        .json({ stat: false, message: "Company has not posted any job yet." });
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
            attributes: ["user_id", "Name", "Email", "Mobile_Number"],
          },
        ],
        order: [["created_at", "DESC"]],
      });

      if (appliedJobs.length === 0) {
        return res.status(404).json({
          stat: false,
          message: "No applications found for the given criteria.",
        });
      }
      return res
        .status(200)
        .json({ stat: true, message: "Success", data: appliedJobs });
    } catch (error) {
      return res
        .status(400)
        .json({ stat: false, message: `Error Occured ${error}` });
    }
  } catch (error) {
    console.error("Error fetching applied jobs:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
export const getJobsByData = async (req, res) => {
  try {
    const { job_id, user_id } = req.body;

    // 🔍 Validate job_id
    if (!job_id) {
      return res
        .status(400)
        .json({ status: false, message: "Job ID is required" });
    }

    // 🔍 Find job
    const job = await Job.findOne({ where: { job_id } });

    if (!job) {
      return res.status(404).json({ status: false, message: "Job not found" });
    }

    let isApplied = false;

    // 🔍 If user_id is provided, check if already applied
    if (user_id) {
      const applied = await AppliedJob.findOne({ where: { user_id, job_id } });
      isApplied = !!applied;
    }

    return res.status(200).json({
      status: true,
      message: "Job fetched successfully",
      data: {
        job,
        isApplied,
      },
    });
  } catch (error) {
    console.error("Error fetching job:", error);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
      error: error.message,
    });
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
      where: { job_id },
    });

    return res.status(200).json({
      status: true,
      message: `Total applications for job ID ${job_id}: ${appliedCount}`,
      total_applications: appliedCount,
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
    const { user_id } = req.query;

    const jobs = await Job.findAll({
      where: { Approval_Status: "Approved" },
      order: [["created_at", "DESC"]],
      limit: 10,
      attributes: [
        "job_id",
        "company_name",
        "job_title",
        "job_type",
        "work_location_type",
        "location",
        "pay_type",
        "salary",
        "job_description",
        "created_at",
      ],
    });

    if (!jobs.length) {
      return res.status(404).json({ success: false, message: "No jobs found" });
    }

    let appliedJobIds = [];

    // 🔍 If user_id is provided, get job_ids from AppliedJob
    if (user_id) {
      const appliedJobs = await AppliedJob.findAll({
        where: { user_id },
        attributes: ["job_id"],
      });
      appliedJobIds = appliedJobs.map((item) => item.job_id);
    }

    const result = jobs.map((job) => {
      const jobData = job.toJSON();

      return {
        job_id: jobData.job_id,
        company_name: jobData.company_name,
        job_title: jobData.job_title,
        job_type: jobData.job_type,
        work_location_type: jobData.work_location_type,
        location: jobData.location,
        pay_type: jobData.pay_type,
        salary: jobData.salary,
        job_description: jobData.job_description,
        created_at: jobData.created_at,
        company_logo: jobData.company?.Company_Logo || null,
        isApplied: appliedJobIds.includes(jobData.job_id), // ✅ Include apply status
      };
    });

    return res.status(200).json({
      success: true,
      latest: result,
    });
  } catch (error) {
    console.error("Error fetching latest jobs:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getUsersAppliedForJob = async (req, res) => {
  try {
    const { job_id } = req.body;

    if (!job_id) {
      return res.status(400).json({
        status: false,
        message: "Job ID is required!",
      });
    }

    // Fetch users who applied for the given job_id
    const appliedUsers = await AppliedJob.findAll({
      where: { job_id },
      attributes: [
        "job_applied_id",
        "job_id",
        "Company_Id",
        "work_location_type",
        "job_title",
        "company_name",
        "user_id",
        "JobPreferenceById",
        "application_status",
      ],
      include: [
        {
          model: User,
          as: "User",
          attributes: [
            "user_id",
            "Name",
            "Email",
            "Mobile_Number",
            "Education_level",
            "Experience_Years",
          ],
        },
      ],
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
      data: appliedUsers
    });
  } catch (error) {
    console.error("Error fetching users who applied for the job:", error);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error!",
    });
  }
};

export const getAppliedJobDetailsById = async (req, res) => {
  try {
    const { job_applied_id } = req.query;

    if (!job_applied_id) {
      return res.status(400).json({
        status: false,
        message: "Job Applied ID is required!",
      });
    }

    const application = await AppliedJob.findOne({
      where: { job_applied_id },
      attributes: [
        "job_applied_id",
        "job_id",
        "Company_Id",
        "work_location_type",
        "job_title",
        "company_name",
        "user_id",
        "JobPreferenceById",
        "application_status",
        "created_at",
        "updatedAt"
      ],
      include: [
        {
          model: User,
          as: "User",
          attributes: [
            "user_id",
            "Name",
            "Gender",
            "Education_Details",
            "Education_level",
            "Experience_Years",
            "Experience_Details",
            "City",
            "Job_Role_Want",
            "Email",
            "Country_Code",
            "Mobile_Number",
            "Date_of_Birth",
            "Current_Location",
            "Skills",
            "user_image",
            "Certificates",
            "Education_level",
            "Experience_Years",
          ],
        },
      ],
    });

    if (!application) {
      return res.status(404).json({
        status: false,
        message: "Application not found!",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Applied job details fetched successfully",
      data: application,
    });

  } catch (error) {
    console.error("Error fetching applied job detail:", error);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error!",
    });
  }
};


export const updateJob = async (req, res) => {
  try {
    const { jobId } = req.query;

    const [updatedCount, updatedJobs] = await Job.update(req.body, {
      where: { job_id: jobId },
      returning: true,
    });

    if (updatedCount === 0) {
      return res.status(404).json({
        status: false,
        message: "Job not found or nothing to update",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Job updated successfully",
      job: updatedJobs[0],
    });
  } catch (error) {
    res.status(500).json({
      error: "Internal Server Error",
      details: error.message,
    });
  }
};

export const deleteJob = async (req, res) => {
  try {
    const { jobId } = req.query;

    const deletedCount = await Job.destroy({
      where: { job_id: jobId },
    });

    if (deletedCount === 0) {
      return res.status(404).json({
        status: false,
        message: "Job not found or already deleted",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Job deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      error: "Internal Server Error",
      details: error.message,
    });
  }
};

export const getJobById = async (req, res) => {
  try {
    const { jobId } = req.query;

    if (!jobId) {
      return res.status(400).json({
        status: false,
        message: "Job ID is required",
      });
    }

    const job = await Job.findOne({
      where: { job_id: jobId },
      include: [
        {
          model: Company,
          as: "company_table",
          attributes: ["Company_Logo", "Company_Name"],
        },
      ],
    });

    if (!job) {
      return res.status(404).json({
        status: false,
        message: "Job not found",
      });
    }

    return res.status(200).json({
      status: true,
      job,
    });
  } catch (error) {
    res.status(500).json({
      error: "Internal Server Error",
      details: error.message,
    });
  }
};
