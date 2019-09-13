DROP TABLE IF EXISTS emails_sends;
DROP TABLE IF EXISTS landmarks_map_photos;
DROP TABLE IF EXISTS landmarks_map_coords;
DROP TABLE IF EXISTS map_roads_photos;
DROP TABLE IF EXISTS map_roads_coords;
DROP TABLE IF EXISTS users;

SET NAMES 'utf8';

CREATE TABLE emails_sends (
  id INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  map_table VARCHAR(255) DEFAULT NULL,
  coords_id INT(11) UNSIGNED DEFAULT NULL,
  from_email VARCHAR(50) NOT NULL,
  from_name VARCHAR(50) DEFAULT NULL,
  recipient_email VARCHAR(50) NOT NULL,
  recipient_name VARCHAR(50) DEFAULT NULL,
  is_html TINYINT(3) UNSIGNED NOT NULL,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  plain_text TEXT NOT NULL,
  created INT(11) NOT NULL,
  modified INT(11) NOT NULL,
  PRIMARY KEY (id)
)
ENGINE = INNODB
AUTO_INCREMENT = 1
CHARACTER SET utf8
COLLATE utf8_general_ci;

CREATE TABLE users (
  id int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  email varchar(50) NOT NULL,
  password_hash varchar(255) NOT NULL,
  created int(11) NOT NULL,
  modified int(11) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE INDEX UK_users_email (email),
  UNIQUE INDEX UK_users_password_hash (password_hash)
)
ENGINE = INNODB
AUTO_INCREMENT = 1
CHARACTER SET utf8
COLLATE utf8_general_ci;

CREATE TABLE landmarks_map_coords (
  id INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  x FLOAT NOT NULL,
  y FLOAT NOT NULL,
  comment TEXT NOT NULL,
  comment_plain TEXT NOT NULL,
  title VARCHAR(255) NOT NULL,
  user_id INT(11) UNSIGNED DEFAULT NULL,
  created INT(11) NOT NULL,
  modified INT(11) NOT NULL,
  PRIMARY KEY (id),
  INDEX IDX_landmarks_map_coords_modified (modified),
  INDEX IDX_landmarks_map_coords_user_id (user_id),
  INDEX IDX_landmarks_map_coords_x (x),
  INDEX IDX_landmarks_map_coords_y (y),
  CONSTRAINT FK_landmarks_map_coords_users_id FOREIGN KEY (user_id)
    REFERENCES users(id) ON DELETE RESTRICT ON UPDATE RESTRICT
)
ENGINE = INNODB
AUTO_INCREMENT = 1
CHARACTER SET utf8
COLLATE utf8_general_ci;

CREATE TABLE map_roads_coords (
  id INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  x FLOAT NOT NULL,
  y FLOAT NOT NULL,
  comment TEXT NOT NULL,
  comment_plain TEXT NOT NULL,
  title VARCHAR(255) NOT NULL,
  user_id INT(11) UNSIGNED DEFAULT NULL,
  created INT(11) NOT NULL,
  modified INT(11) NOT NULL,
  PRIMARY KEY (id),
  INDEX IDX_map_roads_coords_user_id (user_id),
  INDEX IDX_map_roads_modified (modified),
  INDEX IDX_map_roads_x (x),
  INDEX IDX_map_roads_y (y),
  CONSTRAINT FK_map_roads_coords_users_id FOREIGN KEY (user_id)
    REFERENCES users(id) ON DELETE RESTRICT ON UPDATE RESTRICT
)
ENGINE = INNODB
AUTO_INCREMENT = 1
CHARACTER SET utf8
COLLATE utf8_general_ci;

CREATE TABLE landmarks_map_photos (
  id INT(11) NOT NULL AUTO_INCREMENT,
  map_coords_id INT(11) UNSIGNED DEFAULT NULL,
  path VARCHAR(255) NOT NULL,
  width INT(11) NOT NULL,
  height INT(11) NOT NULL,
  created INT(11) NOT NULL,
  modified INT(11) NOT NULL,
  PRIMARY KEY (id),
  CONSTRAINT FK_landmarks_map_photos_landmarks_map_coords_id FOREIGN KEY (map_coords_id)
    REFERENCES landmarks_map_coords(id) ON DELETE RESTRICT ON UPDATE RESTRICT
)
ENGINE = INNODB
AUTO_INCREMENT = 1
CHARACTER SET utf8
COLLATE utf8_general_ci;

CREATE TABLE map_roads_photos (
  id INT(11) NOT NULL AUTO_INCREMENT,
  map_coords_id INT(11) UNSIGNED DEFAULT NULL,
  path VARCHAR(255) NOT NULL,
  width INT(11) NOT NULL,
  height INT(11) NOT NULL,
  created INT(11) NOT NULL,
  modified INT(11) NOT NULL,
  PRIMARY KEY (id),
  INDEX IDX_map_roads_photos_map_roads_coords_id (map_coords_id),
  CONSTRAINT FK_map_roads_photos_map_roads_coords_id FOREIGN KEY (map_coords_id)
    REFERENCES map_roads_coords(id) ON DELETE SET NULL ON UPDATE CASCADE
)
ENGINE = INNODB
AUTO_INCREMENT = 1
CHARACTER SET utf8
COLLATE utf8_general_ci;