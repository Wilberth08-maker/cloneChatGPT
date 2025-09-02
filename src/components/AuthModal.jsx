import { Link } from "react-router-dom"
import { useState } from "react"
import { useDarkMode } from "../context/DarkModeContext"

const AuthModal = () => {
    const [isOpen, setIsOpen] = useState(true);
    const { darkMode, setDarkMode } = useDarkMode();

    const closeAuthModal = () => {
        setIsOpen(false);
    };

    return (
        <>
            {isOpen && (
                <div class="fixed inset-0 bg-gray-900 bg-opacity-25 flex items-center justify-center p-4 z-50 dark:bg-opacity-80">
                    <div class="bg-gray-50 rounded-xl shadow-xl p-6 sm:p-8 w-full max-w-sm text-center dark:bg-gray-800 dark:text-gray-200">
                        <h3 class="text-xl font-semibold text-gray-900 mb-3 dark:text-gray-100">
                            Gracias por probar ChatGPT
                        </h3>
                        <p class="text-gray-600 mb-6 text-sm dark:text-gray-400">
                            Inicia sesión o suscríbete para obtener respuestas más inteligentes y más.
                        </p>
                        <div class="flex flex-col space-y-3">
                            <Link
                                onClick={closeAuthModal}
                                to="/login"
                                class="w-full bg-gray-800 text-white py-2 px-4 rounded-3xl text-lg font-medium hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition ease-in-out duration-150 !no-underline dark:bg-gray-400 dark:text-gray-800 dark:hover:bg-gray-500 dark:focus:ring-gray-500 dark:border dark:border-gray-200"
                            >
                                Iniciar Sesión
                            </Link>
                            <Link
                                onClick={closeAuthModal}
                                to="/signup"
                                class="w-full bg-gray-100 !text-gray-800 py-2 px-4 rounded-3xl text-lg font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50 transition ease-in-out duration-150 border border-gray-300 !no-underline dark:bg-gray-700 dark:!text-gray-200 dark:hover:bg-gray-600 dark:focus:ring-gray-400 dark:border-gray-600"
                            >
                                Suscríbete gratis
                            </Link>
                        </div>
                        <button
                            onClick={closeAuthModal}
                            className="mt-4 text-sm text-gray-500 hover:text-gray-700 transition duration-150 ease-in-out underline"
                        >
                            Mantener la sesión cerrada
                        </button>
                    </div>
                </div>
            )}
        </>
    )
}

export default AuthModal
