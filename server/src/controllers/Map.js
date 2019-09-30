/*
 * File server/src/controllers/Map.js
 *
 * Controller map/* pages
 */
const Deasync = require('deasync');
const BaseFunctions = require('server/src/functions/BaseFunctions');
const ErrorCodes = require('server/src/settings/ErrorCodes');
const Consts = require('server/src/settings/Constants');
const Placemarks = require('server/src/components/Placemarks');
const MapComponent = require('server/src/components/Map');

const CommonController = require('server/src/controllers/CommonController');

const Seo = require('server/src/components/Seo');

class Map extends CommonController {

    constructor() {
        super();
    }

    /*
     * Action index
     */
    action_index() {
        this.addActionData({
            'title':Seo.getInstance(this.requestId).getTitle('map/index'),
            'keywords':Seo.getInstance(this.requestId).getKeywords('map/index'),
            'description':Seo.getInstance(this.requestId).getDescription('map/index'),
        });

        this.sendMe();
    }

    /*
     * Background action that returns placemark data
     */
    action_get_placemark()
    {
        let _id = parseInt(this.getFromRequest(Consts.ID_VAR_NAME, false));

        this.addBackgroundData({
            placemarkData: {...Placemarks.getInstance(this.requestId).getPlacemarksDataByIds([_id], /*needPlainText*/ true, /*needText*/ true, /*order*/ null, /*needRelevant*/ true, /*needAnother*/ true, /*needPhotos*/ true, /*addressWithRoute*/ true, /*addressWithoutRoute*/ false)[0], atCluster:this.getFromRequest('atCluster', false)}});

        this.sendMe(true);
    }


    /*
     * Background action that returns placemarks data by coords
     */
    action_get_placemarks_by_coords()
    {
        let _Y1 = parseFloat(this.getFromRequest('Y1'));
        let _Y2 = parseFloat(this.getFromRequest('Y2'));
        let _X1 = parseFloat(this.getFromRequest('X1'));
        let _X2 = parseFloat(this.getFromRequest('X2'));
        let _zoom = parseInt(this.getFromRequest('zoom'));

        this.addBackgroundData({
            placemarksData: MapComponent.getInstance(this.requestId).getPointsShortDataByCoords({Y1:_Y1,Y2:_Y2,X1:_X1,X2:_X2,zoom:_zoom})
        });
        this.sendMe(true);
    }


}



Map.instanceId = BaseFunctions.uniqueId();
module.exports = Map;
