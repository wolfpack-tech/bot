# Utilise une image Node.js comme image de base
FROM node:18


# Installer les dépendances nécessaires pour Puppeteer
RUN apt-get update && apt-get install -y \
    wget \
    gnupg2 \
    unzip \
    fonts-liberation \
    libappindicator3-1 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libgdk-pixbuf2.0-0 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libx11-xcb1 \
    libxcomposite1 \
    libxrandr2 \
    libxss1 \
    libxtst6 \
    libxshmfence1 \
    libnss3 \
    xdg-utils \
    --no-install-recommends

# Définit le répertoire de travail
WORKDIR /app

# Copie le fichier package.json et package-lock.json
COPY package*.json ./

# Installe les dépendances
RUN npm i puppeteer-core@18.0.0
RUN npm install

# Copie tous les fichiers de l'application
COPY . .

# Expose le port sur lequel l'application écoutera
EXPOSE 3000

# Commande pour démarrer l'application
CMD ["npm", "start"]
