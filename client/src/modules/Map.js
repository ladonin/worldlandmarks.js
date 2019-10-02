/*
 * File src/modules/Map.js
 * import MapModule from 'src/modules/Map';
 *
 * Map module
 */
import Consts from 'src/settings/Constants';
import Config from 'src/settings/Config';
import Service from 'src/modules/Service';
import Language from 'src/modules/Language';
import CommonBaseFunctions from 'src/../../server/common/functions/BaseFunctions';
import {isMobile} from "react-device-detect";
import BaseFunctions from 'src/functions/BaseFunctions';
import ImageDimensions from 'src/modules/ImageDimensions';
import Router from 'src/modules/Router';
import Cookies from 'src/modules/Cookies';
import Socket from 'src/app/socket/Socket';
import CategoryViewerModule from 'src/modules/CategoryViewer';
import Events from 'src/modules/Events';
import AlertsText from 'src/modules/AlertsText';

const DEFAULT_ZOOM = 5;
let _isAvailableToChange = false;
let _filterCategory = false;
let _objectName = 'my_map_vendor';
let _linkId;
let _currentPlacemarkId;
let _isRedactedStatus = false;

let _buttonsPlacemarkViewerHidePosition;
let _buttonsNewPointPlaceAtMapPosition;
let _buttonsPlacemarkViewerShowPosition;
let _buttonsNewPointReturnToEditorPosition;
let _zoomWhereAmI;
let _placemarkViewZoom;
let _zoom;

if (isMobile) {
    _buttonsPlacemarkViewerHidePosition = '-75px';
    _buttonsNewPointPlaceAtMapPosition = '-75px';
    _buttonsPlacemarkViewerShowPosition = '-187px';
    _buttonsNewPointReturnToEditorPosition = '-150px';
    _zoomWhereAmI = 17;
    _placemarkViewZoom = 16;
    //_zoom; // = 14; //ATTENTION - обратите внимание
} else {
    _buttonsPlacemarkViewerHidePosition = '-120px';
    _buttonsNewPointPlaceAtMapPosition = '-120px';
    _buttonsPlacemarkViewerShowPosition = '-300px';
    _buttonsNewPointReturnToEditorPosition = '-240px';
    _zoomWhereAmI = 14;
    _placemarkViewZoom = 17;
    //_zoom; // = 12; //ATTENTION - обратите внимание
}
let _isTooBigRequestedArea = false;
let _presetPlacemarkNew = 'custom#new_placemark';
let _clusterOpened;
let _placemarkOpenedId;
let _balloonContentBody = 'waiting...';
let _gridSize = 50;
let _buttonsHeight;
let _clusterListImageWidth;
let _clusterListImageHeight;
let _clusterListImageWidthMax = 220;
let _placemarkHeight;
let _placemarks = {};
let _placemarksRightList = {};
let _showRightList = false;
let _targetPlacemark;
let _map;
let _clusterer;
let _windowHeight;
let _windowWidth;

// Selectors:
let _xAddNewPointSelector = '#addNewPoint_x';
let _yAddNewPointSelector = '#addNewPoint_y';

let _blockAddNewPointSelector = '#add_new_point';
let _placemarkSelector = '#placemark';
let _placemarkButtonsSelector = '#placemark_buttons';
let _placemarkButtonsBlockSelector = '#placemark_buttons_block';
let _placemarkToggleSelector = '#placemark_toggle';
let _placemarkCloseSelector = '#placemark_close';
let _placemarkAddButtonsSelector = '#placemark_add_buttons';
let _placemarkAddSetPointSelector = '#placemark_add_set_point';
let _buttonImageSelector = 'div.icon img';
let _placemarkBlockSelector = '#placemark_block';
let _placemarkCloseSide1Selector = '#placemark_close_side_1';
let _placemarkCloseSide2Selector = '#placemark_close_side_2';
let _placemarkAddCommitSelector = '#placemark_add_commit';
let _placemarkListElementSelector = '.placemark_list_element';
let _panelToolsContentFilterSelectBlockSelector = "#panel_tools_content_filter_select_block";
let _placemarkListSelector = '#placemark_list';
let _placemarkListBlockSelector = '#placemark_list_block';
let _placemarkAddButtonsBlockSelector = '#placemark_add_buttons_block';
let _placemarkListElementDivSelector = '.placemark_list_element div';
let _placemarkContentImgSelector = '#placemark_content img';
let _placemarkContentSelector = '#placemark_content';
let _shadowBlockSelector = '#shadow_block';
let _shadowSelector = '#shadow';
let _mCustomScrollbarSelector = '.mCustomScrollbar'
let _alertSelector = '#alert'
let _placemarkContentBlockSelector = '#placemark_content_block';
let _placemarkAddCancelSelector = '#placemark_add_cancel';
let _placemarkAddBlockSelector = '#placemark_add_block';
let _placemarkAddSelector = '#placemark_add';
let _placemarkAddOpenSelector = '#placemark_add_open';
let _showPlacemarkAddOpenSelector = false;
let _placemarkUpdateOpenFromViewerSelector = '#placemark_update_open_from_viewer';
let _openPanelSelector = '#open_panel';
let _showOpenPanelSelector = false;
let _whereAmISelector = '#where_am_i';
let _panelToolsSelector = '#panel_tools';
let _updatePlacemarkFieldSelector = '#update_placemark_field';
let _yaShield1Selector = '#ya_shield_1';
let _yMapsIdSelector = '#YMapsID';

