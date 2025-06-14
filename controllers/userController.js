import User from "../models/user_table.js";
import bcrypt, { compareSync } from "bcryptjs";

import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import moment from "moment";
import crypto from "crypto";
import nodeMailer from "nodemailer";
import { Op } from "sequelize";
import UserJobPreferences from "../models/userJobPreferences.js";
import Department from "../models/Department.js";
dotenv.config();

export const createUser = async (req, res, next) => {
  try {
    const { password, ...otherDetails } = req.body; // Extract password separately

    if (!otherDetails.Mobile_Number) {
      return res
        .status(400)
        .json({ status: false, error: "Mobile Number is required" });
    }
    const existingMobile = await User.findOne({
      where: { Mobile_Number: otherDetails.Mobile_Number },
    });
    if (existingMobile) {
      return res
        .status(400)
        .json({ status: false, message: "Mobile number already exists" });
    }
    if (!otherDetails.Email) {
      return res
        .status(400)
        .json({ status: false, error: "Email is required" });
    }
    const existingEmail = await User.findOne({
      where: { Email: otherDetails.Email },
    });
    if (existingEmail) {
      return res
        .status(400)
        .json({ status: false, message: "Email already exists" });
    }
    if (!password) {
      return res
        .status(400)
        .json({ status: false, error: "Password is required!" });
    }

    // Hash password before saving
    // const hashedPassword = await bcrypt.hash(password, 10);
    // console.log(hashedPassword);

    // Create user with hashed password
    const user = await User.create({ ...otherDetails, password: password });

    return res
      .status(201)
      .json({ status: true, message: "User created successfully!" });
  } catch (error) {
    res.status(400).json({ status: false, error: error.message });
  }
};

