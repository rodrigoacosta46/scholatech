#!/bin/sh

# Navega al directorio 'client' e instala las dependencias
cd /app/client
npm install
npm run build

# Ejecuta el build de npm y la aplicación Go en paralelo
npm run preview &    # Ejecutar el build en segundo plano
cd /app              # Regresa al directorio raíz (donde está la app Go)
./ScholaMedsProd     #go run main.go       # Ejecuta la aplicación Go