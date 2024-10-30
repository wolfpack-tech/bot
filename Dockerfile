# Utilise une image Node.js comme image de base
FROM node:18

# Définit le répertoire de travail
WORKDIR /app

# Copie le fichier package.json et package-lock.json
COPY package*.json ./

# Installe les dépendances
RUN npm install

# Copie tous les fichiers de l'application
COPY . .

# Expose le port sur lequel l'application écoutera
EXPOSE 3000

# Commande pour démarrer l'application
CMD ["npm", "start"]
