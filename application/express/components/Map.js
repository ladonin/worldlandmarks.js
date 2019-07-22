/*
 * File application/express/components/Map.js
 * const Map = require('application/express/components/Map');
 *
 * Map component - compute map data
 */

const Fetch = require('node-fetch');
const Deasync = require('deasync');
var Fs = require('fs');

const Component = require('application/express/core/Component');
const BaseFunctions = require('application/express/functions/BaseFunctions');
const Consts = require('application/express/settings/Constants');
const ErrorCodes = require('application/express/settings/ErrorCodes');
const AccessConfig = require_once('application/express/settings/gitignore/Access');
const Service = require('application/express/core/Service');
const GeocodeCollectionModel = require('application/express/models/dbase/mysql/GeocodeCollection');
const MapPhotosModel = require('application/express/models/dbase/mysql/MapPhotos');
const MapDataModel = require('application/express/models/dbase/mysql/MapData');
const Users = require('application/express/core/Users');
const Config = require('application/express/settings/Config');
const StrictFunctions = require('application/express/functions/StrictFunctions');
const Ftp = require('application/express/components/base/Ftp');
const SizeOf = require('image-size');
const UsersModel = require('application/express/models/dbase/mysql/Users');

class Map extends Component {

    constructor(){
        super();

        /*
         * Example: https://geocode-maps.yandex.ru/1.x/?format=json&apikey=APIKEY&geocode=19.611347,0.760241&lang=en
         */
        this.GEOCODE_SERVICE_URL = 'https://geocode-maps.yandex.ru/1.x/?';



    }




//ATTENTION - обратите внимание
// get_name => this.getServiceName()
//get_db_model => сразу берем из require
// module() => и модуль и компонент один файл


    /*
     * Get placemark full data by id
     *
     * @param {integer} id - placemark id
     *
     * @return {object} - placemark data
     */
    getPointContentById(id)
    {
        let _result = this.getPointContentByIds(
                [id],
                true,
                undefined,
                Service.getInstance(this.requestId).isShowRelevantPlacemarks(),
                Service.getInstance(this.requestId).isShowAnotherPlacemarks()
        );
        return _result[id];
    }



    /*
     * Get adress by coordinates from API
     *
     * @param {object} coords - coordinates {x,y}
     * @param {string} language - desired adress language
     *
     * @return {object} - adress
     */
    getAdressByCoords(coords, language = '')
    {
        if (!language) {
            language = this.getLanguage();
        }

        if (!language) {
            this.error(Consts.ERROR_LANGUAGE_NOT_FOUND, 'language [' + language + ']');
        }

        let _query = this.GEOCODE_SERVICE_URL + 'format=json&apikey=' + AccessConfig.yandexMapApiKey + '&geocode='+ coords.x + ',' + coords.y + '&lang=' + language;
        let _apiData;
        let _finished = false;

        fetch(_query)
            .then(function(response) {
                return response.json();
            })
            .then(function(data) {
                _apiData = data;
                _finished = true;
            });

        // Wait for process to be finished
        Deasync.loopWhile(function () {
            return !finished;
        });

        if (_apiData.error) {
            this.error(ErrorCodes.ERROR_MAP_API, _apiData.error.message);
        }

        if (!data.response || !data.response.GeoObjectCollection || !BaseFunctions.isSet(data.response.GeoObjectCollection.featureMember)) {
            this.error(ErrorCodes.ERROR_MAP_API_CHANGED_DATA);
        }
        let _featureMember = data.response.GeoObjectCollection.featureMember;
        let _adress = {};

        _adress['addressComponents'] = _featureMember[0];
        _adress['formattedAddress'] = _featureMember[0]['GeoObject']['metaDataProperty']['GeocoderMetaData']['text'];

        return _adress;
    }






//ATTENTION - обратите внимание

//getPointContentByIds => getPointsBigDataByIds
// getPointsByIds => getPointsShortDataByIds


    /*
     * Get placemarks big data by ids
     *
     * @param {array} ids - placemarks ids
     * @param {boolean} needPlainText - whether placemark description (plain text) is necessary
     * @param {string} order - fetch order
     * @param {boolean} needRelevant - whether 'relevant' placemarks are necessary
     * @param {boolean} needAnother - whether 'another' placemarks are necessary
     *
     * @return {object} - placemark data
     */
    getPointsBigDataByIds(ids, needPlainText = true, order = null, needRelevant = false, needAnother = false)
    {
        if (!ids) {
            return [];
        }

        let _language = this.getLanguage();

        let _result = MapDataModel.getInstance(this.requestId).getPointsBigDataByIds(ids, _language, order, needPlainText, true);

        return this.prepareResult(_result, needRelevant, needAnother);
    }



