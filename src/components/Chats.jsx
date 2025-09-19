import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDarkMode } from '@/context/DarkModeContext';
import '@/index.css';
import { useChatContext } from '@/hooks/useChatContext';
import { useAuthContext } from '@/hooks/useAuthContext';
import MessageContent from '@/context/MessageContent';
import CopyButton from './CopyButton';

const Chats = ({ onOpenMenu }) => {

    const { logout, userPayload } = useAuthContext();
    const [blockCountdown, setBlockCountdown] = useState("");

    // Extraer nombre antes del @
    const name = userPayload?.email?.split("@")[0] || "Invitado";

    const {
        messages,
        input,
        setInput,
        isLoading,
        handleSendMessage,
        isBlocked,
        isAuth,
        getBlockCountdown,
        setIsBlocked,
        isStreaming,
        handleEditMessage,
        handleNewChat,
    } = useChatContext();

    const messagesEndRef = useRef(null);
    const textareaRef = useRef(null);
    const menuRef = useRef(null)

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { darkMode, setDarkMode } = useDarkMode();

    // Función para hacer scroll al último mensaje
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, isLoading]);

    // Auto-ajustar el tamaño del textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
        }
    }, [input]);

    const handleInputChange = (e) => {
        setInput(e.target.value);
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) { // Si es Enter y NO Shift+Enter
            e.preventDefault(); // Previene el salto de línea por defecto
            if (!isLoading) {
                handleSendMessage(); // Envía el mensaje
            }
        }
    };

    // Efecto para cerrar el menu al hacer click fuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            // Si el menú está abierto Y el clic no fue dentro del menú
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false); // Cierra el menú
            }
        };

        // Si el menú está abierto, añade el listener al documento
        if (isMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        // Función de limpieza (si isMenuOpen cambia a false)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isMenuOpen]);

    // Efecto para actualizar el countdown cada 5 minutos si está bloqueado
    useEffect(() => {
        if (!isBlocked) return;

        const updateCountdown = () => {
            const countdown = getBlockCountdown();
            if (!countdown || countdown.remainingMs <= 0) {
                setIsBlocked(false);
                localStorage.removeItem("guestBlockedUntil");
                setBlockCountdown("");
                return;
            }
            setBlockCountdown(countdown.text);
        };

        updateCountdown(); // inicial
        const interval = setInterval(updateCountdown, 5 * 60 * 1000); // cada 5 minutos

        return () => clearInterval(interval);
    }, [isBlocked]);

    return (
        <>
            <div className=" flex-1 bg-white flex flex-col h-screen dark:bg-gray-900 dark:text-white">
                <div className="flex flex-col h-full dark:bg-gray-900 dark:text-gray-100 ">
                    <div className={`${messages.length > 0 ? "border-b border-gray-100 dark:border-gray-700" : ""} flex items-center justify-between pl-2 pr-2 pt-1.5 pb-1.5 `}>
                        <div className='flex'>
                            <button
                                className="md:hidden p-2 rounded-3xl text-gray-900 transition-colors duration-200 hover:bg-[#ebebeb] dark:text-gray-200 dark:hover:bg-gray-700 hover:bg-gray-100"
                                onClick={onOpenMenu}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
                                </svg>
                            </button>
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="flex items-center justify-between p-1.5 rounded-xl text-gray-900 hover:bg-[#ebebeb] transition-colors duration-200 gap-1 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700">
                                <h1 className="text-lg flex-grow text-center">ChatGPT</h1>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    className="size-4 text-gray-500 dark:text-gray-200"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="m19.5 8.25-7.5 7.5-7.5-7.5"
                                    />
                                </svg>
                            </button>
                        </div>
                        {isMenuOpen && (
                            <div ref={menuRef} className="absolute left-68 top-8 mt-3 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-20 animate-fadeInUp dark:bg-gray-700 dark:border-gray-600">
                                <button
                                    onClick={() => setDarkMode(!darkMode)}
                                    className="block w-full text-left px-4 py-2 rounded-xl transition-colors duration-200 text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                                >
                                    {darkMode ? "Modo Claro" : "Modo Oscuro"}
                                </button>
                            </div>
                        )}
                        {isAuth ? (
                            <>
                                {
                                    messages.length === 0 && (
                                        <button className="flex items-center justify-between p-2 rounded-2xl font-bold text-[#5e5cd1] hover:bg-[#ebebeb] transition-colors duration-200 bg-[#f0f0fa] gap-1 dark:text-gray-200 dark:hover:bg-gray-600 dark:bg-gray-700">
                                            <svg
                                                width="15"
                                                height="15"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="icon-sm"
                                            >
                                                <path d="M17.665 10C17.665 10.6877 17.1785 11.2454 16.5488 11.3945L16.4219 11.4189C14.7098 11.6665 13.6129 12.1305 12.877 12.8623C12.1414 13.5938 11.6742 14.6843 11.4238 16.3887C11.3197 17.0973 10.7182 17.665 9.96484 17.665C9.27085 17.665 8.68836 17.1772 8.53613 16.5215C8.12392 14.7459 7.6623 13.619 6.95703 12.8652C6.31314 12.1772 5.39414 11.7268 3.88672 11.4688L3.57715 11.4199C2.88869 11.319 2.33496 10.734 2.33496 10C2.33496 9.26603 2.88869 8.681 3.57715 8.58008L3.88672 8.53125C5.39414 8.27321 6.31314 7.82277 6.95703 7.13477C7.6623 6.38104 8.12392 5.25413 8.53613 3.47852L8.56934 3.35742C8.76133 2.76356 9.31424 2.33496 9.96484 2.33496C10.7182 2.33497 11.3197 2.9027 11.4238 3.61133L11.5283 4.22266C11.7954 5.58295 12.2334 6.49773 12.877 7.1377C13.6129 7.86952 14.7098 8.33351 16.4219 8.58105C17.1119 8.68101 17.665 9.26667 17.665 10Z"></path>
                                            </svg>
                                            <span className="itemList text-sm flex-grow text-center">
                                                Obtener Plus
                                            </span>
                                        </button>
                                    )
                                }
                                {messages.length === 0 ? (
                                    < button className="group p-2 rounded-3xl transition-colors duration-200 hover:bg-[#ebebeb] dark:text-gray-200 dark:hover:bg-gray-700">
                                        <svg
                                            width="20"
                                            height="20"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                            xmlns="http://www.w3.org/2000/svg"
                                            data-rtl-flip=""
                                            className="h-5 w-5"
                                        >
                                            <path d="M4.52148 15.1664C4.61337 14.8108 4.39951 14.4478 4.04395 14.3559C3.73281 14.2756 3.41605 14.4295 3.28027 14.7074L3.2334 14.8334C3.13026 15.2324 3.0046 15.6297 2.86133 16.0287L2.71289 16.4281C2.63179 16.6393 2.66312 16.8775 2.79688 17.06C2.93067 17.2424 3.14825 17.3443 3.37402 17.3305L3.7793 17.3002C4.62726 17.2265 5.44049 17.0856 6.23438 16.8764C6.84665 17.1788 7.50422 17.4101 8.19434 17.558C8.55329 17.6348 8.9064 17.4062 8.9834 17.0473C9.06036 16.6882 8.83177 16.3342 8.47266 16.2572C7.81451 16.1162 7.19288 15.8862 6.62305 15.5815C6.50913 15.5206 6.38084 15.4946 6.25391 15.5053L6.12793 15.5277C5.53715 15.6955 4.93256 15.819 4.30566 15.9027C4.33677 15.8053 4.36932 15.7081 4.39844 15.6098L4.52148 15.1664Z"></path>
                                            <path d="M15.7998 14.5365C15.5786 14.3039 15.2291 14.2666 14.9668 14.4301L14.8604 14.5131C13.9651 15.3633 12.8166 15.9809 11.5273 16.2572C11.1682 16.3342 10.9396 16.6882 11.0166 17.0473C11.0936 17.4062 11.4467 17.6348 11.8057 17.558C13.2388 17.2509 14.5314 16.5858 15.5713 15.6645L15.7754 15.477C16.0417 15.2241 16.0527 14.8028 15.7998 14.5365Z"></path>
                                            <path d="M2.23828 7.58927C1.97668 8.34847 1.83496 9.15958 1.83496 10.0004C1.835 10.736 1.94324 11.4483 2.14551 12.1234L2.23828 12.4106C2.35793 12.7576 2.73588 12.9421 3.08301 12.8227C3.3867 12.718 3.56625 12.4154 3.52637 12.1088L3.49512 11.977C3.2808 11.3549 3.16508 10.6908 3.16504 10.0004C3.16504 9.30977 3.28072 8.64514 3.49512 8.02286C3.61476 7.67563 3.43024 7.2968 3.08301 7.17716C2.73596 7.05778 2.35799 7.24232 2.23828 7.58927Z"></path>
                                            <path d="M16.917 12.8227C17.2641 12.9421 17.6421 12.7576 17.7617 12.4106C18.0233 11.6515 18.165 10.8411 18.165 10.0004C18.165 9.15958 18.0233 8.34847 17.7617 7.58927C17.642 7.24231 17.264 7.05778 16.917 7.17716C16.5698 7.2968 16.3852 7.67563 16.5049 8.02286C16.7193 8.64514 16.835 9.30977 16.835 10.0004C16.8349 10.6908 16.7192 11.3549 16.5049 11.977C16.3852 12.3242 16.5698 12.703 16.917 12.8227Z"></path>
                                            <path d="M8.9834 2.95255C8.90632 2.59374 8.55322 2.3651 8.19434 2.44181C6.76126 2.74892 5.46855 3.41405 4.42871 4.33536L4.22461 4.52286C3.95829 4.77577 3.94729 5.19697 4.2002 5.46329C4.42146 5.69604 4.77088 5.73328 5.0332 5.56973L5.13965 5.4877C6.03496 4.63748 7.18337 4.0189 8.47266 3.74259C8.83177 3.66563 9.06036 3.31166 8.9834 2.95255Z"></path>
                                            <path d="M15.5713 4.33536C14.5314 3.41405 13.2387 2.74892 11.8057 2.44181C11.4468 2.3651 11.0937 2.59374 11.0166 2.95255C10.9396 3.31166 11.1682 3.66563 11.5273 3.74259C12.7361 4.00163 13.8209 4.56095 14.6895 5.33048L14.8604 5.4877L14.9668 5.56973C15.2291 5.73327 15.5785 5.69604 15.7998 5.46329C16.0211 5.23026 16.0403 4.87903 15.8633 4.6254L15.7754 4.52286L15.5713 4.33536Z"></path>
                                        </svg>
                                    </button>
                                ) : (
                                    < button className="group p-2 rounded-xl transition-colors duration-200 hover:bg-[#ebebeb] dark:text-gray-200 dark:hover:bg-gray-700"
                                        onClick={handleNewChat}
                                        disabled={!isAuth}>
                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="icon" aria-hidden="true"><path d="M2.6687 11.333V8.66699C2.6687 7.74455 2.66841 7.01205 2.71655 6.42285C2.76533 5.82612 2.86699 5.31731 3.10425 4.85156L3.25854 4.57617C3.64272 3.94975 4.19392 3.43995 4.85229 3.10449L5.02905 3.02149C5.44666 2.84233 5.90133 2.75849 6.42358 2.71582C7.01272 2.66769 7.74445 2.66797 8.66675 2.66797H9.16675C9.53393 2.66797 9.83165 2.96586 9.83179 3.33301C9.83179 3.70028 9.53402 3.99805 9.16675 3.99805H8.66675C7.7226 3.99805 7.05438 3.99834 6.53198 4.04102C6.14611 4.07254 5.87277 4.12568 5.65601 4.20313L5.45581 4.28906C5.01645 4.51293 4.64872 4.85345 4.39233 5.27149L4.28979 5.45508C4.16388 5.7022 4.08381 6.01663 4.04175 6.53125C3.99906 7.05373 3.99878 7.7226 3.99878 8.66699V11.333C3.99878 12.2774 3.99906 12.9463 4.04175 13.4688C4.08381 13.9833 4.16389 14.2978 4.28979 14.5449L4.39233 14.7285C4.64871 15.1465 5.01648 15.4871 5.45581 15.7109L5.65601 15.7969C5.87276 15.8743 6.14614 15.9265 6.53198 15.958C7.05439 16.0007 7.72256 16.002 8.66675 16.002H11.3337C12.2779 16.002 12.9461 16.0007 13.4685 15.958C13.9829 15.916 14.2976 15.8367 14.5447 15.7109L14.7292 15.6074C15.147 15.3511 15.4879 14.9841 15.7117 14.5449L15.7976 14.3447C15.8751 14.128 15.9272 13.8546 15.9587 13.4688C16.0014 12.9463 16.0017 12.2774 16.0017 11.333V10.833C16.0018 10.466 16.2997 10.1681 16.6667 10.168C17.0339 10.168 17.3316 10.4659 17.3318 10.833V11.333C17.3318 12.2555 17.3331 12.9879 17.2849 13.5771C17.2422 14.0993 17.1584 14.5541 16.9792 14.9717L16.8962 15.1484C16.5609 15.8066 16.0507 16.3571 15.4246 16.7412L15.1492 16.8955C14.6833 17.1329 14.1739 17.2354 13.5769 17.2842C12.9878 17.3323 12.256 17.332 11.3337 17.332H8.66675C7.74446 17.332 7.01271 17.3323 6.42358 17.2842C5.90135 17.2415 5.44665 17.1577 5.02905 16.9785L4.85229 16.8955C4.19396 16.5601 3.64271 16.0502 3.25854 15.4238L3.10425 15.1484C2.86697 14.6827 2.76534 14.1739 2.71655 13.5771C2.66841 12.9879 2.6687 12.2555 2.6687 11.333ZM13.4646 3.11328C14.4201 2.334 15.8288 2.38969 16.7195 3.28027L16.8865 3.46485C17.6141 4.35685 17.6143 5.64423 16.8865 6.53613L16.7195 6.7207L11.6726 11.7686C11.1373 12.3039 10.4624 12.6746 9.72827 12.8408L9.41089 12.8994L7.59351 13.1582C7.38637 13.1877 7.17701 13.1187 7.02905 12.9707C6.88112 12.8227 6.81199 12.6134 6.84155 12.4063L7.10132 10.5898L7.15991 10.2715C7.3262 9.53749 7.69692 8.86241 8.23218 8.32715L13.2791 3.28027L13.4646 3.11328ZM15.7791 4.2207C15.3753 3.81702 14.7366 3.79124 14.3035 4.14453L14.2195 4.2207L9.17261 9.26856C8.81541 9.62578 8.56774 10.0756 8.45679 10.5654L8.41772 10.7773L8.28296 11.7158L9.22241 11.582L9.43433 11.543C9.92426 11.432 10.3749 11.1844 10.7322 10.8271L15.7791 5.78027L15.8552 5.69629C16.185 5.29194 16.1852 4.708 15.8552 4.30371L15.7791 4.2207Z"></path></svg>
                                    </button>
                                )}
                            </>
                        ) : (
                            <>
                                <div className="gap-1 items-center justify-center hidden md:flex">
                                    <Link
                                        to="/login"
                                        className=" bg-gray-900 py-2 px-4 text-gray-50 hover:text-gray-50 rounded-3xl text-base font-medium focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition ease-in-out duration-150 !no-underline dark:bg-gray-300 dark:text-gray-900   dark:focus:ring-gray-500 dark:border dark:border-gray-200"
                                    >
                                        Iniciar Sesión
                                    </Link>
                                    <Link
                                        to="/signup"
                                        className=" bg-gray-100 !text-gray-800 py-2 px-4 rounded-3xl text-base font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50 transition ease-in-out duration-150 border border-gray-300 !no-underline dark:bg-gray-700 dark:!text-gray-200 dark:hover:bg-gray-600 dark:focus:ring-gray-400 dark:border-gray-600"
                                    >
                                        Suscríbete gratis
                                    </Link>
                                </div>
                            </>
                        )}
                    </div>
                    <div className={`mi-div flex flex-col flex-grow overflow-y-auto p-2 ${messages.length === 0 ? "justify-center items-center pb-5" : "justify-start"} `}>
                        <div className={`chat-scroll flex flex-col items-center overflow-y-auto pb-4 p-2 ${messages.length > 0 ? "flex-grow" : "justify-center"} `}>
                            {messages.length === 0 && (
                                <div className="flex flex-col items-center text-center">
                                    {isAuth ? (
                                        <h1 className="text-3xl font-semibold text-gray-800 dark:text-gray-300">
                                            Hola, <Link to="/dashboard" className="text-blue-600 hover:underline">{name}</Link>. ¿Listo para empezar?
                                        </h1>
                                    ) : (
                                        <h1 className="text-3xl font-semibold text-gray-800 dark:text-gray-300">
                                            Hola. ¿Listo para empezar?
                                        </h1>
                                    )}

                                </div>
                            )}

                            {messages.length > 0 && (
                                <div className="w-full max-w-3xl">
                                    {messages.map((msg, index) => (
                                        <div key={index} className="group">
                                            <MessageContent
                                                role={msg.role}
                                                content={msg.content}
                                                isLoading={isLoading}
                                                isLast={index === messages.length - 1}
                                            />
                                            {
                                                msg.role === 'user' && (
                                                    <div className="flex justify-end pt-0.5">
                                                        <CopyButton text={msg.content} />
                                                        <button
                                                            onClick={() => handleEditMessage(msg.content)}
                                                            className="opacity-0 group-hover:opacity-100 transition-opacity text-sm text-gray-600 p-1.5 rounded-xl transition-colors duration-200 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800 block"
                                                        >
                                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="icon"><path d="M11.3312 3.56837C12.7488 2.28756 14.9376 2.33009 16.3038 3.6963L16.4318 3.83106C17.6712 5.20294 17.6712 7.29708 16.4318 8.66895L16.3038 8.80372L10.0118 15.0947C9.68833 15.4182 9.45378 15.6553 9.22179 15.8457L8.98742 16.0225C8.78227 16.1626 8.56423 16.2832 8.33703 16.3828L8.10753 16.4756C7.92576 16.5422 7.73836 16.5902 7.5216 16.6348L6.75695 16.7705L4.36339 17.169C4.22053 17.1928 4.06908 17.2188 3.94054 17.2285C3.84177 17.236 3.70827 17.2386 3.56261 17.2031L3.41417 17.1543C3.19115 17.0586 3.00741 16.8908 2.89171 16.6797L2.84581 16.5859C2.75951 16.3846 2.76168 16.1912 2.7716 16.0596C2.7813 15.931 2.80736 15.7796 2.83117 15.6367L3.2296 13.2432L3.36437 12.4785C3.40893 12.2616 3.45789 12.0745 3.52453 11.8926L3.6173 11.6621C3.71685 11.4352 3.83766 11.2176 3.97765 11.0127L4.15343 10.7783C4.34386 10.5462 4.58164 10.312 4.90538 9.98829L11.1964 3.6963L11.3312 3.56837ZM5.84581 10.9287C5.49664 11.2779 5.31252 11.4634 5.18663 11.6162L5.07531 11.7627C4.98188 11.8995 4.90151 12.0448 4.83507 12.1963L4.77355 12.3506C4.73321 12.4607 4.70242 12.5761 4.66808 12.7451L4.54113 13.4619L4.14269 15.8555L4.14171 15.8574H4.14464L6.5382 15.458L7.25499 15.332C7.424 15.2977 7.5394 15.2669 7.64953 15.2266L7.80285 15.165C7.95455 15.0986 8.09947 15.0174 8.23644 14.9238L8.3839 14.8135C8.53668 14.6876 8.72225 14.5035 9.0714 14.1543L14.0587 9.16602L10.8331 5.94044L5.84581 10.9287ZM15.3634 4.63673C14.5281 3.80141 13.2057 3.74938 12.3097 4.48048L12.1368 4.63673L11.7735 5.00001L15.0001 8.22559L15.3634 7.86329L15.5196 7.68946C16.2015 6.85326 16.2015 5.64676 15.5196 4.81056L15.3634 4.63673Z"></path></svg>
                                                        </button>
                                                    </div>
                                                )
                                            }
                                        </div>
                                    ))}
                                    <div ref={messagesEndRef} />
                                </div>
                            )}
                        </div>


                        <div className={`w-full max-w-3xl rounded-3xl shadow-sm p-2 border border-gray-100 self-center ${messages.length > 0 ? 'animate-slide-down' : ''} dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700 `}>

                            <div className="relative flex items-center pr-2.5 pb-1 pt-1 dark:bg-gray-900 dark:text-gray-200">
                                <textarea
                                    ref={textareaRef}
                                    type="text"
                                    disabled={isBlocked}
                                    rows="1"
                                    placeholder={isBlocked ? `Debes iniciar sesión para continuar. ${blockCountdown}` : "Pregunta lo que quieras"}
                                    className="chat-scroll w-full py-2 px-3 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none resize-none min-h-[50px] max-h-[156px] overflow-y-auto leading-6 text-base box-border cursor-auto dark:bg-gray-900 dark:text-gray-50"
                                    value={input}
                                    onChange={handleInputChange}
                                    onKeyDown={handleKeyDown}
                                />

                            </div>

                            <div className="flex justify-between items-center space-x-4 dark:text-gray-200 dark:bg-gray-900">
                                <div className="flex space-x-2">
                                    <button className="group p-2 rounded-3xl transition-colors duration-200 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                        </svg>
                                    </button>
                                    <button className="flex items-center justify-between p-2 rounded-3xl hover:bg-gray-100 transition-colors duration-200 gap-1 dark:text-gray-200 dark:hover:bg-gray-700">
                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-label="" className="icon"><path d="M7.91626 11.0013C9.43597 11.0013 10.7053 12.0729 11.011 13.5013H16.6663L16.801 13.515C17.1038 13.5771 17.3311 13.8453 17.3313 14.1663C17.3313 14.4875 17.1038 14.7555 16.801 14.8177L16.6663 14.8314H11.011C10.7056 16.2601 9.43619 17.3314 7.91626 17.3314C6.39643 17.3312 5.1269 16.2601 4.82153 14.8314H3.33325C2.96598 14.8314 2.66821 14.5336 2.66821 14.1663C2.66839 13.7992 2.96609 13.5013 3.33325 13.5013H4.82153C5.12713 12.0729 6.39665 11.0015 7.91626 11.0013ZM7.91626 12.3314C6.90308 12.3316 6.08148 13.1532 6.0813 14.1663C6.0813 15.1797 6.90297 16.0011 7.91626 16.0013C8.9297 16.0013 9.75122 15.1798 9.75122 14.1663C9.75104 13.153 8.92959 12.3314 7.91626 12.3314ZM12.0833 2.66829C13.6031 2.66829 14.8725 3.73966 15.178 5.16829H16.6663L16.801 5.18196C17.1038 5.24414 17.3313 5.51212 17.3313 5.83333C17.3313 6.15454 17.1038 6.42253 16.801 6.4847L16.6663 6.49837H15.178C14.8725 7.92701 13.6031 8.99837 12.0833 8.99837C10.5634 8.99837 9.29405 7.92701 8.98853 6.49837H3.33325C2.96598 6.49837 2.66821 6.2006 2.66821 5.83333C2.66821 5.46606 2.96598 5.16829 3.33325 5.16829H8.98853C9.29405 3.73966 10.5634 2.66829 12.0833 2.66829ZM12.0833 3.99837C11.0698 3.99837 10.2483 4.81989 10.2483 5.83333C10.2483 6.84677 11.0698 7.66829 12.0833 7.66829C13.0967 7.66829 13.9182 6.84677 13.9182 5.83333C13.9182 4.81989 13.0967 3.99837 12.0833 3.99837Z"></path></svg>
                                        <span className="itemList text-sm flex-grow text-center">
                                            Herramientas
                                        </span>
                                    </button>
                                </div>
                                <div className="flex space-x-2">
                                    <button className="group p-2 rounded-3xl transition-colors duration-200 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700">
                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-label="" className="icon" fontSize="inherit"><path d="M15.7806 10.1963C16.1326 10.3011 16.3336 10.6714 16.2288 11.0234L16.1487 11.2725C15.3429 13.6262 13.2236 15.3697 10.6644 15.6299L10.6653 16.835H12.0833L12.2171 16.8486C12.5202 16.9106 12.7484 17.1786 12.7484 17.5C12.7484 17.8214 12.5202 18.0894 12.2171 18.1514L12.0833 18.165H7.91632C7.5492 18.1649 7.25128 17.8672 7.25128 17.5C7.25128 17.1328 7.5492 16.8351 7.91632 16.835H9.33527L9.33429 15.6299C6.775 15.3697 4.6558 13.6262 3.84992 11.2725L3.76984 11.0234L3.74445 10.8906C3.71751 10.5825 3.91011 10.2879 4.21808 10.1963C4.52615 10.1047 4.84769 10.2466 4.99347 10.5195L5.04523 10.6436L5.10871 10.8418C5.8047 12.8745 7.73211 14.335 9.99933 14.335C12.3396 14.3349 14.3179 12.7789 14.9534 10.6436L15.0052 10.5195C15.151 10.2466 15.4725 10.1046 15.7806 10.1963ZM12.2513 5.41699C12.2513 4.17354 11.2437 3.16521 10.0003 3.16504C8.75675 3.16504 7.74835 4.17343 7.74835 5.41699V9.16699C7.74853 10.4104 8.75685 11.418 10.0003 11.418C11.2436 11.4178 12.2511 10.4103 12.2513 9.16699V5.41699ZM13.5814 9.16699C13.5812 11.1448 11.9781 12.7479 10.0003 12.748C8.02232 12.748 6.41845 11.1449 6.41828 9.16699V5.41699C6.41828 3.43889 8.02221 1.83496 10.0003 1.83496C11.9783 1.83514 13.5814 3.439 13.5814 5.41699V9.16699Z"></path></svg>
                                    </button>
                                    {isLoading || isStreaming ? (
                                        <button
                                            className="group p-2 rounded-3xl transition-colors duration-200 bg-gray-200 text-black dark:text-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
                                                <path fillRule="evenodd" d="M4.5 7.5a3 3 0 0 1 3-3h9a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3h-9a3 3 0 0 1-3-3v-9Z" clipRule="evenodd" />
                                            </svg>

                                        </button>
                                    ) : (
                                        <>
                                            {/* Botón de enviar mensaje, si no hay nada en el input muestra botón de audio, si hay algo aparece el botón de enviar */}
                                            <button className={`group p-2 rounded-3xl transition-colors duration-200 hover:bg-gray-100 bg-gray-200 ${input.trim() === '' ? 'hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 ' : 'hidden'}`}>
                                                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="icon"><path d="M7.33496 15.5V4.5C7.33496 4.13275 7.63275 3.83499 8 3.83496C8.36727 3.83496 8.66504 4.13273 8.66504 4.5V15.5C8.66504 15.8673 8.36727 16.165 8 16.165C7.63275 16.165 7.33496 15.8673 7.33496 15.5ZM11.335 13.1309V7.20801C11.335 6.84075 11.6327 6.54298 12 6.54297C12.3673 6.54297 12.665 6.84074 12.665 7.20801V13.1309C12.665 13.4981 12.3672 13.7959 12 13.7959C11.6328 13.7959 11.335 13.4981 11.335 13.1309ZM3.33496 11.3535V8.81543C3.33496 8.44816 3.63273 8.15039 4 8.15039C4.36727 8.15039 4.66504 8.44816 4.66504 8.81543V11.3535C4.66504 11.7208 4.36727 12.0186 4 12.0186C3.63273 12.0186 3.33496 11.7208 3.33496 11.3535ZM15.335 11.3535V8.81543C15.335 8.44816 15.6327 8.15039 16 8.15039C16.3673 8.15039 16.665 8.44816 16.665 8.81543V11.3535C16.665 11.7208 16.3673 12.0186 16 12.0186C15.6327 12.0186 15.335 11.7208 15.335 11.3535Z"></path></svg>
                                            </button>
                                            <button
                                                className={`group p-2 rounded-3xl transition-colors duration-200 ${input.trim() === '' ? 'hidden' : 'bg-black dark:bg-gray-700 text-white'}`}
                                                onClick={handleSendMessage}
                                            >
                                                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="icon"><path d="M8.99992 16V6.41407L5.70696 9.70704C5.31643 10.0976 4.68342 10.0976 4.29289 9.70704C3.90237 9.31652 3.90237 8.6835 4.29289 8.29298L9.29289 3.29298L9.36907 3.22462C9.76184 2.90427 10.3408 2.92686 10.707 3.29298L15.707 8.29298L15.7753 8.36915C16.0957 8.76192 16.0731 9.34092 15.707 9.70704C15.3408 10.0732 14.7618 10.0958 14.3691 9.7754L14.2929 9.70704L10.9999 6.41407V16C10.9999 16.5523 10.5522 17 9.99992 17C9.44764 17 8.99992 16.5523 8.99992 16Z"></path></svg>
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                        {messages.length > 0 && (
                            <div className="text-center text-gray-700 pt-2  text-xs dark:text-gray-600">
                                <p>ChatGPT puede cometer errores. Comprueba la información importante.</p>
                            </div>
                        )}
                    </div>
                </div >

            </div >

        </>
    );
};

export default Chats;
