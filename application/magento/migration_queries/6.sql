ALTER TABLE `landmarks_map_coords` ADD COLUMN `subcategories` varchar(255) AFTER `category`;
ALTER TABLE `landmarks_map_coords` ADD INDEX `INDEX_landmarks_map_coords_subcategories` (`subcategories`);
