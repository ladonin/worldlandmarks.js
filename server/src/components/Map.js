/*
 * File server/src/components/Map.js
 * const Map = require('server/src/components/Map');
 *
 * Map component - compute map data
 */


const Fs = require('fs');
const Component = require('server/src/core/parents/Component');
const BaseFunctions = require('server/src/functions/BaseFunctions');
const Consts = require('server/src/settings/Constants');
const ErrorCodes = require('server/src/settings/ErrorCodes');
const Service = require('server/src/core/Service');
const GeocodeCollectionModel = require('server/src/models/dbase/mysql/GeocodeCollection');
const MapPhotosModel = require('server/src/models/dbase/mysql/MapPhotos');
const MapDataModel = require('server/src/models/dbase/mysql/MapData');
const Users = require('server/src/core/Users');
const Config = require('server/src/settings/Config');
const Ftp = require('server/src/components/base/Ftp');
const UsersModel = require('server/src/models/dbase/mysql/Users');
const CreatePointForm = require('server/src/models/form/CreatePoint');
const UpdatePointForm = require('server/src/models/form/UpdatePoint');
const Mailer = require('server/src/components/base/Mailer');
const Countries = require('server/src/components/Countries');
const Placemarks = require('server/src/components/Placemarks');

class Map extends Component {

    constructor(){
        super();

    }




//ATTENTION - обратите внимание
// get_name => this.getServiceName()
//get_db_model => сразу берем из require
// module() => и модуль и компонент один файл
//getPointContentById => getPointBigDataById
//getAdressByCoords => Geo.getInstance(this.requestId).getAdressByCoords

    /*
     * Get placemark full data by id
     *
     * @param {integer} id - placemark id
     *
     * @return {object} - placemark data
     */
    getPointBigDataById(id)
    {
        let _result = Placemarks.getInstance(this.requestId).getPlacemarksDataByIds(
                [id],
                true,
                true,
                undefined,
                Service.getInstance(this.requestId).whetherToShowRelevantPlacemarks(),
                Service.getInstance(this.requestId).whetherToShowAnotherPlacemarks(),
                true
        );
        return _result[id];
    }










//ATTENTION - обратите внимание

//getPointContentByIds => Placemarks.getPlacemarksDataByIds
// getPointsByIds => Placemarks.getPlacemarksDataByIds










