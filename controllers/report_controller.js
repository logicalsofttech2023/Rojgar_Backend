import Report from "../models/Report.js";
import { Op } from "sequelize";

/**
 * Create a new report
 */
export const createReport = async (req, res) => {
  try {
    const { Report_Of, Reported_By, Reported_By_Id, Report_Text, Report_Of_Id, Report_Sub } = req.body;
   

    if (!Reported_By || !Reported_By_Id || !Report_Of_Id) {
      return res.status(400).json({stat:false, error: "Missing required fields" });
    }

    
    
    
    
    
    try{

    
    const newReport = await Report.create({
      Report_Of,
      Reported_By,
      Reported_By_Id,
      Report_Text,
      Report_Of_Id,
      Report_Sub,
    });
    return res.status(201).json({stat:true, message: "Report created successfully", report: newReport });

  }catch(error){
        return res.status(400).json({stat:false, message:"Some error occured "});
  }
  } catch (error) {
    return res.status(500).json({ stat:false,error: "Internal server error", details: error.message });
  }
};

/**
 * Delete a report by ID
 */
export const deleteReport = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Report.destroy({ where: { Report_Id: id } });

    if (!deleted) {
      return res.status(404).json({ error: "Report not found" });
    }

    res.status(200).json({ message: "Report deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
};

/**
 * Update report status by ID
 */
export const updateReportStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { Report_Status } = req.body;

    if (!Report_Status) {
      return res.status(400).json({ error: "Status is required" });
    }

    const report = await Report.findByPk(id);

    if (!report) {
      return res.status(404).json({ error: "Report not found" });
    }

    report.Report_Status = Report_Status;
    await report.save();

    res.status(200).json({ message: "Report status updated", report });
  } catch (error) {
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
};

/**
 * Count reports by company ID
 */
export const countReportsByCompany = async (req, res) => {
  try {
    const { companyId } = req.params;

    const reportCount = await Report.count({
      where: { Report_Of_Id: companyId },
    });

    res.status(200).json({ companyId, reportCount });
  } catch (error) {
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
};

/**
 * Count reports by user ID
 */
export const countReportsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const reportCount = await Report.count({
      where: { Reported_By_Id: userId },
    });

    res.status(200).json({ userId, reportCount });
  } catch (error) {
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
};
export const getReports = async (req, res) => {
  try {
    const { companyId, userId } = req.query; // Get filters from request

    const whereClause = {}; // Initialize empty filter

    if (companyId) whereClause.Report_Of_Id = companyId; // Filter by company
    if (userId) whereClause.Reported_By_Id = userId; // Filter by user

    const reports = await Report.findAll({ where: whereClause });

    if (!reports.length) {
      return res.status(404).json({ message: "No reports found." });
    }

    res.status(200).json({ success: true, reports });
  } catch (error) {
    console.error("Error fetching reports:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};
export const getAllReports = async (req, res) => {
  try {
    const reports = await Report.findAll(); // Fetch all reports

    if (!reports.length) {
      return res.status(404).json({ message: "No reports found." });
    }

    res.status(200).json({ success: true, reports });
  } catch (error) {
    console.error("Error fetching reports:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};