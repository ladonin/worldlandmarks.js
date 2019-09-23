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
import ErrorsText from 'src/modules/ErrorsText';

const DEFAULT_ZOOM = 5;
let _filterCategory = false;
let _objectName = 'my_map_vendor';
let _linkId;
let _currentPlacemarkId;
let _isEnableToChangeMapStatus = false;
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
let _isTooBigRequestedArea = 0;
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
let _placemarks = [];
let _placemarksRightList = [];
let _showRightList = false;
let _targetPlacemark;
let _map;
let _clusterer;
let _windowHeight;
let _windowWidth;

// Selectors:
//let _xAddNewPointSelector = '#<?php echo(my_pass_through(@self::get_model(MY_MODEL_NAME_FORM_ADD_NEW_POINT)->get_id('x'))); ?>';//ATTENTION - обратите внимание
//let _yAddNewPointSelector = '#<?php echo(my_pass_through(@self::get_model(MY_MODEL_NAME_FORM_ADD_NEW_POINT)->get_id('y'))); ?>';//ATTENTION - обратите внимание

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
let _contentImageWithoutClusterWith;
let _clusterListImagePrefix = null;
let _contentImageWithClusterPrefix = null;
let _contentImageWithoutClusterPrefix = null;
let _prefix;
let _bunchFillingTimer;
let _bunchFillingEnd = 0;

function prepareGenericDimensions() {

    if (isMobile) {
        _clusterListImageWidth = Math.floor(_windowWidth * 0.25);
        _clusterListImageHeight = Math.floor(_clusterListImageWidth * 0.75);
        _placemarkContentMargin = 8;
        _contentImageWithClusterWidth = _windowWidth - (_clusterListImageWidth + (_placemarkContentMargin * 2));
        _contentImageWithoutClusterWith = _windowWidth; // без отступов
        //my_fileuploader_object.update({statusBarWidth: 184}); //ATTENTION - обратите внимание
    } else {
        _clusterListImageWidth = 210;
        _clusterListImageHeight = 170;
        _placemarkContentMargin = 10;
        _contentImageWithClusterWidth = BaseFunctions.getWidth(_placemarkBlockSelector) - (_clusterListImageWidth + (_placemarkContentMargin * 2));
        _contentImageWithoutClusterWith = BaseFunctions.getWidth(_placemarkBlockSelector);
        //my_fileuploader_object.update({statusBarWidth: 450});//ATTENTION - обратите внимание
    }

    let _clusterImageWidthDimension = Math.floor(_clusterListImageWidth * 0.2);
    _clusterListImagePrefix = ImageDimensions.getPrefix(_clusterListImageWidth, _clusterImageWidthDimension);
    _contentImageWithClusterPrefix = ImageDimensions.getPrefix(_contentImageWithClusterWidth, 0);
    _contentImageWithoutClusterPrefix = ImageDimensions.getPrefix(_contentImageWithoutClusterWith, 0);
    BaseFunctions.setHeight(_yMapsIdSelector, _windowHeight);
    BaseFunctions.setHeight(_placemarkSelector, _windowHeight - (parseInt(BaseFunctions.getCss(_placemarkSelector, 'margin-top')) * 2));
    BaseFunctions.setHeight(_placemarkAddSelector, _windowHeight - (parseInt(BaseFunctions.getCss(_placemarkAddSelector, 'margin-top')) * 2));
    BaseFunctions.setHeight(_placemarkAddBlockSelector,BaseFunctions.getHeight(_placemarkAddSelector) - BaseFunctions.getHeight(_placemarkAddSetPointSelector) - BaseFunctions.getHeight(_placemarkAddCancelSelector) -15);
    _buttonsHeight = BaseFunctions.getHeight(_openPanelSelector);
    BaseFunctions.setCss(_placemarkButtonsSelector,'top', _windowHeight - BaseFunctions.getHeight(_placemarkButtonsBlockSelector) - parseInt(BaseFunctions.getCss(_placemarkButtonsBlockSelector, 'padding-bottom')) - parseInt(BaseFunctions.getCss(_placemarkButtonsBlockSelector, 'padding-top')) + 'px');
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
    _map.setCenter([_placemarks[id]['data']['y'], _placemarks[id]['data']['x']]);
}

function setZoom(type) {
    if (type === 'whereAmI') {
        _map.setZoom(_zoomWhereAmI);
    }
}




function saveInPlacemarksData(data) {
        let _id = data['id'];
// Если такая метка уже есть в массие, с условием, что мы не обновляем её, то не задаем её снова
        if ((_isRedactedStatus === false) && (typeof (_placemarks[_id]) !== 'undefined')) {
            return false;
        }
// при обновлении не будем уничтожать объект - там ведь только его сущность и координаты, данные все в массиве, вот их и будем обновлять
        if (_isRedactedStatus === false) {
            _placemarks[_id] = {};
        }

        _placemarks[_id]['data'] = data;
        return true;
    }