let _placemarkContentMargin;
let _yaShield1Timer;
let _placemarkAddSetPointTimer;
let _contentImageWithClusterWidth;
let _contentImageWithoutClusterWidth;
let _clusterListImagePrefix = null;
let _contentImageWithClusterPrefix = null;
let _contentImageWithoutClusterPrefix = null;
let _prefix;
let _bunchFillingTimer;
let _bunchFillingEnd = 0;




function getClusterListImagePrefix(){
    return _clusterListImagePrefix;
}
function getClusterListImageWidth(){
    return _clusterListImageWidth;
}
function getClusterListImageHeight(){
    return _clusterListImageHeight;
}
function getContentImageWithClusterWidth(){
    return _contentImageWithClusterWidth;
}
function getContentImageWithoutClusterWidth(){
    return _contentImageWithoutClusterWidth;
}
function getContentImageWithClusterPrefix(){
    return _contentImageWithClusterPrefix;
}
function getContentImageWithoutClusterPrefix(){
    return _contentImageWithoutClusterPrefix;
}







function prepareGenericDimensions() {

    if (isMobile) {
        _clusterListImageWidth = Math.floor(_windowWidth * 0.25);
        _clusterListImageHeight = Math.floor(_clusterListImageWidth * 0.75);
        _placemarkContentMargin = 8;
        _contentImageWithClusterWidth = _windowWidth - (_clusterListImageWidth + (_placemarkContentMargin * 2));
        _contentImageWithoutClusterWidth = _windowWidth; // без отступов
        //my_fileuploader_object.update({statusBarWidth: 184}); //ATTENTION - обратите внимание
    } else {
        _clusterListImageWidth = 210;
        _clusterListImageHeight = 170;
        _placemarkContentMargin = 10;
        _contentImageWithClusterWidth = BaseFunctions.getWidth(_placemarkBlockSelector) - (_clusterListImageWidth + (_placemarkContentMargin * 2));
        _contentImageWithoutClusterWidth = BaseFunctions.getWidth(_placemarkBlockSelector);
        //my_fileuploader_object.update({statusBarWidth: 450});//ATTENTION - обратите внимание
    }

    let _clusterImageWidthDimension = Math.floor(_clusterListImageWidth * 0.2);
    _clusterListImagePrefix = ImageDimensions.getPrefix(_clusterListImageWidth, _clusterImageWidthDimension);
    _contentImageWithClusterPrefix = ImageDimensions.getPrefix(_contentImageWithClusterWidth, 0);
    _contentImageWithoutClusterPrefix = ImageDimensions.getPrefix(_contentImageWithoutClusterWidth, 0);
    BaseFunctions.setHeight(_yMapsIdSelector, _windowHeight);
    BaseFunctions.setHeight(_placemarkSelector, _windowHeight - (parseInt(BaseFunctions.getCss(_placemarkSelector, 'margin-top')) * 2));
    BaseFunctions.setHeight(_placemarkAddSelector, _windowHeight - (parseInt(BaseFunctions.getCss(_placemarkAddSelector, 'margin-top')) * 2));
    BaseFunctions.setHeight(_placemarkAddBlockSelector, BaseFunctions.getHeight(_placemarkAddSelector) - BaseFunctions.getHeight(_placemarkAddSetPointSelector) - BaseFunctions.getHeight(_placemarkAddCancelSelector) - 15);
    _buttonsHeight = BaseFunctions.getHeight(_openPanelSelector);
    BaseFunctions.setCss(_placemarkButtonsSelector, 'top', _windowHeight - BaseFunctions.getHeight(_placemarkButtonsBlockSelector) - parseInt(BaseFunctions.getCss(_placemarkButtonsBlockSelector, 'padding-bottom')) - parseInt(BaseFunctions.getCss(_placemarkButtonsBlockSelector, 'padding-top')) + 'px');
    BaseFunctions.setCss(_placemarkButtonsSelector, 'top', _windowHeight - BaseFunctions.getHeight(_placemarkButtonsBlockSelector) - parseInt(BaseFunctions.getCss(_placemarkButtonsBlockSelector, 'padding-bottom')) - parseInt(BaseFunctions.getCss(_placemarkButtonsBlockSelector, 'padding-top')) + 'px');
    BaseFunctions.setCss(_placemarkAddButtonsSelector, 'top', _windowHeight - BaseFunctions.getHeight(_placemarkAddButtonsSelector) - parseInt(BaseFunctions.getCss(_placemarkAddButtonsSelector, 'margin-bottom')) + 'px');
    BaseFunctions.setCss(_openPanelSelector, 'top', (_windowHeight - _buttonsHeight) / 2);
    BaseFunctions.show(_placemarkAddOpenSelector);
    BaseFunctions.show(_openPanelSelector);
    BaseFunctions.setHeight(_placemarkListSelector, BaseFunctions.getHeight(_placemarkSelector) - BaseFunctions.getHeight(_placemarkCloseSelector));
    BaseFunctions.setHeight(_placemarkContentSelector, BaseFunctions.getHeight(_placemarkListSelector));
    _placemarkHeight = BaseFunctions.getHeight(_placemarkSelector);
    BaseFunctions.setHeight(_placemarkCloseSide1Selector, _placemarkHeight);
    BaseFunctions.setHeight(_placemarkCloseSide2Selector, _placemarkHeight);
}



