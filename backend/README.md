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

# Gestion de la base de données et insertion de données de test (mock data)

Voir wiki: [Gestion de la base de données pour le développement](https://github.com/joe-from-mtl/inm5151-a2024-sylvcit/wiki/Configuration-MySQL-Workbench)

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

> Note: Il est possible de générer un script SQL à partir des schémas créés avec MySQL Workbench. Voir [Database Design and Modeling](https://dev.mysql.com/doc/workbench/en/wb-data-modeling.html) et voir [Forward Engineering](https://dev.mysql.com/doc/workbench/en/wb-forward-engineering-sql-scripts.html).

> Note 2: Il existe des outils pour générer des modèles SQLAlchemy à partir d'une base de données existante. Voir [sqlacodegen](https://pypi.org/project/sqlacodegen/).

