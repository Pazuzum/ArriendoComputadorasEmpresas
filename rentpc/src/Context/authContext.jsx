/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";
import { registerAPI, loginAPI, verificarTokenRequest} from "../api/auth";
import Cookies from "js-cookie";
import { logoutAPI } from "../api/auth";

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
            // No iniciar sesión automáticamente: la cuenta queda en estado Inactivo y debe ser activada por un admin
            return { success: true, message: res.data.message, user: res.data.user };
        } catch (error) {
            const resp = error.response?.data;
            if (Array.isArray(resp)) {
                setErrors(resp);
                return { success: false, message: resp.join(', ') };
            }
            if (resp && resp.message) {
                setErrors([resp.message]);
                return { success: false, message: resp.message };
            }
            setErrors([error.message || 'Error de registro']);
            return { success: false, message: error.message || 'Error de registro' };
        }
    };

    
    const signin = async (user) => {
        try {
            const res = await loginAPI(user);
            // Guardar usuario y marcar autenticado
            setUser(res.data);
            setIsAuthenticated(true);
            return { success: true, user: res.data };
        } catch (e) {
            if (e.response) {
                if (e.response.status === 403) {
                    setErrors([e.response.data.message]);
                    setIsAuthenticated(false);
                    setUser(null);
                    return { success: false, message: e.response.data.message };
                }
                if (Array.isArray(e.response.data)) {
                    setErrors(e.response.data);
                    return { success: false, message: e.response.data.join(", ") };
                } else {
                    setErrors([e.response.data.message]);
                    return { success: false, message: e.response.data.message };
                }
            }
        }
    }

    const logout= async()=>{
        try{
            await logoutAPI();
        }catch{
            // ignore
        }
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
            // No podemos leer cookies httpOnly desde JS. Llamamos al endpoint de verificación
            // y dejamos que el navegador envíe la cookie (axios está configurado con withCredentials)
            try{
                const res= await verificarTokenRequest();
                if(!res?.data){
                    setIsAuthenticated(false);
                    setUser(null);
                    setLoading(false);
                    return;
                }

                setIsAuthenticated(true);
                setUser(res.data);
                setLoading(false);
            }catch{
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