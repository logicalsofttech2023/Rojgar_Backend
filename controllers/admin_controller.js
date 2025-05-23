import User from "../models/user_table.js";
import Company from "../models/Company.js";
import { Op } from "sequelize";







import dotenv from "dotenv";
import Admin from "../models/Admin.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";





import AppliedJob from "../models/AppliedJobs.js";
dotenv.config();

import Job from "../models/Job.js";
const JWT_SECRET = process.env.JWT_SECRET;


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
    const token = jwt.sign({ Admin_Id: admin.Admin_Id }, JWT_SECRET, { expiresIn: "1d" });

    // Store token in cookie
    res.cookie("token", token, { httpOnly: true, secure: true, maxAge: 86400000 });

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

    return res.status(200).json({ success: true, d:admin });
  } catch (error) {
    console.error("Error fetching admin details:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
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
      const count = await User.count({ where: { created_at: { [Op.between]: [start, end] } } });
      sevenDays.push({ name: `Day ${7 - i}`, value: count });
    }

    const oneMonth = [];
    for (let i = 4; i >= 1; i--) {
      const start = generateDate(i * 7);
      const end = generateDate((i - 1) * 7);
      const count = await User.count({ where: { created_at: { [Op.between]: [start, end] } } });
      oneMonth.push({ name: `Week ${5 - i}`, value: count });
    }

    const threeMonths = [];
    for (let i = 3; i >= 1; i--) {
      const start = new Date();
      start.setMonth(today.getMonth() - i);
      const end = new Date();
      end.setMonth(today.getMonth() - (i - 1));
      const count = await User.count({ where: { created_at: { [Op.between]: [start, end] } } });
      threeMonths.push({ name: `Month ${4 - i}`, value: count });
    }

    const sixMonths = [];
    for (let i = 6; i >= 1; i--) {
      const start = new Date();
      start.setMonth(today.getMonth() - i);
      const end = new Date();
      end.setMonth(today.getMonth() - (i - 1));
      const count = await User.count({ where: { created_at: { [Op.between]: [start, end] } } });
      sixMonths.push({ name: `Month ${7 - i}`, value: count });
    }

    const twelveMonths = [];
    for (let i = 12; i >= 1; i--) {
      const start = new Date();
      start.setMonth(today.getMonth() - i);
      const end = new Date();
      end.setMonth(today.getMonth() - (i - 1));
      const count = await User.count({ where: { created_at: { [Op.between]: [start, end] } } });
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
export const getCountRecords = async ( req,res) =>{
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
      const count = await Company.count({ where: { createdAt: { [Op.between]: [start, end] } } });
      sevenDays.push({ name: `Day ${7 - i}`, value: count });
    }

    const oneMonth = [];
    for (let i = 4; i >= 1; i--) {
      const start = generateDate(i * 7);
      const end = generateDate((i - 1) * 7);
      const count = await Company.count({ where: { createdAt: { [Op.between]: [start, end] } } });
      oneMonth.push({ name: `Week ${5 - i}`, value: count });
    }

    const threeMonths = [];
    for (let i = 3; i >= 1; i--) {
      const start = new Date();
      start.setMonth(today.getMonth() - i);
      const end = new Date();
      end.setMonth(today.getMonth() - (i - 1));
      const count = await Company.count({ where: { createdAt: { [Op.between]: [start, end] } } });
      threeMonths.push({ name: `Month ${4 - i}`, value: count });
    }

    const sixMonths = [];
    for (let i = 6; i >= 1; i--) {
      const start = new Date();
      start.setMonth(today.getMonth() - i);
      const end = new Date();
      end.setMonth(today.getMonth() - (i - 1));
      const count = await Company.count({ where: { createdAt: { [Op.between]: [start, end] } } });
      sixMonths.push({ name: `Month ${7 - i}`, value: count });
    }

    const twelveMonths = [];
    for (let i = 12; i >= 1; i--) {
      const start = new Date();
      start.setMonth(today.getMonth() - i);
      const end = new Date();
      end.setMonth(today.getMonth() - (i - 1));
      const count = await Company.count({ where: { createdAt: { [Op.between]: [start, end] } } });
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
      attributes: ["Company_Id", "Company_Name", "Company_Type", "Company_Email", "Company_Status", "createdAt"], // Customize fields as needed
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
      return res.status(400).json({ message: "Company ID and status are required" });
    }

    // Find company by primary key
    const company = await Company.findByPk(companyId);
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    // Update status
    await Company.update({
      Company_Status: status,
    }, {
      where: {
        Company_Id: companyId
      }
    })

    return res.status(200).json({
      message: "Company status updated successfully",
      data: { companyId, status },
    });
  } catch (error) {
    console.error("Error updating company status:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};













