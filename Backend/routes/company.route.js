import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js"
import {login,register,updateProfile,logout} from "../Controllers/user.controller.js";
import { registerCompany,getCompany,getCompanyById, updateCompany } from "../Controllers/company.controller.js";
import { singleUpload } from "../middlewares/multer.js";
const router = express.Router();
router.route("/register").post(isAuthenticated,registerCompany);
router.route("/get").get(isAuthenticated,getCompany);
router.route("/get/:id").get(isAuthenticated,getCompanyById);
router.route("/update/:id").put(isAuthenticated,singleUpload,updateCompany);
export default router;