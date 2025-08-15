import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react({
        // Habilitar React Fast Refresh para una experiencia de desarrollo más fluida
        fastRefresh: true,
    }),],
    resolve: {
        alias: {
            // eslint-disable-next-line no-undef
            '@': path.resolve(__dirname, './src') // Alias apra importar desde src con @
        },
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'], // resuelve estás extensiones automáticamente
    },
    server: {
        port: 3000, // cambia el puerto si quieres 
        open: true, // abre el navegador automáticamente al iniciar el servidor
        strictPort: true, // Fallará si el puerto está ocupado (evita que elija otro automáticamente)
    },
})