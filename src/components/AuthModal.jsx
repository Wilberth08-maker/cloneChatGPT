import { Link } from "react-router-dom"
import { useState } from "react"

const AuthModal = () => {
    const [isOpen, setIsOpen] = useState(true);

    const closeAuthModal = () => {
        setIsOpen(false);
    };

    return (
        <>
            {isOpen && (
                <div class="fixed inset-0 bg-gray-900 bg-opacity-25 flex items-center justify-center p-4 z-50">
                    <div class="bg-white rounded-lg shadow-xl p-6 sm:p-8 w-full max-w-sm text-center">
                        <div class="mb-5">
                            <svg class="mx-auto h-12 w-12 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                            </svg>
                        </div>
                        <h3 class="text-xl font-semibold text-gray-900 mb-3">
                            Inicia sesión o regístrate para continuar
                        </h3>
                        <p class="text-gray-600 mb-6 text-sm">
                            Accede a todas las funciones y guarda tu progreso.
                        </p>
                        <div class="flex flex-col space-y-3">
                            <Link
                                onClick={closeAuthModal}
                                to="/login"
                                class="w-full bg-blue-600 text-white py-2 px-4 rounded-md text-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition ease-in-out duration-150 !no-underline"
                            >
                                Iniciar Sesión
                            </Link>
                            <Link
                                onClick={closeAuthModal}
                                to="/signup"
                                class="w-full bg-gray-100 text-gray-800 py-2 px-4 rounded-md text-lg font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50 transition ease-in-out duration-150 border border-gray-300 !no-underline"
                            >
                                Registrarse
                            </Link>
                        </div>
                        <button
                            onClick={closeAuthModal}
                            className="mt-4 text-sm text-gray-500 hover:text-gray-700 transition duration-150 ease-in-out"
                        >
                            Quizás más tarde
                        </button>
                    </div>
                </div>
            )}
        </>
    )
}

export default AuthModal
