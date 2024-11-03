# # -----------------------------------------------------
# # Data for table `inm5151_db`.`functional_group`
# # -----------------------------------------------------
# START TRANSACTION;
# USE `inm5151_db`;
# INSERT INTO `inm5151_db`.`functional_group` (`group`, `description`) VALUES ('1A', 'Conifères généralement tolérants à l’ombre, mais pas à la sécheresse ou l’inondation.');
# INSERT INTO `inm5151_db`.`functional_group` (`group`, `description`) VALUES ('1B', 'Conifères héliophiles (qui aime la lumière), tolérants à la sécheresse.');
# INSERT INTO `inm5151_db`.`functional_group` (`group`, `description`) VALUES ('2A', 'Arbres tolérants à l’ombre à feuilles larges et minces, croissance moyenne. Graines dispersées surtout par le vent.');
# INSERT INTO `inm5151_db`.`functional_group` (`group`, `description`) VALUES ('2B', 'Ressemblent au 2A sauf pour les semences très lourdes et dispersées par gravité.');
# INSERT INTO `inm5151_db`.`functional_group` (`group`, `description`) VALUES ('2C', 'Grands arbres tolérants à l’inondation.');
# INSERT INTO `inm5151_db`.`functional_group` (`group`, `description`) VALUES ('3A', 'Petits arbres tolérants à la sécheresse, bois lourd, feuilles épaisses, croissance faible.');
# INSERT INTO `inm5151_db`.`functional_group` (`group`, `description`) VALUES ('3B', 'Groupe « moyen ». Intolérant à l’inondation.');
# INSERT INTO `inm5151_db`.`functional_group` (`group`, `description`) VALUES ('4A', 'Grands arbres à semences et bois lourds. Plusieurs tolérants à la sécheresse.');
# INSERT INTO `inm5151_db`.`functional_group` (`group`, `description`) VALUES ('4B', 'Grande tolérance à la sécheresse, mais pas à l’ombre ou inondation.');
# INSERT INTO `inm5151_db`.`functional_group` (`group`, `description`) VALUES ('5', 'Espèces pionnières à très petites semences. Croissance rapide, tolérants à l’inondation, bois léger.');
# COMMIT;
# -- -----------------------------------------------------
# -- Data for table `inm5151_db`.`family`
# -- -----------------------------------------------------
# START TRANSACTION;
# USE `inm5151_db`;
# INSERT INTO `inm5151_db`.`family` (`name`) VALUES ('Sapindaceae');
# INSERT INTO `inm5151_db`.`family` (`name`) VALUES ('Juglandaceae');
# INSERT INTO `inm5151_db`.`family` (`name`) VALUES ('Malvaceae');
# INSERT INTO `inm5151_db`.`family` (`name`) VALUES ('Fagaceae');
# COMMIT;
# -- -----------------------------------------------------
# -- Data for table `inm5151_db`.`genre`
# -- -----------------------------------------------------
# START TRANSACTION;
# USE `inm5151_db`;
# INSERT INTO `inm5151_db`.`genre` (`name`) VALUES ('Acer');
# INSERT INTO `inm5151_db`.`genre` (`name`) VALUES ('Catalpa');
# INSERT INTO `inm5151_db`.`genre` (`name`) VALUES ('Tilia');
# COMMIT;
# -- -----------------------------------------------------
# -- Data for table `inm5151_db`.`location`
# -- -----------------------------------------------------
# START TRANSACTION;
# USE `inm5151_db`;
# INSERT INTO `inm5151_db`.`location` (`latitude`, `longitude`) VALUES ('45.72587', '-73.45703');
# INSERT INTO `inm5151_db`.`location` (`latitude`, `longitude`) VALUES ('45.77804', '-73.40377');
# INSERT INTO `inm5151_db`.`location` (`latitude`, `longitude`) VALUES ('45.7259', '-73.45707');
# INSERT INTO `inm5151_db`.`location` (`latitude`, `longitude`) VALUES ('45.73708', '-73.44643');
# COMMIT;
# -- -----------------------------------------------------
# -- Data for table `inm5151_db`.`type`
# -- -----------------------------------------------------
# START TRANSACTION;
# USE `inm5151_db`;
# INSERT INTO `inm5151_db`.`type` (`name_fr`, `name_en`, `name_la`) VALUES ('Catalpa de lOuest', 'Western Catalpa', 'Catalpa speciosa');
# INSERT INTO `inm5151_db`.`type` (`name_fr`, `name_en`, `name_la`) VALUES ('Phellodendron de lAmour Maelio', 'Maelio Amur Cork Tree', 'Phellodendron amurensis Maelio');
# INSERT INTO `inm5151_db`.`type` (`name_fr`, `name_en`, `name_la`) VALUES ('Érable à Giguère', 'Manitoba Maple', 'Acer negundo');
# COMMIT;
# -- -----------------------------------------------------
# -- Data for table `inm5151_db`.`tree`
# -- -----------------------------------------------------
# START TRANSACTION;
# USE `inm5151_db`;
# INSERT INTO `inm5151_db`.`tree` (`date_plantation`, `date_measure`, `details_url`, `id_type`, `id_genre`, `id_family`, `id_functional_group`, `id_location`, `no_emp`, `adresse`,`dhp`,`is_valid`,`emplacement`,`inv_type`,`arrondissement`) VALUES ('2019-07-12', '2021-06-05', 'https://arbres.hydroquebec.com/fiche-arbre-arbuste/4857', 1, 1, 1, 1, 1, 1, 'Adresse 1', 1, true,'parterre gazonné','H','Ville-Marie');
# INSERT INTO `inm5151_db`.`tree` (`date_plantation`, `date_measure`, `details_url`, `id_type`, `id_genre`, `id_family`, `id_functional_group`, `id_location`, `no_emp`, `adresse`,`dhp`,`is_valid`,`emplacement`,`inv_type`,`arrondissement`) VALUES ('2018-06-24', '2022-09-16', 'https://arbres.hydroquebec.com/fiche-arbre-arbuste/4552', 2, 2, 2, 2, 2, 2, 'Adresse 2', 2, true,'fond de trottoir','R','Ville-Marie');
# INSERT INTO `inm5151_db`.`tree` (`date_plantation`, `date_measure`, `details_url`, `id_type`, `id_genre`, `id_family`, `id_functional_group`, `id_location`, `no_emp`, `adresse`,`dhp`,`is_valid`,`emplacement`,`inv_type`,`arrondissement`) VALUES ('2017-10-12', '2023-01-11', 'https://arbres.hydroquebec.com/fiche-arbre-arbuste/4705', 3, 3, 3, 3, 3, 3, 'Adresse 3', 3, true,'parterre bétonné','H','Ville-Marie');
#
# COMMIT;
#
# START TRANSACTION;
# USE `inm5151_db`;
# INSERT INTO `inm5151_db`.`tree_hors_rue`(id_tree, nom_parc, nom_secteur) VALUES (8, 'PROMENADE DES ARTISTES', 'OUEST');
# INSERT INTO `inm5151_db`.`tree_rue`(id_tree, no_civique, nom_rue, cote, localisation, rue_de, rue_a, distance_pave, distance_ligne_rue, stationnement_heure) VALUES (6, 22, 'parterre gazonné', 'N', 'Parterre Gazonné', 'Parterre Gazonné', 'Parterre Gazonné', 0.0, 0.0, '00:00');
# COMMIT;

