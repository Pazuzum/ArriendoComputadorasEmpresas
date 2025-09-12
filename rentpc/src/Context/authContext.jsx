import { createContext, useContext, useEffect, useState } from "react";
import { registerAPI, loginAPI, verificarTokenRequest} from "../api/auth";
import Cookies from "js-cookie";

const AuthContext = createContext()

export const useAuth=()=>{
    const context= useContext(AuthContext);
    if(!context){
        throw new Error("useAuth puede ser usado dentro de AuthProvider");
    }
    return context;
};

export const AuthProvider = ({children})=>{
    const [user, setUser] = useState(null)
    const [isAuthenticated, setIsAuthenticated]=useState(false);
    const [errors, setErrors] =useState([]);
    const [loading, setLoading] = useState(true);
    
    const signup = async (user) => {
        try {
            const res = await registerAPI(user);
            setUser(res.data); 
            setIsAuthenticated(true);
            return res.data;  
        } catch (error) {
            setErrors(error.response.data);
            return { message: error.response.data?.message || "Error de registro" }; 
        }
    };

    
    const signin = async (user) => {
        try {
            const res = await loginAPI(user);
            console.log(res)
            setUser(res.data);
            setIsAuthenticated(true);
            return res.data;  
        } catch (error) {
            if (error.response) {
                if (error.response.status === 403) {
                    setErrors([error.response.data.message]);
                    setIsAuthenticated(false);
                    setUser(null);
                    return { message: error.response.data.message }; 
                }
                if (Array.isArray(error.response.data)) {
                    setErrors(error.response.data);
                    return { message: error.response.data.join(", ") };
                } else {
                    setErrors([error.response.data.message]);
                    return { message: error.response.data.message };
                }
            } 
        }
    }

    const logout= async(user)=>{
        Cookies.remove("token")
        setIsAuthenticated(false);
        setUser(null)
    }; 

    useEffect(()=>{
        if(errors.length>0){
            const timer= setTimeout(()=>{
                setErrors([])
            }, 3000)
            return ()=> clearTimeout(timer)
        }
    }, [errors])

    useEffect(()=>{
        async function checklogin (){
            const cookies= Cookies.get();
    
            if(!cookies.token){
                setIsAuthenticated(false);
                setLoading(false);
                return setUser(null);
            }
            try{
                const res= await verificarTokenRequest(cookies.token);
                if(!res.data) {
                    setIsAuthenticated(false);
                    setLoading(false);
                    return;
                }

                setIsAuthenticated(true);
                setUser(res.data);
                setLoading(false);
            }catch(error){
                setIsAuthenticated(false);
                setUser(null);
                setLoading(false);
            }
        }
        checklogin();
    }, []);

    return(
        <AuthContext.Provider value={{
            signup,
            user,
            signin,
            logout,
            loading,
            isAuthenticated,
            errors,
        }}>
            {children}
        </AuthContext.Provider>
    );
};