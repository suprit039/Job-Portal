import { useNavigate } from "react-router-dom";
import { Badge } from "./ui/badge";
const LatestJobCards = (job) => {
    const navigate = useNavigate();
    return (
        <div onClick={()=>navigate(`/description/${job._id}`)} className="p-4 md:p-5 rounded-md shadow-xl bg-white border border-gray-100 cursor-pointer hover:shadow-2xl transition-shadow">
            <div>
                <h1 className="font-medium text-base md:text-lg truncate">
                    {job?.company?.name}
                </h1>
                <p className="text-xs md:text-sm text-gray-600">India</p>
            </div>
            <div>
                <h1 className="font-medium text-base md:text-lg my-2 line-clamp-1">{job?.title}</h1>
                <p className='text-xs md:text-sm text-gray-600 line-clamp-2'>{job?.description}</p>
            </div>
            <div className="flex flex-wrap gap-2 items-center mt-4">
                <Badge className={'text-blue-700 font-bold text-xs'} variant="ghost">{job?.position} Positions</Badge>
                <Badge className={'text-[#F83002] font-bold text-xs'} variant="ghost">{job?.jobtype}</Badge>
                <Badge className={'text-[#7209b7] font-bold text-xs'} variant="ghost">{job?.salary}LPA</Badge>
            </div>
        </div>

    )
}
export default LatestJobCards