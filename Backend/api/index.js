import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import applicationRoute from "../routes/application.route.js";
import companyRoute from "../routes/company.route.js";
import jobRoute from "../routes/job.route.js";
import userRoute from "../routes/user.route.js";
import connectDB from "../utils/db.js";

dotenv.config({});
const app = express();
const port =process.env.PORT || 8000;
app.get("/home",(req,res)=>{
    return res.status(200).json({
        message:"I am coming from backend",
        success:true
    })
});

//middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

const corsOptions = {
    origin: process.env.NODE_ENV === 'production' 
        ? true // Allow all origins in production (Vercel handles this)
        : ['http://localhost:5173'],
    credentials: true
}
app.use(cors(corsOptions));

//api's
app.use("/api/v1/user",userRoute);
app.use("/api/v1/company",companyRoute);
app.use("/api/v1/job",jobRoute);
app.use("/api/v1/application",applicationRoute);

// Connect to database
connectDB();

// For Vercel, export the app instead of listening
export default app;
