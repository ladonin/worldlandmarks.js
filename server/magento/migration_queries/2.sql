ALTER TABLE map_roads_coords ADD COLUMN category SMALLINT UNSIGNED DEFAULT 0 AFTER user_id;
ALTER TABLE map_roads_coords ADD INDEX `category` (`category`);

ALTER TABLE landmarks_map_coords ADD COLUMN category SMALLINT UNSIGNED DEFAULT 0 AFTER user_id;
ALTER TABLE landmarks_map_coords ADD INDEX `category` (`category`);