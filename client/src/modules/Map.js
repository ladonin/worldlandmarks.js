/*
 * File src/modules/Map.js
 * import MapModule from 'src/modules/Map';
 *
 * Map module
 */
import Consts from 'src/settings/Constants';
import Config from 'src/settings/Config';
import {isMobile, isBrowser} from "react-device-detect";
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
let _linkId;
let _currentPlacemarkId;
let _isRedactedStatus = false;

let _buttonsPlacemarkViewerHidePosition;
let _zoomWhereAmI;
let _placemarkViewZoom;
let _placemarkComponentRef;
let _panelToolsComponentRef;

if (isMobile) {
    _buttonsPlacemarkViewerHidePosition = '-75px';
    _zoomWhereAmI = 17;
    _placemarkViewZoom = 16;
} else {
    _buttonsPlacemarkViewerHidePosition = '-120px';
    _zoomWhereAmI = 14;
    _placemarkViewZoom = 17;
}
let _isTooBigRequestedArea = false;
let _presetPlacemarkNew = 'custom#new_placemark';
let _placemarkOpenedId;
let _gridSize = 50;
let _clusterListImageWidth;
let _clusterListImageHeight;
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

let _placemarkSelector = '#placemark';
let _placemarkButtonsBlockSelector = '#placemark_buttons_block';
let _placemarkToggleSelector = '#placemark_toggle';
let _placemarkAddButtonsSelector = '#placemark_add_buttons';
let _placemarkAddSetPointSelector = '#placemark_add_set_point';
let _buttonImageSelector = 'div.icon img';
let _placemarkBlockSelector = '#placemark_block';
let _placemarkCloseSide1Selector = '#placemark_close_side_1';
let _placemarkCloseSide2Selector = '#placemark_close_side_2';
let _placemarkAddCommitSelector = '#placemark_add_commit';
let _placemarkListElementSelector = '.placemark_list_element';
let _placemarkListSelector = '#placemark_list';
let _placemarkListElementDivSelector = '.placemark_list_element div';
let _placemarkContentSelector = '#placemark_content';
let _placemarkContentBlockSelector = '#placemark_content_block';
let _placemarkAddCancelSelector = '#placemark_add_cancel';
let _placemarkAddBlockSelector = '#placemark_add_block';
let _placemarkAddSelector = '#placemark_add';
let _placemarkAddOpenSelector = '#placemark_add_open';
let _showPlacemarkAddOpenSelector = false;
let _showOpenPanelSelector = false;
let _panelToolsSelector = '#panel_tools';
let _yaShield1Selector = '#ya_shield_1';
let _yMapsIdSelector = '#YMapsID';

let _placemarkContentMargin;
let _placemarkAddSetPointTimer;
let _contentImageWithClusterWidth;
let _contentImageWithoutClusterWidth;
let _clusterListImagePrefix = null;
let _contentImageWithClusterPrefix = null;
let _contentImageWithoutClusterPrefix = null;
let _bunchFillingTimer;
let _bunchFillingEnd = 0;

function getClusterListImagePrefix()
{
    return _clusterListImagePrefix;
}


function getClusterListImageWidth()
{
    return _clusterListImageWidth;
}


function getClusterListImageHeight()
{
    return _clusterListImageHeight;
}


function getContentImageWithClusterWidth()
{
    return _contentImageWithClusterWidth;
}


function getContentImageWithoutClusterWidth()
{
    return _contentImageWithoutClusterWidth;
}


function getContentImageWithClusterPrefix()
{
    return _contentImageWithClusterPrefix;
}


function getContentImageWithoutClusterPrefix()
{
    return _contentImageWithoutClusterPrefix;
}


