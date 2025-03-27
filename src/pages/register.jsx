import { useState } from "react";
import { register } from "../services/auth";
import { useNavigate } from "react-router-dom";

function Register() {
    const [userData, setUserData] = useState({
        name: "",
        email: "",
        password: ""
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setUserData({
            ...userData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!userData.name || !userData.email || !userData.password) {
            alert("Please fill in all fields.");
            setLoading(false);  // Reset loading if fields are empty
            return;
        }

        try {
            const { name, email, password } = userData;
            const response = await register({ name, email, password });

            if (response.status === 201) {
                alert("User created successfully!");
                navigate("/login");  // Redirect to login page
            } else {
                alert("Registration failed. Please try again.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Something went wrong. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div 
            style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100vh', 
                backgroundColor: '#f8f9fa' 
            }}
        >
            <div 
                style={{ 
                    width: '380px', 
                    padding: '30px', 
                    backgroundColor: '#fff', 
                    borderRadius: '10px', 
                    boxShadow: '0px 4px 10px rgba(0,0,0,0.1)', 
                    textAlign: 'center' 
                }}
            >
                <h1 style={{ marginBottom: '20px', color: '#333', fontSize: '24px' }}>Create an Account</h1>

                <form 
                    onSubmit={handleSubmit} 
                    style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}
                >
                    <input 
                        name="name" 
                        value={userData.name} 
                        onChange={handleChange} 
                        type="text" 
                        placeholder="Your Name" 
                        style={{ 
                            width: '100%', 
                            padding: '12px', 
                            borderRadius: '5px', 
                            border: '1px solid #ccc', 
                            fontSize: '16px' 
                        }} 
                    />

                    <input 
                        name="email" 
                        value={userData.email} 
                        onChange={handleChange} 
                        type="email" 
                        placeholder="Your Email" 
                        style={{ 
                            width: '100%', 
                            padding: '12px', 
                            borderRadius: '5px', 
                            border: '1px solid #ccc', 
                            fontSize: '16px' 
                        }} 
                    />

                    <input 
                        name="password" 
                        value={userData.password} 
                        onChange={handleChange} 
                        type="password" 
                        placeholder="Your Password" 
                        style={{ 
                            width: '100%', 
                            padding: '12px', 
                            borderRadius: '5px', 
                            border: '1px solid #ccc', 
                            fontSize: '16px' 
                        }} 
                    />

                    <button 
                        disabled={loading} 
                        type="submit" 
                        style={{ 
                            width: '100%', 
                            padding: '12px', 
                            backgroundColor: loading ? '#ccc' : '#28a745', 
                            color: '#fff', 
                            border: 'none', 
                            borderRadius: '5px', 
                            fontSize: '16px', 
                            cursor: loading ? 'not-allowed' : 'pointer', 
                            transition: 'background 0.3s ease' 
                        }}
                    >
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>

                <p style={{ marginTop: '15px', fontSize: '14px', color: '#666' }}>
                    Already have an account? <a href="/login" style={{ color: '#007bff', textDecoration: 'none' }}>Log In</a>
                </p>
            </div>
        </div>
    );
}

export default Register;