    /*
     * Get a short points information by their ids
     *
     * @param {array} ids - points ids
     *
     * @return {array of objects}
     */
    getPointsShortDataByIds(ids)
    {
        if (!ids.length) {
            return [];
        }

        let _result = MapDataModel.getInstance(this.requestId).getPointsShortDataByIds(ids)

        return this.prepareResult(_result);
    }




    /*
     * Check whether placemarks can be changed by user
     *
     * @return {boolean}
     */
    isAvailableToChange()
    {
        if (Service.getInstance(this.requestId).isAllCanAddPlacemarks()) {
            return true;
        }

        if (Users.getInstance(this.requestId).isAdmin()) {
            return true;
        }
        return false;
    }





//ATTENTION - обратите внимание
// getPointsByCoords => getPointsShortDataByCoords


    /*
     * Get placemarks short data by coordinates
     *
     * @param {object} data - coordinates with zoom
     *
     * @return {array of object} - placemarks
     */
    getPointsShortDataByCoords(data)
    {
        let _result = this.getPointsByCoordsNaked(data);
        if (!_result || !_result.length) {
            return [];
        }
        return this.prepareResult(_result);
    }







    /*
     * Get placemarks unprepared short data by coordinates
     *
     * @param {object} coords - coordinates with zoom
     *
     * @return {array of object} - placemarks
     */
    getPointsByCoordsNaked(data)
    {
        if (BaseFunctions.isSet(data['X1'])
                && BaseFunctions.isSet(data['X2'])
                && BaseFunctions.isSet(data['Y1'])
                && BaseFunctions.isSet(data['Y2'])
                && BaseFunctions.isSet(data['zoom'])) {

            let _maxMapLoadSize = Service.getInstance(this.requestId).getMaxMapLoadSize();

            let _x1 = parseFloat(data['X1']);
            let _x2 = parseFloat(data['X2']);
            let _y1 = parseFloat(data['Y1']);
            let _y2 = parseFloat(data['Y2']);

            data['zoom'] = parseInt(data['zoom']);


            // If old coordinates are not passed in means that in first request
            if (!BaseFunctions.isSet(_data['old_X1']) || !this.getSocketData()['old_zoom']) {
                this.getSocketData()['old_zoom'] = data['zoom'];
            }

            let _oldZoom = this.getSocketData()['old_zoom'];
            this.getSocketData()['old_zoom'] = data['zoom'];

            // If area is too big
            if (((_x1 < _x2) && (Math.abs(_x2 - _x1) > _maxMapLoadSize))
                    || (((_x1 > 0) && (_x2 < 0)) && (Math.abs((180 - _x1) + Math.abs(-180 - _x2)) > _maxMapLoadSize))
                    || (Math.abs(_y1 - _y2) > _maxMapLoadSize)) {
                return Consts.TOO_BIG_MAP_REQUEST_AREA_CODE;
            }

            // What is already sent
            let _alreadySentIdsFromSession = this.getAlreadySentIdsStringFromSession();

            let _result = MapDataModel.getInstance(this.requestId).getPointsByCoordsNaked(_x1, _x2, _y1, _y2, _alreadySentIdsFromSession);

            this.setAlreadySentIdsToSession(_result);

            return _result;
        } else {
            this.error(ErrorCodes.ERROR_FUNCTION_ARGUMENTS, 'data [' + BaseFunctions.toString(data) + ']', undefined, false);
        }
    }

    /*
     * Get already sent placemarks from socket session
     *
     * @return {string} - list of ids of already sent placemarks
     */
    getAlreadySentIdsStringFromSession()
    {
        if (this.getSocketData()['map_placemarks_loaded_ids'].length) {
            return this.getSocketData()['map_placemarks_loaded_ids'].join(',');
        } else {
            return '';
        }
    }


    /*
     * Write already sent placemarks into socket session in order not to send them again
     *
     * @param {array of objects} placemarks - placemarks to be saved in socket session
     */
    setAlreadySentIdsToSession(placemarks)
    {
        if (placemarks.length) {

            if (!BaseFunctions.isArray(this.getSocketData()['map_placemarks_loaded_ids'])) {
                this.getSocketData()['map_placemarks_loaded_ids'] = [];
            }

            for (let index in placemarks) {
                let _placemark = placemarks[index];

                if (!_placemark['c_id']) {
                    this.error(ErrorCodes.ERROR_FUNCTION_ARGUMENTS, 'placemarks [' + BaseFunctions.toString(placemarks) + ']', undefined, false);
                }

                this.getSocketData()['map_placemarks_loaded_ids'].push(_placemark['c_id']);
            }
        }
    }

    /*
     * Get limited collection of any prepared placemarks in random order
     *
     * @return {array of objects}
     */
    getPointsByLimit()
    {
        let _result = this.getPointsByLimitNaked();

        _result = _result ? this.prepareResult(_result) : _result;

        return _result;
    }