function setCenter(id) {
    _map.setCenter([_placemarks['id_'+id]['data']['y'], _placemarks['id_'+id]['data']['x']]);
}

function setZoom(type) {
    if (type === 'whereAmI') {
        _map.setZoom(_zoomWhereAmI);
    }
}




function saveInPlacemarksData(data) {
    let _id = data['id'];
// Если такая метка уже есть в массие, с условием, что мы не обновляем её, то не задаем её снова
    if ((_isRedactedStatus === false) && (typeof (_placemarks['id_'+_id]) !== 'undefined')) {
        return false;
    }
// при обновлении не будем уничтожать объект - там ведь только его сущность и координаты, данные все в массиве, вот их и будем обновлять
    if (_isRedactedStatus === false) {
        _placemarks['id_'+_id] = {};
    }

    _placemarks['id_'+_id]['data'] = data;
    return true;
}

// добавление и кластеризация элементов карты
function addAndClustering(init = false) {
    let _clusterIsUpdated = false;
    let _newPlacemarkData;
    let _placemarksToAdd = [];

    // проходим по каждой метке и добавляем её в виде балуна на карту
    for (let _key in _placemarks) {

        let _placemark = _placemarks[_key];
        let _id = _placemark.data.id;

        // Only if object was not created for current element yet
        if (init === true || ((typeof (_placemark) !== 'undefined') && (typeof (_placemark['object']) === 'undefined'))) {
            _newPlacemarkData = addPlacemark(_id, _placemark['data']);
            if ((_filterCategory === false) || (_filterCategory === _placemark['data']['category'])) {
                _placemarksToAdd.push(_newPlacemarkData);
                _clusterIsUpdated = true;
            }
        }
    }
    if (_clusterIsUpdated === true) {
        _clusterer.add(_placemarksToAdd);
        _map.geoObjects.add(_clusterer);
    }
}

// задаем цвета кластерам при действиях на карте
function colorizeCluster(target) {

}