export const addUserExperience = async (req, res) => {
  try {
    const { user_id, experience } = req.body;

    // 🔹 Validate input
    if (!user_id || !experience) {
      return res.status(400).json({
        status: false,
        message: "User ID and experience details are required!",
      });
    }

    // 🔹 Find user by ID
    const user = await User.findByPk(user_id);
    if (!user) {
      return res
        .status(404)
        .json({ status: false, message: "User not found!" });
    }

    // 🔹 Ensure experience is stored in JSON format
    let updatedExperience = user.Experience_Details || [];
    if (typeof updatedExperience === "string") {
      updatedExperience = JSON.parse(updatedExperience);
    }

    if (!Array.isArray(updatedExperience)) {
      updatedExperience = [];
    }

    updatedExperience.push(experience); // Append new experience

    // 🔹 Update user experience in the database
    await User.update(
      { Experience_Details: updatedExperience },
      { where: { user_id } }
    );
    // user.Experience_Details = updatedExperience;
    // await user.save();
    return res.status(200).json({
      status: true,
      message: "Experience added successfully!",
      Experience_Details: updatedExperience,
    });
  } catch (error) {
    console.error("Error adding experience:", error);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const updateExperience = async (req, res) => {
  try {
    const { userId, updatedExperience } = req.body; // Expecting userId and updated array of experience details

    if (!userId || !updatedExperience) {
      return res.status(400).json({
        message: "User ID and updated experience details are required",
      });
    }

    // Find and update user experience
    const user = await User.findByPk(userId, {
      attributes: ["Experience_Details"],
    });
    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    try {
      await User.update(
        { Experience_Details: updatedExperience },
        { where: { user_id: userId } }
      );
    } catch (error) {
      return res
        .status(400)
        .json({ status: false, message: `Error Occured : ${error.message}` });
    }

    res.status(200).json({
      status: true,
      message: "Experience details updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const EditExperience = async (req, res) => {
  try {
    const { userId, updatedExperience } = req.body; // Expecting userId and updated array of experience details

    if (!userId || !updatedExperience) {
      return res.status(400).json({
        message: "User ID and updated experience details are required",
      });
    }

    // Find and update user experience
    const user = await User.findByPk(userId, {
      attributes: ["Experience_Details"],
    });
    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    await User.update(
      { Experience_Details: updatedExperience }, // Fields to update
      { where: { user_id: userId } } // Condition using primary key
    );

    res.status(200).json({
      status: true,
      message: "Experience details upadated successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { Mobile_Number, password } = req.body;

    // 🔹 Validate input
    if (!Mobile_Number || !password) {
      return res
        .status(400)
        .json({ message: "Mobile number and password are required!" });
    }

    // 🔹 Check if user exists
    const user = await User.findOne({
      where: { Mobile_Number },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    // 🔹 Compare hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password!" });
    }

    // 🔹 Generate JWT Token
    let token;
    try {
      token = jwt.sign(
        { id: user.id, Mobile_Number: user.Mobile_Number },
        process.env.JWT_SECRET, // Secret key from .env
        { expiresIn: "1d" } // Token expiry
      );

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
        maxAge: 1 * 24 * 60 * 60 * 1000,
        path: "/",
      });
    } catch (err) {
      console.error("JWT Error:", err);
      return res
        .status(500)
        .json({ message: "Error generating authentication token." });
    }

    // 🔹 Successful response
    return res.status(200).json({
      status: true,

      message: "Login successful!",
      token,
      u: user.user_id,
      n: user.Name,
      // user: {
      //     id: user.user_id,
      //     Name: user.Name,
      //     Email: user.Email,
      //     Mobile_Number: user.Mobile_Number,
      //     // Role_Want: user.Role_Want, for bug fix
      // },
    });
  } catch (error) {
    console.error("Login error:", error);
    if (error.response) {
      return res
        .status(500)
        .json({ status: false, message: `Error Response ${error.message}` });
    }
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export const logoutUser = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
  });

  return res.json({ success: true, message: "Logged out successfully" });
};

export const UpdateEducationDetails = async (req, res, next) => {
  try {
    const { user_id, education_details } = req.body;
    if (!user_id || !education_details) {
      return res.status(400).json({
        status: false,
        error: "User ID and Education Details are required",
      });
    }
    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(400).json({ status: false, error: "User not found" });
    }
    let updatedEducation = [];
    if (user.Education_Details) {
      try {
        updatedEducation = JSON.parse(user.Education_Details);
        if (!Array.isArray(updatedEducation)) updatedEducation = [];
      } catch (error) {
        console.error("Error parsing existing Education_Details:", error);
        updatedEducation = [];
      }
    }
    updatedEducation.push(education_details);

    await User.update(
      { Education_Details: updatedEducation },
      { where: { user_id } }
    );
    return res.status(200).json({
      status: true,
      message: "Education details added successfully",
      Education_Details: updatedEducation,
    });
  } catch (error) {
    console.error("Error adding education details", error);
    return res.status(500).json({ status: false, error: error.message });
  }
};

export const updateEducation = async (req, res) => {
  try {
    const { userId, updatedEducation } = req.body;

    if (!userId || !updatedEducation) {
      return res.status(400).json({
        status: false,
        message: "User ID and updated education details are required",
      });
    }

    // Fetch the existing user
    const user = await User.findByPk(userId, {
      attributes: ["Education_Details"],
    });

    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    try {
      await User.update(
        { Education_Details: updatedEducation },
        { where: { user_id: userId } }
      );

      res.status(200).json({
        status: true,
        message: "Education details updated successfully",
      });
    } catch (error) {
      return res
        .status(400)
        .json({ status: false, message: `Error Occurred: ${error.message}` });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
export const modifyEducation = async (req, res) => {
  try {
    const { userId, newEducationData } = req.body;

    if (!userId || !newEducationData) {
      return res.status(400).json({
        status: false,
        message: "User ID and new education data are required",
      });
    }

    // Find the user by primary key
    const user = await User.findByPk(userId, {
      attributes: ["Education_Details"],
    });
    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    // Replace the Education_Details with the new data from the request
    try {
      await User.update(
        { Education_Details: newEducationData },
        { where: { user_id: userId } }
      );
      res.status(200).json({
        status: true,
        message: "Education details modified successfully",
      });
    } catch (error) {
      return res
        .status(400)
        .json({ status: false, message: `Error Occurred: ${error.message}` });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is required" });
    }

    const {
      Name,
      Email,
      Mobile_Number,
      Date_of_Birth,
      Education_level,
      City,
      Gender,
      Current_Location,
    } = req.body;

    const user = await User.findByPk(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (Date_of_Birth) {
      const birthDate = moment(Date_of_Birth);
      const today = moment();
      const age = today.diff(birthDate, "years");

      if (birthDate.isAfter(today)) {
        return res.status(400).json({
          success: false,
          message: "Date of Birth cannot be a future date.",
        });
      }
      if (age < 10) {
        return res.status(400).json({
          success: false,
          message: "User must be at least 10 years old to register.",
        });
      }
    }

    if (Email) {
      try {
        // Check if the email already exists for any user except the current one
        const existingEmail = await User.findOne({
          where: {
            Email,
            user_id: { [Op.ne]: userId },
          },
        });

        if (existingEmail) {
          return res
            .status(400)
            .json({ success: false, message: "Email already exists" });
        }
      } catch (error) {
        console.error("Error checking email uniqueness:", error);
        return res
          .status(500)
          .json({ success: false, message: "Internal Server Error" });
      }
    }

    if (Mobile_Number) {
      const existingPhone = await User.findOne({
        where: {
          Mobile_Number: Mobile_Number,
          user_id: { [Op.ne]: userId },
        },
      });
      if (existingPhone) {
        return res
          .status(400)
          .json({ success: false, message: "Phone number already exists" });
      }
    }
    // res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
    // res.setHeader("Access-Control-Allow-Credentials", "true");
    // res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    // res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

    // Prepare fields for update (Only update provided values)
    const updatedFields = {};
    if (Name) updatedFields.Name = Name;
    if (Email) updatedFields.Email = Email;
    if (Mobile_Number) updatedFields.Mobile_Number = Mobile_Number;
    if (Date_of_Birth) updatedFields.Date_of_Birth = Date_of_Birth;
    if (Education_level) updatedFields.Education_level = Education_level;
    if (City) updatedFields.City = City;
    if (Gender) updatedFields.Gender = Gender;
    if (Current_Location) updatedFields.Current_Location = Current_Location;

    if (Object.keys(updatedFields).length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No fields provided for update" });
    }

    try {
      await User.update(updatedFields, { where: { user_id: userId } });
    } catch (error) {
      console.error("Error updating user profile:", error);
      return res.status(500).json({ success: false, message: "Server error" });
    }

    return res.json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const uploadUserImage = async (req, res) => {
  try {
    const { user_id } = req.body;

    if (!user_id) {
      return res
        .status(400)
        .json({ stat: false, error: "User ID is required" });
    }
    console.log("User_Id", user_id);

    // Extract Image Path from `req.files`
    const fileField = "user_image"; // Field name from frontend
    if (
      !req.files ||
      !req.files[fileField] ||
      req.files[fileField].length === 0
    ) {
      return res.status(400).json({ stat: false, error: "No image uploaded" });
    }

    const imagePath = req.files[fileField][0].path; // Get uploaded image path

    // Update User Table with Image Path
    const updatedUser = await User.update(
      { user_image: imagePath },
      { where: { user_id: user_id } }
    );

    if (!updatedUser[0]) {
      return res.status(404).json({ stat: false, error: "User not found" });
    }

    return res.status(200).json({
      stat: true,
      message: "Image uploaded successfully",
      imagePath,
    });
  } catch (error) {
    return res.status(500).json({ stat: false, error: error.message });
  }
};
export const updateUser = async (req, res) => {
  try {
    const { user_id, Email, Mobile_Number, ...updateData } = req.body; // Extract user_id and new data

    // Check if user exists
    const existingUser = await User.findByPk(user_id);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if Email or Mobile Number is already taken by another user
    const conflictUser = await User.findOne({
      where: {
        [Op.or]: [
          Email ? { Email } : null,
          Mobile_Number ? { Mobile_Number } : null,
        ],
        user_id: { [Op.ne]: user_id }, // Exclude current user
      },
    });

    if (conflictUser) {
      return res.status(400).json({
        message: "Email or Mobile Number is already in use by another user",
      });
    }

    // Update user details
    await User.update(
      { Email, Mobile_Number, ...updateData },
      { where: { user_id } }
    );

    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserDetails = async (req, res) => {
  try {
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({
        status: false,
        message: "User ID is required!",
      });
    }

    const user = await User.findOne({
      where: { user_id: user_id },
      attributes: { exclude: ["password", "FCM_ID"] },
    });

    // Check if user exists
    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User not found!",
      });
    }

    // Return user details
    return res.status(200).json({
      status: true,
      message: "User details fetched successfully!",
      data: user,
    });
  } catch (error) {
    console.error("Error fetching user details:", error);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error!",
    });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { user_id } = req.body; // Extract user_id from request body

    // Check if user exists
    const existingUser = await User.findByPk(user_id);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete the user
    await User.destroy({ where: { user_id } });

    res.status(200).json({ message: "User account deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const fetchFileDetails = async (req, res) => {
  try {
    res.status(200).json({ files: req.files });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateUserField = async (req, res) => {
  try {
    const { userId, field, data } = req.body;

    if (!data) {
      return res
        .status(400)
        .json({ success: false, message: "Data is required" });
    }
    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is required" });
    }
    let column = null;

    if (!userId || !field || !data) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    if (!["Skills", "Certificates"].includes(field)) {
      return res.status(400).json({
        success: false,
        message: "Invalid field. Allowed values: 'Skills' or 'Certificates'",
      });
    }
    const user = await User.findByPk(userId, {
      attributes: [field], // Fetch only the required field
    });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    let existingData;
    try {
      existingData = JSON.parse(user[field]) ?? [];

      if (!Array.isArray(existingData)) {
        existingData = [];
      }
    } catch (error) {
      console.error("Error parsing JSON:", error);
      existingData = [];
    }

    // Append new data (if not already included)
    if (!existingData.includes(data)) {
      existingData.push(data);
    }

    // Update the specific field in MySQL
    await User.update(
      { [field]: JSON.stringify(existingData) }, // Convert array back to JSON
      { where: { user_id: userId } } // Data is doubly parsed in json
    );

    return res
      .status(200)
      .json({ status: true, message: `${field} updated successfully`, user });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

export const updateUserSkills = async (req, res) => {
  try {
    const { userId, skills } = req.body;

    // Validation
    if (!userId || !Array.isArray(skills)) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid user ID or skills format" });
    }

    // Find user
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    // Get existing skills from database
    const existingSkills = user.Skills ? JSON.parse(user.Skills) : [];

    // Merge new skills with existing skills (avoiding duplicates)
    const updatedSkills = [...new Set([...existingSkills, ...skills])];

    // Update skills
    try {
      await user.update({ Skills: skills }, { where: { user_id: userId } });
    } catch (error) {
      return res
        .status(400)
        .json({ status: false, message: `Error updating : ${error.message}` });
    }

    return res.status(200).json({
      status: true,
      message: "Skills updated successfully",
      data: updatedSkills,
    });
  } catch (error) {
    console.error("Error updating skills:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
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

    const user = await User.findOne({ where: { Mobile_Number: mobile } });
    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    if (new Date() > user.reset_token_expires) {
      return res
        .status(400)
        .json({ status: false, message: "OTP has expired" });
    }

    if (user.reset_token !== otp) {
      return res.status(400).json({
        status: false,
        message: "Invalid OTP. Please enter the correct OTP.",
      });
    }

    await user.update(
      {
        password: newPassword,
        reset_token: null,
        reset_token_expires: null,
      },
      {
        where: { user_id: user.user_id },
      }
    );

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

    const user = await User.findOne({
      where: { Mobile_Number: mobile },
      attributes: ["user_id", "Email"],
    });

    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    const otp = crypto.randomInt(1000000, 9999999).toString();
    const expiryTime = new Date(Date.now() + 5 * 60 * 1000);

    await User.update(
      {
        reset_token: otp,
        reset_token_expires: expiryTime,
      },
      {
        where: { user_id: user.user_id },
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
        to: user.Email,
        subject: "Rojgar Password Reset OTP",
        text: `Your OTP to reset password is: ${otp}. It is valid for 5 minutes.`,
      });
      return res
        .status(200)
        .json({ status: true, message: "OTP sent to email" });
    } catch (error) {
      console.error("Error sending email:", error);
      return res
        .status(500)
        .json({ status: false, message: `Error sending Email ${error}` });
    }
  } catch (error) {
    console.error("Error sending OTP:", error);
    return res
      .status(500)
      .json({ status: false, message: `Internal Server Error ${error}` });
  }
};

export const updateUserCertificates = async (req, res) => {
  try {
    const { userId, certificates } = req.body;

    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is required" });
    }

    const user = await User.findByPk(userId, {
      attributes: ["Certificates"],
    });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    let existingCertificates = [];
    try {
      existingCertificates = JSON.parse(user.Certificates);
      if (!Array.isArray(existingCertificates)) {
        existingCertificates = [];
      }
    } catch (error) {
      console.error("Error parsing JSON:", error);
      existingCertificates = [];
    }
    const updatedCertificates = [...existingCertificates, certificates];
    // Update certificates column
    await User.update(
      { Certificates: updatedCertificates },
      { where: { user_id: userId } }
    );
    return res.status(200).json({
      status: true,
      message: "Certificates updated successfully",
      data: updatedCertificates,
    });
  } catch (error) {
    console.error("Error updating certificates:", error);
    return res
      .status(500)
      .json({ status: false, message: "Internal Server Error" });
  }
};
export const updateCertification = async (req, res) => {
  try {
    const { userId, updatedCertifications } = req.body;

    if (!userId || !updatedCertifications) {
      return res.status(400).json({
        status: false,
        message: "User ID and updated certifications are required.",
      });
    }

    const user = await User.findOne({
      where: { user_id: userId },
      attributes: ["Certificates"],
    });
    if (!user) {
      return res
        .status(404)
        .json({ status: false, message: "User not found." });
    }

    try {
      await User.update(
        { Certificates: updatedCertifications },
        { where: { user_id: userId } }
      );
      return res.status(200).json({
        status: true,
        message: "Certifications updated successfully.",
      });
    } catch (error) {
      console.error("Error updating certifications:", error);
      return res
        .status(500)
        .json({ status: false, message: "Failed to update certifications." });
    }
  } catch (error) {
    console.error("Unexpected error:", error);
    return res
      .status(500)
      .json({ status: false, message: "Internal server error." });
  }
};

export const modifyCertification = async (req, res) => {
  try {
    const { userId, newCertificationData } = req.body;

    if (!userId || !newCertificationData) {
      return res.status(400).json({
        status: false,
        message: "User ID and certification are required.",
      });
    }

    const user = await User.findOne({
      where: { user_id: userId },
      attributes: ["Certificates"],
    });
    if (!user) {
      return res
        .status(404)
        .json({ status: false, message: "User not found." });
    }

    try {
      await User.update(
        { Certificates: newCertificationData },
        { where: { user_id: userId } }
      );
      return res.status(200).json({
        status: true,
        message: "Certification modified successfully.",
      });
    } catch (error) {
      console.error("Error modifying certification:", error);
      return res
        .status(500)
        .json({ status: false, message: "Failed to modify certification." });
    }
  } catch (error) {
    console.error("Unexpected error:", error);
    return res
      .status(500)
      .json({ status: false, message: "Internal server error." });
  }
};

export const uploadImage = async (req, res) => {
  try {
    const imageFile = req.files?.user_image?.[0];
    const userId = req.body.user_id;

    if (!imageFile) return res.status(400).json({ error: "No file uploaded" });

    const allowedExtensions = ["jpg", "jpeg", "png", "gif"];
    const fileExtension = imageFile.originalname.split(".").pop().toLowerCase();

    if (!allowedExtensions.includes(fileExtension)) {
      return res.status(400).json({ error: "Invalid file type" });
    }

    if (imageFile.size > 2 * 1024 * 1024) {
      return res.status(400).json({ error: "File size exceeds 2MB" });
    }

    // Save image path to user_table
    const updated = await User.update(
      { user_image: imageFile.path },
      { where: { user_id: userId } }
    );

    if (updated[0] === 0) {
      return res.status(404).json({ error: "User not found or not updated" });
    }

    res
      .status(200)
      .json({ message: "Image uploaded and saved", filePath: imageFile.path });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createJobPreference = async (req, res) => {
  try {
    const {
      user_id,
      Preferred_Job_Location,
      Preferred_Job_Type,
      Expected_Salary,
      Willing_To_Relocate,
      Notice_Period,
    } = req.body;

    let resume = req.files["resume"] ? req.files["resume"][0].path : null;

    const newPreference = await UserJobPreferences.create({
      user_id,
      Preferred_Job_Location,
      Preferred_Job_Type,
      Expected_Salary,
      Willing_To_Relocate,
      Notice_Period,
      resume,
    });

    res
      .status(201)
      .json({
        status: true,
        message: "Preference created successfully",
        data: newPreference,
      });
  } catch (error) {
    res
      .status(500)
      .json({
        status: false,
        message: "Error creating preference",
        error: error.message,
      });
  }
};

export const updateJobPreference = async (req, res) => {
  try {
    const { id } = req.query;

    // Check if resume file is present
    let resume = req.files?.["resume"] ? req.files["resume"][0].path : null;

    // Merge resume with body if provided
    const updatedData = {
      ...req.body,
      ...(resume && { resume }),
    };

    const updated = await UserJobPreferences.update(updatedData, {
      where: { id },
    });

    if (updated[0] === 0) {
      return res
        .status(404)
        .json({ message: "Preference not found or nothing updated." });
    }

    const result = await UserJobPreferences.findByPk(id);
    return res.status(200).json({
      status: true,
      message: "Preference updated successfully",
      data: result,
    });
  } catch (error) {
    res
      .status(500)
      .json({
        status: false,
        message: "Error updating preference",
        error: error.message,
      });
  }
};

export const getAllJobPreferencesByUserId = async (req, res) => {
  try {
    const userId = req.query.userId;

    if (!userId) {
      return res.status(400).json({
        message: "Missing required parameter: userId",
      });
    }
    const preferences = await UserJobPreferences.findAll({
      where: { user_id: userId },
    });

    if (!preferences || preferences.length === 0) {
      return res.status(404).json({
        message: "No job preferences found for this user",
      });
    }

    return res.status(200).json({
      message: "Job preferences fetched successfully",
      data: preferences,
    });
  } catch (error) {
    console.error("Error fetching preferences:", error);
    return res.status(500).json({
      message: "Error fetching preferences",
      error: error.message,
    });
  }
};

export const getJobPreferenceById = async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ message: "Preference ID is required." });
    }
    const preference = await UserJobPreferences.findByPk(id);

    if (!preference) {
      return res.status(404).json({ message: "Preference not found." });
    }

    res.status(200).json(preference);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching preference", error: error.message });
  }
};

export const deleteJobPreference = async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ message: "Preference ID is required." });
    }

    const deleted = await UserJobPreferences.destroy({ where: { id } });

    if (deleted === 0) {
      return res.status(404).json({ message: "Preference not found." });
    }

    res
      .status(200)
      .json({ message: "Preference deleted successfully.", status: true });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting preference", error: error.message });
  }
};