    /*
     * Get limited collection of any placemarks in random order
     *
     * @param {integer} limit - collection limit
     *
     * @return {array of objects}
     */
    getPointsByLimitNaked(limit)
    {
        if (!limit) {
            limit = Service.getInstance(this.requestId).getMapAutofillLimit();
        }

        let _alreadySentIdsFromSession = this.getAlreadySentIdsStringFromSession();

        let _result = MapDataModel.getInstance(this.requestId).getPointsByLimitNaked(limit, _alreadySentIdsFromSession)

        this.setAlreadySentIdsToSession(_result);

        return _result;
    }


    /*
     * Get bunch of random points
     *
     * @return {array of objects}
     */
    getPointsBunch()
    {
        let _limit = Service.getInstance(this.requestId).getMapAutofillLimit();

        return this.getPointsByLimit(_limit);
    }


// addPhotosForPoint => addPhotosToPoint


    /*
     * Add photos to point (writes to base & uploads files)
     *
     * @param {array of objects} photos - photos data
     * @param {integer} pointId - placemark id
     */
    addPhotosToPoint(photos, pointId)
    {
        if (Service.getInstance(this.requestId).wherherNeedPhotosForPlacemarks() === false && !photos.length) {
            return true;
        }

        if (!photos.length) {
            this.error(ErrorCodes.ERROR_FUNCTION_ARGUMENTS, 'photos [' + BaseFunctions.toString(photos) + ']', undefined, false);
        }
        if (!pointId) {
            this.error(ErrorCodes.ERROR_FUNCTION_ARGUMENTS, 'point id [' + BaseFunctions.toString(pointId) + ']', undefined, false);
        }

        // Add new photos
        for (let _index in photos) {
            let _photo = photos[index];

            let _dataPhotos = {
                'map_data_id': pointId,
                'path': _photo['path'],
                'width': _photo['width'],
                'height': _photo['height'],
            };
            MapPhotosModel.getInstance(this.requestId).add(_dataPhotos);//add()
        }

        // Will move photos to this directory
        let _dirNameWithoutRoot = 'map/' + this.getServiceName() + '/' + pointId;
        let _dirName = Consts.FILES_DIR + _dirNameWithoutRoot;

        if (!Fs.existsSync(_dirName)){
            Fs.mkdirSync(_dirName, 0o755);
        }

        for (let _index in photos) {
            let _photo = photos[index];

            // For each size
            for (let _sizeIndex in Config['restrictions']['sizes']['images']['widths']) {
                let _width = Config['restrictions']['sizes']['images']['widths'][_sizeIndex];

                let _photoName = _sizeIndex + '_' + _photo['path'];

                // Our local photos storage
                let _photoPath = _dirName + '/' + _photoName;

                // Prepare photo from temporary loaded according with settings in config
                // Prepared photo put into placemark directory
                StrictFunctions.image_resize(_photoPath, Consts.TEMP_FILES_DIR + _photo['path'],_width, 0, 100);
                Fs.chmod(_photoPath, 0o755);

                // If we store files on an ftp server, then move them there
                if (Config['files_upload_storage']['server'] === Consts.FTP_NAME) {

                    let _sourceFile = _dirName + '/' + _photoName;
                    let _destFile = _dirNameWithoutRoot + '/' + _photoName;

                    // Send file to ftp with creating a directory
                    Ftp.createDirSync(_dirNameWithoutRoot);
                    Ftp.putFileSync(_sourceFile, _destFile);

                    // Remove source file from local
                    Fs.unlinkSync(_sourceFile);
                }
            }
            // Remove temp file
            Fs.unlinkSync(Consts.TEMP_FILES_DIR + _photo['path']);
        }

        // In the end if we used ftp we shoulr remove source directory from local
        if (Config['files_upload_storage']['server'] === Consts.FTP_NAME) {

            if (Fs.existsSync(_dirName)) {
                Fs.rmdirSync(_dirName);
            }
        }
    }

    /*
     * Delete all size photos of current photo of placemark
     *     For example: one photo has several variants - small, middle, big, original - all of them must be deleted
     *     1_{photo name.jpeg}, 2_{photo name.jpeg}, 3_{photo name.jpeg}, 4_{photo name.jpeg}, etc.
     *
     * @param {integer} placemarkId - placemark id
     * @param {string} photoName - photo name without size prefix '{size prefix}_{photo name with .jpeg}' and with extension
     *     For example - gv3401u6bu448bku3y.jpeg
     */
    deletePhotoFiles(placemarkId, photoName)
    {
        if (!photoName) {
            this.error(ErrorCodes.ERROR_FUNCTION_ARGUMENTS, 'photo name [' + photoName + ']', undefined, false);
        }
        if (!placemarkId) {
            this.error(ErrorCodes.ERROR_FUNCTION_ARGUMENTS, 'placemark id [' + placemarkId + ']', undefined, false);
        }

        let _dirNameWithoutRoot = 'map/' + this.getServiceName() + '/' + placemarkId;
        let _dirName = Consts.FILES_DIR + _dirNameWithoutRoot;

        // For each size
        for (let _sizeIndex in Config['restrictions']['sizes']['images']['widths']) {

            if (!Service.getInstance(this.requestId).isPhotoByCategory(photoName)) {

                if (Config['files_upload_storage']['server'] === Consts.FTP_NAME) {
                    // Delete file from ftp
                    Ftp.removeFileSync(_dirNameWithoutRoot + '/' + _sizeIndex + '_' + photoName);
                } else {
                    // Delete file from local
                    Fs.unlinkSync(_dirName + '/' + _sizeIndex + '_' + photoName);
                }
            }
        }

        if (Config['files_upload_storage']['server'] === Consts.FTP_NAME) {
            // Try to delete directory if empty
            Ftp.removeDirSync(_dirNameWithoutRoot);
        }
    }

