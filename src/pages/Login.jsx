import { useForm } from "react-hook-form";
import { loginUserService } from "@/service/userService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@/hooks/useAuthContext";

const Login = () => {
    // usamos useForm
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const navigate = useNavigate();
    const { login } = useAuthContext();

    const onSubmit = async (data) => {
        console.log("datos a enviar:", data);
        try {
            // esperamos a que el servicio de login se resuelva
            const response = await loginUserService(data);
            if (response.status === 200) {
                login(response.data.token); // utilizar el login del contexto y decodificar el token en  el navegador
                toast.success("🎉 Usuario autenticado exitosamente");
                navigate("/");
            } else {
                // si no es status 200, muestra un mensaje de error
                toast.error("❌ Error al iniciar sesión, intenta de nuevo.");
            }
        } catch (error) {
            console.log("Ocurrio un error en login:", error);
            toast.error("Hubo un problema al iniciar sesión");
        }
    };

    return (
        <div className="max-w-lg mx-auto mt-16 p-10 bg-white rounded-xl shadow-2xl border border-gray-100">
            <h2 className="text-4xl font-bold mb-8 text-center text-gray-800">
                <span className="inline-flex items-center justify-center gap-2">
                    Iniciar Sesión
                </span>
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                    <label htmlFor="email" className="block text-gray-600 text-sm font-medium mb-2">
                        Correo electrónico
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Correo electrónico"
                        className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition ease-in-out duration-200"
                        {...register("email", { required: "El correo electrónico es obligatorio" })}
                    />
                    {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
                </div>

                <div>
                    <label htmlFor="password" className="block text-gray-600 text-sm font-medium mb-2">
                        Contraseña
                    </label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="Contraseña"
                        className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition ease-in-out duration-200"
                        {...register("password", { required: "La contraseña es obligatoria" })}
                    />
                    {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
                </div>

                <div className="flex items-center justify-between">
                    <label className="text-sm text-gray-500">
                        <input type="checkbox" className="mr-2 leading-tight" /> Recordar mi sesión
                    </label>
                    <a href="#" className="text-sm text-indigo-600 hover:text-indigo-700 transition">
                        ¿Olvidaste tu contraseña?
                    </a>
                </div>

                <button
                    type="submit"
                    className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition duration-200"
                >
                    Entrar
                </button>
            </form>

            <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                    ¿No tienes cuenta?{" "}
                    <a href="/signup" className="text-indigo-600 hover:text-indigo-700">
                        Regístrate aquí
                    </a>
                </p>
            </div>
        </div>
    );
};

export default Login;