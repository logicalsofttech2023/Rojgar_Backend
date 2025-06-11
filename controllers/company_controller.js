import bcrypt from "bcryptjs";
import Company from "../models/Company.js";
import { Op } from "sequelize";
import dotenv from "dotenv";
import crypto from "crypto";
import nodeMailer from "nodemailer";
import jwt from "jsonwebtoken";
import AppliedJob from "../models/AppliedJobs.js";
import User from "../models/user_table.js";
import Job from "../models/Job.js";
import JobPostPlan from "../models/JobPostPlan.js";
import dayjs from "dayjs";

dotenv.config();
export const SaveCompany = async (req, res, next) => {
  try {
    const {
      Company_User_Name,
      Company_Name,
      Company_Type,
      Country_Code,
      Mobile_Number,
      Company_Email,
      password,
      Company_Website,
      Company_Description,
      Company_Start_Date,
      Company_Address,
      Latitude,
      Longitude,
      FCM_ID,
      Device_ID,
    } = req.body;

    let Company_Logo = req.files["Company_Logo"]
      ? req.files["Company_Logo"][0].path
      : null;
    let Company_Gov_Docs = req.files["Company_Gov_Docs"]
      ? req.files["Company_Gov_Docs"][0].path
      : null;

    const existingCompany = await Company.findOne({
      where: {
        [Op.or]: [
          { Company_User_Name },
          { Company_Name },
          { Mobile_Number },
          { Company_Email },
        ],
      },
    });

    if (existingCompany) {
      if (existingCompany.Company_User_Name === Company_User_Name) {
        return res
          .status(400)
          .json({ stat: false, message: "Company username already exists!" });
      }
      if (existingCompany.Company_Name === Company_Name) {
        return res
          .status(400)
          .json({ stat: false, message: "Company name already exists!" });
      }
      if (existingCompany.Mobile_Number === Mobile_Number) {
        return res
          .status(400)
          .json({ stat: false, message: "Mobile number already exists!" });
      }
      if (existingCompany.Company_Email === Company_Email) {
        return res
          .status(400)
          .json({ stat: false, message: "Company email already exists!" });
      }
    }

    try {
      await Company.create({
        Company_User_Name,
        Company_Name,
        Company_Type,
        Country_Code,
        Mobile_Number,
        Company_Email,
        password,
        Company_Logo,
        Company_Website,
        Company_Description,
        Company_Status: "Inactive",
        Approval_Status: "Pending",
        Remaining_Job_Posts: 3,
        Company_Start_Date,
        Company_Address,
        Latitude,
        Longitude,
        Company_Gov_Docs,
        FCM_ID,
        Device_ID,
      });
      return res.status(200).json({
        stat: true,
        message: "Company Registered Successfully",
        status: "Pending",
      });
    } catch (err) {
      console.error(" Error saving company in DB:", err);
      return res.status(400).json({ stat: false, message: `Error ${err}` });
    }
  } catch (error) {
    console.error("Error saving company:", error);

    // 🔹 Handle Sequelize Unique Constraint Error
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({
        errorType: "Database Error",
        message:
          "A company with the provided email, mobile number, or username already exists!",
        details: error.errors.map((e) => e.message),
      });
    }

    // 🔹 Handle Validation Errors
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        errorType: "Validation Error",
        message: "Invalid input data",
        details: error.errors.map((e) => e.message),
      });
    }

    // 🔹 Catch Other Errors
    res.status(500).json({
      errorType: "Server Error",
      message: "Internal Server Error! Please try again later.",
      details: error.message,
    });

    next(error);
  }
};