    /*
     * Delete placemark photo from database
     *
     * @param {integer} placemarkId - placemark id
     * @param {string} photoName - photo name without prefix and with extension
     */
    deletePhotoDb(placemarkId = null, photoName = null)
    {
        if (Service.getInstance(this.requestId).isPhotoByCategory(photoName)) {
            return true;
        }

        if (!placemarkId) {
            this.error(ErrorCodes.ERROR_FUNCTION_ARGUMENTS, 'placemark id [' + placemarkId + ']', undefined, false);
        }
        if (!photoName) {
            this.error(ErrorCodes.ERROR_FUNCTION_ARGUMENTS, 'photo name [' + photoName + ']', undefined, false);
        }

        let _needResult = Service.getInstance(this.requestId).wherherNeedPhotosForPlacemarks() === true ? true : false;

        return MapPhotosModel.getInstance(this.requestId).delete(placemarkId, photoName);
    }






//ATTENTION - обратите внимание
// preparePhotosForInsert => createPhotosDataForInsert



    /*
     * Create object with photos data for insert operation
     *
     * @param {array} photos - photos names
     *
     * @return {array of objects}
     */
    createPhotosDataForInsert(photos)
    {
        let _result = [];

        for (let _index in photos) {
            let _photoName = photos[index];
            let _photoPath = Consts.TEMP_FILES_DIR + _photoName;

            if (!_photoName || !Fs.existsSync(_photoPath)) {
                return _result;
            }

            let _dimensions = SizeOf(_photoPath);

            _result.push({
                'path':_photoName,
                'width':_dimensions.width,
                'height':_dimensions.height,
            });
        }

        return _result;
    }


    /*
     * Get all photos by placemark id
     *
     * @param {integer} id - palcemark id
     *
     * @return {array of objects}
     */
    getPhotosByDataId(id)
    {
        let _needResult = Service.getInstance(this.requestId).wherherNeedPhotosForPlacemarks() === true ? true : false;
        return MapPhotosModel.getInstance(this.requestId).getPhotosByDataId(id, needResult)
    }

//ATTENTION - обратите внимание
//clearLoadedIdsFromSession

    /*
     * Clear all already sent placemarks from socket session
     */
    clearAlreadySentIdsFromSession()
    {
        this.getSocketData()['map_placemarks_loaded_ids'] = [];
    }













    /*
     * Check wheither user can change placemark
     *
     * @param {string} password - users password
     * @param {integer} dataId - placemark id (in db it called data_id)
     *
     * @return {boolean}
     */
    authenticateByPasswordAndDataId(password, dataId)
    {
        // Checking on superadmin password
        if (BaseFunctions.hashEqualsToValue(password, Consts.SUPER_ADMIN_PASSWORD_HASH)) {
            return true;
        }

        // Try to find a user created placemark
        let _data = MapDataModel.getInstance(this.requestId).getById(dataId);

        if (_data['user_id']) {
            let _userId = _data['user_id'];

            // Search his password hash
            let _user = UsersModel.getInstance(this.requestId).getById(_userId);

            if (BaseFunctions.hashEqualsToValue(password, _user['password_hash'])) {
                return true;
            }
        }

        return false;
    }


















    /*
     * Delete placemark
     */
    deletePoint()
    {
        let _requestData = this.getFromRequest('data');
        let _dataId = BaseFunctions.toInt(_requestData['id']);

        if (_dataId && _requestData['password']) {
            let _password = _requestData['password'];
        } else {
            this.error(ErrorCodes.ERROR_FORM_NOT_PASSED, 'data id [' + _dataId + '], password[' + _requestData['password'] + ']', undefined, false);
        }

        // Check password
        if (!_password) {
            this.error(ErrorCodes.ERROR_PASSWORD_NOT_PASSED, undefined, undefined, false);
        }
        if (!this.authenticateByPasswordAndDataId(_password, _dataId)) {
            this.error(ErrorCodes.ERROR_WRONG_PASSWORD, undefined, undefined, false);
        }

        // Delete photos from DBase and from files
        this.deletePhotos(_dataId);

        // Delete placemark from DBase
        MapDataModel.getInstance(this.requestId).delete(_dataId);

        // Delete placemark geodata
        GeocodeCollectionModel.getInstance(this.requestId).deleteAdresses(_dataId);

        return {
            'status':Consts.SUCCESS_CODE,
            'message':this.getText('success/point/deleted'),
            'data':{
                'id':_dataId
            }
        };
    }












