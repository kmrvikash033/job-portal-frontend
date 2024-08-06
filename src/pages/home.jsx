import React,{useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import { deleteJob, getJobs } from "../services/job";
import { verifyToken } from "../utils/auth";
import toast from "react-hot-toast";
import { SKILLS } from "./create";
function Home(){
    const [jobs, setJobs] = useState([]);
    const [filterJobs, setFilterJobs] = useState([])
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [authLoading, setAuthLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [skills, setSkills] = useState(null);
    const [search, setSearch] = useState('');
    const handleSearch = (e)=>{
        setSearch(e.target.value);
        setFilterJobs( jobs.filter((job)=>{
            return job.jobPosition.includes(e.target.value)||job.companyName.includes(e.target.value) || job.description.includes(e.target.value);
        }))
    }
    const handleDelete=async(id)=>{
        try{
            const response = await deleteJob(id);
            if(response.status===200){
                toast.success('Job deleted successfully');
                fetchJobs();
            }
        }
        catch(error){
            toast.error('Job deletion failed')
        }
    }
    const fetchJobs = async({skills}) =>{
        setLoading(true)
        const response = await getJobs({id:null, skills: skills});
        if(response.status === 200){
            setJobs(response.data);
            setFilterJobs(response.data);
        }
        setLoading(false);
    }
    useEffect(()=>{
        
        const fetchUser = async() =>{
            const response = await verifyToken();
            console.log(response)
            if(response.status === 200){
                setUser(response.data);
            }
            setAuthLoading(false)
        }
        
        fetchUser();
        fetchJobs({skills:null});
    },[])

    const handleSkillChange = (skill)=>{
        setSkills((prev)=> {
            if(!prev){
                return [skill]
            }
            return prev.includes(skill)? prev.filter((s) => s !== skill) : [...prev, skill];
        })
    }
    return (
        <div>
          <h1>Home</h1>
          <input type="text" placeholder="Search" value={search} onChange={handleSearch} />
          <select onChange={(e) => handleSkillChange(e.target.value)} >
                {SKILLS.map((skill) => {
                    return <option onSelect={() => handleSkillChange(skill.value)} key={skill} value={skill.value}>{skill.label}</option>
                })}
          </select>
          {skills && skills.map((skill)=>{
            return <span style={{marginRight: '10px'}} key={skill}>{skill} </span>
          })}
          <button disabled={skills === null} onClick={()=>fetchJobs({skills})}>Apply Filter</button>
          <button onClick={() =>{fetchJobs({ skills: null }); setSkills(null)} }>Clear Filters</button>
            {loading ? <h2>loading......</h2>:filterJobs.map((job)=>{
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
                            {authLoading || user===null ? <button disabled>Delete</button>:<button onClick={()=>handleDelete(job._id)}>Delete</button>}
                        </div>
                    
                    
                )
            })}
        </div>
    )
}

export default Home;