// добавление балуна на карту
function addPlacemark(id, data) {


    let _coords = [data['y'], data['x']];
    let _myPlacemark = new window.ymaps.Placemark(
            _coords,
            {
                // собственные данные иденфикации балуна
                own_id: id
            },
            // Изображение иконки метки
            CategoryViewerModule.getBaloonImage(data['category'])
            );




// сохраняем в массив объект балуна, чтобы можно было работать с ним в будущем,
// если объект тут задан, значит он уже отображен на карте, а не только в массиве
    _placemarks['id_'+id]['object'] = _myPlacemark;
// что делаем при клике на балун
    _myPlacemark.events.add('click', function (e) {
        if (BaseFunctions.is(_placemarkAddButtonsSelector, ':visible') !== true) {
            _placemarksRightList = {};
            _showRightList = false;
            placemarkPreview(id, false);
        } else {
            Events.dispatch('alert', {
                text: AlertsText.get('new_point/another_actions', 'error'),
                className: 'error'
            });
        }
    });
    return _myPlacemark;
}

// отоюбражение данных балуна
function placemarkPreview(id, atCluster) {
    _showPlacemarkAddOpenSelector = false;
    _showOpenPanelSelector = false;
    getPointData(id, atCluster);
}


// получение данных балуна
function getPointData(id, atCluster) {
    showPointData(id, atCluster);
    colorizePlacemark(id);
}

function getPlacemarksRightList() {
    return _placemarksRightList;
}

function getPlacemarks() {
    return _placemarks;
}


// подготавливаем габариты окна просмотра балуна - NOTE:  нельзя прописать это в css, потому что теги еще не существуют
function preparePlacemarkContentDimensions(atCluster, id) {
    BaseFunctions.setWidth(_placemarkListSelector, _clusterListImageWidth + (_placemarkContentMargin * 2));
    if (isMobile) {
        if (atCluster) {
            BaseFunctions.setWidth(_placemarkContentSelector, _windowWidth - BaseFunctions.getWidth(_placemarkListSelector));
        } else {
            BaseFunctions.setWidth(_placemarkContentSelector, _windowWidth);
        }
    } else {
        if (atCluster) {
            BaseFunctions.setWidth(_placemarkContentSelector, BaseFunctions.getWidth(_placemarkBlockSelector) - BaseFunctions.getWidth(_placemarkListSelector));
        } else {
            BaseFunctions.setWidth(_placemarkContentSelector, BaseFunctions.getWidth(_placemarkBlockSelector));
        }
    }
    // переводим скролл вверх, если вдруг он не там
    BaseFunctions.setScrollTop(_placemarkContentSelector, 0);
    BaseFunctions.kickNicescroll(_placemarkContentSelector);
    BaseFunctions.kickNicescroll(_placemarkAddBlockSelector);
    BaseFunctions.kickNicescroll(_placemarkListSelector);

    if (atCluster && id) {
        BaseFunctions.scrollTo(_placemarkListSelector, '#placemark_list_element_'+id);
    }
}





function checkLinkOnId(matchParams) {
    _linkId = Router.getActionData(undefined, matchParams)[Consts.ID_VAR_NAME];
    if (_linkId) {
        getPlacemark(_linkId);
    }
}

function getPlacemark(id, atCluster = false) {

    Socket.backgroundQuery(
            Consts.CONTROLLER_NAME_MAP,
            'get_placemark',
            {
                [Consts.ID_VAR_NAME]: id,
                atCluster
            }
    );
}



