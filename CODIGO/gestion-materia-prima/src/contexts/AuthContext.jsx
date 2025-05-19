import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import authService  from "../services/authService";


export const AuthContext = createContext();


export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = () => {
            try{
                const userData = authService.getUserData();
                const token = authService.getToken();

                if (userData && token) {
                    setUser(userData);
                    setIsAuthenticated(true);
                }
            }catch (error) {
                console.error('Error al verificar la autenticación:', error);
                authService.logout();
            }finally{
                setLoading(false);
            }
        };
        checkAuth();
    }, []);

    const login = async (email, password) => {
        try {
           const data = await authService.login(email, password);

           if (!data.success) {
                return {
                     success: false, 
                     message: data.message || "Error al iniciar sesión",
                     errorType: data.errorType || 'Uknown'};
            }

            authService.setUserData(data.usuario, data.token);

            setUser(data.usuario);
            setIsAuthenticated(true);

            return { success: true, message: 'Inicio de sesión exitoso' };
        } catch (error) {
            console.error('Error en la solicitud de login:', error);
            return { success: false, message: 'Error al iniciar sesion' };
        }
    };

    const logout = () => {
        authService.logout();
        setUser(null);
        setIsAuthenticated(false);
        navigate("/login");
    };

    const contextValue = {
        user,
        isAuthenticated,
        loading,
        login,
        logout
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="loader"></div>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}