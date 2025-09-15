import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authSchema } from "@/schemas/authSchema";
import { registerUserService } from "@/service/userService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Signup = () => {
    // usamos useForm 
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(authSchema),
    });
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        try {
            const response = await registerUserService(data);
            if (response.status === 201) {
                toast.success("🎉 Usuario registrado exitosamente")
                navigate("/login")
                // reset()
            } else {
                toast.error("❌ Error al registrar usuario.")
            }
        } catch (error) {
            console.log("Ocurrio un error en signup:", error);
            toast.error(error.message || "Error al registrar usuario")
        }
    }


    return (
        <div className="w-full h-full flex justify-center items-center dark:bg-gray-900 transition-colors duration-300">
            <div className="max-w-md w-full mx-auto p-8 rounded-xl shadow-lg bg-gray-50 mt-10 mb-10 md:mt-20 md:mb-20 dark:bg-gray-800 dark:text-gray-100">
                <button
                    onClick={() => navigate(-1)}
                    className="px-3 py-1 mb-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                    </svg>

                </button>
                <h2 className="text-3xl font-extrabold mb-8 text-center text-gray-900 dark:text-white">
                    <span className="inline-flex items-center justify-center gap-2">
                        Crear Cuenta
                    </span>
                </h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block mb-2 font-medium text-gray-700 dark:text-gray-100">
                            Correo electrónico
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="Correo electrónico"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition duration-200 dark:text-gray-100 dark:bg-gray-700"
                            {...register("email", { required: "El correo electrónico es obligatorio" })}
                        />
                        {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
                    </div>

                    <div>
                        <label htmlFor="password" className="block mb-2 font-medium text-gray-700 dark:text-gray-100">
                            Contraseña
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="Contraseña"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition duration-200 dark:text-gray-100 dark:bg-gray-700"
                            {...register("password", { required: "La contraseña es obligatoria" })}
                        />
                        {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 bg-gray-950 text-white rounded-lg font-semibold hover:bg-gray-900 transition-colors duration-300 shadow-md transform focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 dark:bg-gray-600 dark:hover:bg-gray-500"
                    >
                        Registrarse
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Signup