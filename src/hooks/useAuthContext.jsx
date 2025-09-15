import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";

//* Hook personalizado para consumir el contexto de autenticación
export const useAuthContext = () => {
    // guardo mi contexto en una constante 
    const context = useContext(AuthContext) //quiero consumir mi contexto 
    // Valido que el hook esté siendo usando dentro del AuthProvider
    if (!context) {
        throw new Error('useAuthContext debe usarse dentro de AuthProvider')
    }
    return context
}