import express from "express";
import multer from "multer";
import {
  fetchFileDetails,
  uploadImage,
} from "../controllers/userController.js";

const router = express.Router();
const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 2 * 1024 * 1024 },
});

router.get("/files", fetchFileDetails);
router.post("/image", upload.single("image"), uploadImage);

export default router;
