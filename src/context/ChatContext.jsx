import { createContext, useState, useEffect, useContext, useCallback, useRef } from 'react';
import { AuthContext } from './AuthContext';

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const [chats, setChats] = useState([]);
    const [currentChatID, setCurrentChatID] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [skipNextSync, setSkipNextSync] = useState(false);

    const [messageCount, setMessageCount] = useState(0);
    const [isBlocked, setIsBlocked] = useState(false);
    const { isAuth, authToken } = useContext(AuthContext);

    const API_BASE_URL = 'http://localhost:5000/api';

    const authHeaders = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
    };

    useEffect(() => {
        if (isAuth) {
            setIsBlocked(false);
        }
    }, [isAuth]);


    const fetchChats = useCallback(async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/chats`, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                }
            });

            if (!response.ok) throw new Error('Error al cargar chats');

            const data = await response.json();

            setChats(data);

            // Selecciona el primer chat si el chat actual ya no existe
            if (data.length > 0) {
                setCurrentChatID(prevId => {
                    // Solo actualiza si el chat actual no está en la lista
                    if (prevId === null || !data.some(chat => chat.id === prevId)) {
                        return data[0].id;
                    }
                    return prevId;
                });
            } else {
                setCurrentChatID(null);
                setMessages([]);
            }
        } catch (error) {
            console.error("Error al obtener los chats:", error);
            // Si no se pueden cargar los chats, muestra un mensaje de error
            if (chats.length === 0 && isAuth) {
                setMessages([{ role: 'assistant', content: "No se pudieron cargar los chats existentes." }]);
            }
        }
    }, [API_BASE_URL, chats.length]);

    useEffect(() => {
        if (isAuth && authToken) {
            fetchChats();
            // Esperar que los chats se actualicen
            setMessages([]);
            setSkipNextSync(false);
        }
    }, [fetchChats, isAuth, authToken]);

    // Sincroniza los mensajes del chat actual con el estado local.
    // Si skipNextSync está activo, evita sincronizar innecesariamente una vez.
    useEffect(() => {

        // Si skipNextSync es true, evita la sincronización completa y solo actualiza mensajes una vez, sin sobrescribirlos.
        if (skipNextSync) {
            setSkipNextSync(true);

            const chat = chats.find(c => c.id === currentChatID);
            if (chat && chat.messages && chat.messages.some(m => m.content !== '')) {
                setMessages(chat.messages);
            }
            return;
        }

        // Si no hay un chat actual limpia los mensajes
        if (!currentChatID) {
            setMessages([]);
            return;
        }

        const chat = chats.find(c => c.id === currentChatID);

        if (!chat || !chat.messages) return;

        // Carga los mensajes del chat actual
        setMessages(chat.messages);

    }, [currentChatID, chats, skipNextSync]);



    // Maneja el envío de mensajes
    const handleSendMessage = async () => {
        if (input.trim() === "") return;

        // Maneja el conteo de mensajes y bloqueo si no está autenticado
        if (isBlocked) return;

        // Verifica si el usuario no está autenticado y ya envió 3 mensajes
        if (!isAuth && messageCount >= 3) {
            setIsBlocked(true);

            const authPrompt = {
                role: 'assistant',
                content: "🛑 Has alcanzado el límite de mensajes. Para continuar, inicia sesión o regístrate.",
                authRequired: true
            };

            setMessages(prev => [...prev, authPrompt]);
            return;
        }
        const userMessageContent = input.trim();
        const newUserMessage = { role: 'user', content: userMessageContent };
        // Función para animar texto tipo máquina de escribir
        const typeWriterEffect = (fullText, callback) => {
            let index = 0;
            const interval = setInterval(() => {
                callback(fullText.slice(0, index + 1));
                index++;
                if (index === fullText.length) {
                    clearInterval(interval);
                }
            }, 10); // velocidad en ms
        };

        // Agrega el mensaje del usuario y una respuesta vacía del asistente.
        setMessages(prevMessages => [...prevMessages, newUserMessage, { role: 'assistant', content: '' }]);
        setSkipNextSync(true);
        setInput("");
        setIsLoading(true);

        let chatIdToUse = currentChatID;
        let newChatCreated = false;

        try {
            // 1. Si no hay chat seleccionado, crea uno nuevo
            if (!chatIdToUse) {
                try {
                    if (isAuth) {
                        const response = await fetch(`${API_BASE_URL}/chats`, {
                            method: 'POST',
                            headers: authHeaders,
                            body: JSON.stringify({ title: newUserMessage.content.substring(0, 30) + (newUserMessage.content.length > 30 ? '...' : '') }),
                        });

                        if (!response.ok) throw new Error('Error al crear nuevo chat en backend');

                        const newChat = await response.json();

                        // Asigna el ID del nuevo chat
                        chatIdToUse = newChat.id;

                        newChatCreated = true;

                        // Añade el nuevo chat en la parte superior de la lista, 
                        // con el mensaje del usuario y una respuesta vacía del asistente.
                        setChats(prevChats => [{
                            ...newChat,
                            messages: [newUserMessage, { role: 'assistant', content: '' }]
                        }, ...prevChats]);

                        setCurrentChatID(chatIdToUse);
                    } else {
                        // 👤 Invitado → crea chat temporal solo en frontend
                        chatIdToUse = `guest-${Date.now()}`;
                        newChatCreated = true;

                        const tempChat = {
                            id: chatIdToUse,
                            title: newUserMessage.content.substring(0, 30) + (newUserMessage.content.length > 30 ? '...' : ''),
                            messages: [newUserMessage, { role: 'assistant', content: '' }],
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString(),
                        };

                        setChats(prevChats => [tempChat, ...prevChats]);
                        setCurrentChatID(chatIdToUse);
                    }
                } catch (error) {
                    console.error("Error creando nuevo chat:", error);
                    setIsLoading(false);
                    setMessages(prevMessages => {
                        // Filtra el mensaje del usuario y el placeholder temporal
                        const filteredMessages = prevMessages.filter(msg => msg !== newUserMessage && msg.content !== '...');
                        return [...filteredMessages, { role: 'assistant', content: "Lo siento, no se pudo crear un nuevo chat. Por favor, inténtalo de nuevo." }];
                    });
                    return;
                }
            }
            // 2. Prepara el mensaje del usuario para enviar a la IA
            // Si es un nuevo chat, solo envía el mensaje del usuario
            // Si es un chat existente, envía el historial de mensajes
            const messagesForIA = newChatCreated
                ? [newUserMessage]
                : [...messages.filter(msg => msg.content !== '...'), newUserMessage];


            // 2. Enviar el mensaje del usuario al backend
            const response = await fetch(`${API_BASE_URL}/chat`, {
                method: 'POST',
                headers: authHeaders,
                body: JSON.stringify({
                    chatId: chatIdToUse, // Envía el ID del chat
                    messages: messagesForIA // Envía todo el historial
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Error en la respuesta de la IA desde el backend: ${errorData.error || response.statusText}`);
            }

            const data = await response.json();
            const aiMessage = { role: 'assistant', content: data.reply };

            //Actualizar el estado 'chats' directamente con la respuesta de la IA.
            setChats(prevChats => {
                return prevChats.map(chat =>
                    chat.id === chatIdToUse
                        ? { ...chat, messages: [...messagesForIA, aiMessage], updatedAt: new Date().toISOString() }
                        : chat
                );
            });

            // Incrementa el contador de mensajes si el usuario no está autenticado
            setMessageCount(prev => prev + 1);

            typeWriterEffect(data.reply, (partialText) => {
                setChats(prevChats => prevChats.map(chat =>
                    chat.id === chatIdToUse
                        ? {
                            ...chat,
                            messages: chat.messages.map((msg, i) =>
                                i === chat.messages.length - 1
                                    ? { ...msg, content: partialText }
                                    : msg
                            )
                        }
                        : chat
                ));
            });

        } catch (error) {
            console.error("Error al comunicarse con la IA o guardar chat:", error);
            setMessages(prevMessages => {
                // Reemplaza el placeholder o añade el mensaje de error
                const updated = prevMessages.filter(msg => msg.content !== '...');
                return [...updated, { role: 'assistant', content: "Lo siento, hubo un error al obtener la respuesta. Por favor, inténtalo de nuevo." }];
            });
            await fetchChats();
        } finally {
            setIsLoading(false);
        }
    };

    // Maneja la creación de un nuevo chat
    const handleNewChat = () => {
        setCurrentChatID(null);
        setMessages([]);
        setInput("");
    }

    // Maneja la selección de un chat
    const handleChatSelect = (chatId) => {
        setCurrentChatID(chatId);
        setInput("");
    }

    // Maneja la eliminación de un chat
    const handleDeleteChat = async (chatIdToDelete) => {
        if (!window.confirm('¿Estás seguro de que quieres eliminar este chat?')) {
            return;
        }

        if (!isAuth) return;

        try {
            const response = await fetch(`${API_BASE_URL}/chats/${chatIdToDelete}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${authToken}`,
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Error al eliminar chat: ${errorData.error || response.statusText}`);
            }

            await fetchChats(); // Refresca la lista de chats después de eliminar

        } catch (error) {
            console.error("Error al eliminar chat:", error);
            setMessages(prevMessages => [...prevMessages, { role: 'assistant', content: `No se pudo eliminar el chat: ${error.message}` }]);
        }
    };

    // CONSTANTES PARA MANEJAR EL ESTADO DE LOS SIDEBAR
    const [isCompact, setIsCompact] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    // CONSTANTE PARA MANEJAR EL ESTADO DEL SEARCHMENU
    const [isMenuSearchOpen, setIsMenuSearchOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const searchRef = useRef(null);

    const chatProps = {
        chats,
        currentChatID,
        messages,
        input,
        isLoading,
        isBlocked,
        isAuth,
        messageCount,
        setChats,
        setCurrentChatID,
        setMessages,
        setInput,
        setIsLoading,
        handleSendMessage,
        handleNewChat,
        handleChatSelect,
        handleDeleteChat,
        isCompact,
        setIsCompact,
        isMobileOpen,
        setIsMobileOpen,
        isMenuSearchOpen,
        setIsMenuSearchOpen,
        searchTerm,
        setSearchTerm,
        searchRef
    }

    return (
        <ChatContext.Provider value={chatProps}>
            {children}
        </ChatContext.Provider>
    )
}

export default ChatContext
