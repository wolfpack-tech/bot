FROM baseImage

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier le package.json et le package-lock.json (si présent)
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste de l'application dans le conteneur
COPY . .

# Exposer le port sur lequel l'application va fonctionner
EXPOSE 5000

# Démarrer l'application
CMD ["node", "bot.js"]