    /*
     * Delete photos from DBASE and from files of current placemark
     *
     * @param {integer} dataId - placemark id
     */
    deletePhotos(dataId)
    {
        dataId = BaseFunctions.toInt(dataId);

        if (!dataId) {
            this.error(ErrorCodes.ERROR_FUNCTION_ARGUMENTS, 'data id [' + dataId + ']', undefined, false);
        }

        let _result = MapPhotosModel.getInstance(this.requestId).getPhotosByDataId(dataId, false);

        for (let _index in _result) {
            let _photo = _result[index];

            // From DBase
            MapPhotosModel.getInstance(this.requestId).delete(_photo['id']);

            // From files
            this.deletePhotoFiles(dataId, _photo['path']);
        }
    }


















   updateCurrentPoint()
    {

        $config = self::get_config();


        $map_db_model_data = components\Map::get_db_model('data');
        $map_form_model_data = self::get_model(MY_MODEL_NAME_FORM_ADD_NEW_POINT);
        $map_db_model_photos = components\Map::get_db_model('photos');
        $map_db_model_geocode_collection = self::get_model(MY_MODEL_NAME_DB_GEOCODE_COLLECTION);







// определяем POST данные
        $form_data = $_POST['add_new_point_form'];

        $data = array();
        $photos = array();
        $data_photos = array();

//если title не используем, то задаем его пустым (он не передается в форме, но надо все же его инициализировать)
        if (!self::get_module(MY_MODULE_NAME_SERVICE)->is_use_titles()) {
            $form_data['title'] = '';
        }










// проверка post данных
        if ($map_form_model_data->check_select_type_field('category', @$form_data['category'], false) && my_is_not_empty(@$form_data['id']) && (int) $form_data['id'] && (isset($form_data['x'])) && (isset($form_data['y'])) && (isset($form_data['comment'])) && (isset($form_data['title'])) && (isset($form_data['password']))) {

            $form_data['id'] = (int) $form_data['id'];
            $password = $form_data['password'];

            if ($form_data['x'] || $form_data['y']){
                my_check_coords($form_data['x'], $form_data['y']);
            }
            $data = array(
                'id' => $form_data['id'],
                'x' => $form_data['x'],
                'y' => $form_data['y'],
                'comment' => $form_data['comment'],
                'comment_plain' => $form_data['comment'],
                'title' => $form_data['title'],
                'category' => $form_data['category'],
            );
        } else {
            self::concrete_error(array(MY_ERROR_FORM_WRONG_DATA, 'POST array:' . json_encode($_POST)));
        }










// проверяем приложенный пароль

        if (!$password) {
            echo my_pass_through(@self::trace('errors/update_point/empty_password'));
            self::rollback();
        }

        if (!$this->authenticate_by_password_and_data_id($password, $form_data['id'])) {
            echo my_pass_through(@self::trace('errors/update_point/wrong_password'));
            self::rollback();
        }














// проверяем приложенные фото
        if (my_is_not_empty(@$form_data['photos'])) {
            $photos_new_array = explode(' ', trim($form_data['photos']));

// подготавливаем данные фоток для вставки
            if (!$photos_new_prepared = $this->prepare_photos_for_insert($photos_new_array)) {
                self::concrete_error(array(MY_ERROR_FORM_WRONG_DATA, 'photos: [' . $form_data['photos'] . ']'));
            }

// сколько новых
            $photos_new_count = count($photos_new_array);
        } else {
            $photos_new_count = 0;
        }



        // сколько всего было до этого
        $photos_existed = $map_db_model_photos->get_by_data_id($form_data['id']);
        $photos_existed_count = count($photos_existed);



//если удаляем часть фоток
        if (my_array_is_not_empty(@$form_data['delete_photos'])) {
// сколько фоток удаляем
            $photos_deleted_count = count($form_data['delete_photos']);
        } else {
            $photos_deleted_count = 0;
        }
// считаем сколько всего фоток в итоге с учетом удаленных и новых
        $photos_count = $photos_existed_count + $photos_new_count - $photos_deleted_count;



// Если фоток получается больше положенного
        if ($photos_count > $config['allows']['max_upload_files_per_point']) {
            self::concrete_error(array(MY_ERROR_FORM_UPDATE_POINT_A_LOT_OF_PHOTOS,
                'photos new: [' . $form_data['photos'] . '],'
                . 'photos delete: [' . json_encode(@$form_data['delete_photos']) . ']'
                . 'photos existed: [' . json_encode($photos_existed) . ']'
            ));
        }

        if (($photos_count === 0) && (self::get_module(MY_MODULE_NAME_SERVICE)->is_need_photos_for_placemarks() === true)) {
            self::concrete_error(array(MY_ERROR_FORM_UPDATE_POINT_WITH_NO_PHOTOS,
                'photos new: [' . $form_data['photos'] . '],'
                . 'photos delete: [' . json_encode(@$form_data['delete_photos']) . ']'
                . 'photos existed: [' . json_encode($photos_existed) . ']'
            ));
        }







        //предварительно обновляем адрес - работаем еще со старыми координатами
        $map_db_model_geocode_collection->update_record(array('x' => $data['x'], 'y' => $data['y']), $data['id']);
        // обновляем метку
        $map_db_model_data->update_point($data);










        // удаляем фотки, которые указали
        if ($photos_deleted_count) {
            foreach ($form_data['delete_photos'] as $name => $value) {
                // из базы
                $this->delete_photo_db($form_data['id'], $name);

                // из директории
                $this->delete_photo_files($form_data['id'], $name);
            }
        }









        //если добавили новые фотки
        if ($photos_new_count) {

            // Добавляем новые фотки
            $this->add_photos_for_point($photos_new_prepared, $form_data['id']);
        }








        

        $result = array(
            'status' => MY_SUCCESS_CODE,
            'message' => my_pass_through(@self::trace('success/new_point/updated')),
            'data' => array(
                'id' => $form_data['id']
            )
        );
        echo json_encode($result);
    }














}

