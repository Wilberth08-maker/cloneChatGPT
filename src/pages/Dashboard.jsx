import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuthContext } from "@/hooks/useAuthContext";
import { useChatContext } from "../hooks/useChatContext";


function Dashboard() {
    const navigate = useNavigate();

    const { logout, userPayload } = useAuthContext();
    const { setChats, setMessages, setInput } = useChatContext();

    const handleLogout = () => {
        toast.info("👋 Sesión cerrada correctamente");
        logout();
        setChats([]); // Limpiar chats al cerrar sesión
        setMessages([]); // Limpiar mensajes al cerrar sesión
        setInput(""); // Limpiar input al cerrar sesión
        navigate("/");
    };

    // Extraer nombre antes del @
    const name = userPayload?.email?.split("@")[0] || "Invitado";

    return (
        <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300 h-full w-full align-center justify-center items-center">

            <div className="max-w-4xl mx-auto px-6 py-8 border border-gray-200 dark:border-gray-700 rounded-xl shadow-md dark:bg-gray-800 align-center justify-center items-center h-full w-full">
                <div className="flex justify-between justify-center items-center mb-6 align-center">
                    <button
                        onClick={() => navigate(-1)}
                        className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                    >
                        ← Regresar
                    </button>

                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 font-medium rounded-lg text-gray-100 bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200 dark:text-gray-200 dark:bg-red-900/75 dark:hover:bg-red-900/50 dark:focus:ring-red-400"
                    >
                        Cerrar Sesión
                    </button>

                </div>

                <h1 className="text-3xl font-bold mb-4">👋 Bienvenido, <span className="text-teal-500">{name}</span></h1>
                <p className="text-lg mb-6">
                    Este es tu panel personal.
                </p>

                <div className="bg-gray-100 dark:bg-gray-600 p-6 rounded-lg shadow-md dark:text-gray-200 ">
                    <h2 className="text-xl font-semibold mb-2">📧 Correo asociado</h2>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{userPayload.email}</p>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
