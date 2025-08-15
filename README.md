Aplicación de Chat con React y Backend
Este proyecto es una aplicación de chat web con una interfaz de usuario moderna construida con React y un backend simple para gestionar la persistencia de los chats. La aplicación permite a los usuarios iniciar nuevos chats, enviar mensajes y ver un historial de conversaciones.

Características
Interfaz de Usuario Responsiva: La aplicación se adapta a diferentes tamaños de pantalla.

Gestión de Chats: Los usuarios pueden ver la lista de chats existentes, seleccionar uno para ver su historial y eliminar chats.

Envío de Mensajes: Envía mensajes al backend para su procesamiento.

Persistencia de Datos: El backend guarda el historial de chats y mensajes, permitiendo que las conversaciones persistan entre sesiones.

Estructura del Proyecto
El proyecto está dividido en dos partes principales:

Frontend (React)
src/App.js: El componente principal de la aplicación que gestiona el estado global (chats, mensajes, etc.) y la lógica de negocio (enviar mensajes, cargar chats).

src/components/SideBar.js: Componente para mostrar la lista de chats y permitir la selección o eliminación de los mismos.

src/components/Chats.js: Componente para mostrar los mensajes de la conversación actual y el campo de entrada de texto.

Backend (servidor)
Gestiona las rutas API para crear, leer, actualizar y eliminar chats.

Se encarga de procesar los mensajes y simular una respuesta de "IA".

Maneja la persistencia de los datos del chat.

Cómo Empezar
Sigue estos pasos para poner en marcha el proyecto en tu máquina local.

Prerrequisitos
Node.js y npm instalados.

1. Clonar el Repositorio
Bash

git clone https://github.com/Wilberth08-maker/cloneChatGPT.git
cd cloneChatGPT
2. Configurar el Backend
Navega a la carpeta de tu backend (si está separada).

Instala las dependencias:

Bash

npm install
Inicia el servidor de backend:

Bash

node server.js
El servidor se ejecutará en http://localhost:5000.

3. Configurar el Frontend
Asegúrate de estar en la carpeta raíz del proyecto.

Instala las dependencias de React:

Bash

npm install
Inicia la aplicación de React:

Bash

npm start
La aplicación se abrirá en http://localhost:3000.

Código Relevante
El corazón de la aplicación se encuentra en el componente src/App.js. A continuación, se describen las funciones y los estados más importantes:

Estados Principales
chats: Un array que almacena la lista de todos los chats.

currentChatID: El ID del chat que se está mostrando en el panel de conversación. Es null si no hay un chat seleccionado.

messages: Un array que contiene los mensajes del chat actual.

input: El texto del mensaje que el usuario está escribiendo.

isLoading: Un booleano que indica si la aplicación está esperando una respuesta del backend (ej. de la "IA").

Funciones Clave
fetchChats(): Función asíncrona que se encarga de cargar la lista de chats desde el backend.

handleSendMessage(): La función más compleja. Se activa al enviar un mensaje y realiza lo siguiente:

Crea un nuevo chat en el backend si no hay un currentChatID seleccionado.

Envía el mensaje del usuario y el historial completo al backend.

Maneja la respuesta del backend ("IA") y actualiza los mensajes en la UI.

Actualiza el chat en el backend para guardar el nuevo historial completo.

handleNewChat(): Reinicia el estado de la UI para que el usuario pueda empezar una nueva conversación.

handleChatSelect(chatId): Actualiza currentChatID para cargar los mensajes de un chat específico.

handleDeleteChat(chatId): Envía una solicitud al backend para eliminar un chat y actualiza la lista de chats en la UI.

Notas de Desarrollo
Flujo de Datos Unidireccional: El estado principal de la aplicación reside en el componente App, y los datos se pasan a los componentes hijos (SideBar y Chats) a través de las props.

Manejo de Errores: La aplicación utiliza bloques try...catch en las funciones asíncronas para gestionar posibles errores.

Asincronía con async/await: Todas las operaciones de red se gestionan con la sintaxis async/await para un código más legible y secuencial.