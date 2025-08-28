// rutas privadas 
import { Navigate } from "react-router-dom";
import {useAuthContext} from "@/hooks/useAuthContext"

const ProtectedRoute = ({children}) => {
    const {isAuth} = useAuthContext(); // ¿Estás Autenticado?
    return isAuth ? children : <Navigate to="/login" replace/>
}

export default ProtectedRoute