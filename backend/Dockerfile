# Utilise une image Python officielle comme image de base
FROM python:3.9-slim

# Définit le répertoire de travail dans le conteneur
WORKDIR /app

# Copie le contenu du répertoire courant (.) dans le conteneur à /app
COPY . /app

# Installe les dépendances Python listées dans requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Ajout d'un script pour attendre MySQL
COPY wait_for_db.sh /app/wait_for_db.sh
RUN chmod +x /app/wait_for_db.sh

# Indique que le conteneur écoute sur le port 5000 au moment de l'exécution
EXPOSE 5000

# Définit des variables d'environnement utilisées par l'application Flask
ENV FLASK_APP=app.py
ENV FLASK_RUN_HOST=0.0.0.0

# Spécifie la commande à exécuter lorsque le conteneur démarre
CMD ["/app/wait_for_db.sh", "flask", "run"]
