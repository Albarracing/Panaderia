# 1. Usa una imagen base oficial de Node.js
FROM node:18-alpine

# 2. Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# 3. Copia los archivos package.json y package-lock.json al directorio de trabajo
COPY package*.json ./

# 4. Instala las dependencias del proyecto
RUN npm install --production

# 5. Copia el resto del código de la aplicación al contenedor
COPY . .

# 6. Expone el puerto en el que la aplicación escucha
EXPOSE 3000

# 7. Define el comando que se ejecutará al iniciar el contenedor
CMD ["node", "index.js"]
