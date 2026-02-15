import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import LatestJobCards from "./LatestJobCards";

// const randomJobs=[1,2,3,4,5,6,7,8];
const LatestJobs=()=>{
    const {allJobs}= useSelector(store=>store.job);
    const navigate = useNavigate();
    return(
        <div className='max-w-7xl mx-auto my-20 px-4'>
            <h1 className="text-2xl md:text-4xl font-bold"><span className="text-[#6A38C2]">Latest </span>Job Opening</h1>
           <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-5'>
            {
                allJobs.length<=0?<span>No Job Available</span>:allJobs?.slice(0,6).map((job)=><LatestJobCards key={job._id} {...job} />)
            }
           </div>
        </div>
    )
}
export default LatestJobs