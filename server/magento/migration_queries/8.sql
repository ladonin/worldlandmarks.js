CREATE TABLE users_registered (
  id int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  name varchar(50) NOT NULL,
  role smallint(5) UNSIGNED NOT NULL,
  password_hash varchar(255) NOT NULL,
  PRIMARY KEY (id)
)
ENGINE = INNODB
AUTO_INCREMENT = 1
CHARACTER SET utf8
COLLATE utf8_general_ci;


INSERT INTO users_registered
(
  id
 ,name
 ,role
 ,password_hash
)
VALUES
(
  1
 ,'admin'
 ,9
 ,'$6$$1zOyLGD8fsSEsjb3npfpnEW2O/bLC5Ksb8FfvubaVDiy/qUrCCPAq1ZHKaXeCCrfyKdez4WZX9dn7m5OWiYIz0'
)