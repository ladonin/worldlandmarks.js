ALTER TABLE roads_map_data MODIFY COLUMN subcategories VARCHAR(1024) DEFAULT NULL;
ALTER TABLE roads_map_data MODIFY COLUMN relevant_placemarks VARCHAR(1024) DEFAULT NULL;

ALTER TABLE landmarks_map_data MODIFY COLUMN subcategories VARCHAR(1024) DEFAULT NULL;
ALTER TABLE landmarks_map_data MODIFY COLUMN relevant_placemarks VARCHAR(1024) DEFAULT NULL;