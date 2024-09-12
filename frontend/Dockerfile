FROM node:14

WORKDIR /app

# Copier les fichiers de configuration
COPY package*.json ./
COPY babel.config.js ./

# Installer les dépendances
RUN npm install

# Installer expo-cli localement dans le projet
RUN npm install expo-cli

# Copier le reste des fichiers du projet
COPY . .

# Exposer les ports nécessaires
EXPOSE 19000 19001 19002 19006

# Commande pour démarrer l'application
CMD ["npx", "expo", "start", "--web", "--non-interactive"]