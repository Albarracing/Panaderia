# 1. Usa una imagen de Node.js como base para la construcción
FROM node:18-alpine AS build

# 2. Establece el directorio de trabajo en el contenedor
WORKDIR /app

# 3. Copia los archivos de tu aplicación al contenedor
COPY package.json ./
COPY package-lock.json ./

# 4. Instala las dependencias
RUN npm install

# 5. Copia el resto del código de la aplicación al contenedor
COPY . .

# 6. Construye la aplicación
RUN npm run build

# 7. Usa una imagen de servidor web para servir los archivos estáticos
FROM nginx:alpine

# 8. Copia los archivos generados en la etapa de construcción a la carpeta que Nginx servirá
COPY --from=build /app/dist /usr/share/nginx/html

# 9. Exponer el puerto 80 para acceder a la aplicación
EXPOSE 80

# 10. Comando para ejecutar Nginx
CMD ["nginx", "-g", "daemon off;"]

