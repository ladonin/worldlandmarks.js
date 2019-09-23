/*
 * File src/app/common/PlacemarkAdminLinks.js
 * import PlacemarkAdminLinks from 'src/app/common/PlacemarkAdminLinks';
 *
 * Placemark Admin Links component
 */

import React, { Component } from 'react';

class PlacemarkAdminLinks extends Component {

    constructor() {
        super();
    }

    render() {
        if (!this.props.isAdmin || !this.props.id) {
            return null;
        }
        return (
                <React.Fragment>
                    <div style={{margin: '10px 20px', textAlign: 'left'}}><a target="_blank" style={{color: '#f00'}} href={"/admin/update_placemark_adress?map_data_id=" + this.props.id}>[change address]</a></div>
                    <div style={{margin: '10px 20px', textAlign: 'left'}}><a target="_blank" style={{color: '#f00'}} href={"/admin/update_placemark_categories?map_data_id=" + this.props.id + "&category_id=" + this.props.category}>[categories and relevance manage]</a></div>
                    <div style={{margin: '10px 20px', textAlign: 'left'}}><a target="_blank" style={{color: '#f00'}} href={"/admin/update_placemark_seo?map_data_id=" + this.props.id + "&category_id=" + this.props.category}>[SEO manage]</a></div>
                    <div style={{margin: '10px 20px', textAlign: 'left'}}><a style={{color: '#f00'}} href={"/admin/export_placemarks?id=" + this.props.id}>[download archive]</a></div>
                </React.Fragment>
                );
    }
}

export default PlacemarkAdminLinks







