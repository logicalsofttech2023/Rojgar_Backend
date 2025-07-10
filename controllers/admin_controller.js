import User from "../models/user_table.js";
import Company from "../models/Company.js";
import { Op } from "sequelize";

import dotenv from "dotenv";
import Admin from "../models/Admin.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import JobPostPlan from "../models/JobPostPlan.js";

import AppliedJob from "../models/AppliedJobs.js";
dotenv.config();

import Job from "../models/Job.js";
import { sendMail } from "../utils/sendMail.js";
const JWT_SECRET = process.env.JWT_SECRET;

const validateJobPostPlan = (body) => {
  const { plan_name, plan_type, plan_job_count, duration, price } = body;

  const validTypes = ["duration_based", "per_post"];
  const validJobCounts = ["unlimited", "limited"];
  const validDurations = ["1Month", "6Months", "1Year"];

  if (!plan_name || !plan_type || !plan_job_count || price == null) {
    return "Required fields: plan_name, plan_type, plan_job_count, price.";
  }

  if (!validTypes.includes(plan_type)) {
    return `Invalid plan_type. Allowed: ${validTypes.join(", ")}`;
  }

  if (!validJobCounts.includes(plan_job_count)) {
    return `Invalid plan_job_count. Allowed: ${validJobCounts.join(", ")}`;
  }

  if (plan_type === "duration_based") {
    if (!duration || !validDurations.includes(duration)) {
      return `Duration is required and must be one of: ${validDurations.join(
        ", "
      )}`;
    }
  }

  return null; // No error
};

export const createAdmin = async (req, res) => {
  try {
    const { Admin_Name, Admin_Password } = req.body;

    // Check if Admin_Name already exists
    const existingAdmin = await Admin.findOne({ where: { Admin_Name } });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin name already exists" });
    }

    // Create new admin (bcrypt hashing will happen automatically due to hooks)
    const admin = await Admin.create({ Admin_Name, Admin_Password });

    res.status(201).json({ message: "Admin created successfully", admin });
  } catch (error) {
    console.error("Error creating admin:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const loginAdmin = async (req, res) => {
  try {
    const { Admin_Name, Admin_Password } = req.body;

    // Validate admin existence
    const admin = await Admin.findOne({ where: { Admin_Name: Admin_Name } });

    // if (!admin) {
    //   return res.status(401).json({ message: "Invalid credentials" });
    // }

    // Compare password
    const isMatch = await bcrypt.compare(Admin_Password, admin.Admin_Password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ Admin_Id: admin.Admin_Id }, JWT_SECRET, {
      expiresIn: "1d",
    });

    // Store token in cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      maxAge: 86400000,
    });

    res.json({ message: "Login successful", data: admin });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const logoutAdmin = (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logout successful" });
};

