
ALTER TABLE country
ADD COLUMN created int(11) UNSIGNED NOT NULL,
ADD COLUMN modified int(11) UNSIGNED NOT NULL;


ALTER TABLE country_name
ADD COLUMN created int(11) UNSIGNED NOT NULL,
ADD COLUMN modified int(11) UNSIGNED NOT NULL;


ALTER TABLE country_params
ADD COLUMN created int(11) UNSIGNED NOT NULL,
ADD COLUMN modified int(11) UNSIGNED NOT NULL;


ALTER TABLE country_states
ADD COLUMN created int(11) UNSIGNED NOT NULL,
ADD COLUMN modified int(11) UNSIGNED NOT NULL;


ALTER TABLE country_states_google_names
ADD COLUMN created int(11) UNSIGNED NOT NULL,
ADD COLUMN modified int(11) UNSIGNED NOT NULL;


ALTER TABLE country_states_cities_google_translates
ADD COLUMN created int(11) UNSIGNED NOT NULL,
ADD COLUMN modified int(11) UNSIGNED NOT NULL;






ALTER TABLE emails_sends
CHANGE created created  int(11) UNSIGNED NOT NULL,
CHANGE modified modified  int(11) UNSIGNED NOT NULL;

ALTER TABLE landmarks_geocode_collection
CHANGE created created  int(11) UNSIGNED NOT NULL,
CHANGE modified modified  int(11) UNSIGNED NOT NULL;

ALTER TABLE landmarks_map_data
CHANGE created created  int(11) UNSIGNED NOT NULL,
CHANGE modified modified  int(11) UNSIGNED NOT NULL;

ALTER TABLE landmarks_map_photos
CHANGE created created  int(11) UNSIGNED NOT NULL,
CHANGE modified modified  int(11) UNSIGNED NOT NULL;

ALTER TABLE roads_geocode_collection
CHANGE created created  int(11) UNSIGNED NOT NULL,
CHANGE modified modified  int(11) UNSIGNED NOT NULL;

ALTER TABLE roads_map_data
CHANGE created created  int(11) UNSIGNED NOT NULL,
CHANGE modified modified  int(11) UNSIGNED NOT NULL;

ALTER TABLE roads_map_photos
CHANGE created created  int(11) UNSIGNED NOT NULL,
CHANGE modified modified  int(11) UNSIGNED NOT NULL;

ALTER TABLE roads_spam
CHANGE created created  int(11) UNSIGNED NOT NULL,
CHANGE modified modified  int(11) UNSIGNED NOT NULL;

ALTER TABLE users
CHANGE created created  int(11) UNSIGNED NOT NULL,
CHANGE modified modified  int(11) UNSIGNED NOT NULL;



ALTER TABLE landmarks_invite_odnoklassniki
ADD COLUMN created int(11) UNSIGNED NOT NULL,
ADD COLUMN modified int(11) UNSIGNED NOT NULL;

ALTER TABLE roads_invite_odnoklassniki
ADD COLUMN created int(11) UNSIGNED NOT NULL,
ADD COLUMN modified int(11) UNSIGNED NOT NULL;

ALTER TABLE users_registered
ADD COLUMN created int(11) UNSIGNED NOT NULL,
ADD COLUMN modified int(11) UNSIGNED NOT NULL;




ALTER TABLE landmarks_invite_odnoklassniki
CHANGE created created  int(11) UNSIGNED NOT NULL,
CHANGE modified modified  int(11) UNSIGNED NOT NULL;

ALTER TABLE roads_invite_odnoklassniki
CHANGE created created  int(11) UNSIGNED NOT NULL,
CHANGE modified modified  int(11) UNSIGNED NOT NULL;

ALTER TABLE users_registered
CHANGE created created  int(11) UNSIGNED NOT NULL,
CHANGE modified modified  int(11) UNSIGNED NOT NULL;