// подготавливаем габариты окна просмотра балуна - NOTE:  нельзя прописать это в css, потому что теги еще не существуют
function preparePlacemarkViewerDimensions(id, atCluster) {

    BaseFunctions.setCss(_placemarkContentBlockSelector + ' div.text_1', 'margin-top', _placemarkContentMargin + 'px');
    BaseFunctions.setCss(_placemarkContentBlockSelector + ' div.header_1', 'padding-top', _placemarkContentMargin * 2 + 'px');
    BaseFunctions.setCss(_placemarkContentBlockSelector + ' div.header_1', 'padding-bottom', '0px');

    BaseFunctions.setCss(_placemarkContentBlockSelector, 'padding-bottom', _placemarkContentMargin + 'px');
    BaseFunctions.setCss(_placemarkListElementSelector, 'padding', _placemarkContentMargin + 'px');

    BaseFunctions.setCss(_placemarkListElementDivSelector, 'margin-bottom', _placemarkContentMargin + 'px');

    if (isMobile) {

        BaseFunctions.setWidth(_placemarkBlockSelector, _windowWidth);
        BaseFunctions.setWidth(_placemarkButtonsBlockSelector, _windowWidth);

        if (_isAvailableToChange) {
            BaseFunctions.setWidth(_placemarkCloseSelector, Math.floor(_windowWidth / 3) - parseInt(BaseFunctions.getCss(_placemarkCloseSelector, 'margin-right')));
            BaseFunctions.setWidth(_placemarkToggleSelector, Math.floor(_windowWidth / 3) - parseInt(BaseFunctions.getCss(_placemarkToggleSelector, 'margin-right')));
            BaseFunctions.setWidth(_placemarkUpdateOpenFromViewerSelector, _windowWidth - BaseFunctions.getWidth(_placemarkCloseSelector) - BaseFunctions.getWidth(_placemarkToggleSelector) - parseInt(BaseFunctions.getCss(_placemarkCloseSelector, 'margin-right')) - parseInt(BaseFunctions.getCss(_placemarkToggleSelector, 'margin-right')) - (parseInt(BaseFunctions.getCss(_placemarkUpdateOpenFromViewerSelector, 'margin-right')) * 2));
        } else {
            BaseFunctions.setWidth(_placemarkCloseSelector, Math.floor(_windowWidth / 2) - parseInt(BaseFunctions.getCss(_placemarkCloseSelector, 'margin-right')) - Math.ceil(parseInt(BaseFunctions.getCss(_placemarkCloseSelector, 'margin-right'))/2));
            BaseFunctions.setWidth(_placemarkToggleSelector, Math.floor(_windowWidth / 2) - parseInt(BaseFunctions.getCss(_placemarkToggleSelector, 'margin-right')) - Math.floor(parseInt(BaseFunctions.getCss(_placemarkToggleSelector, 'margin-right'))/2));
        }
        BaseFunctions.setWidth(_placemarkAddSetPointSelector, _windowWidth - (parseInt(BaseFunctions.getCss(_placemarkAddSetPointSelector, 'margin-right')) * 2));
        BaseFunctions.setWidth(_placemarkAddCancelSelector, Math.floor(_windowWidth / 2) - parseInt(BaseFunctions.getCss(_placemarkAddCancelSelector, 'margin-right')) - Math.ceil(parseInt(BaseFunctions.getCss(_placemarkAddCancelSelector, 'margin-right'))/2));
        BaseFunctions.setWidth(_placemarkAddCommitSelector, Math.floor(_windowWidth / 2) - parseInt(BaseFunctions.getCss(_placemarkAddCommitSelector, 'margin-right')) - Math.floor(parseInt(BaseFunctions.getCss(_placemarkAddCommitSelector, 'margin-right'))/2));
        BaseFunctions.hide('.sublist_placemarks_block .placemarks_category_html_content');
        if (atCluster) {
            BaseFunctions.setWidth('.sublist_placemarks_block', BaseFunctions.getWidth(_placemarkContentBlockSelector));
            BaseFunctions.setWidth('.sublist_placemarks_content', BaseFunctions.getWidth('.sublist_placemarks_block') - BaseFunctions.getWidth('.cropped_image_div') - 30);
        } else {
            if (BaseFunctions.getWidth(_placemarkContentBlockSelector) < (BaseFunctions.getWidth('.cropped_image_div') * 6)) {
                BaseFunctions.setWidth('.sublist_placemarks_block', BaseFunctions.getWidth(_placemarkContentBlockSelector));
            }
            else {
                BaseFunctions.setWidth('.sublist_placemarks_block', (BaseFunctions.getWidth(_placemarkContentBlockSelector) / 2));
            }
            BaseFunctions.setWidth('.sublist_placemarks_content', BaseFunctions.getWidth('.sublist_placemarks_block') - BaseFunctions.getWidth('.cropped_image_div') - 30);
        }

    } else {
        if (atCluster) {
            BaseFunctions.setWidth('.sublist_placemarks_block', BaseFunctions.getWidth(_placemarkContentBlockSelector) - 30);
            BaseFunctions.setWidth('.sublist_placemarks_content', BaseFunctions.getWidth('.sublist_placemarks_block') - BaseFunctions.getWidth('.cropped_image_div') - 10);
        } else {
            BaseFunctions.setWidth('.sublist_placemarks_block', (BaseFunctions.getWidth(_placemarkContentBlockSelector)/ 2) - 30);
            BaseFunctions.setWidth('.sublist_placemarks_content', BaseFunctions.getWidth('.sublist_placemarks_block') - BaseFunctions.getWidth('.cropped_image_div') - 10);
        }
    }
    BaseFunctions.setWidth(_placemarkCloseSide1Selector, Math.floor((_windowWidth - BaseFunctions.getWidth(_placemarkBlockSelector)) / 2));
    BaseFunctions.setWidth(_placemarkCloseSide2Selector, BaseFunctions.getWidth(_placemarkCloseSide1Selector));
}

