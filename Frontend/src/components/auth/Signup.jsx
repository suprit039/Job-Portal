import axios from 'axios'
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import Navbar from "../Shared/Navbar"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import {
  RadioGroup
} from "../ui/radio-group"
import { Loader2 } from "lucide-react"
import { USER_API_END_POINT } from "@/utils/constant"
import { toast } from "sonner"
import { useDispatch, useSelector } from "react-redux"
import { setLoading } from "@/redux/authSlice"
 
const Signup = () => {
  const [input, setInput] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "",
    file: ""
  });
  const dispatch = useDispatch();
  const {loading,user}= useSelector(store=>store.auth);
  const navigate = useNavigate();
  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  }
  const changeFileHandler = (e) => {
    setInput({ ...input, file: e.target.files?.[0] });
  }
  const submitHandler=async(e)=>{
    e.preventDefault();
    const formData = new FormData();
    formData.append("fullname",input.fullname);
    formData.append("email",input.email);
    formData.append("phoneNumber",input.phoneNumber);
    formData.append("password",input.password);
    formData.append("role",input.role);
    if(input.file){
      formData.append("file",input.file);
    }
     try{
      dispatch(setLoading(true));
        const res = await axios.post(`${USER_API_END_POINT}/register`,formData,{
          headers:{
            "Content-Type":"multipart/form-data"
          },
          withCredentials:true,
        });
        if(res.data.success){
          navigate("/login");
          toast.success(res.data.message);
        }
    }
    catch(error){
      console.log(error);
      toast.error(error.response.data.message);
    }
    finally{
      dispatch(setLoading(false));
    }
  }
  useEffect(()=>{
      if(user){
        navigate("/");
      }
    },[])
  return (
    <div>
      <Navbar />
      <div className="flex items-center justify-center mx-auto max-w-7xl">
        <form onSubmit={submitHandler}  className="w-1/2 border border-gray-200 p-4 my-10">
          <h1 className="font-bold text-xl mb-5">Sign Up</h1>
          <div className="my-2">
            <Label>Full Name:</Label>
            <Input type="text" value={input.fullname} name="fullname" onChange={changeEventHandler} placeholder="Full name" />
          </div>
          <div className="my-2">
            <Label>Email:</Label>
            <Input type="email" value={input.email} name="email" onChange={changeEventHandler} placeholder="suprit@gmail.com" />
          </div>
          <div className="my-2">
            <Label>Phone Number:</Label>
            <Input type="tel" value={input.phoneNumber} name="phoneNumber" onChange={changeEventHandler} placeholder="1234567890" />
          </div>
          <div className="my-2">
            <Label>Password</Label>
            <Input type="password" value={input.password} name="password" onChange={changeEventHandler} placeholder="password" />
          </div>
          <div className='flex items-center justify-between'>
            <RadioGroup className="flex items-center gap-4 my-5">
              <div className="flex items-center gap-3">
                <input type="radio" name="role" value="student" checked={input.role === 'student'} onChange ={changeEventHandler} className="cursor-pointer" />
                <Label htmlFor="r1">Student</Label>
              </div>
              <div className="flex items-center gap-3">
                <input type="radio" name="role" value="recruiter" checked={input.role === 'recruiter'} onChange ={changeEventHandler}/>
                <Label htmlFor="r2">Recruiter</Label>
              </div>
            </RadioGroup>
            <div className='flex items-center gap-2'>
              <Label>Profile</Label>
              <Input type="file" accept="image/*" onChange={changeFileHandler} className="cursor-pointer" />
            </div>
          </div>
{
            loading?<Button className="w-full my-4"><Loader2 className="mr-2 h-4 w-4 animate-spin"/>Please Wait</Button>:<Button type="submit" className="cursor-pointer w-full mx-auto my-4 bg-[#6A38C2] text-white">Sign up</Button>
          }          <span className="text-sm">Already have an account?<Link to="/login" className="text-blue-500 ml-1">Login</Link></span>
        </form>
      </div>
    </div>
  )
}

export default Signup
