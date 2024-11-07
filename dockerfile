
# Usa la imagen de Golang 1.23
FROM golang:1.23

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia todos los archivos desde el contexto actual al directorio de trabajo en el contenedor
COPY . .

# Ejecuta la aplicación
CMD ["./app"]