export const EditAdmin = async (req, res) => {
  try {
    const { Admin_Id } = req.body;

    // Check if admin exists
    const admin = await Admin.findByPk(Admin_Id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Delete admin
    await admin.destroy();
    res.json({ message: "Admin Edited successfully" });
  } catch (error) {
    console.error("Error Editing admin:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const getAdminDetails = async (req, res) => {
  try {
    const { Admin_Id } = req.body;

    // Find admin by primary key
    const admin = await Admin.findByPk(Admin_Id, {
      attributes: ["Admin_Id", "Admin_Name", "created_at"], // Exclude password
    });

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    return res.status(200).json({ success: true, d: admin });
  } catch (error) {
    console.error("Error fetching admin details:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
export const changeAdminPassword = async (req, res) => {
  try {
    const { Admin_Id, oldPassword, newPassword } = req.body;

    // Find admin
    const admin = await Admin.findByPk(Admin_Id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Validate old password
    const isMatch = await bcrypt.compare(oldPassword, admin.Admin_Password);
    if (!isMatch) {
      return res.status(401).json({ message: "Old password is incorrect" });
    }

    // Update password (bcrypt hashing will happen automatically due to hooks)
    admin.Admin_Password = newPassword;
    await admin.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const getUserStatistics = async (req, res) => {
  try {
    const today = new Date();

    // Generate past dates
    const generateDate = (days) => {
      const date = new Date();
      date.setDate(today.getDate() - days);
      return date;
    };

    const sevenDays = [];
    for (let i = 6; i >= 0; i--) {
      const start = generateDate(i);
      const end = generateDate(i - 1);
      const count = await User.count({
        where: { created_at: { [Op.between]: [start, end] } },
      });
      sevenDays.push({ name: `Day ${7 - i}`, value: count });
    }

    const oneMonth = [];
    for (let i = 4; i >= 1; i--) {
      const start = generateDate(i * 7);
      const end = generateDate((i - 1) * 7);
      const count = await User.count({
        where: { created_at: { [Op.between]: [start, end] } },
      });
      oneMonth.push({ name: `Week ${5 - i}`, value: count });
    }

    const threeMonths = [];
    for (let i = 3; i >= 1; i--) {
      const start = new Date();
      start.setMonth(today.getMonth() - i);
      const end = new Date();
      end.setMonth(today.getMonth() - (i - 1));
      const count = await User.count({
        where: { created_at: { [Op.between]: [start, end] } },
      });
      threeMonths.push({ name: `Month ${4 - i}`, value: count });
    }

    const sixMonths = [];
    for (let i = 6; i >= 1; i--) {
      const start = new Date();
      start.setMonth(today.getMonth() - i);
      const end = new Date();
      end.setMonth(today.getMonth() - (i - 1));
      const count = await User.count({
        where: { created_at: { [Op.between]: [start, end] } },
      });
      sixMonths.push({ name: `Month ${7 - i}`, value: count });
    }

    const twelveMonths = [];
    for (let i = 12; i >= 1; i--) {
      const start = new Date();
      start.setMonth(today.getMonth() - i);
      const end = new Date();
      end.setMonth(today.getMonth() - (i - 1));
      const count = await User.count({
        where: { created_at: { [Op.between]: [start, end] } },
      });
      twelveMonths.push({ name: `Month ${13 - i}`, value: count });
    }

    return res.status(200).json({
      stat: true,
      message: "User statistics retrieved successfully",
      data: {
        "7days": sevenDays,
        "1month": oneMonth,
        "3months": threeMonths,
        "6months": sixMonths,
        "12months": twelveMonths,
      },
    });
  } catch (error) {
    console.error("Error fetching user statistics:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const getCountRecords = async (req, res) => {
  try {
    // Fetch counts from all models

    const userCount = await User.count();
    const companyCount = await Company.count();
    const jobCount = await Job.count();
    const appliedJobCount = await AppliedJob.count();

    // Return response
    return res.json({
      success: true,
      data: {
        users: userCount,
        companies: companyCount,
        jobs: jobCount,
        appliedJobs: appliedJobCount,
      },
    });
  } catch (error) {
    console.error("Error fetching counts:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getCompanyStatistics = async (req, res) => {
  try {
    const today = new Date();

    const generateDate = (days) => {
      const date = new Date();
      date.setDate(today.getDate() - days);
      return date;
    };

    const sevenDays = [];
    for (let i = 6; i >= 0; i--) {
      const start = generateDate(i);
      const end = generateDate(i - 1);
      const count = await Company.count({
        where: { createdAt: { [Op.between]: [start, end] } },
      });
      sevenDays.push({ name: `Day ${7 - i}`, value: count });
    }

    const oneMonth = [];
    for (let i = 4; i >= 1; i--) {
      const start = generateDate(i * 7);
      const end = generateDate((i - 1) * 7);
      const count = await Company.count({
        where: { createdAt: { [Op.between]: [start, end] } },
      });
      oneMonth.push({ name: `Week ${5 - i}`, value: count });
    }

    const threeMonths = [];
    for (let i = 3; i >= 1; i--) {
      const start = new Date();
      start.setMonth(today.getMonth() - i);
      const end = new Date();
      end.setMonth(today.getMonth() - (i - 1));
      const count = await Company.count({
        where: { createdAt: { [Op.between]: [start, end] } },
      });
      threeMonths.push({ name: `Month ${4 - i}`, value: count });
    }

    const sixMonths = [];
    for (let i = 6; i >= 1; i--) {
      const start = new Date();
      start.setMonth(today.getMonth() - i);
      const end = new Date();
      end.setMonth(today.getMonth() - (i - 1));
      const count = await Company.count({
        where: { createdAt: { [Op.between]: [start, end] } },
      });
      sixMonths.push({ name: `Month ${7 - i}`, value: count });
    }

    const twelveMonths = [];
    for (let i = 12; i >= 1; i--) {
      const start = new Date();
      start.setMonth(today.getMonth() - i);
      const end = new Date();
      end.setMonth(today.getMonth() - (i - 1));
      const count = await Company.count({
        where: { createdAt: { [Op.between]: [start, end] } },
      });
      twelveMonths.push({ name: `Month ${13 - i}`, value: count });
    }
    // Define date thresholds
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);

    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(today.getMonth() - 1);

    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(today.getMonth() - 3);

    const fiveMonthsAgo = new Date();
    fiveMonthsAgo.setMonth(today.getMonth() - 5);

    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(today.getFullYear() - 1);

    // Count companies based on created_at conditions
    // const [sevenDays, oneMonth, threeMonths, fiveMonths, oneYear] = await Promise.all([
    //   Company.count({ where: { createdAt: { [Op.lt]: sevenDaysAgo } } }),
    //   Company.count({ where: { createdAt: { [Op.lt]: oneMonthAgo } } }),
    //   Company.count({ where: { createdAt: { [Op.lt]: threeMonthsAgo } } }),
    //   Company.count({ where: { createdAt: { [Op.lt]: fiveMonthsAgo } } }),
    //   Company.count({ where: { createdAt: { [Op.lt]: oneYearAgo } } }),
    // ]);

    // Return response
    return res.status(200).json({
      stat: true,
      message: "Company statistics retrieved successfully",
      data: {
        "7days": sevenDays,
        "1month": oneMonth,
        "3months": threeMonths,
        "6months": sixMonths,
        "12months": twelveMonths,
      },
    });
  } catch (error) {
    console.error("Error fetching company statistics:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const listUsers = async (req, res) => {
  try {
    // Fetch users with selected attributes
    const users = await User.findAll({
      attributes: ["user_id", "Name", "Email", "Mobile_Number", "created_at"], // Customize fields as needed
      order: [["created_at", "DESC"]], // Latest users first
    });

    return res.status(200).json({
      stat: true,
      message: "Users retrieved successfully",
      data: users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const listCompanies = async (req, res) => {
  try {
    // Fetch companies with selected attributes
    const companies = await Company.findAll({
      attributes: [
        "Company_Id",
        "Company_Name",
        "Company_Type",
        "Company_Email",
        "Company_Status",
        "createdAt",
      ], // Customize fields as needed
      order: [["createdAt", "DESC"]], // Latest companies first
    });

    return res.status(200).json({
      stat: true,
      message: "Companies retrieved successfully",
      data: companies,
    });
  } catch (error) {
    console.error("Error fetching companies:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const updateCompanyStatus = async (req, res) => {
  try {
    const { companyId, status } = req.body;

    // Validate input
    if (!companyId || !status) {
      return res
        .status(400)
        .json({ message: "Company ID and status are required" });
    }

    // Find company by primary key
    const company = await Company.findByPk(companyId);
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    // Update status
    await Company.update(
      {
        Company_Status: status,
      },
      {
        where: {
          Company_Id: companyId,
        },
      }
    );

    return res.status(200).json({
      message: "Company status updated successfully",
      data: { companyId, status },
    });
  } catch (error) {
    console.error("Error updating company status:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateCompanyApprovalStatus = async (req, res) => {
  try {
    const { companyId, status } = req.body;

    // Validate input
    if (!companyId || !status) {
      return res.status(400).json({
        success: false,
        message: "Both companyId and status are required fields.",
      });
    }

    // Find and update company
    const company = await Company.findByPk(companyId);
    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found with the provided ID.",
      });
    }

    // Update approval status
    company.Approval_Status = status;
    await company.save();

    // Enhanced email handling
    if (company.Company_Email) {
      const statusMessages = {
        approved: {
          subject: "Congratulations! Your Company Has Been Approved",
          text: `Dear ${
            company.Company_Name || "User"
          },\n\nWe are pleased to inform you that your company registration has been approved.\n\nYou can now access all features of our platform.\n\nThank you,\nTeam Rojgar`,
          html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333; line-height: 1.6;">
          <div style="background-color: #4a6baf; color: white; padding: 25px; text-align: center; border-radius: 5px 5px 0 0;">
            <h2 style="margin: 0;">Company Registration Approved</h2>
          </div>
          <div style="padding: 25px; background-color: #f9f9f9; border-left: 1px solid #ddd; border-right: 1px solid #ddd;">
            <p>Dear ${company.Company_Name || "User"},</p>
            <div style="font-size: 20px; font-weight: bold; color: #2c3e50; margin: 15px 0;">${
              company.Company_Name || "Your Company"
            }</div>
            <span style="display: inline-block; padding: 6px 12px; border-radius: 20px; font-weight: bold; margin: 10px 0; background-color: #d4edda; color: #155724;">APPROVED</span>
            <p>We're delighted to inform you that your company registration has been successfully approved!</p>
            <p>You now have full access to all features of our platform, including:</p>
            <ul>
              <li>Posting job opportunities</li>
              <li>Managing candidate applications</li>
              <li>Accessing our talent database</li>
              <li>Using our recruitment tools</li>
            </ul>
            <a href="#" style="display: inline-block; padding: 12px 24px; background-color: #4a6baf; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0; font-weight: bold;">Access Your Dashboard</a>
            <p>If you have any questions or need assistance getting started, our support team is ready to help.</p>
            <p>Welcome aboard!</p>
          </div>
          <div style="padding: 20px; text-align: center; background-color: #e9e9e9; border-radius: 0 0 5px 5px; font-size: 14px; color: #666; border: 1px solid #ddd; border-top: none;">
            <p>Best regards,<br><strong>Team Rojgar</strong></p>
            <p><small>This is an automated message. Please do not reply directly to this email.</small></p>
          </div>
        </div>
      `,
        },
        // Do the same for 'rejected', 'pending', and fallback like the pattern above
      };

      const emailContent = statusMessages[status.toLowerCase()] || {
        subject: "Company Approval Status Updated",
        text: `Dear ${
          company.Company_Name || "User"
        },\n\nYour company's approval status has been updated to: ${status}.\n\nThank you,\nTeam Rojgar`,
        html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333; line-height: 1.6;">
        <div style="background-color: #3498db; color: white; padding: 25px; text-align: center; border-radius: 5px 5px 0 0;">
          <h2 style="margin: 0;">Company Status Update</h2>
        </div>
        <div style="padding: 25px; background-color: #f9f9f9; border-left: 1px solid #ddd; border-right: 1px solid #ddd;">
          <p>Dear ${company.Company_Name || "User"},</p>
          <div style="font-size: 20px; font-weight: bold; color: #2c3e50; margin: 15px 0;">${
            company.Company_Name || "Your Company"
          }</div>
          <p>Your company's approval status has been updated:</p>
          <div style="background-color: #f0f7ff; padding: 15px; border-left: 3px solid #3498db; margin: 15px 0;">
            <p><strong>New Status:</strong> ${status}</p>
          </div>
          ${
            status.toLowerCase() === "suspended"
              ? `<p>Your account has been temporarily suspended. During this period, you won't be able to post new jobs or access certain features.</p><p>Please contact our support team for more information about this action.</p>`
              : ""
          }
          ${
            status.toLowerCase() === "under_review"
              ? `<p>Our team is currently reviewing your company information. This process typically takes 2-3 business days.</p><p>We may contact you if additional information is required.</p>`
              : ""
          }
          <a href="#" style="display: inline-block; padding: 12px 24px; background-color: #4a6baf; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0; font-weight: bold;">View Account Details</a>
          <p>If you believe this status change was made in error, or if you have any questions, please contact our support team.</p>
        </div>
        <div style="padding: 20px; text-align: center; background-color: #e9e9e9; border-radius: 0 0 5px 5px; font-size: 14px; color: #666; border: 1px solid #ddd; border-top: none;">
          <p>Best regards,<br><strong>Team Rojgar</strong></p>
          <p><small>This is an automated message. Please do not reply directly to this email.</small></p>
        </div>
      </div>
    `,
      };

      // Send email
      sendMail({
        to: company.Company_Email,
        subject: emailContent.subject,
        text: emailContent.text,
        html: emailContent.html,
        headers: {
          "X-Company-Id": company.id,
          "X-Status-Change": status,
        },
      }).catch((mailErr) => {
        console.error("Email failed to send:", mailErr);
      });
    }

    return res.status(200).json({
      success: true,
      message: "Approval status updated successfully.",
      data: {
        companyId: company.id,
        newStatus: company.Approval_Status,
        emailSent: !!company.Company_Email,
      },
    });
  } catch (error) {
    console.error("Error updating approval status:", error);
    return res.status(500).json({
      success: false,
      message:
        "An unexpected error occurred while updating the approval status.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const updateJobApprovalStatus = async (req, res) => {
  try {
    const { jobId, status } = req.body;

    // Validate input
    if (!jobId || !status) {
      return res.status(400).json({
        success: false,
        message: "Both jobId and status are required fields.",
      });
    }

    // Find and update job
    const job = await Job.findByPk(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found with the provided ID.",
      });
    }

    // Update approval status
    const previousStatus = job.Approval_Status;
    job.Approval_Status = status;
    await job.save();

    // Enhanced email notification system
    if (job.Company_Id) {
      try {
        const company = await Company.findByPk(job.Company_Id);

        if (company?.Company_Email) {
          // Prepare email content based on status
          const emailTemplates = {
            approved: {
              subject: `Your Job Posting "${job.Job_Title}" Has Been Approved`,
              text: `Dear ${
                company.Company_Name || "Client"
              },\n\nWe're pleased to inform you that your job posting "${
                job.Job_Title
              }" has been approved and is now live on our platform.\n\nCandidates can now view and apply for this position.\n\nRegards,\nTeam Rojgar`,
              html: `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333; line-height: 1.6;">
              <div style="background-color: #4a6baf; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0;">
                <h2>Job Posting Approved</h2>
              </div>
              <div style="padding: 20px; background-color: #f9f9f9; border-left: 1px solid #ddd; border-right: 1px solid #ddd;">
                <p>Dear ${company.Company_Name || "Client"},</p>
                
                <p>We're pleased to inform you that your job posting has been approved and is now live on our platform.</p>
                
                <div style="font-size: 18px; font-weight: bold; color: #2c3e50; margin: 10px 0;">${
                  job.Job_Title
                }</div>
                
                <p>Candidates can now view and apply for this position. You can expect to start receiving applications soon.</p>
                
                <a href="#" style="display: inline-block; padding: 10px 20px; background-color: #4a6baf; color: white !important; text-decoration: none; border-radius: 4px; margin: 15px 0;">View Job Posting</a>
                
                <p>If you have any questions or need to make changes to your posting, please don't hesitate to contact our support team.</p>
              </div>
              <div style="padding: 15px; text-align: center; background-color: #e9e9e9; border-radius: 0 0 5px 5px; font-size: 14px; color: #666; border-left: 1px solid #ddd; border-right: 1px solid #ddd; border-bottom: 1px solid #ddd;">
                <p>Regards,<br><strong>Team Rojgar</strong></p>
                <p><small>This is an automated message. Please do not reply directly to this email.</small></p>
              </div>
            </div>
          `,
            },
            rejected: {
              subject: `Update Regarding Your Job Posting "${job.Job_Title}"`,
              text: `Dear ${
                company.Company_Name || "Client"
              },\n\nAfter careful review, we regret to inform you that your job posting "${
                job.Job_Title
              }" does not meet our platform guidelines and has been rejected.\n\nPlease contact our support team for more information.\n\nRegards,\nTeam Rojgar`,
              html: `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333; line-height: 1.6;">
              <div style="background-color: #e74c3c; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0;">
                <h2>Job Posting Not Approved</h2>
              </div>
              <div style="padding: 20px; background-color: #f9f9f9; border-left: 1px solid #ddd; border-right: 1px solid #ddd;">
                <p>Dear ${company.Company_Name || "Client"},</p>
                
                <p>After careful review, we regret to inform you that your job posting does not currently meet our platform guidelines.</p>
                
                <div style="font-size: 18px; font-weight: bold; color: #2c3e50; margin: 10px 0;">${
                  job.Job_Title
                }</div>
                
                <div style="background-color: #f0f7ff; padding: 10px; border-left: 3px solid #4a6baf; margin: 15px 0;">
                  <p><strong>Status:</strong> Rejected</p>
                </div>
                
                <p>Common reasons for rejection include:</p>
                <ul>
                  <li>Incomplete job description</li>
                  <li>Non-compliance with our posting guidelines</li>
                  <li>Suspected discriminatory content</li>
                </ul>
                
                <p>Please review our <a href="#">job posting guidelines</a> and feel free to submit a revised version.</p>
                
                <a href="#" style="display: inline-block; padding: 10px 20px; background-color: #4a6baf; color: white !important; text-decoration: none; border-radius: 4px; margin: 15px 0;">Contact Support</a>
                
                <p>Our team is available to help you understand the specific reasons for this decision and how to improve your posting.</p>
              </div>
              <div style="padding: 15px; text-align: center; background-color: #e9e9e9; border-radius: 0 0 5px 5px; font-size: 14px; color: #666; border-left: 1px solid #ddd; border-right: 1px solid #ddd; border-bottom: 1px solid #ddd;">
                <p>Regards,<br><strong>Team Rojgar</strong></p>
                <p><small>This is an automated message. Please do not reply directly to this email.</small></p>
              </div>
            </div>
          `,
            },
            // Add other status templates as needed
          };

          const template = emailTemplates[status.toLowerCase()] || {
            subject: `Job Status Update: "${job.Job_Title}"`,
            text: `Dear ${
              company.Company_Name || "Client"
            },\n\nThe status of your job posting "${
              job.Job_Title
            }" has been changed from ${previousStatus} to ${status}.\n\nRegards,\nTeam Rojgar`,
            html: `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333; line-height: 1.6;">
            <div style="background-color: #3498db; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0;">
              <h2>Job Status Updated</h2>
            </div>
            <div style="padding: 20px; background-color: #f9f9f9; border-left: 1px solid #ddd; border-right: 1px solid #ddd;">
              <p>Dear ${company.Company_Name || "Client"},</p>
              
              <p>The status of your job posting has been updated:</p>
              
              <div style="font-size: 18px; font-weight: bold; color: #2c3e50; margin: 10px 0;">${
                job.Job_Title
              }</div>
              
              <div style="background-color: #f0f7ff; padding: 10px; border-left: 3px solid #4a6baf; margin: 15px 0;">
                <p><strong>Status changed from:</strong> ${previousStatus}</p>
                <p><strong>New status:</strong> ${status}</p>
              </div>
              
              ${
                status.toLowerCase() === "pending"
                  ? `
                <p>Your job posting is now under review by our team. This process typically takes 1-2 business days.</p>
              `
                  : ""
              }
              
              ${
                status.toLowerCase() === "closed"
                  ? `
                <p>This job posting is no longer visible to candidates. You can reopen it anytime from your dashboard.</p>
              `
                  : ""
              }
              
              <a href="#" style="display: inline-block; padding: 10px 20px; background-color: #4a6baf; color: white !important; text-decoration: none; border-radius: 4px; margin: 15px 0;">View Job Posting</a>
              
              <p>If you have any questions about this status change, please contact our support team.</p>
            </div>
            <div style="padding: 15px; text-align: center; background-color: #e9e9e9; border-radius: 0 0 5px 5px; font-size: 14px; color: #666; border-left: 1px solid #ddd; border-right: 1px solid #ddd; border-bottom: 1px solid #ddd;">
              <p>Regards,<br><strong>Team Rojgar</strong></p>
              <p><small>This is an automated message. Please do not reply directly to this email.</small></p>
            </div>
          </div>
        `,
          };

          // Send email without waiting for response
          sendMail({
            to: company.Company_Email,
            subject: template.subject,
            text: template.text,
            html: template.html,
            // Consider adding headers for tracking
            headers: {
              "X-Job-Id": jobId,
              "X-Status-Change": `${previousStatus}→${status}`,
            },
          }).catch((error) => {
            console.error(`Email failed for job ${jobId}:`, error);
            // Consider logging to an error tracking system
          });
        }
      } catch (error) {
        console.error(`Error processing email for job ${jobId}:`, error);
        // Don't fail the whole operation if email fails
      }
    }

    return res.status(200).json({
      success: true,
      message: "Job approval status updated successfully.",
      data: {
        jobId: job.id,
        jobTitle: job.Job_Title,
        previousStatus,
        newStatus: job.Approval_Status,
        companyNotified: !!job.Company_Id,
      },
    });
  } catch (error) {
    console.error("Error updating job approval status:", error);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred while updating the job status.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// CREATE
export const createJobPostPlan = async (req, res) => {
  try {
    const error = validateJobPostPlan(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error });
    }

    const plan = await JobPostPlan.create(req.body);
    return res.status(200).json({ success: true, data: plan });
  } catch (error) {
    console.error("Create Plan Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// GET ALL
export const getAllJobPostPlans = async (req, res) => {
  try {
    const plans = await JobPostPlan.findAll();
    return res.status(200).json({ success: true, data: plans });
  } catch (error) {
    console.error("Fetch Plans Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// GET BY ID
export const getJobPostPlanById = async (req, res) => {
  try {
    const plan = await JobPostPlan.findByPk(req.query.id);
    if (!plan) {
      return res
        .status(404)
        .json({ success: false, message: "Plan not found" });
    }

    return res.status(200).json({ success: true, data: plan });
  } catch (error) {
    console.error("Fetch Plan by ID Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// UPDATE
export const updateJobPostPlan = async (req, res) => {
  try {
    const plan = await JobPostPlan.findByPk(req.query.id);
    if (!plan) {
      return res
        .status(404)
        .json({ success: false, message: "Plan not found" });
    }

    const error = validateJobPostPlan({ ...plan.toJSON(), ...req.body });
    if (error) {
      return res.status(400).json({ success: false, message: error });
    }

    await plan.update(req.body);
    return res
      .status(200)
      .json({ success: true, message: "Plan updated", data: plan });
  } catch (error) {
    console.error("Update Plan Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// DELETE
export const deleteJobPostPlan = async (req, res) => {
  try {
    const plan = await JobPostPlan.findByPk(req.params.id);
    if (!plan) {
      return res
        .status(404)
        .json({ success: false, message: "Plan not found" });
    }

    await plan.destroy();
    return res
      .status(200)
      .json({ success: true, message: "Plan deleted successfully" });
  } catch (error) {
    console.error("Delete Plan Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};
