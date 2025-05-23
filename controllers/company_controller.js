import bcrypt from "bcryptjs";
import Company from "../models/Company.js";
import { Op } from "sequelize";
import dotenv from "dotenv"




import path from "path";
import fs from "fs";
import crypto from "crypto";
import nodeMailer from "nodemailer";
import jwt from 'jsonwebtoken';
import { where } from 'sequelize';
import { type } from "os";
import AppliedJob from "../models/AppliedJobs.js";

import User from "../models/user_table.js";
import Job from "../models/Job.js";
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
            // Company_Logo,
            // Company_Gov_Docs,
            Company_Website,
            Company_Description,
            Company_Start_Date,
            Company_Address,
            Latitude,
            Longitude,

            FCM_ID,
            Device_ID,
        } = req.body;
        

        // const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp", "application/pdf"];
        // const maxFileSize = 10 * 1024 * 1024;

        // if(req.files){
        //     return res.status(400).json({message:`${req.files["Company_Logo"]}`})
        // }
        //    try{
        //     Company_Logo = req.files?.Company_Logo ;
        //     Company_Gov_Docs = req.files?.Company_Gov_Docs ;

        //    }catch(error){
        //     console.error(error);
        //     return res.status(500).json({ message: "Error while uploading files." });
        //    }














        let logoPath = null;
        let docPath = null;
        
        

        let Company_Logo = req.files["Company_Logo"] ? req.files["Company_Logo"][0].path : null;
        let Company_Gov_Docs = req.files["Company_Gov_Docs"] ? req.files["Company_Gov_Docs"][0].path : null;
        





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
                return res.status(400).json({stat:false, message: "Company username already exists!" });
            }
            if (existingCompany.Company_Name === Company_Name) {
                return res.status(400).json({stat:false, message: "Company name already exists!" });
            }
            if (existingCompany.Mobile_Number === Mobile_Number) {
                return res.status(400).json({stat:false, message: "Mobile number already exists!" });
            }
            if (existingCompany.Company_Email === Company_Email) {
                return res.status(400).json({stat:false, message: "Company email already exists!" });
            }
        }

      

        
        // setImmediate(async () => {
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
                    Company_Start_Date,
                    Company_Address,
                    Latitude,
                    Longitude,
                    Company_Gov_Docs,
                    FCM_ID,
                    Device_ID,
                });
                return res.status(200).json({stat:true,message:"Company Registered Successfully"});
            } catch (err) {
                console.error(" Error saving company in DB:", err);
                return res.status(400).json({stat:false,message:`Error ${err}`});
            }
        // });

        // if (Company_Logo) {
        //     if (!allowedTypes.includes(Company_Logo.mimetype)) {
        //         return res.status(400).json({ message: "Invalid file type for Company Logo! Only images allowed." });
        //     }
        //     if (Company_Logo.size > maxFileSize) {
        //         return res.status(400).json({ message: "Company Logo size exceeds 10MB limit!" });
        //     }
        //     const uploadDir = "./uploads/";
        //     if (!fs.existsSync(uploadDir)) {
        //         fs.mkdirSync(uploadDir, { recursive: true });
        //     }
        //     logoPath = `uploads/${Date.now()}_${Company_Logo.name}`;
        //     await Company_Logo.mv(logoPath);
        // }
        // if (Company_Gov_Docs) {
        //     if (!allowedTypes.includes(Company_Gov_Docs.mimetype)) {
        //         return res.status(400).json({ message: "Invalid file type for Company Gov Docs! Only images and PDFs allowed." });
        //     }
        //     if (Company_Gov_Docs.size > maxFileSize) {
        //         return res.status(400).json({ message: "Company Gov Docs size exceeds 10MB limit!" });
        //     }

        //     const uploadDir = "./uploads/";
        //     if (!fs.existsSync(uploadDir)) {
        //         fs.mkdirSync(uploadDir, { recursive: true });
        //     }
        //     // docPath = `uploads/${Date.now()}_${Company_Gov_Docs.name}`;
        //     docPath="uploads/1";
        //     await Company_Gov_Docs.mv(docPath);
        // }
        // 🔹 Create a new company record
        // const newCompany = await Company.create({
        //     Company_User_Name,
        //     Company_Name,
        //     Company_Type,
        //     Country_Code,
        //     Mobile_Number,
        //     Company_Email,
        //     password, // Hashing handled in beforeSave()
        //     Company_Logo:Company_Logo,
        //     Company_Website,
        //     Company_Description,
        //     Company_Status: "Inactive",
        //     Company_Start_Date,
        //     Company_Address,
        //     Latitude,
        //     Longitude,
        //     Company_Gov_Docs:Company_Gov_Docs,
        //     FCM_ID,
        //     Device_ID,
        // });

        // res.status(201).json({
        //     stat: true,
        //     message: "Company created successfully!",
        //     company: newCompany,
        // });

    } catch (error) {
        console.error("Error saving company:", error);

        // 🔹 Handle Sequelize Unique Constraint Error
        if (error.name === "SequelizeUniqueConstraintError") {
            return res.status(400).json({
                errorType: "Database Error",
                message: "A company with the provided email, mobile number, or username already exists!",
                details: error.errors.map(e => e.message),
            });
        }

        // 🔹 Handle Validation Errors
        if (error.name === "SequelizeValidationError") {
            return res.status(400).json({
                errorType: "Validation Error",
                message: "Invalid input data",
                details: error.errors.map(e => e.message),
            });
        }

        // 🔹 Catch Other Errors
        res.status(500).json({
            errorType: "Server Error",
            message: "Internal Server Error! Please try again later.",
            details: error.message,
        });

         next(error); 
        //   Pass error to global error handler
    }
};

