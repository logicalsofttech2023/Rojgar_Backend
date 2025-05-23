import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import multer from 'multer';





import { connectDB } from './connection/db.js';
import "./models/associations.js";
import userRoutes from './routes/userRoutes.js';
import companyRoutes from './routes/company_routes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import jobRoutes from './routes/jobRoute.js';


import cookieParser from 'cookie-parser';

import reportRoute from "./routes/report_route.js";
import suggetionRoute from "./routes/suggetion_route.js";

import adminRoutes from "./routes/admin_route.js";
dotenv.config();
connectDB();

const app = express();










// Upload Multer

// const uploadDir = "uploads/";
// if (!fs.existsSync(uploadDir)) {
//     fs.mkdirSync(uploadDir);
// }
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, "uploads/"); 
//     },
//     filename: (req, file, cb) => {
//         cb(null, Date.now() + path.extname(file.originalname)); // Unique file name
//     }
// });
// const fileFilter = (req, file, cb) => {
//     const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
//     if (allowedTypes.includes(file.mimetype)) {
//         cb(null, true);
//     } else {
//         cb(new Error("Invalid file type. Only JPG, PNG, and PDF are allowed."), false);
//     }};











// const upload = multer({
//     storage: storage,
//     limits: { fileSize: 5* 1024 * 1024 }, // 10MB limit
//     fileFilter: fileFilter
// });























// app.use(upload.array());
// app.use(upload.any());
app.use("/uploads", express.static("uploads"));
// app.use(upload.any()); 
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true, 
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],  
    allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));








// app.use("/uploads", express.static(path.join(__dirname, "uploads")));












// const upload = multer({ dest: 'uploads/' });












// Impoert routes after cors 

app.use('/api/users', userRoutes);
app.use('/api/suggestions',suggetionRoute);
app.use('/api/companies', companyRoutes);  
app.use('/api/upload', uploadRoutes);


















app.use('/api/admin',adminRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/reports',reportRoute);




app.get("/", (req, res) => {
    res.send("Server Connected");
})



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
