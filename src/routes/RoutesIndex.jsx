import { Routes, Route } from "react-router-dom"
import Dashboard from "@/pages/Dashboard"
import Login from "@/pages/Login"
import NotFound from "@/pages/NotFound"
import Signup from "@/pages/Signup"
import ProtectedRoute from "./ProtectedRoute"
import Home from "@/pages/Home"

const RoutesIndex = () => {
    return (
        <>
            <Routes>
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    } />
                <Route path="/" element={<Home />} />
                <Route path="/*" element={<NotFound />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
            </Routes>
        </>
    )
}

export default RoutesIndex