export const Login_Company = async (req, res, next) => {
    try {


        const { Mobile_Number, password } = req.body;
        // return res.staus(200).json({message:"Api called"});




        if (!Mobile_Number) { return res.status(400).json({ stat: false, message: "Mobile Number Required" }); }

        if (!Mobile_Number || !password) {
            return res.status(400).json({ stat: false, message: "Mobile Number and Password Required" });
        }

        const company = await Company.findOne({ where: { Mobile_Number } });
        if (!company) {
            return res.status(404).json({ stat: false, message: "Company Not Found" });
        }
        const isMatch = await bcrypt.compare(password, company.password);



        if (!isMatch) {
            return res.status(400).json({ stat: false, message: "Invalid Password" });
        }

        let token;
        try {
            token = jwt.sign(
                { id: company.Company_Id, Mobile_Number: company.Mobile_Number },
                process.env.JWT_SECRET, // Secret key from .env
                { expiresIn: "7d" } // Token expiry
            );
        } catch (err) {
            console.error("JWT Error:", err);
            return res.status(500).json({ message: "Error generating authentication token." });
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
                User_Name:company.Company_User_Name,
                Gov_Docs: company.Company_Gov_Docs,
                FCM_ID: company.FCM_ID,
                Device_ID: company.Device_ID,
                Stat: company.Company_Status,
                Type: company.Company_Type,
                CreatedAt:company.createdAt,
                // Role_Want: company.Role_Want, for bug fix
                // Role_Want: user.Role_Want, for bug fix
            },
        });
    } catch (error) {

        // 🔹 Handle Sequelize (MySQL) errors
        if (error.name === "SequelizeDatabaseError") {
            return res.status(500).json({
                errorType: "Database Error",
                message: "A database error occurred.",
                sqlMessage: error.parent?.sqlMessage || "Unknown SQL error."
            });
        }

        // 🔹 Handle Sequelize Validation errors (e.g., unique constraint)
        if (error.name === "SequelizeValidationError") {
            return res.status(400).json({
                errorType: "Validation Error",
                message: error.errors.map(err => err.message)
            });
        }

        // 🔹 Catch any other unexpected errors
        return res.status(500).json({
            errorType: "Server Error",
            message: "Internal Server Error",
            errorDetails: error.message
        });
    }


}

