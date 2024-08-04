import { useState } from "react";
import { login } from "../services/auth";
import toast from "react-hot-toast";

export default function Login(){
    const [userData, setUserData] = useState({
        email: '',
        password: ''
    })
    const [loading, setLoading] = useState(false);
    const handleChange=(e)=>{
       
        setUserData({
            ...userData,
            [e.target.name]: e.target.value
        })
    }
    const handleSubmit=async(e)=>{
        e.preventDefault();
        setLoading(true);
        if(!userData.email || !userData.password){
            return;
        }
        try{
            const {email, password} = userData;
            const response = await login({email,password});
            console.log(response);
            if(response.status === 200){
                const {data} = response;
                localStorage.setItem('token',data.token);
                toast.success('Successfully logedin');
            }
        }
        catch(error){
            toast.error("login failed ");
        }
        finally{
            setLoading(false);
        }
    }
    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <input type="email" name="email" value={userData.email} onChange={handleChange} placeholder="Your email" />
                <input type="password" name="password" value={userData.password} onChange={handleChange} placeholder="Your password" />
                <button disabled={loading} type="submit">Submit</button>
            </form>
        </div>
    );
}