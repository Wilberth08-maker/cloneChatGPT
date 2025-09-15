import { useDarkMode } from "../context/DarkModeContext"
import { useChatContext } from '../hooks/useChatContext';

const AuthModal = () => {
    const { darkMode, setDarkMode } = useDarkMode();

    const {
        cancelDelete,
        confirmDelete,
        chats,
        chatIdToDelete,
    } = useChatContext();

    const chatToDelete = chats.find(chat => chat.id === chatIdToDelete);

    return (
        <>
            <div className="fixed inset-0 bg-gray-900 bg-opacity-25 flex items-center justify-center p-4 z-50 dark:bg-opacity-80">
                <div className="bg-gray-50 rounded-xl shadow-xl p-6 sm:p-8 w-full max-w-sm text-center dark:bg-gray-800 dark:text-gray-200">
                    <p className="text-gray-800 dark:text-gray-100 p-2">¿Deseas eliminar el chat?</p>
                    <p className="p-4"> Esto eliminará <strong>{chatToDelete?.title || "este chat"}</strong></p>
                    <div className="flex justify-center space-x-3 p-2">
                        <button
                            onClick={cancelDelete}
                            className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={confirmDelete}
                            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                        >
                            Eliminar
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AuthModal
