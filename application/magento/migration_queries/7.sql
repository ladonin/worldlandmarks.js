ALTER TABLE `landmarks_map_coords` ADD COLUMN `relevant_placemarks` varchar(255) AFTER `subcategories`;
ALTER TABLE `landmarks_map_coords` ADD INDEX `INDEX_landmarks_map_coords_relevant_placemarks` (`relevant_placemarks`);
