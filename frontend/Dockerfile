# Etapa 1: Construir la aplicación React
FROM node:14 AS build

WORKDIR /app

# Copia el package.json y package-lock.json al contenedor
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia todo el código fuente
COPY . .

# Construye la aplicación para producción
RUN npm run build

# Etapa 2: Servir la aplicación con serve
FROM node:14

WORKDIR /app

# Copia los archivos construidos al contenedor
COPY --from=build /app/build /app/build

# Instala serve para servir los archivos estáticos
RUN npm install -g serve

# Expone el puerto en el que el servidor servirá la aplicación
EXPOSE 3000

# Comando para iniciar serve
CMD ["serve", "-s", "build", "-l", "3000"]
