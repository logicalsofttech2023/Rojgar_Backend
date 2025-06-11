import express from "express";
import * as ucontrol from "../controllers/userController.js";
import { verifyToken } from "../midlleware/authcontroller.js";
import multer from "multer";

const router = express.Router();
// Sign Up

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// 📌 Multer Middleware (for two fields: profileImage, coverImage)
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max file size
});

router.post("/save_user", ucontrol.createUser);

// Login
// router.post("/login/send-otp",ucontrol.loginUserWithOTP);
// router.post("/login/verify-otp",ucontrol.verifyOTP);

router.post("/login", ucontrol.loginUser);
router.post("/find_user", ucontrol.getUserDetails);

router.post("/update_user", ucontrol.updateUser);
router.post("delete_user",  ucontrol.deleteUser);
router.post("/add_experience", ucontrol.addUserExperience);

router.post(
  "/add_user_image",
  upload.fields([{ name: "user_image", maxCount: 1 }]),
  ucontrol.uploadImage
);

router.post("/find_user_normal", ucontrol.getUserDetails);
router.post("/update_experience",  ucontrol.updateExperience);
router.post("/edit_experience",  ucontrol.EditExperience);
// Fetch Users Api
router.get("/", ucontrol.getUsers);

router.put("/edit_profile/:userId",  ucontrol.updateUserProfile);
router.post("/reset_password", ucontrol.resetPassword);
router.post("/forget_password", ucontrol.forgotPassword);
router.post("/logout",  ucontrol.logoutUser);
router.post(
  "/update_certificates",
  
  ucontrol.updateUserCertificates
);
router.post("/updatee_certificates",  ucontrol.updateCertification);
router.post("/modify_certifiactes",  ucontrol.modifyCertification);
router.post("/update_skills",  ucontrol.updateUserSkills);
router.post("/add_education",  ucontrol.UpdateEducationDetails);
router.post("/update_education",  ucontrol.updateEducation);
router.post("/modify_education",  ucontrol.modifyEducation);
// router.post('/update_user_fields',ucontrol.updateUserField);
// Update users Api

// Delete users Api
router.delete("/:id", ucontrol.deleteUser);

export default router;
