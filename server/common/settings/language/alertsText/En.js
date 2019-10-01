/*
 * File server/common/settings/language/errorsText/En.js
 * const En = require('server/common/settings/language/errorsText/En');
 *
 */

module.exports = {
    'error': {
        'new_point/photos_upload': 'Please attach at least one photo.',
        'new_point/photos_uploaded_yet': 'Photos are still being downloaded.',
        'new_point/photos_upload_more_than_available': 'The number of photos is more than acceptable. Quantity exceeded on:',
        'new_point/coords_empty': 'Please select a location on the map.',
        'new_point/another_actions': 'First, finish adding the new placemark.',
        92: 'Placemark with current id was not found in this map, maybe it has been removed :(',
        'search/empty_params': 'Please, enter search data.',
        'new_point/wrong_email': 'Incorrect email',
        'update_point/wrong_password': 'The password is entered incorrectly, or this isn\'t your entry.',
        'update_point/empty_password': 'You need to enter the password that was previously sent to you by email.',
        'system': 'System error! Please contact site administrator.'
    },
    'success': {
        'new_point/placemark_added': 'Mark added, now you go into the edit section',
        'new_point/created': 'The record was successfully added',
        'new_point/updated': 'The record updated successfully',
        'new_article/created': 'New article was successfullt created',
        'article/updated': 'The article was successfullt updated',
        'article/deleted': 'The article was successfullt deleted',
        'point/deleted': 'The record was successfully deleted',
    }
}