Map.instanceId = BaseFunctions.unique_id();

module.exports = Map;











<?php

namespace modules\app\map\classes;
use \components\base\Ftp_Client;
use \components\app as components;




abstract class Map extends \vendor\Module
{











    public function create_new_point()
    {
        $config = self::get_config();
        $map_db_model_data = components\Map::get_db_model('data');
        $map_db_model_geocode_collection = self::get_model(MY_MODEL_NAME_DB_GEOCODE_COLLECTION);
        $map_form_model_data = self::get_model(MY_MODEL_NAME_FORM_ADD_NEW_POINT);
        $map_db_model_photos = components\Map::get_db_model('photos');

// определяем POST данные
        $data = array();
        $photos = array();
        $data_photos = array();
        $need_to_send_email = false;

// проверка и подготовка post данных
        $map_form_model_data->prepare_fields();

        $form_data = $_POST['add_new_point_form'];

//если title не используем, то задаем его пустым (он не передается в форме, но надо все же его инициализировать)
        if (!self::get_module(MY_MODULE_NAME_SERVICE)->is_use_titles()) {
            $form_data['title'] = '';
        }
        my_check_coords($form_data['x'], $form_data['y']);

        $user_email = isset($form_data['email']) ? $form_data['email'] : null;
        $data = array(
            'x' => $form_data['x'],
            'y' => $form_data['y'],
            'comment' => $form_data['comment'],
            'comment_plain' => $form_data['comment'],
            'title' => $form_data['title'],
            'category' => $form_data['category'],
        );

// если email приложен
        if ($user_email) {

            $users_model = self::get_model(MY_MODEL_NAME_DB_USERS);
            if (!$users_model->validate('email', $user_email, MY_FILTER_TYPE_ALL, false)) {
                echo my_pass_through(@self::trace('errors/new_point/wrong_email'));
                self::rollback();
            }

            $user_data = $this->prepare_user_email($user_email);
            $data['user_id'] = $user_data['id'];

// если только что создалось
            if ($user_data['just_created'] === true) {
                $need_to_send_email = true;
            }
            self::set_cookie(MY_COOKIE_EMAIL_PLACEMARK, $user_email);
        }
// записываем координату
        $id_data = $map_db_model_data->add_new_point($data);

        $map_db_model_geocode_collection->add(array('x' => $data['x'], 'y' => $data['y']), $id_data);


// проверяем приложенные фото
        $photos_array = explode(' ', trim($form_data['photos']));

// Если фоток больше положенного
        if (count($photos_array) > $config['allows']['max_upload_files_per_point']) {
            self::concrete_error(array(MY_ERROR_FORM_NEW_POINT_A_LOT_OF_PHOTOS, 'photos: [' . $form_data['photos'] . ']'));
        }

// подготавливаем данные фоток
        if ((!$photos = $this->prepare_photos_for_insert($photos_array)) && (self::get_module(MY_MODULE_NAME_SERVICE)->is_need_photos_for_placemarks() === true)) {
            self::concrete_error(array(MY_ERROR_FORM_WRONG_DATA, 'photos: [' . $form_data['photos'] . ']'));
        }
// Добавляем фотки
        $this->add_photos_for_point($photos, $id_data);

// возвращаемся на предыдущую страницу через url возврата (после execute())
// теперь через ajax self::set_redirect_url($form_data[MY_FORM_SUBMIT_REDIRECT_URL_VAR_NAME]);

        if ($need_to_send_email === true) {
// отправляем почту
            $mailer_module = self::get_module(MY_MODULE_NAME_MAILER);
            $data = array(
                'recipient' => $user_email,
                'password' => $user_data['password'],
            );
            $mailer_module->send_password_after_create_placemark($data, $id_data);
        }

        $result = array(
            'status' => MY_SUCCESS_CODE,
            'message' => my_pass_through(@self::trace('success/new_point/created')),
            'data' => array(
                'id' => $id_data,
                'email' => $user_email
            )
        );
        echo json_encode($result);
        return $result;
    }


