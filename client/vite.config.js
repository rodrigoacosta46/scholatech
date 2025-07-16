/*
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server:{
  	port: 5173,
  },
})
*/

import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    define: {
      'process.env.REACT_APP_API_URL': JSON.stringify(env.REACT_APP_API_URL),
    },
    plugins: [react()],
    envPrefix: 'REACT_APP_',
    server: {
      host: '0.0.0.0',
      port: 5173,
      middlewareMode: false,
      configureMiddleware: (app) => {
        app.use((req, res, next) => {
          res.setHeader('X-Robots-Tag', 'noindex')
          next()
        })
      }
    },
  };
});
