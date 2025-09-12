import { useForm } from "react-hook-form"
import { registerUserService } from "@/service/userService"
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Signup = () => {
    // usamos useForm 
    const { register, handleSubmit, formState: { errors } } = useForm();
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
        <div className="max-w-md mx-auto mt-16 p-10 bg-white rounded-xl shadow-xl border border-gray-200">
            <h2 className="text-4xl font-bold mb-8 text-center text-gray-800">
                <span className="inline-flex items-center justify-center gap-2">
                    Crear Cuenta
                </span>
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-600 mb-1">
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
                    <label htmlFor="password" className="block text-sm font-medium text-gray-600 mb-1">
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

                <button
                    type="submit"
                    className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition duration-200"
                >
                    Registrarse
                </button>
            </form>
        </div>
    );
}

export default Signup