// добавление и кластеризация элементов карты
function addAndClustering () {
    let _clusterIsUpdated = false;
    let _newPlacemarkData;
    let _placemarksToAdd = [];

    // проходим по каждой метке и добавляем её в виде балуна на карту
    for (let _id in _placemarks) {

        let _placemark = _placemarks[_id];

        // Only if object was not created for current element yet
        if ((typeof (_placemark) !== 'undefined') && (typeof (_placemark['object']) === 'undefined')) {
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
function colorizeCluster (target) {

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
    _placemarks[id]['object'] = _myPlacemark;
// что делаем при клике на балун
    _myPlacemark.events.add('click', function (e) {
        if (BaseFunctions.is(_placemarkAddButtonsSelector, ':visible') !== true) {
            _placemarksRightList = [];
            _showRightList = false;
            placemarkPreview(id, false);
        } else {
            Events.dispatch('alert', {
                text: ErrorsText.get('new_point/another_actions'),
                className:'error'
            });
        }
    });
    return _myPlacemark;
}

// отоюбражение данных балуна
function placemarkPreview (id, atCluster) {
    _showPlacemarkAddOpenSelector = false;
    _showOpenPanelSelector = false;
    getPointData(id, atCluster);
}


// получение данных балуна
function getPointData(id, atCluster) {
    showPointData(id, atCluster);
    colorizePlacemark(id);
}

function getPlacemarksRightList(){
    return _placemarksRightList;
}

    // подготавливаем габариты окна просмотра балуна - NOTE:  нельзя прописать это в css, потому что теги еще не существуют
function preparePlacemarkContentDimensions(atCluster) {
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
}






function checkLinkOnId() {

    if (_linkId) {
        getPlacemark(_linkId);
    }
}

function getPlacemark(id, atCluster = false) {

        Socket.backgroundQuery(
            Consts.CONTROLLER_NAME_MAP,
            'get_placemark',
            {
                [Consts.ID_VAR_NAME]:id,
                atCluster
            }
        );
}



// ПРИ КЛИКЕ НА БАЛУН ВЫЗЫВАЕТСЯ ЭТА ФУНКЦИЯ
// выводим на экран данные метки - из кластера или из балуна
function showPointData(id, atCluster) {
    if (atCluster === 1) {
        Events.dispatch('mapPlacemarksListChangeSelected', {id});
        preparePlacemarkContentDimensions(atCluster);

/*
        getPlacemark(id, atCluster);









        VK.Widgets.Like("vk_like", {type: "button", pageTitle:placemarks[id]['data']['title'], pageUrl:'http://world-landmarks.ru/catalog/' +  placemarks[id]['data']['catalog_url']},id);//  like
        share42();

        //console.log('pageTitle: '+placemarks[id]['data']['title']);
        //console.log('pageUrl: '+'http://world-landmarks.ru/catalog/' +  placemarks[id]['data']['catalog_url']);
        //console.log('id: '+id);
        //console.log('>>>');
        // при клике на ссылку - она выделится
                    $("#placemark_link_" + id + " span").click(function () {
            var r = document.createRange();
                    r.selectNode(this);
                    document.getSelection().addRange(r);
            });
            $(_placemarkSelector).show();
//$(shadow_selector).show();
            $(placemark_buttons_selector).show();
            $(ya_shield_1_selector).trigger('show', ['on']);
            $(placemark_toggle_selector).html('<?php echo(my_htmlller_buttons(self::trace('buttons/placemark/viewer/hide'))); ?>');
            $(placemark_toggle_selector + ' ' + button_image_selector).css('top', buttons_placemark_viewer_hide_position);
            $(YMaps_ID_selector).css('opacity', 0.62);
            prepare_placemark_viewer_dimensions(id, atCluster);
            current_placemark_id = id;
// переводим скролл вверх, если вдруг он не там
            document.getElementById("placemark_content").scrollTop = 0;
            kick_1_nicescroll('placemark_add_block');
            kick_1_nicescroll('placemark_list');*/
    }
}



    // задаем цвета метке при действиях на карте
function colorizePlacemark(id) {
    // только если сейчас открывается метка а не кластер, это нужно чтобы закрывая прошлые кластера, подсвечивать их как просмотренные
    if (id) {
        let _target = _placemarks[id]['object'];
        _target.options.set('preset', CategoryViewerModule.getBaloonImage(_placemarks[id]['data']['category'], 1));
    }
    // делаем прошлую метку как просмотренную, если прошлая метка не эта же, на которую мы сейчас снова перешли
    if ((typeof (_placemarkOpenedId) !== 'undefined') && (_placemarkOpenedId !== id)) {
        _placemarks[_placemarkOpenedId]['object'].options.set('preset', CategoryViewerModule.getBaloonImage(_placemarks[_placemarkOpenedId]['data']['category']));
    }
    if (id) {
        // теперь открытая метка это она
        _placemarkOpenedId = id;
    }
}


function init(coords, matchParams){

    window.ymaps.ready(function () {

    _zoom = Cookies.getCookie(Consts.YMAP_ZOOM) ? Cookies.getCookie(Consts.YMAP_ZOOM) : DEFAULT_ZOOM;

    _windowWidth = BaseFunctions.getWidth(window);
    _windowHeight = BaseFunctions.getHeight(window);
    _linkId = Router.getActionData(undefined, matchParams)[Consts.ID_VAR_NAME];
    prepareBalloonPresets();
    prepareGenericDimensions();

    _map = new window.ymaps.Map('YMapsID', {
        center: coords,
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
        offset: [ -20, -20]
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
    checkLinkOnId();

BaseFunctions.niceScroll(_placemarkContentSelector);
BaseFunctions.niceScroll(_placemarkAddBlockSelector);
BaseFunctions.niceScroll(_placemarkListSelector);
BaseFunctions.niceScroll("#panel_tools_content_filter_select_block");







    });
}











function prepareBalloonPresets() {
    window.ymaps.option.presetStorage.add(_presetPlacemarkNew, {
        iconLayout: 'default#image',
        iconImageHref: '/img/new_placemark.png',
        iconImageSize: [26, 37],
        iconImageOffset: [ -6, -31]
    });
}




export default {
    init,
    saveInPlacemarksData,
    addAndClustering,
    setCenter,
    setZoom,
    placemarkPreview,
    preparePlacemarkContentDimensions
}