    /*
     * Check whether placemarks can be changed by user
     *
     * @return {boolean}
     */
    isAvailableToChange()
    {
        if (Service.getInstance(this.requestId).whetherAllCanAddPlacemarks()) {
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
        return Placemarks.getInstance(this.requestId).prepareResult(_result, false, false, 1);
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
            if (!BaseFunctions.isSet(data['old_X1']) || !this.getSocketData()['old_zoom']) {
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

        _result = _result ? Placemarks.getInstance(this.requestId).prepareResult(_result, false, false, 1) : _result;

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

        let _result = MapDataModel.getInstance(this.requestId).getPointsByLimitNaked(limit, _alreadySentIdsFromSession);

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
        if (Service.getInstance(this.requestId).whetherPhotosNeedForPlacemarks() === false && !photos.length) {
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
            let _photo = photos[_index];

            let _dataPhotos = {
                'map_data_id': pointId,
                'path': _photo['path'],
                'width': _photo['width'],
                'height': _photo['height']
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
            let _photo = photos[_index];

            // For each size
            for (let _sizeIndex in Config['restrictions']['sizes']['images']['widths']) {
                let _width = Config['restrictions']['sizes']['images']['widths'][_sizeIndex];

                let _photoName = _sizeIndex + '_' + _photo['path'];

                // Our local photos storage
                let _photoPath = _dirName + '/' + _photoName;

                // Prepare photo from temporary loaded according with settings in config
                // Prepared photo put into placemark directory
                BaseFunctions.image_resize(_photoPath, Consts.TEMP_FILES_DIR + _photo['path'],_width, 0, 100, this);
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
    deletePhotoDb(placemarkId, photoName)
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

        let _needResult = Service.getInstance(this.requestId).whetherPhotosNeedForPlacemarks() === true ? true : false;

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
            let _photoName = photos[_index];
            let _photoPath = Consts.TEMP_FILES_DIR + _photoName;

            if (!_photoName || !Fs.existsSync(_photoPath)) {
                return _result;
            }

            let _dimensions = BaseFunctions.getImageDimentions(_photoPath, this);

            _result.push({
                'path':_photoName,
                'width':_dimensions.width,
                'height':_dimensions.height
            });
        }

        return _result;
    }


    /*
     * Get all photos by placemark id
     *
     * @param {integer} id - placemark id
     *
     * @return {array of objects}
     */
    getPhotosByDataId(id)
    {
        let _needResult = Service.getInstance(this.requestId).whetherPhotosNeedForPlacemarks() === true ? true : false;
        return MapPhotosModel.getInstance(this.requestId).getPhotosByDataId(id, _needResult)
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
















//ATTENTION - обратите внимание
//let _requestData = this.getFromRequest('data');
    /*
     * Delete placemark
     *
     * @param {object} data - placemark data
     */
    deletePoint(data)
    {
        let _dataId = BaseFunctions.toInt(data['id']);
        let _password = '';
        if (_dataId && data['password']) {
            _password = data['password'];
        } else {
            this.error(ErrorCodes.ERROR_FORM_NOT_PASSED, 'data id [' + _dataId + '], password[' + data['password'] + ']', undefined, false);
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
            let _photo = _result[_index];

            // From DBase
            MapPhotosModel.getInstance(this.requestId).delete(_photo['id']);

            // From files
            this.deletePhotoFiles(dataId, _photo['path']);
        }
    }



//ATTENTION - обратите внимание
//(data) = this.getFromRequest('data');
//updateCurrentPoint => updatePoint

    /*
     * Update placemark
     *
     * @param {object} data - placemark data
     *
     * @return {object} - result data
     */
    updatePoint(data)
    {
        // Prepare, validate and process form data
        // Also check coords and password on presence
        let _formData = UpdatePointForm.getInstance(this.requestId).processData(data.form);

        if (!_formData['id']) {
            this.error(ErrorCodes.ERROR_FORM_WRONG_DATA, 'data id [' + BaseFunctions.toString(data['id']) + ']', undefined, false);
        }

        let _preparedData = {
                'id' : _formData['id'],
                'x' : _formData['x'],
                'y' : _formData['y'],
                'comment' : _formData['comment'],
                'comment_plain' : _formData['comment'],
                'title' : _formData['title'],
                'category' : _formData['category']
            };

        if (!this.authenticateByPasswordAndDataId(_formData['password'], _formData['id'])) {
            this.error(ErrorCodes.ERROR_WRONG_PASSWORD, undefined, undefined, false);
        }

        // Check and prepare protos data
        let _photosNewCount = 0;
        let _photosNewPrepared = '';
        if (_formData['photos']) {

            let _photosNewArray = BaseFunctions.getArrayFromString(_formData['photos'].trim(), ' ', this);
            _photosNewPrepared = this.createPhotosDataForInsert(_photosNewArray);
            if (!_photosNewPrepared) {
                this.error(ErrorCodes.ERROR_FORM_WRONG_DATA, 'photos: [' + _formData['photos'] + ']', undefined, false);
            }
            _photosNewCount = _photosNewArray.length;
        }

        // How many them were
        let _photosExisted = MapPhotosModel.getInstance(this.requestId).getPhotosByDataId(_formData['id']);
        let _photosExistedCount = _photosExisted.length;

        // If we delete some of the photos
        let _photosDeletedCount = 0;
        if (BaseFunctions.isArray(_formData['delete_photos'])) {
            // How many photos are deleted
            _photosDeletedCount = _formData['delete_photos'].length;
        }
        // Calculate total photos count
        let _photosCount = _photosExistedCount + _photosNewCount - _photosDeletedCount;

        // If photos count is too big
        if (_photosCount > Config['restrictions']['max_upload_files_per_point']) {
            this.error(ErrorCodes.ERROR_FORM_POINT_A_LOT_OF_PHOTOS, undefined, undefined, false);
        }

        if ((_photosCount === 0) && (Service.getInstance(this.requestId).whetherPhotosNeedForPlacemarks() === true)) {
            this.error(ErrorCodes.ERROR_FORM_POINT_WITH_NO_PHOTOS, undefined, undefined, false);
        }

        // Update geodata
        GeocodeCollectionModel.getInstance(this.requestId).updateRecord(
                {
                    'x':_preparedData['x'],
                    'y':_preparedData['y']
                },
                _preparedData['id']
        );

        // Update placemark
        MapDataModel.getInstance(this.requestId).change(_preparedData);

        // Delete photos
        if (_photosDeletedCount) {
            for (let _index in _formData['delete_photos']) {
                let _photoName = _formData['delete_photos'][_index];
                this.deletePhotoDb(_formData['id'], _photoName);
                this.deletePhotoFiles(_formData['id'], _photoName);
            }
        }

        // If have added new photos
        if (_photosNewCount) {
            this.addPhotosToPoint(_photosNewPrepared, _formData['id']);
        }

        return {
            'status':Consts.SUCCESS_CODE,
            'message':this.getText('success/new_point/updated'),
            'data':{
                'id':_formData['id']
            }
        };
    }


//ATTENTION - обратите внимание
//prepareUserEmail => processUserEmail


    /*
     * Process user email
     * If absent - then create new user
     *
     * @param {string} email
     *
     * @return {object} - result data
     */
    processUserEmail(email)
    {
        if (!email) {
            return null;
        }

        // Check if email already exists in dbase
        let _result = UsersModel.getInstance(this.requestId).getByEmail(email);

        if (_result['id']) {
            return {
                'just_created': false,
                'id': _result['id']
            };
        }

        // If didn't find - then create
        let _password = BaseFunctions.createPassword();
        let _data = {
            'email': email,
            'password_hash': BaseFunctions.crypt(_password)
        };
        let _id = UsersModel.getInstance(this.requestId).add(_data);

        return {
            'just_created': true,
            'id': _id,
            'password': _password
        };
    }






//ATTENTION - обратите внимание
//(data) = this.getFromRequest('data');


    /*
     * Create new placemark
     *
     * @param {object} data - placemark data
     *
     * @return {object} - result data
     */
    createNewPoint(data)
    {
        // Prepare, validate and process form data
        // Also check coords
        let _formData = CreatePointForm.getInstance(this.requestId).processData(data.form);

        let _needToSendEmail = false;

        let _data = {
            'x':_formData['x'],
            'y':_formData['y'],
            'comment':_formData['comment'],
            'comment_plain':_formData['comment'],
            'title':_formData['title'],
            'category':_formData['category']
        };

        // If email is passed on
        if (_formData['email']) {
            var _userData = this.processUserEmail(_formData['email']);
            _data['user_id'] = _userData['id'];

            // If it user's first placemark
            if (_userData['just_created'] === true) {
                _needToSendEmail = true;
            }
        }

        // Record placemark
        let _dataId = MapDataModel.getInstance(this.requestId).add(_data);

        // Record geodata
        Placemarks.getInstance(this.requestId).add({'x':_data['x'], 'y':_data['y']}, _dataId);


        // Check attached photos
        let _photosArray = BaseFunctions.getArrayFromString(_formData['photos'].trim(), ' ', this);

        // If photos count is too big
        if (_photosArray.length > Config['restrictions']['max_upload_files_per_point']) {
            this.error(ErrorCodes.ERROR_FORM_POINT_A_LOT_OF_PHOTOS, undefined, undefined, false);
        }

        // Prepare photos data
        let _photos = this.createPhotosDataForInsert(_photosArray);
        if (!_photos && Service.getInstance(this.requestId).whetherPhotosNeedForPlacemarks() === true) {
            this.error(ErrorCodes.ERROR_FORM_POINT_WITH_NO_PHOTOS, undefined, undefined, false);
        }

        // Add photos
        this.addPhotosToPoint(_photos, _dataId);

        // Send email
        if (_needToSendEmail === true) {

            let _mailData = {
                data:{
                    password:_userData['password']
                },
                recipient:_formData['email']
            };
            Mailer.getInstance(this.requestId).sendAfterCreationPlacemark(_mailData, 'afterCreationPlacemark', _dataId);
        }

        return {
            'status':Consts.SUCCESS_CODE,
            'message':this.getText('success/new_point/created'),
            'data':{
                'id':_dataId,
                'email':_formData['email']
            }
        };
    }

//    prepareAddress(adress) - удалил
//ATTENTION - обратите внимание
//prepareResult => Placemarks.getInstance(this.requestId).prepareResult



//ATTENTION - обратите внимание
// getPhotoDir => Placemarks.getPhotoDir

}

Map.instanceId = BaseFunctions.unique_id();

module.exports = Map;