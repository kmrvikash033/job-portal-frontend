import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/auth";
import toast from "react-hot-toast";

export default function Login() {
    const [userData, setUserData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);  // Check login status
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setIsLoggedIn(true);
        }
    }, []);

    const handleChange = (e) => {
        setUserData({
            ...userData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        if (!userData.email || !userData.password) {
            toast.error("Please enter email and password.");
            setLoading(false);
            return;
        }

        try {
            const { email, password } = userData;
            const response = await login({ email, password });

            if (response.status === 200) {
                const { data } = response;
                localStorage.setItem("token", data.token);
                toast.success("Successfully logged in");
                setIsLoggedIn(true); // Update state after login
            }
        } catch (error) {
            toast.error("Login failed. Please try again.");
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
                backgroundColor: '#f4f4f4' 
            }}
        >
            <div 
                style={{ 
                    width: '350px', 
                    padding: '30px', 
                    backgroundColor: '#fff', 
                    borderRadius: '10px', 
                    boxShadow: '0px 4px 10px rgba(0,0,0,0.1)', 
                    textAlign: 'center' 
                }}
            >
                <h1 style={{ marginBottom: '20px', color: '#333' }}>Login</h1>
                {!isLoggedIn && (<div>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <input 
                            type="email" 
                            name="email" 
                            value={userData.email} 
                            onChange={handleChange} 
                            placeholder="Your email" 
                            style={{ 
                                width: '100%', 
                                padding: '12px', 
                                borderRadius: '5px', 
                                border: '1px solid #ccc', 
                                fontSize: '16px' 
                            }} 
                        />

                        <input 
                            type="password" 
                            name="password" 
                            value={userData.password} 
                            onChange={handleChange} 
                            placeholder="Your password" 
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
                                backgroundColor: loading ? '#ccc' : '#007bff', 
                                color: '#fff', 
                                border: 'none', 
                                borderRadius: '5px', 
                                fontSize: '16px', 
                                cursor: loading ? 'not-allowed' : 'pointer', 
                                transition: 'background 0.3s ease' 
                            }}
                        >
                            {loading ? 'Loading...' : 'Submit'}
                        </button>
                    </form>

                    <p style={{ marginTop: '15px', fontSize: '14px', color: '#666' }}>
                        Don't have an account? <a href="/register" style={{ color: '#007bff', textDecoration: 'none' }}>Sign Up</a>
                    </p>
                </div>)}
                {/* Show Create Button after Login */}
                {isLoggedIn && (
                    <button 
                        onClick={() => navigate("/new")}
                        style={{ 
                            marginTop: '20px', 
                            width: '100%', 
                            padding: '12px', 
                            backgroundColor: '#28a745', 
                            color: '#fff', 
                            border: 'none', 
                            borderRadius: '5px', 
                            fontSize: '16px', 
                            cursor: 'pointer', 
                            transition: 'background 0.3s ease' 
                        }}
                    >
                        Create
                    </button>
                )}
            </div>
        </div>
    );
}
