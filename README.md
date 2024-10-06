# SylvCiT Mobile

SylvCiT Mobile est une application mobile pour la foresterie urbaine, conçue pour faciliter la collecte de données sur les arbres en ville. Ce projet vise à améliorer la compréhension de l'écosystème urbain et à aider à la prise de décision pour la gestion des espaces verts.

## Table des matières

1. [Prérequis](#prérequis)
2. [Installation](#installation)
3. [Configuration](#configuration)
4. [Utilisation](#utilisation)
5. [Développement](#développement)
6. [Base de données](#base-de-données)
7. [Documentation supplémentaire](#documentation-supplémentaire)

## Prérequis

- Docker et Docker Compose
- Node.js et npm
- Un compte Expo

## Installation

1. Clonez ce dépôt :

```shell
git clone https://github.com/joe-from-mtl/inm5151-a2024-sylvcit.git
cd inm5151-inm5151-a2024-sylvcit.git
```

2. Installez Docker en suivant les instructions dans le [Wiki Docker](https://github.com/joe-from-mtl/inm5151-a2024-sylvcit/wiki/Docker).

3. Appliquez la dernière migration de la base de données :

```shell
docker-compose exec backend flask db upgrade
```

4. Vérifiez l'installation de Docker :

```shell
docker --version
docker-compose --version
```

## Configuration

1. Créez un compte sur [Expo](https://expo.dev) si ce n'est pas déjà fait.

2. Générez un token Expo en suivant les instructions dans le [Wiki Expo Go](https://github.com/joe-from-mtl/inm5151-a2024-sylvcit/wiki/Utilisation-d'Expo-Go-pour-accéder-à-l'application-SylvCiT-Mobile).

3. Dans le dossier racine du projet, créez un fichier `.env` et ajoutez votre token Expo :

```shell
EXPO_TOKEN=votre_token_ici
```

## Utilisation

1. Lancez les conteneurs Docker :

```shell
docker-compose up --build
```

2. Dans un nouveau terminal, démarrez l'application Expo depuis le répertoire */frontend*:

```shell
npx expo start
```

3. Sur votre téléphone, suivez les instructions dans le [Wiki Expo Go](https://github.com/joe-from-mtl/inm5151-a2024-sylvcit/wiki/Utilisation-d'Expo-Go-pour-accéder-à-l'application-SylvCiT-Mobile) pour installer et utiliser l'application Expo Go.

L'application utilise les ports suivants par défaut:

- Frontend: http://localhost:8081
- Backend: http://localhost:5001

Assurez-vous que ces ports sont disponibles sur votre machine avant de lancer l'application.

## Développement


Les changements dans le code seront automatiquement reflétés dans le conteneur Docker grâce au montage de volume. Si Flask ne détecte pas les changements, redémarrez le conteneur avec `docker-compose restart`. Pour arrêter les conteneurs, utilisez `docker-compose down`.

Pour plus de détails sur l'utilisation de Docker pendant le développement, consultez le [Wiki Docker](https://github.com/joe-from-mtl/inm5151-a2024-sylvcit/wiki/Docker).

## Base de données

Nous utilisons MySQL comme base de données. Pour configurer et utiliser MySQL Workbench pour la gestion de la base de données, suivez les instructions détaillées dans le [Wiki Gestion de la base de données](https://github.com/joe-from-mtl/inm5151-a2024-sylvcit/wiki/Gestion-de-la-base-de-donn%C3%A9es).

## Documentation supplémentaire

Pour des informations plus détaillées sur la configuration et l'utilisation des différents outils, consultez les wikis :

- [Wiki Docker](https://github.com/joe-from-mtl/inm5151-a2024-sylvcit/wiki/Docker) - Installation, configuration et utilisation de Docker
- [Wiki Expo Go](https://github.com/joe-from-mtl/inm5151-a2024-sylvcit/wiki/Utilisation-d'Expo-Go-pour-accéder-à-l'application-SylvCiT-Mobile) - Configuration d'Expo et utilisation d'Expo Go
- [Wiki Gestion de la base de données](https://github.com/joe-from-mtl/inm5151-a2024-sylvcit/wiki/Gestion-de-la-base-de-donn%C3%A9es) - Gestion de la base de données avec MySQL Workbench
