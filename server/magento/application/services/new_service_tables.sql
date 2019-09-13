/*
#SERVICENAME# - переименовать на имя сервиса
*/


CREATE TABLE #SERVICENAME#_geocode_collection (
  id int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  map_data_id int(11) NOT NULL,
  language varchar(255) DEFAULT NULL,
  state_code varchar(255) NOT NULL,
  country_code varchar(255) NOT NULL,
  created int(11) NOT NULL,
  modified int(11) NOT NULL,
  json_data text NOT NULL,
  formatted_address text DEFAULT NULL,
  street_address text DEFAULT NULL,
  route text DEFAULT NULL,
  intersection text DEFAULT NULL,
  political text DEFAULT NULL,
  country varchar(255) DEFAULT NULL,
  administrative_area_level_1 varchar(255) DEFAULT NULL,
  administrative_area_level_2 varchar(255) DEFAULT NULL,
  administrative_area_level_3 text DEFAULT NULL,
  administrative_area_level_4 text DEFAULT NULL,
  administrative_area_level_5 text DEFAULT NULL,
  colloquial_area text DEFAULT NULL,
  locality varchar(255) DEFAULT NULL,
  ward text DEFAULT NULL,
  sublocality text DEFAULT NULL,
  neighborhood text DEFAULT NULL,
  premise text DEFAULT NULL,
  subpremise text DEFAULT NULL,
  postal_code varchar(255) DEFAULT NULL,
  natural_feature text DEFAULT NULL,
  airport text DEFAULT NULL,
  park text DEFAULT NULL,
  point_of_interest text DEFAULT NULL,
  PRIMARY KEY (id),
  INDEX country_code (country_code),
  INDEX IDX_en_geocode_collection_administrative_area_level_1 (administrative_area_level_1),
  INDEX IDX_en_geocode_collection_administrative_area_level_2 (administrative_area_level_2),
  INDEX IDX_en_geocode_collection_country (country),
  INDEX IDX_en_geocode_collection_language (language),
  INDEX IDX_en_geocode_collection_locality (locality),
  INDEX IDX_en_geocode_collection_map_table (map_data_id),
  INDEX state_code (state_code)
)
ENGINE = INNODB
CHARACTER SET utf8
COLLATE utf8_general_ci;


CREATE TABLE #SERVICENAME#_invite_odnoklassniki (
  id int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  profile_id varchar(255) NOT NULL,
  is_invited int(1) UNSIGNED DEFAULT 0,
  PRIMARY KEY (id),
  UNIQUE INDEX UK_#SERVICENAME#_INVITE_ODNOKLASSNIKI_PROFILE_ID (profile_id)
)
ENGINE = INNODB
CHARACTER SET utf8
COLLATE utf8_general_ci;


CREATE TABLE #SERVICENAME#_map_data (
  id int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  x float NOT NULL,
  y float NOT NULL,
  comment text NOT NULL,
  comment_plain text NOT NULL,
  title varchar(255) NOT NULL,
  user_id int(11) UNSIGNED DEFAULT NULL,
  category smallint(5) UNSIGNED DEFAULT 0,
  subcategories VARCHAR(1024) DEFAULT NULL,
  relevant_placemarks VARCHAR(1024) DEFAULT NULL,
  seo_keywords TEXT DEFAULT NULL,
  seo_description TEXT DEFAULT NULL,
  created int(11) NOT NULL,
  modified int(11) NOT NULL,
  PRIMARY KEY (id),
  INDEX category (category),
  INDEX IDX_map_city_#SERVICENAME#_data_modified (modified),
  INDEX IDX_map_city_#SERVICENAME#_data_user_id (user_id),
  INDEX IDX_map_city_#SERVICENAME#_data_x (x),
  INDEX IDX_map_city_#SERVICENAME#_data_y (y),
  INDEX INDEX_map_#SERVICENAME#_data_relevant_placemarks (relevant_placemarks),
  INDEX INDEX_map_#SERVICENAME#_data_subcategories (subcategories),
  CONSTRAINT FK_map_city_#SERVICENAME#_data_users_id FOREIGN KEY (user_id)
  REFERENCES users (id) ON DELETE RESTRICT ON UPDATE RESTRICT
)
ENGINE = INNODB
CHARACTER SET utf8
COLLATE utf8_general_ci;



CREATE TABLE #SERVICENAME#_map_photos (
  id int(11) NOT NULL AUTO_INCREMENT,
  map_data_id int(11) UNSIGNED DEFAULT NULL,
  path varchar(255) NOT NULL,
  width int(11) NOT NULL,
  height int(11) NOT NULL,
  created int(11) NOT NULL,
  modified int(11) NOT NULL,
  PRIMARY KEY (id),
  CONSTRAINT FK_map_city_#SERVICENAME#_photos_map_city_#SERVICENAME#_data_id FOREIGN KEY (map_data_id)
  REFERENCES #SERVICENAME#_map_data (id) ON DELETE RESTRICT ON UPDATE RESTRICT
)
ENGINE = INNODB
CHARACTER SET utf8
COLLATE utf8_general_ci;


CREATE TABLE #SERVICENAME#_spam (
  id int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  email varchar(80) NOT NULL,
  site varchar(255) DEFAULT NULL,
  greeting tinyint(4) DEFAULT NULL,
  status tinyint(4) DEFAULT NULL,
  code int(10) NOT NULL,
  entry_points text DEFAULT NULL,
  is_sent tinyint(4) NOT NULL DEFAULT 0,
  created int(11) NOT NULL,
  modified int(11) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE INDEX UK_#SERVICENAME#_spam_email (email)
)
ENGINE = INNODB
CHARACTER SET utf8
COLLATE utf8_general_ci;