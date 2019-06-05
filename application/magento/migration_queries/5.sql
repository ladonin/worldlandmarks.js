ALTER TABLE `geocode_collection` ADD COLUMN `state_code` varchar(255) NOT NULL AFTER `language`;
ALTER TABLE `geocode_collection` ADD INDEX `state_code` (`state_code`);

ALTER TABLE `geocode_collection` ADD COLUMN `country_code` varchar(255) NOT NULL AFTER `state_code`;
ALTER TABLE `geocode_collection` ADD INDEX `country_code` (`country_code`);