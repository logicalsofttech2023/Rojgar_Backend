import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import multer from "multer";

import { connectDB } from "./connection/db.js";
import "./models/associations.js";
import userRoutes from "./routes/userRoutes.js";
import companyRoutes from "./routes/company_routes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import jobRoutes from "./routes/jobRoute.js";

import cookieParser from "cookie-parser";

import reportRoute from "./routes/report_route.js";
import suggetionRoute from "./routes/suggetion_route.js";

import adminRoutes from "./routes/admin_route.js";
import { createAllTables } from "./connection/CreateAllTable.js";
dotenv.config();
connectDB();
createAllTables();

const app = express();


app.use("/uploads", express.static("uploads"));
// app.use(upload.any());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/users", userRoutes);
app.use("/api/suggestions", suggetionRoute);
app.use("/api/companies", companyRoutes);
app.use("/api/upload", uploadRoutes);

app.use("/api/admin", adminRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/reports", reportRoute);

app.get("/", (req, res) => {
  res.send("Server Connected");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
