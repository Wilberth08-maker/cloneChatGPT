import './App.css';
import React, { useState, useEffect, useCallback} from 'react';
import SideBar from './components/SideBar';
import Chats from './components/Chats';

function App() {
  const [chats, setChats] = useState([]);
  const [currentChatID, setCurrentChatID] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);  

  const API_BASE_URL = 'http://localhost:5000/api';
  

  const fetchChats = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/chats`);

      if (!response.ok) throw new Error('Error al cargar chats');

      const data = await response.json();
      setChats(data);

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
      if (chats.length === 0) { 
        setMessages([{ role: 'assistant', content: "No se pudieron cargar los chats existentes." }]);
      }
    }
  },[API_BASE_URL, chats.length]);

  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  useEffect(() => {
    if (!currentChatID) {
      setMessages([]);
      return;
    }

    const chat = chats.find(c => c.id === currentChatID);
    if (!chat) return;

    setMessages(prevMessages => {
      // Evita reemplazar si ya hay más mensajes localmente
      if (chat.messages.length > prevMessages.length) {
        return chat.messages;
      }
      return prevMessages;
    });
  }, [currentChatID, chats]);


  // Maneja el envío de mensajes
  const handleSendMessage = async () => {
    if (input.trim() === "") return;
    const userMessageContent = input.trim();
    const newUserMessage = { role: 'user', content: userMessageContent };

    let chatIdToUse = currentChatID;
    let newChatCreated = false;
    
    setMessages(prevMessages => [...prevMessages, newUserMessage]);    
    setInput("");
    setIsLoading(true);

    try {
      // 1. Si no hay chat seleccionado, crea uno nuevo
      if (!chatIdToUse) {
        try {
          const response = await fetch(`${API_BASE_URL}/chats`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: newUserMessage.content.substring(0, 30) + (newUserMessage.content.length > 30 ? '...' : '') }),
          });

          if (!response.ok) throw new Error('Error al crear nuevo chat en backend');

          const newChat = await response.json();
          chatIdToUse = newChat.id;
          await fetchChats();
          setCurrentChatID(chatIdToUse); 
            // setChats(prevChats => [...prevChats, { ...newChat, messages: [newUserMessage] }]);
          setMessages([newUserMessage]); // Inicia el chat con el mensaje del usuario
          newChatCreated = true;
          } catch (error) {
            console.error("Error creando nuevo chat:", error);
            setIsLoading(false);
          setMessages(prevMessages => prevMessages.filter(msg => msg !== newUserMessage));
          setMessages(prevMessages => {
            return [...prevMessages, { role: 'assistant', content: "Lo siento, no se pudo crear un nuevo chat. Por favor, inténtalo de nuevo." }];
          });
            return; // Salir de la función si no se pudo crear el chat
        }
      }

      const messagesForIA = newChatCreated ? [newUserMessage] : [...messages, newUserMessage];

      // 2. Enviar el mensaje del usuario al backend
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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

      setMessages(prevMessages => [...prevMessages, aiMessage]);

      // 3. Actualizar el estado con la respuesta de la IA
      // setMessages(prevMessages => [...prevMessages, aiMessage]);
  
      // 4. Actualiza el chat en el backend con la respuesta de la IA
      // await fetch(`${API_BASE_URL}/chats/${chatIdToUse}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ messages: [...currentMessagesIncludingNewUser, aiMessage] }),
      // });

      await fetchChats(); // Refresca la lista de chats después de enviar el mensaje

      // // Actualiza el estado de chats con el nuevo mensaje
      // setChats(prevChats => prevChats.map(chat =>
      //   chat.id === chatIdToUse
      //     ? { ...chat, messages: [...currentMessagesIncludingNewUser, aiMessage] }
      //     : chat
      // ));

      // 5. Si el título del chat no se ha generado, toma el primer mensaje del usuario
      // if (newChatCreated) {
      //   setChats(prevChats => prevChats.map(chat => {
      //     if (chat.id === chatIdToUse) {
      //       return { ...chat, title: newUserMessage.content.substring(0, 30) + (newUserMessage.content.length > 30 ? '...' : '') };
      //     }
      //     return chat;
      //   }));
      // }     

    } catch (error) {
      console.error("Error al comunicarse con la IA o guardar chat:", error);
      setMessages(prevMessages => {
        return [...prevMessages, { role: 'assistant', content: "Lo siento, hubo un error al obtener la respuesta. Por favor, inténtalo de nuevo." }];
      });
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
  }

  // Maneja la eliminación de un chat
  const handleDeleteChat = async (chatIdToDelete) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este chat?')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/chats/${chatIdToDelete}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error al eliminar chat: ${errorData.error || response.statusText}`);
      }

      await fetchChats(); // Refresca la lista de chats después de eliminar

      // setChats(prevChats => {
      //   const updatedChats = prevChats.filter(chat => chat.id !== chatIdToDelete);
      //   // Si no quedan chats, limpia todo
      //   if (updatedChats.length === 0) {
      //     setCurrentChatID(null);
      //     setMessages([]);
      //   } else if (currentChatID === chatIdToDelete) {
      //     setCurrentChatID(updatedChats.length > 0 ? updatedChats[0].id : null);
      //   }
      //   return updatedChats;
      // });
    } catch (error) {
      console.error("Error al eliminar chat:", error);
      setMessages(prevMessages => [...prevMessages, { role: 'assistant', content: `No se pudo eliminar el chat: ${error.message}` }]);
    }
  };

  


  return (
    <div className="flex h-screen">
        <SideBar
          chats={chats}
          currentChatID={currentChatID}
          onNewChat={handleNewChat}
          onChatSelect={handleChatSelect}
          onDeleteChat={handleDeleteChat}
        />
        
        <Chats 
          messages={messages}
          setMessages={setMessages}
          input={input}
          setInput={setInput}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          handleSendMessage={handleSendMessage}
          currentChatId={currentChatID}
        /> 
    </div>
  );
}

export default App;
