/*
 * File server/src/services/landmarks/language/Ru.js
 *
 * Service words in russian translation
 */

const Consts = require('server/src/settings/Constants');
const Ru = require('server/common/services/landmarks/language/Ru');

module.exports = {
    ...Ru,
    ['form/map_new_point/category/' + Consts.NONE_CATEGORY_CODE]: 'Выберите из списка',
    'form/map_new_point/comment/label': 'Комментарий (не обязательно).',
    'form/map_new_point/title/label': 'Заголовок (не обязательно).',
    'form/map_new_point/category/label': 'Категория',
    'text/new_point/add_photos': 'Приложить фото',

    'site/title/map/index': 'Достопримечательности на карте мира',
    'site/title/catalog/index': 'Выбор страны',
    'site/title/catalog/country': '%country%',
    'site/title/catalog/state': '%country%. %state%',
    'site/title/catalog/placemark': '%title%. %state%. %country%',
    'site/title/catalog/placemark_no_states': '%title%. %country%',
    'site/title/main/index': 'Достопримечательности на карте мира',
    'site/title/catalog/search/title': 'Поиск',
    'site/title/catalog/search': 'Поиск',
    'site/title/catalog/search/submit/text': 'Поиск',
    'site/title/catalog/search/form/title/label': 'Ключевое слово',
    'site/title/catalog/search/form/category/label': 'Категория',
    'site/title/catalog/search/form/country/label': 'Страна',
    'site/title/catalog/search/form/all_countries': 'Любая страна',
    'site/title/catalog/search/form/all_categories': 'Любая категория',

    'site/keywords/main/index': 'достопримечательности,достопримечательности на карте мира,карта мира',
    'site/keywords/catalog/index': '',
    'site/keywords/map/index': '',
    'site/keywords/catalog/search': '',

    'site/description/main/index': 'Обзор достопримечательностей со всего мира - как созданных руками человека, так и самой природой.',
    'site/description/catalog/index': '',
    'site/description/map/index': '',
    'site/description/catalog/search': '',

    'site/description/catalog/sitemap_countries/country': 'Список достопримечательностей. %country%.',
    'site/description/catalog/sitemap_countries/index': 'Список достопримечательностей. Выберите страну.',
    'site/description/catalog/sitemap_categories/category': 'Список достопримечательностей. %category%.',
    'site/description/catalog/sitemap_categories/index': 'Список достопримечательностей. Выберите категорию.',

    'hat/logo/under_text': 'достопримечательности мира',
    'page_bottom/column_1/header/text': 'Сервисы',
    'page_bottom/catalog/text': 'Каталог',
    'page_bottom/map/text': 'Карта',
    'page_bottom/search/text': 'Поиск',
    'page_bottom/rights/text': '© World-Landmarks.ru - достопримечательности мира. Все права защищены. По всем вопросам обращаться по адресу <a class="nowrap" href="mailto:info@world-landmarks.ru" target="_blank" rel="noopener">info@world-landmarks.ru</a>.',
    'main/description': `Данный сайт посвящен обзору достопримечательностей со всего мира - как созданных руками человека, так и самой природой.
        Ежедневно сайт пополняется новыми записями. Ознакомиться с ними вы можете с помощью сервисов - карты и каталога.
        Во время просмотра можно легко переходить с каталога на карту и обратно, не теряя нужной страницы.
        Каждый объект, будь он на карте или в каталоге, имеет подробное описание с фотографиями, список наиболее "близких" ему объектов и многое другое.`,
    'main/map/description': `Если вы отправились в путешествие, то это наиболее удобный способ познакомиться с местными достопримечательностями.
            Нажав на кнопку "определить мое местоположение", вы увидите объекты, которые находятся в непосредственной близости от вас, с подробным описанием каждого.',
    'main/catalog/description':'Позволяет быстро ознакомиться с достопримечательностями любой интересующей вас страны, выбрав её из списка.`,
    'main/map/title': 'карта',
    'main/catalog/title': 'каталог',
    'main/search/title': 'поиск',
    'main/catalog/link': 'Перейти',
    'main/map/link': 'Перейти',
    'main/last_placemarks/text': 'Все метки',
    'last_articles/text': 'Новые статьи',
    'map/default_title_part/value': 'метка:',
    'errors/new_point/category_none': 'Укажите категорию',
    'category/info/title/text': 'Категории:',
};