import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode"

//* 1) Crear el contexto de autenticación
const AuthContext = createContext();

//* 2) Provider que envuelve a la app y manejra el estado global de autenticación
function AuthProvider({ children }) {
    const [isAuth, setIsAuth] = useState(false) // ¿Usuario Autenticado?
    const [userPayload, setUserPayload] = useState(null) // Datos decodificados del token 
    const [authToken, setAuthToken] = useState(localStorage.getItem("token")) // Estado para el token

    const login = (token) => {
        try {
            localStorage.setItem("token", token) // guardamos el token en localStorage
            setAuthToken(token) // Actualizamos el estado del token
            const decode = jwtDecode(token) // decodificamos el payload
            //⏱  Verificar expiración (si "exp" existe y está vencido)
            if (decode.exp && decode.exp * 1000 < Date.now()) {
                console.log("El token ha expirado. Cerrando sesión")
                logout()
                return
            }
            setUserPayload(decode)
            setIsAuth(true)
        } catch (error) {
            console.log("Error al decodificar el token durante login:", error)
            logout();
        }
    }

    //* Función para cerrar sesión
    const logout = () => {
        localStorage.removeItem("token")// eliminar token del localStorage
        setUserPayload(null) // limpiar el payload
        setIsAuth(false) // marcar como no autenticado
    }
    //* Efecto al montar: intentar recuperar sesión desde localStorage
    useEffect(() => {
        const token = localStorage.getItem("token")
        if (token) {
            try {
                const decode = jwtDecode(token)
                // verificar expiración al iniciar
                if (decode.exp && decode.exp * 1000 < Date.now()) {
                    console.log("El token ha expirado. Cerrando sesión")
                    logout()
                    return
                }
                setUserPayload(decode)
                setIsAuth(true)
            } catch (error) {
                console.log("Error al decodificar el desde localStorage:", error)
                logout();
            }
        }
    }, [])

    //* Datos compartidos por el contexto
    const data = {
        isAuth, // ¿Usuario Autenticado?
        userPayload,
        login, // función para iniciar sesión
        logout,
        authToken // token de autenticación
    }

    return (
        <AuthContext.Provider value={data}>
            {children}
        </AuthContext.Provider>
    )
}

export { AuthContext, AuthProvider }