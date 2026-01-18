import { Job } from "../models/job.model.js";

//admin post krega job
export const postJob = async(req,res)=>{
    try{
        
    const {title,description,requirements,salary,location,jobtype,experience,position,companyId}=req.body;
    const userId = req.id;

        if(!title||!description||!requirements||!salary||!location||!jobtype||!experience||!position||!companyId){
            return res.status(400).json({
                message:"All fields are required. Please fill in all the fields.",
                success:false
            })
        };
        const job = await Job.create({
            title,
            description,
            requirements:requirements.split(","),
            salary:Number(salary),
            location,
            jobtype,
            experienceLevel:experience,
            position,
            company:companyId,
            created_by:userId
        });
        return res.status(201).json({
            message:"New job created successfully.",
            job,
            success:true
        })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            message:"Error creating job",
            success:false,
            error:error.message
        })
    }
}
//student k liye
export const getAllJobs = async(req,res)=>{
    try{
        const keyword = req.query.keyword || "";
        let query = {};
        
        // If keyword is provided, search by title or description
        if(keyword.trim()){
            query = {
                $or:[
                    {title:{$regex:keyword,$options:"i"}},
                    {description:{$regex:keyword,$options:"i"}}
                ]
            };
        }
        // If no keyword, return all jobs (empty query object returns all)
        
        const jobs= await Job.find(query).populate({
            path:"company"
        }).sort({createdAt:-1});
        
        return res.status(200).json({
            jobs: jobs || [],
            success:true
        })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            message:"Error fetching jobs",
            success:false,
            error:error.message
        })
    }
}
//student k liye
export const getJobById= async(req,res)=>{
    try{
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate({
            path:"applications"
        }).populate({
            path:"company"
        });
        if(!job){
            return res.status(404).json({
                message:"Jobs not found.",
                success:false
            })
        };
        return res.status(200).json({job,success:true});
    }catch(error){
        console.log(error);
    }
}
//admin kitne job create kra hai
export const getAdminJobs = async(req,res) =>{
    try{
        const adminId = req.id;
        const jobs = await Job.find({created_by:adminId}).populate({
            path:'company',
            createdAt:-1
        });
        if(!jobs){
            return res.status(404).json({
                message:"Jobs not found.",
                success:false
            })
        };
        return res.status(200).json({
            jobs,
            success:true
        })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            message:"Error creating job",
            success:false,
            error:error.message
        })
    }
}