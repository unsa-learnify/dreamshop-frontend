FROM node:20

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar y instalar dependencias
COPY package.json .
COPY package-lock.json .
RUN npm install

# Copiar el proyecto y construir
COPY . .
RUN npm run build

# Exponer el puerto
EXPOSE 8080

# CMD ["npm", "run", "serve"]