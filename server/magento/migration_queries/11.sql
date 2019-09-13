ALTER TABLE map_roads_data ADD COLUMN seo_keywords TEXT DEFAULT NULL AFTER relevant_placemarks;
ALTER TABLE map_roads_data ADD COLUMN seo_description TEXT DEFAULT NULL AFTER seo_keywords;

ALTER TABLE landmarks_map_data ADD COLUMN seo_keywords TEXT DEFAULT NULL AFTER relevant_placemarks;
ALTER TABLE landmarks_map_data ADD COLUMN seo_description TEXT DEFAULT NULL AFTER seo_keywords;