function actionsAfterShowPointData(id, atCluster){
    BaseFunctions.trigger(_yaShield1Selector, 'show', ['on']);
    BaseFunctions.setCss(_placemarkToggleSelector + ' ' + _buttonImageSelector, 'top', _buttonsPlacemarkViewerHidePosition);
    BaseFunctions.setCss(_yMapsIdSelector, 'opacity', 0.62);

    preparePlacemarkViewerDimensions(id, atCluster);
    _currentPlacemarkId = id;
    BaseFunctions.setScrollTop(_placemarkContentSelector, 0);
    BaseFunctions.kickNicescroll(_placemarkContentSelector);
    BaseFunctions.kickNicescroll(_placemarkAddBlockSelector);
    BaseFunctions.kickNicescroll(_placemarkListSelector);
}


function actionsAfterHidePointData(){
    colorizePlacemark(0);
    BaseFunctions.trigger(_yaShield1Selector, 'show', ['off']);
    BaseFunctions.setCss(_yMapsIdSelector, 'opacity', 1);
    BaseFunctions.setCss(_placemarkToggleSelector + ' ' + _buttonImageSelector, 'top', _buttonsPlacemarkViewerHidePosition);
    moveToCluster(_currentPlacemarkId);
    BaseFunctions.setScrollTop(_placemarkContentSelector, 0);
    BaseFunctions.kickNicescroll(_placemarkContentSelector);
    BaseFunctions.kickNicescroll(_placemarkAddBlockSelector);
    BaseFunctions.kickNicescroll(_placemarkListSelector);
}

// возвращаем метку в кластер
function moveToCluster(id) {
    if ((typeof (_placemarks['id_'+id]) !== 'undefined') && (typeof (_placemarks['id_'+id]['object']) !== 'undefined')) {
        _clusterer.add(_placemarks['id_'+id]['object']);
        _map.geoObjects.remove(_placemarks['id_'+id]['object']);
        _map.geoObjects.add(_clusterer);
    }
}



// ПРИ КЛИКЕ НА БАЛУН ВЫЗЫВАЕТСЯ ЭТА ФУНКЦИЯ
// выводим на экран данные метки - из кластера или из балуна
function showPointData(id, atCluster) {
    preparePlacemarkContentDimensions(atCluster, id);
    getPlacemark(id, atCluster);

}



// задаем цвета метке при действиях на карте
function colorizePlacemark(id) {
    // только если сейчас открывается метка а не кластер, это нужно чтобы закрывая прошлые кластера, подсвечивать их как просмотренные
    if (id) {
        let _target = _placemarks['id_'+id]['object'];
        _target.options.set('preset', CategoryViewerModule.getBaloonImage(_placemarks['id_'+id]['data']['category'], true));
    }
    // делаем прошлую метку как просмотренную, если прошлая метка не эта же, на которую мы сейчас снова перешли
    if ((typeof (_placemarkOpenedId) !== 'undefined') && (_placemarkOpenedId !== id)) {
        _placemarks['id_'+_placemarkOpenedId]['object'].options.set('preset', CategoryViewerModule.getBaloonImage(_placemarks['id_'+_placemarkOpenedId]['data']['category']));
    }
    if (id) {
        // теперь открытая метка это она
        _placemarkOpenedId = id;
    }
}






function addTargetPlacemark(coords) {
        if (typeof (_targetPlacemark) === 'object') {
    //перемещаем
        _targetPlacemark.geometry.setCoordinates(coords);
        } else if (typeof (_targetPlacemark) === 'undefined') {
        _targetPlacemark = new window.ymaps.Placemark(coords, {}, {
        preset: _presetPlacemarkNew
        });
                _map.geoObjects.add(_targetPlacemark);
        }
    }

function setAvailableToChange(value){
    _isAvailableToChange = value;
}

