import { useEffect, useRef, useState } from 'react';
import { useDarkMode } from '../context/DarkModeContext';
import '../index.css';

const Chats = ({
    messages,
    setMessages,
    input,
    setInput,
    isLoading,
    setIsLoading,
    handleSendMessage, 
    onOpenMenu 
}) => {     

    const messagesEndRef = useRef(null);
    const textareaRef = useRef(null);
    const menuRef = useRef(null)

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const {darkMode, setDarkMode} = useDarkMode();
    

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
                    {messages.length === 0 && (
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
                    )}
                    <button className="group p-2 rounded-3xl transition-colors duration-200 hover:bg-[#ebebeb] dark:text-gray-200 dark:hover:bg-gray-700">
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
                </div>
                <div className={`mi-div flex flex-col flex-grow overflow-y-auto p-2 ${messages.length === 0 ? "justify-center items-center pb-5" : "justify-start"} `}>
                    <div className={`chat-scroll flex flex-col items-center overflow-y-auto pb-4 p-2 ${messages.length > 0 ? "flex-grow" : "justify-center"} `}>
                        {messages.length === 0 && (
                            <div className="flex flex-col items-center text-center">
                                <h1 className="text-3xl font-semibold text-gray-800 dark:text-gray-300">
                                    Hola. ¿Listo para empezar?
                                </h1>
                            </div>
                        )}

                        {messages.length > 0 && (
                        <div className="w-full max-w-3xl space-y-4"> 
                            {messages.map((msg, index) => (

                            <div key={index} 
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div 
                                className={`p-2.5 rounded-3xl ${
                                            msg.role === 'user' ? 'max-w-[70%] bg-[#f5f5f5] text-black dark:text-gray-200 dark:bg-gray-800 ' : 'w-full text-black dark:text-gray-200'
                                        } whitespace-pre-wrap break-words`}>
                                    {msg.content ? (        
                                        <span className='p-2 items-center block '>{msg.content}</span>
                                    ) : isLoading && msg.role === 'assistant' && index === messages.length - 1 ? (
                                        <div className="ml-2 w-3.5 h-3.5 bg-gray-900 rounded-full animate-pulse dark:bg-gray-200"></div>                                                     
                                    ) : null}
                                </div>
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
                                rows="1"
                                placeholder="Pregunta lo que quieras"
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
                                    {isLoading ? (
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
                </div>
                
            </div>
            
        </>
    );
};

export default Chats;
