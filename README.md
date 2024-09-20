# inm5151-a2024-sylvcit

## Table des matières

1. [Installation de Docker](#installation-de-docker)
2. [Configuration du projet](#configuration-du-projet)
3. [Utilisation quotidienne](#utilisation-quotidienne)

## Installation de Docker

### Pour macOS et Windows:

1. Téléchargez et lancez Docker Desktop:
   https://www.docker.com/products/docker-desktop

### Pour Linux:

1. Suivez les instructions spécifiques à votre distribution: https://docs.docker.com/engine/install/

### Vérification de l'installation

Ouvrez un terminal et exécutez:

```
docker --version
docker-compose --version
```

## Configuration du projet

1. Construisez l'image Docker et lancez les conteneurs:

   ```
   docker-compose up --build
   ```

2. Dans un autre terminal, initialisez la base de données:

   ```
   docker-compose exec backend flask db upgrade
   ```

   Pour plus de détails, voir `README.md` dans le dossier backend.

3. Une fois terminé, l'application devrait être accessible à `http://localhost:5001`

## Utilisation quotidienne

1. Au début de votre session de travail, lancez les conteneurs:

   ```
   docker-compose up
   ```

2. Travaillez sur votre code comme d'habitude. Les changements seront automatiquement reflétés dans le conteneur grâce au montage de volume.

3. Si Flask ne détecte pas automatiquement vos changements, vous pouvez redémarrer le conteneur:

   ```
   docker-compose restart
   ```

4. Pour arrêter les conteneurs à la fin de votre session:

   ```
   docker-compose down
   ```

5. Si vous modifiez le `Dockerfile`, `requirements.txt`, ou `docker-compose.yml`, reconstruisez l'image:
   ```
   docker-compose up --build
   ```
