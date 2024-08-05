import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getJobs } from "../services/job";
export const Job = () =>{
    const {id} = useParams();
    const [job, setJob] = useState({});
    const [loading,setLoading] = useState(true);
    useEffect(()=>{
        const fetchJob = async()=>{
            setLoading(true);
            const response = await getJobs({id});
            if(response.status===200){
                setJob(response.data);
            }
            setLoading(false);
        }
        fetchJob()
    },[])
    return(
        <div>
            <h1>Job</h1>
            {loading ? <h1>Loading....</h1>:(
                <div>
                    <h1>{job.jobPosition}</h1>
                    <p>{job.companyName}</p>
                    <p>{job.monthlySalary}</p>
                    <p>{job.description}</p>
                    {job.skills && job.skills.map((skill)=>{
                        return <span style={{margin: '10px'}} key={skill}>{skill}</span>
                    })}
                    <p>{job.jobType}</p>
                    <p>{job.location}</p>
                    <p>{job.about}</p>
                    <p>
                        Type: 
                        {job.remote?<p>Work From Home</p>:<p>Work From office</p>}
                    </p>
                </div>
            )}
        </div>
    )
}

