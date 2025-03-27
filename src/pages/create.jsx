import { useEffect, useState } from "react";
import { createJob, getJobs } from "../services/job";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

export const SKILLS = [
    { value: 'React', label: 'React' },
    { value: 'Node', label: 'Node' },
    { value: 'Express', label: 'Express' },
    { value: 'MongoDB', label: 'MongoDB' },
    { value: 'Django', label: 'Django' },
    { value: 'Flask', label: 'Flask' },
    { value: 'Golang', label: 'Golang' },
    { value: 'Java', label: 'Java' }
];

export default function Create() {
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        companyName: "",
        logoUrl: "",
        jobPosition: "",
        monthlySalary: "",
        jobType: "Full-time",
        remote: "true",
        location: "",
        description: "",
        about: "",
        skills: [],
        information: ""
    });

    useEffect(() => {
        if (id) {
            const fetchJob = async () => {
                try {
                    const response = await getJobs({ id });
                    if (response.status === 200) {
                        setFormData(response.data);
                    }
                } catch (error) {
                    toast.error("Error fetching job details");
                }
            };
            fetchJob();
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value, selectedOptions } = e.target;
        if (name === "skills") {
            const selectedSkills = Array.from(selectedOptions).map((opt) => opt.value);
            setFormData({ ...formData, skills: selectedSkills });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        for (let key in formData) {
            if (!formData[key] || (Array.isArray(formData[key]) && formData[key].length === 0)) {
                toast.error(`Please fill out ${key.replace(/([A-Z])/g, " $1")}`);
                return;
            }
        }
        setLoading(true);
        try {
            const jobId = id || null;
            const response = await createJob({ data: formData, id: jobId });

            if (response.status === 200) {
                toast.success(jobId ? "Job Updated successfully" : "Job Created Successfully");
                setFormData(response.data);
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={containerStyle}>
            <h1 style={headingStyle}>{id ? "Update Job" : "Create Job"}</h1>

            <form onSubmit={handleSubmit} style={formStyle}>
                <div style={fieldGroupStyle}>
                    <input onChange={handleChange} value={formData.companyName} type="text" name="companyName" placeholder="Company Name" required style={inputStyle} />
                    <input onChange={handleChange} value={formData.logoUrl} type="text" name="logoUrl" placeholder="Logo URL" required style={inputStyle} />
                </div>

                <div style={fieldGroupStyle}>
                    <input onChange={handleChange} value={formData.jobPosition} type="text" name="jobPosition" placeholder="Job Position" required style={inputStyle} />
                    <input onChange={handleChange} value={formData.monthlySalary} type="text" name="monthlySalary" placeholder="Monthly Salary" required style={inputStyle} />
                </div>

                <div style={fieldGroupStyle}>
                    <select onChange={handleChange} value={formData.jobType} name="jobType" required style={inputStyle}>
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Contract">Contract</option>
                        <option value="Freelance">Freelance</option>
                    </select>

                    <select onChange={handleChange} value={formData.remote} name="remote" required style={inputStyle}>
                        <option value="true">Remote - YES</option>
                        <option value="false">Remote - NO</option>
                    </select>
                </div>

                <input onChange={handleChange} value={formData.location} type="text" name="location" placeholder="Location" required style={inputStyle} />

                <textarea onChange={handleChange} value={formData.description} name="description" placeholder="Job Description" required style={textareaStyle}></textarea>
                <textarea onChange={handleChange} value={formData.about} name="about" placeholder="About the Job" required style={textareaStyle}></textarea>

                <select onChange={handleChange} name="skills" multiple required style={inputStyle}>
                    {SKILLS.map((skill, idx) => (
                        <option key={idx} value={skill.value} selected={formData.skills.includes(skill.value)}>{skill.label}</option>
                    ))}
                </select>

                <input onChange={handleChange} value={formData.information} type="text" name="information" placeholder="Additional Information" required style={inputStyle} />

                <button disabled={loading} type="submit" style={loading ? buttonDisabledStyle : buttonStyle}>
                    {loading ? "Processing..." : id ? "Update Job" : "Create Job"}
                </button>
            </form>
        </div>
    );
}

// Styling
const containerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "auto",
    backgroundColor: "#f4f4f4",
    padding: "20px"
};

const headingStyle = {
    fontSize: "22px",
    marginBottom: "15px",
    color: "#333"
};

const formStyle = {
    display: "flex",
    flexDirection: "column",
    width: "60%",
    gap: "10px",
    background: "white",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0px 4px 8px rgba(0,0,0,0.1)"
};

const fieldGroupStyle = {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: "10px"
};

const inputStyle = {
    width: "calc(50% - 5px)",
    padding: "8px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "14px"
};

const textareaStyle = {
    width: "100%",
    padding: "8px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "14px",
    minHeight: "60px"
};

const buttonStyle = {
    padding: "10px",
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "5px",
    fontSize: "14px",
    cursor: "pointer",
    transition: "background 0.3s ease"
};

const buttonDisabledStyle = {
    ...buttonStyle,
    backgroundColor: "#ccc",
    cursor: "not-allowed"
};