function init(matchParams) {
    window.ymaps.ready(function () {
        let _center = [];
        let _zoom = Cookies.getCookie(Consts.YMAP_ZOOM) ? Cookies.getCookie(Consts.YMAP_ZOOM) : DEFAULT_ZOOM;
        _center[0] = typeof Cookies.getCookie('centerx') === 'undefined' ? 10 : Cookies.getCookie('centerx');
        _center[1] = typeof Cookies.getCookie('centery') === 'undefined' ? 50 : Cookies.getCookie('centery');

        _windowWidth = BaseFunctions.getWidth(window);
        _windowHeight = BaseFunctions.getHeight(window);

        CategoryViewerModule.setToMapApi();
        prepareNewPlacemarkBalloonPresets();
        prepareGenericDimensions();

        _map = new window.ymaps.Map('YMapsID', {
            center: _center,
            zoom: _zoom,
            controls: ['searchControl', 'typeSelector']
        }, {
            suppressMapOpenBlock: true,
            searchControlProvider: 'yandex#search'
        });

        _map.controls.add('zoomControl', {position: {left: '10px', top: '130px'}});
        // initialize cluster
        let _clusterIcons = [{
                href: '/img/cluster.png',
                size: [40, 40],
                offset: [-20, -20]
            }];
        _clusterer = new window.ymaps.Clusterer({
            showInAlphabeticalOrder: true,
            clusterIcons: _clusterIcons,
            gridSize: _gridSize,
            groupByCoordinates: false,
            clusterDisableClickZoom: true,
            clusterHideIconOnBalloonOpen: false,
            geoObjectHideIconOnBalloonOpen: false,
            openBalloonOnClick: false
        });

        checkLinkOnId(matchParams);

        /**
         * Кластеризатор расширяет коллекцию, что позволяет использовать один обработчик
         * для обработки событий всех геообъектов.
         * Будем менять цвет иконок и кластеров при наведении.
         */
        _clusterer.events
            //при клике на кластер, подгружаем данные первого в списке элемента
            .add(['click'], function (e) {
                if (BaseFunctions.is(_placemarkAddButtonsSelector, ":visible") !== true) {
                    let _target = e.get('target');
                    // только для кластера с элементами
                    if (typeof _target.getGeoObjects === "function") {
                        showClusterList(_target);
                        // переводим скролл вверх, если вдруг он не там
                        BaseFunctions.setScrollTop(_placemarkListSelector, 0);
                    }
                } else {
                    Events.dispatch('alert', {
                        text: AlertsText.get('new_point/another_actions', 'error'),
                        className: 'error'
                    });
                }
            });


    // события:
    // при клике по полю, в случае добавления новой точки или смены координат существующей, определяем координаты клика и записываем их форму
        _map.events.add('click', function (e) {
            if (_isAvailableToChange
                && BaseFunctions.is(_panelToolsSelector, ":visible")!== true
                && BaseFunctions.is(_placemarkToggleSelector, ":visible")!== true
                && BaseFunctions.is(_placemarkAddSelector, ":visible")!== true) {

                let _coords = e.get('coords');
                BaseFunctions.setVal(_yAddNewPointSelector, _coords[0].toPrecision(6));
                BaseFunctions.setVal(_xAddNewPointSelector, _coords[1].toPrecision(6));

    //если редактируем
                if (_isRedactedStatus === true) {
    // меняем местоположение метки
                    _placemarks['id_'+_currentPlacemarkId]['object'].geometry.setCoordinates(_coords);
                } else {
                    addTargetPlacemark(_coords);
                }
                Events.dispatch('success', {
                    text: AlertsText.get('new_point/placemark_added'),
                    className: 'success'
                });

                clearTimeout(_placemarkAddSetPointTimer);

                _placemarkAddSetPointTimer = setTimeout(function () {

                    if (BaseFunctions.is(_placemarkAddSelector, ":visible") !== true) {

                        //$(placemark_add_set_point_selector).trigger('click'); //ATTENTION - обратите внимание
                    }
                    BaseFunctions.kickNicescroll(_placemarkAddBlockSelector);
                    BaseFunctions.kickNicescroll(_placemarkListSelector);
                }, 2000);
            }
        }).add('boundschange', function (event) {
            loadByCoords();
        });

        BaseFunctions.niceScroll(_placemarkContentSelector);
        BaseFunctions.niceScroll(_placemarkAddBlockSelector);
        BaseFunctions.niceScroll(_placemarkListSelector);
        BaseFunctions.niceScroll("#panel_tools_content_filter_select_block");

        runBunchFillingTimer();
        loadByCoords();
        addAndClustering(true);
    });
}


function runBunchFillingTimer() {
    bunchFilling();//сразу и потом
    if (Config.getServiceConfig().map.autofill.on) {
        _bunchFillingTimer = setInterval(bunchFilling, Config.getServiceConfig().map.autofill.period * 1000);
    }
}