export const Login_Company = async (req, res, next) => {
  try {
    const { Mobile_Number, password } = req.body;

    if (!Mobile_Number || !password) {
      return res
        .status(400)
        .json({ stat: false, message: "Mobile Number and Password Required" });
    }

    const company = await Company.findOne({ where: { Mobile_Number } });

    if (!company) {
      return res
        .status(404)
        .json({ stat: false, message: "Company Not Found" });
    }

    const isMatch = await bcrypt.compare(password, company.password);

    if (!isMatch) {
      return res.status(400).json({ stat: false, message: "Invalid Password" });
    }

    // 🔸 Generate JWT Token
    let token;
    try {
      token = jwt.sign(
        { id: company.Company_Id, Mobile_Number: company.Mobile_Number },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );
    } catch (err) {
      console.error("JWT Error:", err);
      return res
        .status(500)
        .json({ message: "Error generating authentication token." });
    }

    return res.status(200).json({
      stat: true,
      message: "Login successful!",
      token,
      comp: {
        id: company.Company_Id,
        Name: company.Company_Name,
        Email: company.Company_Email,
        Mobile_Number: company.Mobile_Number,
        Logo: company.Company_Logo,
        Website: company.Company_Website,
        Description: company.Company_Description,
        Start_Date: company.Company_Start_Date,
        Address: company.Company_Address,
        User_Name: company.Company_User_Name,
        Gov_Docs: company.Company_Gov_Docs,
        FCM_ID: company.FCM_ID,
        Device_ID: company.Device_ID,
        Stat: company.Company_Status,
        Type: company.Company_Type,
        CreatedAt: company.createdAt,
      },
    });
  } catch (error) {
    if (error.name === "SequelizeDatabaseError") {
      return res.status(500).json({
        errorType: "Database Error",
        message: "A database error occurred.",
        sqlMessage: error.parent?.sqlMessage || "Unknown SQL error.",
      });
    }

    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        errorType: "Validation Error",
        message: error.errors.map((err) => err.message),
      });
    }

    return res.status(500).json({
      errorType: "Server Error",
      message: "Internal Server Error",
      errorDetails: error.message,
    });
  }
};

