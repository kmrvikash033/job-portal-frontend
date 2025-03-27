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
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: 'auto' }}>
    <h1 style={{ textAlign: 'center', color: '#333' }}>Home</h1>

    <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input 
            type="text" 
            placeholder="Search" 
            value={search} 
            onChange={handleSearch} 
            style={{ flex: 1, padding: '8px', border: '1px solid #ccc', borderRadius: '5px' }} 
        />
        <select 
            onChange={(e) => handleSkillChange(e.target.value)} 
            style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '5px', cursor: 'pointer' }}
        >
            {SKILLS.map((skill) => (
                <option key={skill} value={skill.value}>{skill.label}</option>
            ))}
        </select>
    </div>

    <div style={{ marginBottom: '10px' }}>
        {skills && skills.map((skill) => (
            <span 
                style={{ 
                    display: 'inline-block', 
                    padding: '5px 10px', 
                    marginRight: '10px', 
                    backgroundColor: '#007bff', 
                    color: '#fff', 
                    borderRadius: '15px', 
                    fontSize: '14px' 
                }} 
                key={skill}
            >
                {skill}
            </span>
        ))}
    </div>

    <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button 
            disabled={skills === null} 
            onClick={() => fetchJobs({ skills })} 
            style={{ 
                padding: '10px 15px', 
                backgroundColor: skills ? '#28a745' : '#ccc', 
                color: '#fff', 
                border: 'none', 
                borderRadius: '5px', 
                cursor: skills ? 'pointer' : 'not-allowed' 
            }}
        >
            Apply Filter
        </button>

        <button 
            onClick={() => { fetchJobs({ skills: null }); setSkills(null) }} 
            style={{ 
                padding: '10px 15px', 
                backgroundColor: '#dc3545', 
                color: '#fff', 
                border: 'none', 
                borderRadius: '5px', 
                cursor: 'pointer' 
            }}
        >
            Clear Filters
        </button>
    </div>

    {loading ? (
        <h2 style={{ textAlign: 'center', color: '#555' }}>Loading...</h2>
    ) : (
        filterJobs.map((job) => (
            <div 
                key={job._id} 
                style={{ 
                    border: '1px solid #ddd', 
                    borderRadius: '10px', 
                    padding: '15px', 
                    marginBottom: '15px', 
                    boxShadow: '2px 2px 10px rgba(0,0,0,0.1)', 
                    backgroundColor: '#fff' 
                }}
            >
                <h2 style={{ color: '#333' }}>{job.jobPosition}</h2>
                <p style={{ fontWeight: 'bold', color: '#007bff' }}>{job.companyName}</p>
                <p style={{ color: '#28a745', fontWeight: 'bold' }}>₹{job.monthlySalary}</p>
                <p style={{ color: '#555' }}>{job.discription}</p>
                
                <div style={{ marginTop: '10px' }}>
                    {job.skills.map((skill) => (
                        <span 
                            key={skill} 
                            style={{ 
                                display: 'inline-block', 
                                padding: '5px 10px', 
                                marginRight: '5px', 
                                backgroundColor: '#17a2b8', 
                                color: '#fff', 
                                borderRadius: '10px', 
                                fontSize: '12px' 
                            }}
                        >
                            {skill}
                        </span>
                    ))}
                </div>

                <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
                    <button 
                        onClick={() => navigate(`/job/${job._id}`)} 
                        style={{ 
                            padding: '8px 12px', 
                            backgroundColor: '#007bff', 
                            color: '#fff', 
                            border: 'none', 
                            borderRadius: '5px', 
                            cursor: 'pointer' 
                        }}
                    >
                        View
                    </button>

                    {authLoading || user === null ? (
                        <button 
                            disabled 
                            style={{ 
                                padding: '8px 12px', 
                                backgroundColor: '#ccc', 
                                color: '#666', 
                                border: 'none', 
                                borderRadius: '5px', 
                                cursor: 'not-allowed' 
                            }}
                        >
                            Edit
                        </button>
                    ) : (
                        <button 
                            onClick={() => navigate(`/edit/${job._id}`)} 
                            style={{ 
                                padding: '8px 12px', 
                                backgroundColor: '#ffc107', 
                                color: '#333', 
                                border: 'none', 
                                borderRadius: '5px', 
                                cursor: 'pointer' 
                            }}
                        >
                            Edit
                        </button>
                    )}

                    {authLoading || user === null ? (
                        <button 
                            disabled 
                            style={{ 
                                padding: '8px 12px', 
                                backgroundColor: '#ccc', 
                                color: '#666', 
                                border: 'none', 
                                borderRadius: '5px', 
                                cursor: 'not-allowed' 
                            }}
                        >
                            Delete
                        </button>
                    ) : (
                        <button 
                            onClick={() => handleDelete(job._id)} 
                            style={{ 
                                padding: '8px 12px', 
                                backgroundColor: '#dc3545', 
                                color: '#fff', 
                                border: 'none', 
                                borderRadius: '5px', 
                                cursor: 'pointer' 
                            }}
                        >
                            Delete
                        </button>
                    )}
                </div>
            </div>
        ))
    )}
</div>

    )
}

export default Home;