import React,{useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import { getJobs } from "../services/job";
import { verifyToken } from "../utils/auth";
function Home(){
    const [jobs, setJobs] = useState([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [authLoading, setAuthLoading] = useState(true);
    const [user, setUser] = useState(null);
    useEffect(()=>{
        const fetchJobs = async() =>{
            setLoading(true)
            const response = await getJobs({id:null});
            if(response.status === 200){
                setJobs(response.data);
            }
            setLoading(false);
        }
        const fetchUser = async() =>{
            const response = await verifyToken();
            console.log(response)
            if(response.status === 200){
                setUser(response.data);
            }
            setAuthLoading(false)
        }
        fetchUser();
        fetchJobs();
    },[])
    return (
        <div>
          <h1>Home</h1>
          
            {loading ? <h2>loading......</h2>:jobs.map((job)=>{
                return (
                    
                        <div key={job._id}>
                            <h2>{job.jobPosition}</h2>
                            <p>{job.companyName}</p>
                            <p>{job.monthlySalary}</p>
                            <p>{job.discription} </p>
                            {job.skills.map((skill)=>{
                                return <span style={{margin: '10px'}} key={skill}>{skill}</span>
                            })}
                            <button onClick={()=> navigate(`/job/${job._id}`)}>View</button>
                            {authLoading || user===null ? <button disabled>Edit</button>:<button onClick={()=>navigate(`/edit/${job._id}`)}>Edit</button>}
                        </div>
                    
                    
                )
            })}
        </div>
    )
}

export default Home;