export const getCompanyById = async (req, res) => {
  try {
    const { companyId } = req.body; // Extract Company_Id from request body

    // Validate input
    if (!companyId || isNaN(companyId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Company ID" });
    }

    // Fetch company details
    const company = await Company.findOne({
      where: { Company_Id: companyId },
      attributes: { exclude: ["password", "FCM_ID", "DEVICE_ID"] },
      include: [
        {
          model: JobPostPlan,
          as: "planDetails",
          attributes: [
            "plan_id",
            "plan_name",
            "plan_type",
            "plan_job_count",
            "duration",
            "price",
          ],
        },
      ],
    });

    // Check if company exists
    if (!company) {
      return res
        .status(404)
        .json({ success: false, message: "Company not found" });
    }

    return res.status(200).json({ success: true, data: company });
  } catch (error) {
    console.error("Error fetching company data:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const updateCompany = async (req, res) => {
  try {
    const { Company_Id, ...updateData } = req.body;

    // Ensure Company_Id is provided
    if (!Company_Id) {
      return res.status(400).json({
        success: false,
        message: "Company_Id is required for update.",
      });
    }

    // Find the company by ID
    const company = await Company.findByPk(Company_Id);
    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found.",
      });
    }

    // Check for duplicate mobile number
    if (updateData.Mobile_Number) {
      const existingMobile = await Company.findOne({
        where: {
          Mobile_Number: updateData.Mobile_Number,
          Company_Id: { [Op.ne]: Company_Id },
        },
      });
      if (existingMobile) {
        return res.status(400).json({
          success: false,
          message: "Mobile number is already in use.",
        });
      }
    }

    // Check for duplicate email
    if (updateData.Company_Email) {
      const existingEmail = await Company.findOne({
        where: {
          Company_Email: updateData.Company_Email,
          Company_Id: { [Op.ne]: Company_Id },
        },
      });
      if (existingEmail) {
        return res.status(400).json({
          success: false,
          message: "Company email is already in use.",
        });
      }
    }

    // Check for duplicate username
    if (updateData.Company_User_Name) {
      const existingUserName = await Company.findOne({
        where: {
          Company_User_Name: updateData.Company_User_Name,
          Company_Id: { [Op.ne]: Company_Id },
        },
      });
      if (existingUserName) {
        return res.status(400).json({
          success: false,
          message: "Company username is already taken.",
        });
      }
    }

    // Handle Company_Logo file update if uploaded
    const Company_Logo = req.files?.Company_Logo
      ? req.files.Company_Logo[0].path
      : null;

    const Company_Gov_Docs = req.files?.Company_Gov_Docs
      ? req.files.Company_Gov_Docs[0].path
      : null;

    if (Company_Logo) {
      updateData.Company_Logo = Company_Logo;
    }

    if (Company_Gov_Docs) {
      updateData.Company_Gov_Docs = Company_Gov_Docs;
    }

    // Perform the update
    await Company.update(updateData, {
      where: { Company_Id },
    });

    // Fetch updated company (excluding sensitive fields)
    const companyUpdated = await Company.findByPk(Company_Id, {
      attributes: {
        exclude: [
          "password",
          "FCM_ID",
          "DEVICE_ID",
          "reset_token",
          "reset_token_expires",
        ],
      },
    });

    return res.status(200).json({
      success: true,
      message: "Company updated successfully.",
      data: companyUpdated,
    });
  } catch (error) {
    console.error("Error updating company:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const RemoveCompany = async (req, res) => {
  try {
    const { Company_Id } = req.body; // Extract Company_Id from request body

    // Validate input
    if (!Company_Id) {
      return res.status(400).json({
        success: false,
        message: "Company_Id is required for removal.",
      });
    }

    // Find the company
    const company = await Company.findByPk(Company_Id);
    if (!company) {
      return res
        .status(404)
        .json({ success: false, message: "Company not found." });
    }

    // Delete the company
    await company.destroy();

    return res.status(200).json({
      success: true,
      message: "Company removed successfully.",
    });
  } catch (error) {
    console.error("Error removing company:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { mobile, otp, newPassword } = req.body;

    if (!mobile || !otp || !newPassword) {
      return res
        .status(400)
        .json({ status: false, message: "All fields are required" });
    }

    const company = await Company.findOne({ where: { Mobile_Number: mobile } });
    if (!company) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    if (new Date() > company.reset_token_expires) {
      return res
        .status(400)
        .json({ status: false, message: "OTP has expired" });
    }

    if (company.reset_token != otp) {
      return res.status(400).json({
        status: false,
        message: "Invalid OTP. Please enter the correct OTP.",
      });
    }

    try {
      await Company.update(
        {
          password: newPassword, // Plain text (Schema will hash it)
          reset_token: null,
          reset_token_expires: null,
        },
        {
          where: { Company_Id: company.Company_Id },
          individualHooks: true, // Ensures `beforeSave` runs for hashing
        }
      );
    } catch (error) {
      return res.status(400).json({ status: false, message: error.message });
    }

    // if (!updated) {
    //     return res.status(404).json({ message: "Company not found or no changes made" });
    // }

    return res
      .status(200)
      .json({ status: true, message: "Password reset successfully" });
  } catch (error) {
    console.error("Error resetting password:", error);
    return res
      .status(500)
      .json({ status: false, message: "Internal Server Error" });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { mobile } = req.body;

    if (!mobile) {
      return res
        .status(400)
        .json({ status: false, message: "Mobile is required" });
    }

    const company = await Company.findOne({
      where: { Mobile_Number: mobile },
      attributes: ["Company_Id", "Company_Email"],
    });

    if (!company) {
      return res
        .status(404)
        .json({ status: false, message: "Company not found" });
    }

    const otp = crypto.randomInt(1000000, 9999999).toString();
    const expiryTime = new Date(Date.now() + 5 * 60 * 1000);

    await Company.update(
      {
        reset_token: otp,
        reset_token_expires: expiryTime,
      },
      {
        where: { Company_Id: company.Company_Id },
      }
    );

    const transporter = nodeMailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.APP_PASSWORD,
      },
    });

    try {
      const info = await transporter.sendMail({
        from: process.env.EMAIL,
        to: company.Company_Email,
        subject: "Rojgar Password Reset OTP",
        text: `Your OTP to reset password is: ${otp}. It is valid for 5 minutes.`,
      });
    } catch (error) {
      console.error("Error sending email:", error);
      return res
        .status(500)
        .json({ status: false, message: `Error sending Email ${error}` });
    }

    return res.status(200).json({ status: true, message: "OTP sent to email" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    return res
      .status(500)
      .json({ status: false, message: `Internal Server Error ${error}` });
  }
};
export const getAppliedJobbyCompany = async (req, res) => {
  try {
    const { Company_Id, days } = req.body;

    if (!Company_Id) {
      return res
        .status(400)
        .json({ success: true, message: "Company_Id is required" });
    }

    let whereClause = { Company_Id };

    if (days) {
      const dateLimit = new Date();
      dateLimit.setDate(dateLimit.getDate() - parseInt(days));

      whereClause.created_at = {
        [Op.gte]: dateLimit, // Fetch applied jobs within the given days
      };
    }

    // Fetch applied jobs with related job and user details
    const appliedJobs = await AppliedJob.findAll({
      where: whereClause,
      include: [
        {
          model: Job,
          as: "Job",
          attributes: ["job_id", "job_title", "created_at", "updated_at"],
        },
        {
          model: User,
          as: "User",
          attributes: ["user_id", "Name"],
        },
      ],
      attributes: ["job_applied_id", "created_at"],
    });

    if (!appliedJobs.length) {
      return res
        .status(404)
        .json({ success: true, message: "No applied jobs found" });
    }

    // Transform response data
    const result = appliedJobs.map((job) => ({
      job_id: job.Job?.job_id,
      job_title: job.Job?.job_title,
      posted_date: job.Job?.created_at,
      last_updated_date: job.Job?.updated_at,
      user_name: job.User?.Name,
      user_id: job.User?.user_id,
      applied_date: job.created_at,
    }));

    return res.status(200).json({ success: true, message: result });
  } catch (error) {
    console.error("Error fetching applied jobs:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const getAllPlans = async (req, res) => {
  try {
    const { Company_Id } = req.query;

    // Fetch all active plans
    const plans = await JobPostPlan.findAll({
      where: { is_active: 1 },
      raw: true,
    });

    // If no Company_Id provided, return all plans as not purchased
    if (!Company_Id) {
      return res.status(200).json({
        success: true,
        data: plans.map((plan) => ({ ...plan, purchased: false })),
      });
    }

    // Check if the company exists with relevant plan attributes
    const company = await Company.findByPk(Company_Id, {
      attributes: ["Plan_Id", "Remaining_Job_Posts", "Is_Unlimited_Job_Post"],
    });

    // If company doesn't exist, return all plans as not purchased
    if (!company) {
      return res.status(200).json({
        success: true,
        data: plans.map((plan) => ({ ...plan, purchased: false })),
      });
    }

    const purchasedPlanId = company.Plan_Id;
    const hasActivePlan = company.Is_Unlimited_Job_Post || 
                         (company.Remaining_Job_Posts !== null && company.Remaining_Job_Posts > 0);

    // Mark which plan is purchased (only if they have an active plan)
    const updatedPlans = plans.map((plan) => ({
      ...plan,
      purchased: hasActivePlan && plan.plan_id === purchasedPlanId,
    }));

    return res.status(200).json({ success: true, data: updatedPlans, Remaining_Job_Posts: company.Remaining_Job_Posts });
  } catch (error) {
    console.error("Fetch Plans Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const purchaseJobPostPlan = async (req, res) => {
  try {
    const { Company_Id, Plan_Id } = req.body;

    if (!Company_Id || !Plan_Id) {
      return res.status(400).json({
        success: false,
        message: "Company_Id and Plan_Id are required.",
      });
    }

    const company = await Company.findByPk(Company_Id);
    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found.",
      });
    }

    const plan = await JobPostPlan.findByPk(Plan_Id);
    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Plan not found.",
      });
    }

    company.Plan_Id = Plan_Id;

    if (plan.plan_type === "duration_based") {
      const startDate = new Date();
      let endDate;

      if (plan.duration === "1Month") {
        endDate = dayjs(startDate).add(1, "month").toDate();
      } else if (plan.duration === "6Months") {
        endDate = dayjs(startDate).add(6, "month").toDate();
      } else if (plan.duration === "1Year") {
        endDate = dayjs(startDate).add(1, "year").toDate();
      }

      company.Plan_Start_Date = startDate;
      company.Plan_End_Date = endDate;
      company.Is_Unlimited_Job_Post = true;
      company.Remaining_Job_Posts = null;

    } else if (plan.plan_type === "per_post") {
      company.Plan_Start_Date = null;
      company.Plan_End_Date = null;
      company.Is_Unlimited_Job_Post = false;
      company.Remaining_Job_Posts = company.Remaining_Job_Posts + 1;
    }

    await company.save();

    return res.status(200).json({
      success: true,
      message: "Plan purchased successfully.",
      data: company,
    });
  } catch (error) {
    console.error("Purchase Plan Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const getPlanById = async (req, res) => {
  try {
    const plan = await JobPostPlan.findByPk(req.query.id);
    if (!plan) {
      return res.status(404).json({ success: false, message: "Plan not found" });
    }

    return res.status(200).json({ success: true, data: plan });
  } catch (error) {
    console.error("Fetch Plan by ID Error:", error);
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};


