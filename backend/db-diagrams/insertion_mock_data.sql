
-- -----------------------------------------------------
-- Data for table `inm5151_db`.`functional_group`
-- -----------------------------------------------------
START TRANSACTION;
USE `inm5151_db`;
INSERT INTO `inm5151_db`.`functional_group` (`group`, `description`) VALUES ('1A', 'Conifères généralement tolérants à l’ombre, mais pas à la sécheresse ou l’inondation.');
INSERT INTO `inm5151_db`.`functional_group` (`group`, `description`) VALUES ('1B', 'Conifères héliophiles (qui aime la lumière), tolérants à la sécheresse.');
INSERT INTO `inm5151_db`.`functional_group` (`group`, `description`) VALUES ('2A', 'Arbres tolérants à l’ombre à feuilles larges et minces, croissance moyenne. Graines dispersées surtout par le vent.');
INSERT INTO `inm5151_db`.`functional_group` (`group`, `description`) VALUES ('2B', 'Ressemblent au 2A sauf pour les semences très lourdes et dispersées par gravité.');
INSERT INTO `inm5151_db`.`functional_group` (`group`, `description`) VALUES ('2C', 'Grands arbres tolérants à l’inondation.');
INSERT INTO `inm5151_db`.`functional_group` (`group`, `description`) VALUES ('3A', 'Petits arbres tolérants à la sécheresse, bois lourd, feuilles épaisses, croissance faible.');
INSERT INTO `inm5151_db`.`functional_group` (`group`, `description`) VALUES ('3B', 'Groupe « moyen ». Intolérant à l’inondation.');
INSERT INTO `inm5151_db`.`functional_group` (`group`, `description`) VALUES ('4A', 'Grands arbres à semences et bois lourds. Plusieurs tolérants à la sécheresse.');
INSERT INTO `inm5151_db`.`functional_group` (`group`, `description`) VALUES ('4B', 'Grande tolérance à la sécheresse, mais pas à l’ombre ou inondation.');
INSERT INTO `inm5151_db`.`functional_group` (`group`, `description`) VALUES ('5', 'Espèces pionnières à très petites semences. Croissance rapide, tolérants à l’inondation, bois léger.');

COMMIT;


-- -----------------------------------------------------
-- Data for table `inm5151_db`.`family`
-- -----------------------------------------------------
START TRANSACTION;
USE `inm5151_db`;
INSERT INTO `inm5151_db`.`family` (`name`) VALUES ('Sapindaceae');
INSERT INTO `inm5151_db`.`family` (`name`) VALUES ('Juglandaceae');
INSERT INTO `inm5151_db`.`family` (`name`) VALUES ('Malvaceae');
INSERT INTO `inm5151_db`.`family` (`name`) VALUES ('Fagaceae');

COMMIT;


-- -----------------------------------------------------
-- Data for table `inm5151_db`.`genre`
-- -----------------------------------------------------
START TRANSACTION;
USE `inm5151_db`;
INSERT INTO `inm5151_db`.`genre` (`name`) VALUES ('Acer');
INSERT INTO `inm5151_db`.`genre` (`name`) VALUES ('Catalpa');
INSERT INTO `inm5151_db`.`genre` (`name`) VALUES ('Tilia');

COMMIT;


-- -----------------------------------------------------
-- Data for table `inm5151_db`.`location`
-- -----------------------------------------------------
START TRANSACTION;
USE `inm5151_db`;
INSERT INTO `inm5151_db`.`location` (`latitude`, `longitude`) VALUES ('45.72587', '-73.45703');
INSERT INTO `inm5151_db`.`location` (`latitude`, `longitude`) VALUES ('45.77804', '-73.40377');
INSERT INTO `inm5151_db`.`location` (`latitude`, `longitude`) VALUES ('45.7259', '-73.45707');
INSERT INTO `inm5151_db`.`location` (`latitude`, `longitude`) VALUES ('45.73708', '-73.44643');

COMMIT;

-- -----------------------------------------------------
-- Data for table `inm5151_db`.`type`
-- -----------------------------------------------------
START TRANSACTION;
USE `inm5151_db`;
INSERT INTO `inm5151_db`.`type` (`name_fr`, `name_en`, `name_la`) VALUES ('Catalpa de lOuest', 'Western Catalpa', 'Catalpa speciosa');
INSERT INTO `inm5151_db`.`type` (`name_fr`, `name_en`, `name_la`) VALUES ('Phellodendron de lAmour Maelio', 'Maelio Amur Cork Tree', 'Phellodendron amurensis Maelio');
INSERT INTO `inm5151_db`.`type` (`name_fr`, `name_en`, `name_la`) VALUES ('Érable à Giguère', 'Manitoba Maple', 'Acer negundo');

COMMIT;

-- -----------------------------------------------------
-- Data for table `inm5151_db`.`tree`
-- -----------------------------------------------------
START TRANSACTION;
USE `inm5151_db`;
INSERT INTO `inm5151_db`.`tree` (`date_plantation`, `date_measure`, `details_url`, `id_type`, `id_genre`, `id_family`, `id_functional_group`, `id_location`) VALUES ('2019-07-12', '2021-06-05', 'https://arbres.hydroquebec.com/fiche-arbre-arbuste/4857', 1, 1, 1, 2, 2);
INSERT INTO `inm5151_db`.`tree` (`date_plantation`, `date_measure`, `details_url`, `id_type`, `id_genre`, `id_family`, `id_functional_group`, `id_location`) VALUES ('2018-06-24', '2022-09-16', 'https://arbres.hydroquebec.com/fiche-arbre-arbuste/4552', 2, 2, 2, 5, 1);
INSERT INTO `inm5151_db`.`tree` (`date_plantation`, `date_measure`, `details_url`, `id_type`, `id_genre`, `id_family`, `id_functional_group`, `id_location`) VALUES ('2017-10-12', '2023-01-11', 'https://arbres.hydroquebec.com/fiche-arbre-arbuste/4705', 2, 3, 3, 4, 3);

COMMIT;

START TRANSACTION;
USE `inm5151_db`;
INSERT INTO `inm5151_db`.`add_tree` (`latitude`, `longitude`, `date_releve`) VALUES ('45.72587', '-73.45703', '2021-06-05');

COMMIT;

START TRANSACTION;
USE `inm5151_db`;
INSERT INTO `inm5151_db`.`nom_tree` (`essence_latin`, `sigle`, `essence_fr`,`essence_en`) VALUES ('Ulmus wilsoniana Prospector', 'ULWIPR', 'Orme japonais du prospecteur','Prospector\'s Elm');

COMMIT ;

START TRANSACTION;
USE `inm5151_db`;
INSERT INTO `inm5151_db`.`tree_search` (`no_emp`, `arrondissement`,`emplacement`, `essence_latin`, `dhp`, `date_releve`, `date_plantation`, `longitude`, `latitude`, `inv_type`) VALUES (31708, 6, 'Parterre Gazonné', 'Ulmus wilsoniana Prospector', '22', '2024-04-15', '2010-10-12', '-73.568412', '45.508639', 'H');

COMMIT;

START TRANSACTION ;
USE `inm5151_db`;
INSERT INTO `inm5151_db`.`tree_hors_rue`(no_emp, nom_parc, nom_secteur) VALUES (31708, 'PROMENADE DES ARTISTES', 'OUEST');

COMMIT;