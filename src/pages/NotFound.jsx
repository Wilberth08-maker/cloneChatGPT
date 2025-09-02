import { useDarkMode } from "@/context/DarkModeContext";
const NotFound = () => {
    const { darkMode, setDarkMode } = useDarkMode();
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-800 dark:bg-gray-900 dark:text-gray-200 p-4 sm:p-6 lg:p-8">
            {/* Icono grande de advertencia o de pregunta */}
            <div className="mb-8 text-6xl sm:text-7xl lg:text-8xl text-gray-400 dark:text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.174 3.355 1.945 3.355h12.59c1.77 0 2.81-1.855 1.943-3.356L12.94 2.126c-.525-.97-1.464-.97-1.989 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
            </div>

            {/* Título principal */}
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-center dark:text-white">
                Página no encontrada
            </h1>

            {/* Mensaje descriptivo */}
            <p className="text-lg sm:text-xl text-center max-w-xl mb-8 leading-relaxed dark:text-gray-400">
                Lo sentimos, no pudimos encontrar la página que buscas. Es posible que la dirección sea incorrecta o que la página haya sido eliminada.
            </p>

            {/* Botón para volver al inicio */}
            <a
                href="/"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200 dark:bg-gray-700 dark:hover:bg-gray-800 dark:focus:ring-gray-600"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
                Volver a la página de inicio
            </a>

            {/* Pequeña nota al pie */}
            <p className="mt-12 text-sm text-gray-400 dark:text-gray-600">
                Si crees que esto es un error, por favor, contacta al soporte.
            </p>
        </div>
    );
};

export default NotFound;