export const getCompanyById = async (req, res) => {
    try {
        const { companyId } = req.body; // Extract Company_Id from request body

        // Validate input
        if (!companyId || isNaN(companyId)) {
            return res.status(400).json({ success: false, message: "Invalid Company ID" });
        }

        // Fetch company details
        const company = await Company.findOne({
            where: { Company_Id: companyId },
            attributes: { exclude: ["password", "FCM_ID", "DEVICE_ID"] } // Exclude sensitive fields
        });

        // Check if company exists
        if (!company) {
            return res.status(404).json({ success: false, message: "Company not found" });
        }

        return res.status(200).json({ success: true, data: company });
    } catch (error) {
        console.error("Error fetching company data:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};






export const updateCompany = async (req, res) => {
    try {
        const { Company_Id, ...updateData } = req.body; // Extract Company_Id and update fields
         
        // Ensure Company_Id is provided
        if (!Company_Id) {
            return res.status(400).json({ success: false, message: "Company_Id is required for update." });
        }

        // Find the company by ID
        const company = await Company.findByPk(Company_Id);
        if (!company) {
            return res.status(404).json({ success: false, message: "Company not found." });
        }

        // Check if Mobile_Number, Company_Email, or Company_User_Name already exist in other records
        if (updateData.Mobile_Number) {
            const existingMobile = await Company.findOne({
                where: {
                    Mobile_Number: updateData.Mobile_Number,
                    Company_Id: { [Op.ne]: Company_Id } // Exclude current company
                }
            });
            if (existingMobile) {
                return res.status(400).json({ success: false, message: "Mobile number is already in use." });
            }
        }

        if (updateData.Company_Email) {
            const existingEmail = await Company.findOne({
                where: {
                    Company_Email: updateData.Company_Email,
                    Company_Id: { [Op.ne]: Company_Id }
                }
            });
            if (existingEmail) {
                return res.status(400).json({ success: false, message: "Company email is already in use." });
            }
        }

        if (updateData.Company_User_Name) {
            const existingUserName = await Company.findOne({
                where: {
                    Company_User_Name: updateData.Company_User_Name,
                    Company_Id: { [Op.ne]: Company_Id }
                }
            });
            if (existingUserName) {
                return res.status(400).json({ success: false, message: "Company username is already taken." });
            }
        }

        // Perform the update
        try{
           
            await Company.update(
                {
                 Company_Email:updateData.final_data.Company_Email,
                 Company_Name:updateData.final_data.Company_Name,
                 Company_User_Name:updateData.final_data.Company_User_Name,
                 Mobile_Number:updateData.final_data.Mobile_Number,
                 Company_Type:updateData.final_data.Company_Type,
                //  Company_Logo:updateData.Company_Logo,
                 Company_Website:updateData.final_data.Company_Website,
                 Company_Description:updateData.final_data.Company_Description,
                 Company_Address:updateData.final_data.Company_Address,
                //  Company_Start_Date:updateData.Company_Start_Date,
                },
                {where:{Company_Id:Company_Id}}


            );
            const companyUpdated = await Company.findByPk(Company_Id,{
                attributes: { exclude: ["password", "FCM_ID", "DEVICE_ID","reset_token","reset_token_expires"] } // Exclude sensitive fields
            });
            // console.log(companyUpdated)
            return res.status(200).json({success:true,message:"Company updated Successfully",d:companyUpdated})
        }catch(error){
            console.error("Error updating company:", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error",
                error: error.message
            });
        }
        

        return res.status(200).json({
            success: true,
            message: "Company details updated successfully.",
            data: company
        });

    } catch (error) {
        console.error("Error updating company:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};







export const RemoveCompany = async (req, res) => {
    try {
        const { Company_Id } = req.body; // Extract Company_Id from request body

        // Validate input
        if (!Company_Id) {
            return res.status(400).json({ success: false, message: "Company_Id is required for removal." });
        }

        // Find the company
        const company = await Company.findByPk(Company_Id);
        if (!company) {
            return res.status(404).json({ success: false, message: "Company not found." });
        }

        // Delete the company
        await company.destroy();

        return res.status(200).json({
            success: true,
            message: "Company removed successfully."
        });

    } catch (error) {
        console.error("Error removing company:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { mobile, otp, newPassword } = req.body;

        if (!mobile || !otp || !newPassword) {
            return res.status(400).json({ status: false, message: "All fields are required" });
        }


        const company = await Company.findOne({ where: { Mobile_Number: mobile } });
        if (!company) {
            return res.status(404).json({ status: false, message: "User not found" });
        }

        if (new Date() > company.reset_token_expires) {
            return res.status(400).json({ status: false, message: "OTP has expired" });
        }


        if (company.reset_token != otp) {
            return res.status(400).json({ status: false, message: "Invalid OTP. Please enter the correct OTP." });
        }


        try {
            await Company.update(
                {
                    password: newPassword, // Plain text (Schema will hash it)
                    reset_token: null,
                    reset_token_expires: null
                },
                {
                    where: { Company_Id: company.Company_Id },
                    individualHooks: true // Ensures `beforeSave` runs for hashing
                }
            );
        } catch (error) {
            return res.status(400).json({ status: false, message: error.message });
        }


        // if (!updated) {
        //     return res.status(404).json({ message: "Company not found or no changes made" });
        // }

        return res.status(200).json({ status: true, message: "Password reset successfully" });

    } catch (error) {
        console.error("Error resetting password:", error);
        return res.status(500).json({ status: false, message: "Internal Server Error" });
    }
};

export const forgotPassword = async (req, res) => {
    try {
        const { mobile } = req.body;

        if (!mobile) {
            return res.status(400).json({ status: false, message: "Mobile is required" });
        }

        const company = await Company.findOne(
            {
                where: { Mobile_Number: mobile },
                attributes: ["Company_Id", "Company_Email"]
            },


        );

        if (!company) {
            return res.status(404).json({ status: false, message: "Company not found" });
        }

        const otp = crypto.randomInt(1000000, 9999999).toString();
        const expiryTime = new Date(Date.now() + 5 * 60 * 1000);

        await Company.update(
            {
                reset_token: otp,
                reset_token_expires: expiryTime
            },
            {
                where: { Company_Id: company.Company_Id }
            }
        );

        const transporter = nodeMailer.createTransport({
            service: "Gmail",
            auth: {
                user: process.env.EMAIL,
                pass: process.env.APP_PASSWORD,
            }
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
            return res.status(500).json({ status: false, message: `Error sending Email ${error}` });
        }


        return res.status(200).json({ status: true, message: "OTP sent to email" });
    } catch (error) {
        console.error("Error sending OTP:", error);
        return res.status(500).json({ status: false, message: `Internal Server Error ${error}` });
    }
};
export const getAppliedJobbyCompany = async (req, res) => {
    try {
        const { Company_Id, days } = req.body;

        if (!Company_Id) {
            return res.status(400).json({success:true, message: "Company_Id is required" });
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
                    as:"Job",
                    attributes: ["job_id", "job_title", "created_at","updated_at"],
                },
                {
                    model: User,
                    as:"User",
                    attributes: ["user_id", "Name"],
                }
            ],
            attributes: ["job_applied_id", "created_at"]
        });
         
       
        if (!appliedJobs.length) {
            return res.status(404).json({ success:true, message: "No applied jobs found" });
        }

        // Transform response data
        const result = appliedJobs.map(job => ({
            job_id: job.Job?.job_id,
            job_title: job.Job?.job_title,
            posted_date: job.Job?.created_at,
            last_updated_date: job.Job?.updated_at,
            user_name: job.User?.Name,
            user_id: job.User?.user_id,
            applied_date: job.created_at
        }));
           
        
        return res.status(200).json({success:true,message:result});
    } catch (error) {
        console.error("Error fetching applied jobs:", error);
        return res.status(500).json({success:false, message: "Internal server error" });
    }
}