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
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: 'auto' }}>
    <h1 style={{ textAlign: 'center', color: '#333' }}>Job</h1>

    {loading ? (
        <h1 style={{ textAlign: 'center', color: '#555' }}>Loading...</h1>
    ) : (
        <div 
            style={{ 
                border: '1px solid #ddd', 
                borderRadius: '10px', 
                padding: '20px', 
                boxShadow: '2px 2px 10px rgba(0,0,0,0.1)', 
                backgroundColor: '#fff' 
            }}
        >
            <h1 style={{ color: '#007bff' }}>{job.jobPosition}</h1>
            <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#333' }}>{job.companyName}</p>
            <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#28a745' }}>₹{job.monthlySalary}</p>
            <p style={{ color: '#555', lineHeight: '1.5' }}>{job.description}</p>

            <div style={{ marginBottom: '10px' }}>
                {job.skills && job.skills.map((skill) => (
                    <span 
                        style={{ 
                            display: 'inline-block', 
                            padding: '5px 10px', 
                            marginRight: '10px', 
                            backgroundColor: '#17a2b8', 
                            color: '#fff', 
                            borderRadius: '10px', 
                            fontSize: '14px' 
                        }} 
                        key={skill}
                    >
                        {skill}
                    </span>
                ))}
            </div>

            <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#555' }}>Job Type: {job.jobType}</p>
            <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#555' }}>Location: {job.location}</p>
            <p style={{ color: '#777', lineHeight: '1.5' }}>{job.about}</p>

            <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#555' }}>
                Type: {job.remote ? <span style={{ color: '#28a745' }}>Work From Home</span> : <span style={{ color: '#dc3545' }}>Work From Office</span>}
            </p>
        </div>
    )}
</div>

    )
}

