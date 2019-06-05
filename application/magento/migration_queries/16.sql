CREATE TABLE map.landmarks_articles (
  id int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  title varchar(255) NOT NULL,
  content text NOT NULL,
  content_plain text NOT NULL,
  country_id int(11) UNSIGNED NOT NULL,
  seo_description text DEFAULT NULL,
  keywords varchar(255) DEFAULT NULL,
  categories varchar(255) DEFAULT NULL,
  created int(11) UNSIGNED NOT NULL,
  modified int(11) UNSIGNED NOT NULL,
  PRIMARY KEY (id),
  INDEX IDX_landmarks_articles_categor (categories),
  INDEX IDX_landmarks_articles_country (country_id)
)
ENGINE = INNODB
AUTO_INCREMENT = 4
AVG_ROW_LENGTH = 5461
CHARACTER SET utf8
COLLATE utf8_general_ci;



INSERT into `country` (local_code) VALUES ('undefined');
INSERT into `country_name` (country_id, name, language) VALUES ('252', 'Undefined places', 'EN'), ('252', 'Прочие места', 'RU');