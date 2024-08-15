# Etapa 1: Construir la aplicación React
FROM node:14 as build

WORKDIR /app

# Copia el package.json y package-lock.json al contenedor
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia todo el código fuente
COPY . .

# Construye la aplicación para producción
RUN npm run build

# Etapa 2: Configurar Nginx para servir la aplicación
FROM nginx:alpine

# Copia los archivos construidos al directorio que Nginx usa para servir contenido
COPY --from=build /app/build /usr/share/nginx/html

# Expone el puerto en el que Nginx servirá la aplicación
EXPOSE 80

# Comando para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]
