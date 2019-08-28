/*
 * File application/express/services/landmarks/language/En.js
 *
 * Service words in english translation
 */
const Consts = require('application/express/settings/Constants');
const En = require('application/common/services/landmarks/language/En');

module.exports = {
    ...En,
    ['form/map_new_point/category/' + Consts.NONE_CATEGORY_CODE]: 'Select from the list',
    'form/map_new_point/comment/label': 'Review (optional).',
    'form/map_new_point/title/label': 'Title (optional).',
    'form/map_new_point/category/label': 'Category',
    'text/new_point/add_photos': 'Attach photo',

    'site/title/map/index': 'Landmarks on the world map',
    'site/title/catalog/index': 'The choice of the country.',
    'site/title/catalog/country': '%country%.',
    'site/title/catalog/state': '%country%. %state%.',
    'site/title/catalog/placemark': '%title%. %state%. %country%.',
    'site/title/catalog/placemark_no_states': '%title%. %country%.',
    'site/title/main/index': 'Landmarks on the world map',
    'site/title/catalog/search/title': 'Search',
    'site/title/catalog/search': 'Search',
    'site/title/catalog/search/submit/text': 'Search',
    'site/title/catalog/search/form/title/label': 'Keywords',
    'site/title/catalog/search/form/category/label': 'Category',
    'site/title/catalog/search/form/country/label': 'Country',
    'site/title/catalog/search/form/all_countries': 'Any country',
    'site/title/catalog/search/form/all_categories': 'Any category',

    'site/keywords/main/index': 'landmark, landmarks, attraction, attracions, world map',
    'site/keywords/catalog/index': '',
    'site/keywords/map/index': '',
    'site/keywords/catalog/search': '',

    'site/description/main/index': 'Review landmarks from around the world - created by human hands or by nature.',
    'site/description/catalog/index': '',
    'site/description/map/index': '',
    'site/description/catalog/search': '',

    'site/description/catalog/sitemap_countries/country': 'The list of landmarks. %country%.',
    'site/description/catalog/sitemap_countries/index': 'The list of landmarks. Select a country.',
    'site/description/catalog/sitemap_categories/category': 'The list of landmarks. %category%.',
    'site/description/catalog/sitemap_categories/index': 'The list of landmarks. Select a category.',

    'hat/logo/under_text': 'landmarks around the world',
    'page_bottom/column_1/header/text': 'Services',
    'page_bottom/catalog/text': 'Catalog',
    'page_bottom/map/text': 'Map',
    'page_bottom/search/text': 'Advanced search',
    'page_bottom/rights/text': '© World-Landmarks.ru - browse landmarks around  the world. All rights reserved. For all questions contact on email <a class="nowrap" href="mailto:info@world-landmarks.ru" target="_blank" rel="noopener">info@world-landmarks.ru</a>.',
    'main/description': `This site is dedicated to the review sites from around the world - as created by human hands or by nature. Daily website updated with new entries. To view them you can use the services map and directory.
During playback you can easily jump from the catalog to the map and back without losing the desired page.
Every object, whether on the map or in a directory that has a detailed description with photos, a list of the most "close" to it objects, and more.`,
    'main/map/description': '',
    'main/catalog/description': '',
    'main/map/title': 'map',
    'main/catalog/title': 'catalog',
    'main/search/title': 'search',
    'main/catalog/link': 'Go',
    'main/map/link': 'Go',
    'last_articles/text': 'Last articles',
    'main/last_placemarks/text': 'All placemarks',
    'catalog/country/last_articles/text': 'Last articles',
    'map/default_title_part/value': 'placemark:',
    'errors/new_point/category_none': 'Select a category',
    'category/info/title/text': 'Categories:',
};
