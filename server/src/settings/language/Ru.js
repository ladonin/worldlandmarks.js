/*
 * File server/src/settings/language/Ru.js
 * const Ru = require('server/src/settings/language/Ru');
 *
 */

const Constants = require('server/src/settings/Constants');
const Seo = require('server/src/settings/language/seo/Ru');

module.exports = {
    'domain_name': 'WORLD-LANDMARKS.RU',
    'countries/undefined/name': 'Прочие места',
    'text/new_point/loading': 'загрузка...',
    'visitors/welcome/1/text': 'Благодарим Вас за посещение нашего сайта! <br>Надеемся, Вам у нас понравится :).',
    'visitors/interest/1/title/text': `<span style="color:#0070C3">Благодарим Вас за проявленный интерес!</span>`,
    'visitors/interest/1/description/text': "Если Вы не против, мы будем иногда присылать Вам письма с новыми интересными достопримечательностями. <br><br> <small>Если Вы пожелаете отказаться от наших писем, то всегда сможете нажать в письме на кнопку <b style=\"font-weight:bold;\">Мне это не интересно</b></small>.",
    'buttons/new_point/add': 'Добавить',
    'buttons/new_point/delete_photo': 'Удалить',
    'buttons/new_point/delete_placemark': 'Удалить метку',
    'buttons/new_point/update': 'Править',
    'buttons/new_point/existing_photos_title': 'Загруженные фото',
    'sweet_alert/delete_placemark/notation': 'Данные будут удалены безвозвратно',
    'buttons/new_point/close': 'Отмена',
    'sweet_alert/are_you_sure': 'Вы уверены?',
    'sweet_alert/new_point/close/notation': 'Ваши данные не будут сохранены.',
    'sweet_alert/redact_point/close/notation': 'Вы хотите отменить редактирование?',
    'sweet_alert/yes': 'Да',
    'sweet_alert/no': 'Нет',
    'map/buttons/placemark/viewer/onmap': 'На карте',
    'map/buttons/placemark/viewer/return': 'Вернуться',
    'map/buttons/placemark/viewer/close': 'Закрыть',
    'buttons/new_point/place_at_map': 'Поменять место на карте',
    'buttons/new_point/return_to_editor': 'Перейти к редактированию',
    'buttons/new_point/cancel': 'Отмена',
    'buttons/new_point/commit': 'Сохранить',
    'notice/new_point/check_place': 'Укажите место на карте',
    'notice/load_placemarks/big_zoom': 'Ничего не загрузилось. Слишком большая площадь. Попробуйте приблизить масштаб.',
    'notice/map/filter/start/text': 'Идет фильтрация, пожалуйста подождите.',
    'notice/map/filter/reset/text': 'Идет сброс фильтра, пожалуйста подождите.',
    'warning/search/empty_result': 'Ничего не найдено.',
    'text/new_point/title': 'Добавить метку на карту',
    'text/new_point/title_update': 'Обновить запись',
    'map/panel_tools/where_am_i/title': '<br>где я нахожусь',
    'map/panel_tools/placemark_add_open/title': 'добавить<br>новую метку',
    'map/panel_tools/link/catalog': 'Каталог',
    'map/panel_tools/link/main': 'Главная страница',
    'map/panel_tools/filter/category/title': 'Показать только:',
    'map/panel_tools/filter/category/selected/title': 'Выбрано:',
    'map/panel_tools/filter/title': '<br>фильтр',
    'panel_tools/settings/title': 'Настройки/Settings',
    'panel_tools/settings_back/title': '<br>назад',
    'panel_tools/settings/head': 'Настройки',
    'panel_tools/settings/language/title': 'Язык сайта',
    'map/panel_tools/filter/head': 'Фильтр',
    'catalog/panel_tools/link/map': 'Карта',
    'map/panel_tools/filter_back/title': '<br>назад',
    'map/panel_tools/filter_reset/title': '<br>сброс фильтра',
    'catalog/panel_tools/link/filter': 'Поиск',
    'catalog/panel_tools/link/catalog': 'Каталог',
    'catalog/panel_tools/link/catalog/search': 'Поиск',
    'catalog/panel_tools/link/article': 'Статьи',
    'breadcrumbs/catalog/text': 'Каталог',
    'breadcrumbs/articles/text': 'Статьи',
    'map/panel_tools/link/all_placemarks': 'Все метки',
    'map/panel_tools/link/filter': 'Поиск',
    'text/new_point/step_1': 'Описание места.',
    'text/general_review': 'Общий обзор',
    'form/map_generic_new_point/email/label': 'Ваш Email (не обязательно). Это даст вам возможность редактировать эту запись в будущем.',
    'form/map_generic_new_point/password/label': 'Введите пароль (он был ранее выслан вам на почту, если вы указали email).',
    'map/placemark/link/text': 'Ссылка на место: ',
    'catalog/placemark/link_to_map/text': 'Посмотреть на карте',
    'map/placemark/link_to_catalog/text': 'Посмотреть в каталоге',
    'map/placemark/adress/text': '', //Адрес места:
    'email/send_password_after_create_placemark/subject': 'Ваш пароль',
    'email/send_password_after_create_placemark/body': 'Пароль: <b>%password%</b><br>С помощью этого пароля вы сможете редактировать ваши записи на любой из карт проекта Instorage.',
    'email/send_password_after_create_placemark/alt_body': 'С помощью этого пароля вы сможете редактировать ваши записи на любой из карт проекта Instorage.',
    'select_a_country_text': 'Выберите страну',
    'catalog/country/back_link': 'Вернуться к выбору стран',
    'catalog/placemark/back_link_states': 'Другие метки в этом регионе',
    'catalog/placemark/back_link_countries': 'Другие метки в этой стране',
    'catalog/placemark/back_link_undefined': 'Другие метки',
    'catalog/country/photoalbum_title/text': 'Последние загруженные фото',
    'catalog/state/photoalbum_title/text': 'Последние загруженные фото',
    'catalog/state/back_link_states': 'Выбрать другой регион',
    'catalog/state/back_link_countries': 'Другие страны',
    'relevant_placemarks/title/text': 'Вам будет это интересно:',
    'another_placemarks/title/text': 'Другие объекты:',
    'another_articles/title/text': 'Другие статьи:',
    'placemarks_count/1/text': 'Всего меток: ',
    'placemarks_count/2/text': 'меток: ',
    'catalog/states/regions/list/title': 'Регионы',
    'select_a_category_text': 'Выберите категорию',
    'sitemap/empty_list/text': 'Список пуст',
    'upload_file_plugin/uploadstr/value': '',
    'upload_file_plugin/deletelStr/value': 'Отмена',
    'page_bottom/sitemap_countries/text': 'Поиск меток по странам',
    'page_bottom/sitemap_categories/text': 'Поиск меток по категориям',
    'page_bottom/articles_countries/text': 'Просмотр статей по странам',
    'page_bottom/articles_categories/text': 'Просмотр статей по категориям',
    'articles_categories/header/text': 'Выберите категорию',
    'text_form/tags/a/title': 'Ссылка',
    'text_form/tags/p/title': 'Абзац',
    'text_form/tags/b/title': 'Выделить жирным',
    'text_form/tags/strong/title': 'Тег <strong>',
    'text_form/tags/img/title': 'Изображение',
    'see_all':'смотреть все',
    ...Seo
};