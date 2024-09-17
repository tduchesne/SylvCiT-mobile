# Première utilisation

1. Pour lancer le service db, backend et frontend, utilisez la même commande docker:

   ```bash
   docker-compose up --build
   ```

   Le schéma de la base de données sera automatiquement crée lors du premier démarrage du service `db`.

2. Il faut maintenant appliquer la migration plus recente à la base de données. Il faut exécuter dans un autre terminal:

   ```bash
   docker-compose exec backend flask db upgrade
   ```

   > Note: Chaque fois qu'une nouvelle migration a été créée, il faut appliquer cette commande aussi. Il est recommandé d'éxécuter cette commande après chaque pull du projet si la dernière version de la base de données est requise.

- Si jamais le schéma de la base de données n'est pas créé ou si la base de donnée a été effacé, il faut d'abord effacer les volumes docker:

  ```bash
  docker-compose down -v
  ```

  Ensuite, on relance les services avec `docker-compose up --build` et on applique les migrations comme indiqué ci-dessus.

# Gestion de la base de données pour le développement

Il est possible de gérer la base de données avec un outil externe comme MySQL Workbench. Pour ce faire, il faut utiliser les informations suivantes:

- Le service `db` utilise MySQL comme base de données. Utilisez `localhost:3306` pour vous connecter.
- L'utilisateur du backend est `user` et le mot de passe est `user`.
- L'utilisateur root est `root` et le mot de passe est `root`.

Dans la wiki du projet, vous trouverez la **configuration de MySQL Workbench** pour se connecter à la base de données.

# Insertion de données de test (mock data)

Un jeu de données de test est disponible dans le fichier `/backend/db-diagrams/insertion_mock_data.sql`.

Il est possible d'insérer ces données dans la base de données de deux façons:

1. Utilisez un client MySQL (comme MySQL Workbench) pour exécuter ce script (recommandé) ou
2. Copiez le script `.sql` dans le conteneur `db` et exécutez le script à partir de là.

Dans la wiki du projet, vous trouverez un guide pour **insérer les données de test** dans la base de données à l'aide de MySQL Workbench.

# Création d'une nouvelle migration

Assurez-vous d'avoir défini ou modifié les modèles SQLAlchemy correctement avant de créer une nouvelle migration.

1. Il faut d'abord se connecter au conteneur backend:

   ```bash
   docker-compose exec backend bash
   ```

2. Ensuite, après avoir défini ou modifié les modèles SQLAlchemy, il faut créer une nouvelle migration. Exécutez :

   ```bash
   flask db migrate -m "Description de la migration"
   ```

3. Appliquez la migration à la base de données:
   ```bash
   flask db upgrade
   ```

- Si vous voulez revenir en arrière, utilisez la commande `flask db downgrade`.