START TRANSACTION;
USE `inm5151_db`;
INSERT INTO `inm5151_db`.`parc`(code_parc, nom_parc) VALUES ('1265-000','PROMENADE DES ARTISTES');
INSERT INTO `inm5151_db`.`secteur`(code_secteur, nom_secteur) VALUES ('2','OUEST');
INSERT INTO `inm5151_db`.`arrondissement`(no_arrondissement, nom_arrondissement) VALUES (6,'Ville-Marie');
INSERT INTO `inm5151_db`.`essence`(sigle, la, en, fr) VALUES ('ULWIPR', 'Ulmus wilsoniana ''Prospector''', 'Prospector''s Elm','Orme japonais du prospecteur');
INSERT INTO `inm5151_db`.`tree`(no_emp,no_arrondissement, emplacement, sigle, dhp, date_measure, date_plantation, latitude, longitude, inv_type, is_valid) VALUES (31709,6,'parterre gazonné','ULWIPR',22,'2024-04-15','2010-10-12',45.508639,-73.568412,'H',true);
INSERT INTO `inm5151_db`.`tree_hors_rue`(id, code_parc, code_secteur) VALUES (1,'1265-000','2');
COMMIT;

START TRANSACTION;
USE `inm5151_db`;
INSERT INTO `inm5151_db`.`essence`(sigle, la, en, fr) VALUES ('GYDI', 'Gymnocladus dioicus', 'Kentucky Coffee Tree','Chicot du Canada');
INSERT INTO `inm5151_db`.`tree`(no_emp,no_arrondissement, emplacement, sigle, dhp, date_measure, date_plantation, latitude, longitude, inv_type, is_valid) VALUES (469185,6,'fond de trottoir','GYDI',5,'2024-10-20','2024-10-20',45.508692,-73.568993,'R',true);
INSERT INTO `inm5151_db`.`tree_rue`(id, adresse, localisation, localisation_code, rue_de, rue_a, distance_pave, distance_ligne_rue, stationnement_jour, stationnement_heure, district, arbre_remarquable) VALUES (2,'1 Rue Jeanne-Mance E','25 m. au Nord de PRÉSIDENT-KENNEDY','N-25','PRÉSIDENT-KENNEDY AVENU DU','SHERBROOKE O RUE',2.6,3.7,'L-V','06:30:00',184,'N');
COMMIT;


START TRANSACTION;
USE `inm5151_db`;
INSERT INTO `inm5151_db`.`tree`(no_emp,no_arrondissement, emplacement, sigle, dhp, date_measure, date_plantation, latitude, longitude, inv_type, is_valid) VALUES (31708,6,'parterre gazonné','ULWIPR',26,'2024-04-15','2024-10-12',45.508592,-73.568455,'H',false);
INSERT INTO `inm5151_db`.`tree_hors_rue`(id, code_parc, code_secteur) VALUES (3,'1265-000','2');
COMMIT;
