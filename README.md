# 🧠 CloneChatGPT — Frontend

Aplicación web de chat inspirada en ChatGPT, desarrollada con React + Vite y una arquitectura moderna, modular y escalable. Este frontend se conecta a un backend Express con Prisma y PostgreSQL para ofrecer una experiencia conversacional fluida, responsiva y persistente.

## 🚀 Tecnologías

- **React + Vite** — SPA con render optimizado
- **TailwindCSS** — Estilización avanzada con keyframes, dark mode y plugins
- **React Context** — Manejo global de estado (auth, chat, tema)
- **React Router DOM** — Rutas públicas y protegidas
- **Zod** — Validación de formularios
- **Axios** — Configuración centralizada de peticiones
- **jwt-decode** — Decodificación de tokens JWT en el cliente
- **React Toastify** — Notificaciones visuales y manejo de errores
- **Vercel** — Despliegue en nube

## 🧱 Estructura del Proyecto

```
src/
├── 🧩 components/        → UI, layout, interacción
├── 🧠 context/           → Auth, Chat, DarkMode
├── 🔁 hooks/             → Custom hooks
├── 📄 pages/             → Login, Signup, Home, etc.
├── 🔐 routes/            → Rutas protegidas/públicas
├── 📜 schemas/           → Validación con Zod
├── 🔧 service/           → Axios config y servicios
├── 🧵 App.jsx            → Componente raíz
└── 🚀 main.jsx          → Punto de entrada: montaje de la app y configuración de contextos
```

## 🎯 Funcionalidades

- Autenticación con JWT (decodificada en frontend)
- Gestión de chats y mensajes con persistencia
- Renderizado de Markdown con soporte para código (`react-markdown`, `remark-gfm`, `rehype-raw`)
- Sintaxis destacada con `react-syntax-highlighter`
- Modo oscuro con persistencia
- Animaciones personalizadas con Tailwind (`@keyframes`)
- Manejo de errores con `try/catch` y feedback visual
- Notificaciones contextuales con `react-toastify` para errores, acciones y confirmaciones

## 🧠 Arquitectura React

- **Flujo de datos unidireccional** desde `App.jsx` hacia componentes hijos
- **Contextos desacoplados** para auth, chat y tema
- **Hooks personalizados** para consumir lógica de contexto
- **Componentes desacoplados** para UI, lógica y renderizado
- **Validación declarativa** con Zod en formularios

## 📦 Instalación

```bash
git clone https://github.com/Wilberth08-maker/cloneChatGPT.git
cd clone
npm install
npm run dev
```

## 🌐 Demo

Este frontend está desplegado en Vercel.

🔗 https://clone-chat-gpt-beta.vercel.app/

## 📄 Backend

Este frontend se conecta a un backend Express con Prisma y PostgreSQL.

🔗 https://github.com/Wilberth08-maker/backend-clone-chagGPT

## 🧠 Autor

Wilberth — Desarrollador frontend en formación activa, con experiencia práctica en proyectos reales y despliegue profesional de backend con ExpressJS, Prisma y PostgreSQL. Domina React, Tailwind, arquitectura modular y optimización visual. Apasionado por construir interfaces limpias, eficientes y escalables, con atención al detalle, arquitectura modular y experiencia visual elegante basada en buenas prácticas.
