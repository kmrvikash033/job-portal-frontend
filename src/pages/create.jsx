import { useState } from "react"
import { createJob } from "../services/job"
import toast from "react-hot-toast"

const SKILLS = [
    {
        value: 'React',
        label: 'React'
    },{
        value: 'Node',
        label: 'Node'
    },{
        value: 'Express',
        label: 'Express'
    },{
        value: 'MongoDB',
        label: 'MongoDB'
    },{
        value: 'Python',
        label: 'Django'
    },{
        value: 'Flask',
        label: 'Flask'
    },{
        value: 'Golang',
        label: 'Golang'
    },{
        value: 'Java',
        label: 'Java'
    }
]


export default function Create(){
    const [formData, setFormData] = useState({
        companyName: null,
        logoUrl: null,
        jobPosition: null,
        monthlySalary: null,
        jobType: null,
        remote: null,
        location: null,
        description: null,
        about: null,
        about: null,
        skills: [],
        information: null
    })
    const handleChange= (e)=>{
        if(e.target.name === 'skills'){
            return setFormData({
                ...formData,
                skills: formData.skills. includes(e.target.value) ? formData.skills.filter
                (skill => skill !== e.target.value) : [...formData.skills,e.target.value]
            })
        }
        setFormData({
            ...formData,
            [e.target.name] : e.target.value
        })
    }

    const handleSubmit= async(e)=>{
        e.preventDefault();
        const data ={...formData};
        data.skills = data.skills.join(',');
        try{
            console.log(data);
            const response = await createJob({data});
            console.log(response);
            if(response.status === 200){
                toast.success('Job Created Successfully')
            }
        }
        catch(error){
            toast.error(error.message);
        }
    }
    
    return (
        <div>
            <h1>Create</h1>
            <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', width: '40%', gap: '10px'}}>
                <input onChange={handleChange} value={formData.companyName} type="text" name="companyName" placeholder="Company Name"/>
                <input onChange={handleChange} value={formData.logoUrl} type="text" name="logoUrl" placeholder="Logo URL" />
                <input onChange={handleChange} value={formData.jobPosition} type="text" name="jobPosition" placeholder="Job Position"/>
                <input onChange={handleChange} value={formData.monthlySalary} type="text" name="monthlySalary" placeholder="Monthly Salary"/>
                <select onChange={handleChange} value={formData.jobType} name="jobType" id="" placeholder="Job Type">
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Freelance">Freelance</option>
                </select>
                <select onChange={handleChange} value={formData.remote} name="remote" id="" placeholder="Remote">
                    <option value="true">YES</option>
                    <option value="false">NO</option>
                </select>
                <input onChange={handleChange} value={formData.location} type="text" name="location" placeholder="Location"/>
                <textarea onChange={handleChange} value={formData.description} name="description" id="" placeholder="Description"></textarea>
                <textarea onChange={handleChange} value={formData.about} name="about" id="" placeholder="About"></textarea>
                <select onChange={handleChange} value={formData.skills} name="skills" multiple>
                    {SKILLS.map((skill, idx) => (
                        <option key={idx} value={skill.value}>{skill.label}</option>
                    ))}
                </select>
                <input onChange={handleChange} value={formData.information} type="text" name="information" placeholder="Information" />
                <button type="submit">Submit</button>
            </form>
        </div>
    )
}