    protected function prepare_user_email($email)
    {
        if (!$email) {
            return NULL;
        }

// проверяем, есть ли он уже в базе юзеров
        $users_model = self::get_model(MY_MODEL_NAME_DB_USERS);
        $result = $users_model->get_by_condition('email=' . $users_model->get_connect()->quote($email), '', '', '*', 1, false);
// если нашли
        if (my_is_not_empty(@$result['id'])) {
            return array(
                'just_created' => false,
                'id' => $result['id']
            );
        }

// если не нашли - создаем
        $password = my_create_password();
        $data = array(
            'email' => $email,
            'password_hash' => hash($password)
        );
        $id = $users_model->add_new_user($data);

        return array(
            'just_created' => true,
            'id' => $id,
            'password' => $password
        );
    }


    protected function prepare_address(array $adress)
    {

        $language_model = components\Language::get_instance();
        $language = $language_model->get_language();
        $result = '';
        if ($language === MY_LANGUAGE_RU) {
// Гугл в русских сообщениях пишет иногда иностранные слова
            $result = str_replace('Unnamed Road', @$adress['administrative_area_level_2'], @$adress['formatted_address']);
            return $result;
        }

        return $result;
    }


    public function prepare_result(array $result, $need_relevant = false, $need_another = false)
    {
        $country_component = components\Countries::get_instance();
        $catalog_module = self::get_module(MY_MODULE_NAME_CATALOG);
        $config = self::get_config();
        $return = array();

        foreach ($result as $value) {
            if (!isset($return[$value['c_id']])) {
                $return[$value['c_id']] = array(
                    'id' => $value['c_id'],
                    'x' => $value['c_x'],
                    'y' => $value['c_y'],
                    'comment' => isset($value['c_comment']) ? $value['c_comment'] : null,
                    'comment_plain' => isset($value['c_comment_plain']) ? $value['c_comment_plain'] : null,
                    'formatted_address' => isset($value['g_country_code']) ? $catalog_module->prepare_address(@$value['g_state_code'], @$value['g_country_code'], @$value['g_administrative_area_level_2'], @$value['g_administrative_area_level_1'], @$value['g_country'], @$value['g_locality']) : null,
                    'formatted_address_with_route' => isset($value['g_country_code']) ? $catalog_module->prepare_address_with_route(@$value['g_state_code'], @$value['g_country_code'], @$value['g_administrative_area_level_2'], @$value['g_administrative_area_level_1'], @$value['g_country'], @$value['g_locality'], @$value['g_street']) : null,
                    'flag_url' => isset($value['g_country_code']) ? get_flag_url(@$value['g_country_code']) : null,
                    'country_code' => isset($value['g_country_code']) ? $value['g_country_code'] : null,
                    'state_code' => isset($value['g_state_code']) ? $value['g_state_code'] : null,
                    'street' => isset($value['g_street']) ? $value['g_street'] : null,
                    'title' => $value['c_title'],
                    'category' => $value['c_category'],
                    'subcategories' => $value['c_subcategories'],
                    'relevant_placemarks' => self::get_module(MY_MODULE_NAME_SERVICE)->is_show_relevant_placemarks() ? $value['c_relevant_placemarks'] : '',
                    'created' => isset($value['c_created']) ? $value['c_created'] : null,
                    'modified' => isset($value['c_modified']) ? $value['c_modified'] : null,
                );

// --> Prepare catalog_url
                if ($return[$value['c_id']]['country_code']) {
                    if ($country_component->has_states($return[$value['c_id']]['country_code'])) {
                        $catalog_url = $return[$value['c_id']]['country_code'] . '/' . $return[$value['c_id']]['state_code'] . '/' . $return[$value['c_id']]['id'];
                    } else {
                        $catalog_url = $return[$value['c_id']]['country_code'] . '/' . $return[$value['c_id']]['id'];
                    }
                } else {
                    $catalog_url = '';
                }
                $return[$value['c_id']]['catalog_url'] = $catalog_url;
// <-- Prepare catalog_url
            }


// Add photos
            if ($value['ph_id']) {

//первая фотка - фотка категории - несколько раз перезапишет - не страшно
                if (self::get_module(MY_MODULE_NAME_SERVICE)->is_add_category_photo_as_first_in_placemark_view() === true) {
                    $return[$value['c_id']]['photos'][0] = array(
                        'id' => 0,
                        'dir' => MY_SERVICE_IMGS_URL_CATEGORIES_PHOTOS,
                        'name' => $catalog_module->get_category_code($value['c_category']) . '.jpg',
                        'width' => self::get_module(MY_MODULE_NAME_SERVICE)->get_categories_photo_initial_width(),
                        'height' => self::get_module(MY_MODULE_NAME_SERVICE)->get_categories_photo_initial_height(),
                        'created' => isset($value['ph_created']) ? $value['ph_created'] : null,
                        'modified' => isset($value['ph_modified']) ? $value['ph_modified'] : null,
                    );
                }



//загружаем файлы сперва на основной сервер, а потом премещаем их в облачное хранилище, тем самым сохраняя место на сервере
                $dir = $this->get_photo_dir($value['c_id'], $value['ph_path']);
                $return[$value['c_id']]['photos'][] = array(
                    'id' => $value['ph_id'],
                    'dir' => $dir,
                    'name' => $value['ph_path'],
                    'width' => $value['ph_width'],
                    'height' => $value['ph_height'],
                    'created' => isset($value['ph_created']) ? $value['ph_created'] : null,
                    'modified' => isset($value['ph_modified']) ? $value['ph_modified'] : null,
                );
            } else {
//если фоток нет - берем дефолтную
                $return[$value['c_id']]['photos'][0] = array(
                    'id' => 0,
                    'dir' => MY_SERVICE_IMGS_URL_CATEGORIES_PHOTOS,
                    'name' => $catalog_module->get_category_code($value['c_category']) . '.jpg',
                    'width' => self::get_module(MY_MODULE_NAME_SERVICE)->get_categories_photo_initial_width(),
                    'height' => self::get_module(MY_MODULE_NAME_SERVICE)->get_categories_photo_initial_height(),
                    'created' => isset($value['ph_created']) ? $value['ph_created'] : null,
                    'modified' => isset($value['ph_modified']) ? $value['ph_modified'] : null,
                );
            }




            if ($need_relevant) {
                if ($value['c_relevant_placemarks']) {
                    ob_start();
                    $this->trace_block('_models/placemark/sublist_1', false, array(
                        'ident' => 'relevant',
                        'ids' => $value['c_relevant_placemarks'],
                        'image_width' => $config['dimentions'][get_device()]['sublist_images']['width'],
                        'image_height' => $config['dimentions'][get_device()]['sublist_images']['height'],
                        'title' => my_pass_through(@self::trace('relevant_placemarks/title/text')))
                    );
                    $relevant_placemarks = ob_get_clean();
                    $return[$value['c_id']]['relevant_placemarks'] = $relevant_placemarks ? $relevant_placemarks : null;
                    unset($relevant_placemarks);
                }
            }

            if ($need_another) {
                $another_placemarks_ids = $catalog_module->get_another_placemarks_by_category($value['c_category'], $value['c_id']);
                if (my_array_is_not_empty($another_placemarks_ids)) {
                    ob_start();
                    $this->trace_block('_models/placemark/sublist_1', false, array(
                        'ident' => 'another',
                        'ids' => $another_placemarks_ids,
                        'image_width' => $config['dimentions'][get_device()]['sublist_images']['width'],
                        'image_height' => $config['dimentions'][get_device()]['sublist_images']['height'],
                        'title' => my_pass_through(@self::trace('another_placemarks/title/text')))
                    );
                    $another_placemarks = ob_get_clean();
                    $return[$value['c_id']]['another_placemarks'] = $another_placemarks ? $another_placemarks : null;
                    unset($another_placemarks);
                } else {
                    $return[$value['c_id']]['another_placemarks'] = null;
                }
            }

            ob_start();
            $this->trace_block('placemarks/categories_viewer', false, array(
                'category' => $value['c_category'],
                'subcategories' => $value['c_subcategories'])
            );
            $categories_html = ob_get_clean();
            $return[$value['c_id']]['categories_html'] = my_pass_through(@$categories_html);
            unset($categories_html);
        }
        return $return;
    }


//потому что загружаем файлы сперва на основной сервер, а потом премещаем их в облачное хранилище, тем самым сохраняя место на сервере
    public function get_photo_dir($c_id, $ph_path)
    {

//потому что загружаем файлы сперва на основной сервер, а потом премещаем их в облачное хранилище, тем самым сохраняя место на сервере
        return prepare_photo_path($c_id, $ph_path, '1_', true, true);
    }
}