function stopBunchFillingTimer() {
   clearInterval(_bunchFillingTimer);
   _bunchFillingEnd=true;
}

function bunchFilling() {

    if (!_isTooBigRequestedArea){
        //если запрашиваемая область не велика и может подгружаться с помощью координат, то не "заливаем" карту
        //эта функция может выполняться только, когда масштаб карты очень маленький
        return;
    }

    if (_bunchFillingEnd){
        //если вдруг еще раз запустили, чтобы не дергать по пустякам сервер
        return;
    }

    Socket.backgroundQuery(
        Consts.CONTROLLER_NAME_MAP,
        'fill_placemarks_on_map'
    );
}








function showClusterList(target) {

        if (typeof (target) === 'undefined') {
            return;
        }
        //задаем размеры блоков - content и cluster list
        preparePlacemarkContentDimensions(true, null);

        _placemarksRightList = {};
        let _firstId = null;
        // выбираем все данные кластера и отображаем их в попапе

        let _geoObjects = target.getGeoObjects();

        for (let _index in _geoObjects) {
            let _placemark = _geoObjects[_index];
            let _id = _placemark.properties.get('own_id');

            if (_firstId === null) {
                _firstId = _id;
            }
            _placemarksRightList['id_'+_id]=_id;
        }

        BaseFunctions.setCss(_yMapsIdSelector,'opacity', 0.62);
        BaseFunctions.trigger(_yaShield1Selector,'show', ['on']);

        colorizeCluster(target);
        colorizePlacemark(0); // делаем потенциально открытые ранее метки как просмотренные, не знаем какая, но она должна быть закрыта
        placemarkPreview(_firstId, true);
    }








function prepareLoadedPlacemarks(data, isBunch) {

    if (data === Consts.TOO_BIG_MAP_REQUEST_AREA_CODE) {
        if ((typeof(isBunch)==='undefined') || (!isBunch)){
            _isTooBigRequestedArea = true;
        }
    } else {
        let _placemarksDataIsSet = false;
        for (let _index in data) {
            let _placemarkData = data[_index];

            if (saveInPlacemarksData(_placemarkData) === true) {
                _placemarksDataIsSet = true;
            }
        }

        // Если хоть одна новая метка добавилась
        if (_placemarksDataIsSet === true) {
            addAndClustering();
        }
        if (!isBunch){
            _isTooBigRequestedArea = false;
        }
    }
}

function loadByCoords(coords) {
    let _params;
        if (typeof (coords) === 'undefined') {
            let _coordsArray = _map.getBounds();
            _params = {
                'Y1': _coordsArray[1][0],
                'Y2': _coordsArray[0][0],
                'X1': _coordsArray[0][1],
                'X2': _coordsArray[1][1]
            };
        } else {
            _params = coords;
        }
        _params.zoom = _map.getZoom();
        _params.center = _map.getCenter();

        Cookies.setCookie('centerx', _params.center[0]);
        Cookies.setCookie('centery', _params.center[1]);
        Cookies.setCookie(Consts.YMAP_ZOOM, _params.zoom);

        Socket.backgroundQuery(
                Consts.CONTROLLER_NAME_MAP,
                'get_placemarks_by_coords',
                {
                    'Y1': _params.Y1,
                    'Y2': _params.Y2,
                    'X1': _params.X1,
                    'X2': _params.X2,
                    'zoom': _params.zoom
                }
        );
    }



function prepareNewPlacemarkBalloonPresets() {
    window.ymaps.option.presetStorage.add(_presetPlacemarkNew, {
        iconLayout: 'default#image',
        iconImageHref: '/img/new_placemark.png',
        iconImageSize: [26, 37],
        iconImageOffset: [-6, -31]
    });
}




export default {
    init,
    saveInPlacemarksData,
    addAndClustering,
    setCenter,
    setZoom,
    placemarkPreview,
    preparePlacemarkContentDimensions,
    prepareLoadedPlacemarks,
    setAvailableToChange,
    actionsAfterShowPointData,
    stopBunchFillingTimer,
    getPlacemarksRightList,
    getPlacemarks,
    actionsAfterHidePointData,
    getClusterListImageWidth,
    getClusterListImagePrefix,
    getClusterListImageHeight,
    getContentImageWithClusterWidth,
    getContentImageWithoutClusterWidth,
    getContentImageWithClusterPrefix,
    getContentImageWithoutClusterPrefix,
    checkLinkOnId
}