function prepareGenericDimensions()
{
    if (isMobile) {
        _clusterListImageWidth = Math.floor(_windowWidth * 0.25);
        _clusterListImageHeight = Math.floor(_clusterListImageWidth * 0.75);
        _placemarkContentMargin = 8;
        _contentImageWithClusterWidth = _windowWidth - (_clusterListImageWidth + (_placemarkContentMargin * 2));
        _contentImageWithoutClusterWidth = _windowWidth;
    } else {
        _clusterListImageWidth = 210;
        _clusterListImageHeight = 170;
        _placemarkContentMargin = 10;
        _contentImageWithClusterWidth = BaseFunctions.getWidth(_placemarkBlockSelector) - (_clusterListImageWidth + (_placemarkContentMargin * 2));
        _contentImageWithoutClusterWidth = BaseFunctions.getWidth(_placemarkBlockSelector);
    }

    let _clusterImageWidthDimension = Math.floor(_clusterListImageWidth * 0.2);
    _clusterListImagePrefix = ImageDimensions.getPrefix(_clusterListImageWidth, _clusterImageWidthDimension);
    _contentImageWithClusterPrefix = ImageDimensions.getPrefix(_contentImageWithClusterWidth, 0);
    _contentImageWithoutClusterPrefix = ImageDimensions.getPrefix(_contentImageWithoutClusterWidth, 0);
    BaseFunctions.setHeight(_yMapsIdSelector, _windowHeight);
    BaseFunctions.setHeight(_placemarkSelector, _windowHeight - (isMobile ? 55 : 80));
    BaseFunctions.setHeight(_placemarkAddSelector, _windowHeight - (parseInt(BaseFunctions.getCss(_placemarkAddSelector, 'margin-top')) * 2));
    BaseFunctions.setHeight(_placemarkAddBlockSelector, BaseFunctions.getHeight(_placemarkAddSelector) - BaseFunctions.getHeight(_placemarkAddSetPointSelector) - BaseFunctions.getHeight(_placemarkAddCancelSelector) - 15);
    BaseFunctions.setCss(_placemarkAddButtonsSelector, 'top', _windowHeight - BaseFunctions.getHeight(_placemarkAddButtonsSelector) - parseInt(BaseFunctions.getCss(_placemarkAddButtonsSelector, 'margin-bottom')) + 'px');
    BaseFunctions.show(_placemarkAddOpenSelector);
    BaseFunctions.setHeight(_placemarkListSelector, BaseFunctions.getHeight(_placemarkSelector));
    BaseFunctions.setHeight(_placemarkContentSelector, BaseFunctions.getHeight(_placemarkSelector));
    _placemarkHeight = BaseFunctions.getHeight(_placemarkSelector);
    BaseFunctions.setHeight(_placemarkCloseSide1Selector, _placemarkHeight);
    BaseFunctions.setHeight(_placemarkCloseSide2Selector, _placemarkHeight);
}


function setCenter(id)
{
    _map.setCenter([_placemarks['id_'+id]['data']['y'], _placemarks['id_'+id]['data']['x']]);
}


function setZoom(type)
{
    if (type === 'whereAmI') {
        _map.setZoom(_zoomWhereAmI);
    }
}


function saveInPlacemarksData(data)
{
    let _id = data['id'];
    if ((_isRedactedStatus === false) && (typeof (_placemarks['id_'+_id]) !== 'undefined')) {
        return false;
    }
    if (_isRedactedStatus === false) {
        _placemarks['id_'+_id] = {};
    }
    _placemarks['id_'+_id]['data'] = data;
    _placemarks['id_'+_id]['data']['categories'] = [data['category'],...(data['categories_html']['subcategories'] !== null ? data['categories_html']['subcategories'].split(',').map((val)=>parseInt(val)) : [])];
    return true;
}


function filterByCategory(id)
{
    hideAllPlacemarksFromMap();
    _filterCategory = id;
    addAndClustering(true);
}


function resetFilterByCategory()
{
    hideAllPlacemarksFromMap();
    _filterCategory = false;
    addAndClustering(true);
}


function hideAllPlacemarksFromMap()
{
    _placemarkOpenedId = undefined;
    _clusterer.removeAll();
    _map.geoObjects.removeAll();
}


