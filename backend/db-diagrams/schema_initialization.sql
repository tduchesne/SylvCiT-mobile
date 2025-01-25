-- SQL for initializing the database schema. Migrations should be applied after data
CREATE SCHEMA IF NOT EXISTS `inm5151_db`;
USE `inm5151_db`;

FLUSH PRIVILEGES;

DROP USER IF EXISTS user;
CREATE USER 'user' IDENTIFIED BY 'user';
GRANT ALL PRIVILEGES ON `inm5151_db`.* TO 'user'@'%';
FLUSH PRIVILEGES;

COMMIT;