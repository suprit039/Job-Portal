import { setSearchedQuery } from "@/redux/jobSlice";
import { Search } from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

const HeroSection = () => {
    const[query,setQuery]= useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const searchJobHandler =()=>{
        dispatch(setSearchedQuery(query));
        navigate("/browse");
    }
    return (
        <div className="text-center px-4">
            <div className="flex flex-col gap-5 my-10">
                <span className="mx-auto px-4 py-2 rounded-full bg-gray-100 text-[#F83002] font-medium text-sm md:text-base">No.1 Job Hunt Website</span>
                <h1 className='text-3xl md:text-5xl font-bold'>Search,Apply &<br />Get Your<span className='text-[#6A38C2]'> Dream Job</span></h1>
                <p className="text-sm md:text-base">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Totam, veritatis.</p>
                <div className="flex w-full md:w-[80%] lg:w-[60%] xl:w-[40%] shadow-lg border border-gray-200 pl-3 rounded-full items-center gap-4 mx-auto">
                    <input type="text"
                    placeholder="Find your dream jobs"
                    onChange={(e)=>setQuery(e.target.value)}
                    className="outline-none border-none w-full text-sm md:text-base" />
                    <Button onClick={searchJobHandler}className="rounded-r-full bg-[#6A38C2]">
                        <Search className="h-5 w-5"/>
                    </Button>
                </div>
            </div>

        </div>
    )
}
export default HeroSection