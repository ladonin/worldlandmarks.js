CREATE TABLE spam_landmarks (
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
  UNIQUE INDEX UK_spam_landmarks_email (email)
)
ENGINE = INNODB
CHARACTER SET utf8
COLLATE utf8_general_ci;