function addAndClustering(init = false)
{
    let _clusterIsUpdated = false;
    let _newPlacemarkData;
    let _placemarksToAdd = [];

    // Going through each landmark and add it as baloon on map
    for (let _key in _placemarks) {

        let _placemark = _placemarks[_key];
        let _id = _placemark.data.id;

        // Only if object was not created for current element yet
        if (init === true || ((typeof (_placemark) !== 'undefined') && (typeof (_placemark['object']) === 'undefined'))) {
            _newPlacemarkData = addPlacemark(_id, _placemark['data']);

            if ((_filterCategory === false) || (_placemark['data']['categories'].includes(_filterCategory))) {
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


function colorizeCluster(target) {}


// Add baloon on map
function addPlacemark(id, data)
{
    let _coords = [data['y'], data['x']];
    let _myPlacemark = new window.ymaps.Placemark(
        _coords,
        {
            own_id: id
        },
        // Baloon icon image
        CategoryViewerModule.getBaloonImage(data['category'])
    );

    // Save the baloon in array
    _placemarks['id_'+id]['object'] = _myPlacemark;

    _myPlacemark.events.add('click', function (e) {
        _placemarkComponentRef.close();
        _panelToolsComponentRef.hide();
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


function placemarkPreview(id, atCluster)
{
    _showPlacemarkAddOpenSelector = false;
    _showOpenPanelSelector = false;
    getPointData(id, atCluster);
}


function setPlacemarkComponentRef(ref)
{
    _placemarkComponentRef = ref;
}


function setPanelToolsComponentRef(ref)
{
    _panelToolsComponentRef = ref;
}


function getPointData(id, atCluster)
{
    showPointData(id, atCluster);
    colorizePlacemark(id);
}


function getPlacemarksRightList()
{
    return _placemarksRightList;
}


function getPlacemarks()
{
    return _placemarks;
}


// Prepare placemark block dimentions according with actual state
function preparePlacemarkContentDimensions(atCluster, id)
{
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
    BaseFunctions.scrollTop(_placemarkContentSelector, 0);
    if (isBrowser) {
        BaseFunctions.kickNicescroll(_placemarkContentSelector);
        BaseFunctions.kickNicescroll(_placemarkAddBlockSelector);
        BaseFunctions.kickNicescroll(_placemarkListSelector);
    }

    if (atCluster && id) {
        BaseFunctions.scrollTo(_placemarkListSelector, '#placemark_list_element_'+id);
    }
}


function checkLinkOnId(matchParams)
{
    _linkId = Router.getActionData(undefined, matchParams)[Consts.ID_VAR_NAME];
    if (_linkId) {
        _panelToolsComponentRef.hide();
        getPlacemark(_linkId);
    }
}


function getPlacemark(id, atCluster = false)
{
    Socket.backgroundQuery(
            Consts.CONTROLLER_NAME_MAP,
            'get_placemark',
            {
                [Consts.ID_VAR_NAME]: id,
                atCluster
            }
    );
}


// Prepare placemark viewer dimentions according with actual state
function preparePlacemarkViewerDimensions(id, atCluster)
{
    BaseFunctions.setCss(_placemarkContentBlockSelector + ' div.text_1', 'margin-top', _placemarkContentMargin + 'px');
    BaseFunctions.setCss(_placemarkContentBlockSelector + ' div.header_1', 'padding-top', _placemarkContentMargin * 2 + 'px');
    BaseFunctions.setCss(_placemarkContentBlockSelector + ' div.header_1', 'padding-bottom', '0px');
    BaseFunctions.setCss(_placemarkListElementSelector, 'padding', _placemarkContentMargin + 'px');
    BaseFunctions.setCss(_placemarkListElementDivSelector, 'margin-bottom', _placemarkContentMargin + 'px');

    if (isMobile) {

        BaseFunctions.setWidth(_placemarkBlockSelector, _windowWidth);
        BaseFunctions.setWidth(_placemarkButtonsBlockSelector, _windowWidth);
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


function actionsAfterShowPointData(id, atCluster)
{
    BaseFunctions.trigger(_yaShield1Selector, 'show', ['on']);
    BaseFunctions.setCss(_placemarkToggleSelector + ' ' + _buttonImageSelector, 'top', _buttonsPlacemarkViewerHidePosition);
    BaseFunctions.setCss(_yMapsIdSelector, 'opacity', 0.62);
    colorizePlacemark(id);
    preparePlacemarkViewerDimensions(id, atCluster);
    _currentPlacemarkId = id;
    BaseFunctions.scrollTop(_placemarkContentSelector, 0);
    if (isBrowser) {
        BaseFunctions.kickNicescroll(_placemarkContentSelector);
        BaseFunctions.kickNicescroll(_placemarkAddBlockSelector);
        BaseFunctions.kickNicescroll(_placemarkListSelector);
    }
}


function actionsAfterClosePointData()
{
    colorizePlacemark(0);
    BaseFunctions.trigger(_yaShield1Selector, 'show', ['off']);
    BaseFunctions.setCss(_yMapsIdSelector, 'opacity', 1);
    BaseFunctions.setCss(_placemarkToggleSelector + ' ' + _buttonImageSelector, 'top', _buttonsPlacemarkViewerHidePosition);
    moveToCluster(_currentPlacemarkId);
    BaseFunctions.scrollTop(_placemarkContentSelector, 0);
    if (isBrowser) {
        BaseFunctions.kickNicescroll(_placemarkContentSelector);
        BaseFunctions.kickNicescroll(_placemarkAddBlockSelector);
        BaseFunctions.kickNicescroll(_placemarkListSelector);
    }
}


// Return baloon to cluster
function moveToCluster(id)
{
    if ((typeof (_placemarks['id_'+id]) !== 'undefined') && (typeof (_placemarks['id_'+id]['object']) !== 'undefined')) {
        _clusterer.add(_placemarks['id_'+id]['object']);
        _map.geoObjects.remove(_placemarks['id_'+id]['object']);
        _map.geoObjects.add(_clusterer);
    }
}


// Show data from baloon or cluster
function showPointData(id, atCluster)
{
    preparePlacemarkContentDimensions(atCluster, id);
    getPlacemark(id, atCluster);

}


function colorizePlacemark(id)
{
    if (id) {
        let _target = _placemarks['id_'+id]['object'];
        _target.options.set('preset', CategoryViewerModule.getBaloonImage(_placemarks['id_'+id]['data']['category'], true));
    }
    if ((typeof (_placemarkOpenedId) !== 'undefined') && (_placemarkOpenedId !== id)) {
        _placemarks['id_'+_placemarkOpenedId]['object'].options.set('preset', CategoryViewerModule.getBaloonImage(_placemarks['id_'+_placemarkOpenedId]['data']['category']));
    }
    if (id) {
        _placemarkOpenedId = id;
    }
}


function addTargetPlacemark(coords)
{
    if (typeof (_targetPlacemark) === 'object') {
        _targetPlacemark.geometry.setCoordinates(coords);
    } else if (typeof (_targetPlacemark) === 'undefined') {
        _targetPlacemark = new window.ymaps.Placemark(coords, {}, {
        preset: _presetPlacemarkNew
        });
        _map.geoObjects.add(_targetPlacemark);
    }
}


function setAvailableToChange(value)
{
    _isAvailableToChange = value;
}


function init(coords, matchParams)
{
    let _center = [];
    let _zoom = Cookies.getCookie(Consts.YMAP_ZOOM) ? Cookies.getCookie(Consts.YMAP_ZOOM) : DEFAULT_ZOOM;
    _center[0] = typeof Cookies.getCookie('centerx') === 'undefined' ? coords[0] : Cookies.getCookie('centerx');
    _center[1] = typeof Cookies.getCookie('centery') === 'undefined' ? coords[1] : Cookies.getCookie('centery');

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
    // Initialize cluster
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

    _clusterer.events
        // On click on clustrer show first baloon in cluster
        .add(['click'], function (e) {
            _placemarkComponentRef.close();
            _panelToolsComponentRef.hide();
            if (BaseFunctions.is(_placemarkAddButtonsSelector, ":visible") !== true) {
                let _target = e.get('target');
                if (typeof _target.getGeoObjects === "function") {
                    showClusterList(_target);
                    BaseFunctions.scrollTop(_placemarkListSelector, 0);
                }
            } else {
                Events.dispatch('alert', {
                    text: AlertsText.get('new_point/another_actions', 'error'),
                    className: 'error'
                });
            }
        });

    _map.events.add('click', function (e) {
        if (_isAvailableToChange
            && BaseFunctions.is(_panelToolsSelector, ":visible")!== true
            && BaseFunctions.is(_placemarkToggleSelector, ":visible")!== true
            && BaseFunctions.is(_placemarkAddSelector, ":visible")!== true) {

            let _coords = e.get('coords');
            BaseFunctions.setVal(_yAddNewPointSelector, _coords[0].toPrecision(6));
            BaseFunctions.setVal(_xAddNewPointSelector, _coords[1].toPrecision(6));

            if (_isRedactedStatus === true) {
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
                if (isBrowser) {
                    BaseFunctions.kickNicescroll(_placemarkAddBlockSelector);
                    BaseFunctions.kickNicescroll(_placemarkListSelector);
                }
            }, 2000);
        }
    }).add('boundschange', function (event) {
        loadByCoords();
    });

    if (isBrowser) {
        BaseFunctions.niceScroll(_placemarkContentSelector);
        BaseFunctions.niceScroll(_placemarkAddBlockSelector);
        BaseFunctions.niceScroll(_placemarkListSelector);
    }

    runBunchFillingTimer();
    loadByCoords();
    addAndClustering(true);
}


function restartBunchFillingTimer()
{
    clearInterval(_bunchFillingTimer);
    _bunchFillingEnd=false;
    runBunchFillingTimer();
}


function suspendBunchFillingTimer()
{
   clearInterval(_bunchFillingTimer);
}


function resumeBunchFillingTimer()
{
   runBunchFillingTimer();
}


function runBunchFillingTimer()
{
    bunchFilling();
    if (Config.getServiceConfig().map.autofill.on) {
        clearInterval(_bunchFillingTimer);
        _bunchFillingTimer = setInterval(bunchFilling, Config.getServiceConfig().map.autofill.period * 1000);
    }
}


function stopBunchFillingTimer()
{
   clearInterval(_bunchFillingTimer);
   _bunchFillingEnd=true;
}


function bunchFilling()
{

    if (!_isTooBigRequestedArea){
        // If requester area is not too big then don't filling
        return;
    }

    if (_bunchFillingEnd){
        // To avoid request duplications
        return;
    }

    Socket.backgroundQuery(
        Consts.CONTROLLER_NAME_MAP,
        'fill_placemarks_on_map',
        {
            'filterCategory': _filterCategory
        }
    );
}


function showClusterList(target)
{

    if (typeof (target) === 'undefined') {
        return;
    }

    preparePlacemarkContentDimensions(true, null);
    _placemarksRightList = {};
    let _firstId = null;
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
    colorizePlacemark(0);
    placemarkPreview(_firstId, true);
}


function prepareLoadedPlacemarks(data, isBunch)
{
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

        // If at least one placemark is added
        if (_placemarksDataIsSet === true) {
            addAndClustering();
        }
        if (!isBunch){
            _isTooBigRequestedArea = false;
        }
    }
}


function loadByCoords(coords)
{
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
                'zoom': _params.zoom,
                'filterCategory': false
            }
    );
}


function prepareNewPlacemarkBalloonPresets()
{
    window.ymaps.option.presetStorage.add(_presetPlacemarkNew, {
        iconLayout: 'default#image',
        iconImageHref: '/img/new_placemark.png',
        iconImageSize: [26, 37],
        iconImageOffset: [-6, -31]
    });
}


// Separate baloon from cluster
function removeFromCluster(id)
{
    if ((typeof (_placemarks['id_'+id]) !== 'undefined') && (typeof (_placemarks['id_'+id]['object']) !== 'undefined')) {
        _clusterer.remove(_placemarks['id_'+id]['object']);
        _map.geoObjects.add(_placemarks['id_'+id]['object']);
    }
}


function showPlace()
{
    BaseFunctions.setCss(_yMapsIdSelector,'opacity', 1);
    _map.setCenter([_placemarks['id_'+_currentPlacemarkId]['data']['y'], _placemarks['id_'+_currentPlacemarkId]['data']['x']]);
    _map.setZoom(_placemarkViewZoom);
    removeFromCluster(_currentPlacemarkId);
}


function hidePlace()
{
    BaseFunctions.setCss(_yMapsIdSelector,'opacity', 0.62);
    moveToCluster(_currentPlacemarkId);
}


function getFilterCategory()
{
    return _filterCategory;
}


function run(matchParams, action)
{
    window.ymaps.ready(function () {
        function ymapsGeolocation() {
            window.ymaps.geolocation.get({
                provider: 'yandex',
                mapStateAutoApply: true
            }).then(function (result) {
                let _bounds = result.geoObjects.get(0).properties.get('boundedBy');
                let _coords = window.ymaps.util.bounds.getCenter(_bounds);
                if (action === 'init') {
                    init(_coords, matchParams);
                } else if (action === 'replace') {
                    locate(_coords);
                }
            }).catch(function(r) {
                if (action === 'init') {
                    init([50,10], matchParams);
                }
            });
        }

        // Maximum precision of location determination (is used in mobile devices)
        if ((window.navigator.geolocation) && isMobile && !1) {
            window.navigator.geolocation.getCurrentPosition(function (position) {
                let _latitude = position.coords.latitude;
                let _longitude = position.coords.longitude;
                let _coords = [_latitude, _longitude];
                if (action === 'init') {
                    init(_coords, matchParams);
                } else if (action === 'replace') {
                    locate(_coords);
                }
            }, function () {
                // Else - origin way
                ymapsGeolocation();
            }).catch(function(r) {
                if (action === 'init') {
                    init([50,10], matchParams);
                }
            });;
        } else {
            // Else - origin way
            ymapsGeolocation();
        }
    });
}


function locate(coords)
{
    _map.setCenter(coords);
    _map.setZoom(_zoomWhereAmI);
}


export default {
    run,
    getFilterCategory,
    hidePlace,
    showPlace,
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
    actionsAfterClosePointData,
    getClusterListImageWidth,
    getClusterListImagePrefix,
    getClusterListImageHeight,
    getContentImageWithClusterWidth,
    getContentImageWithoutClusterWidth,
    getContentImageWithClusterPrefix,
    getContentImageWithoutClusterPrefix,
    checkLinkOnId,
    setPlacemarkComponentRef,
    setPanelToolsComponentRef,
    filterByCategory,
    resetFilterByCategory,
    restartBunchFillingTimer,
    suspendBunchFillingTimer,
    resumeBunchFillingTimer
}