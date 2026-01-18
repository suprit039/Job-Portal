import { APPLICATION_API_END_POINT } from "@/utils/constant";
import { Popover } from "../ui/popover"
import { Table, TableBody, TableCaption, TableCell, TableHead,TableHeader } from "../ui/table"
const shortlistingStatus =["Accepted","Rejected"];
const ApplicantsTable = () => {
    const {applicants}= useSelector(store=>store.application);
    const statusHandler = async(status,id)=>{
        try{
            axios.defaults.withCredentials=true;
            const res = await axios.post(`${APPLICATION_API_END_POINT}/status/${id}/update`,{status},{withCredential:true});
            if(res.data.success){
                toast.success(res.data.message);
            }
        }
        catch(error){
            toast.error(error.response.data.message);
        }
    }
  return (
    <div>
      <Table>
        <TableCaption>A list of your recent applied user</TableCaption>
        <TableHeader>
            <TableRow>
                <TableHead>FullName</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Resume</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Action</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {
                applicants && applicants?.applications?.map((item)=>{
                    <tr key={item._id}>
                <TableCell>{item?.applicant?.fullname}</TableCell>
                <TableCell>{item?.applicant?.email}</TableCell>
                <TableCell>{item?.applicant?.phoneNumber}</TableCell>
                <TableCell>
                    {
                        item.applicant?.profile?.resume?<a className="text-blue-600" href={item?.applicant?.profile?.resume} target="_blank"></a>:<span>NA</span>
                    }
                </TableCell>
                <TableCell>{item?.applicant.createdAt.split("T")[0]}</TableCell>
                <TableCell className='font-right cursor-pointer'>
                    <Popover>
                        <PopoverTrigger>
                            <MoreHorizontal/>
                        </PopoverTrigger>
                        <PopoverContent className='w-32'>
                            {
                                shortlistingStatus.map((status,index)=>{
                                    return(
                                        <div key={index} className='flex w-fit items-center my-2 cursor-pointer'>
                                        <span>{status}</span>
                                        </div>
                                    )
                                })
                            }
                        </PopoverContent>
                    </Popover>
                </TableCell>
            </tr>
                })
            }
            
        </TableBody>
      </Table>
    </div>
  )
}

export default ApplicantsTable
