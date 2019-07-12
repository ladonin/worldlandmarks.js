/*
 * File src/app/common/blocks/Hat.js
 * import Hat from 'src/app/common/blocks/Hat';
 *
 * Hat block component
 */

import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {BrowserView, MobileView, isBrowser, isMobile} from "react-device-detect";
import { connect } from 'react-redux';


import Consts from 'src/settings/Constants';
const BaseFunctions = require('application/express/functions/BaseFunctions');




export default withRouter(MainLinks);


class Hat extends Component {


    constructor() {
        super();
        this.goTo = this.goTo.bind(this);
    }
    goTo(event) {
        this.props.history.push(event.target.dataset.url);
    }










        render() {
        return (
<React.Fragment>
    <BrowserView>


        <div className="catalog_index_block">




        <For each="item" in={this.props.data}>

            <div className="catalog_index_country_row" onClick={this.goTo} data-url="catalog/{item.country_code}">
                <img className="flag" src={BaseFunctions.getFlagUrl(item.country_code)}/>









                <div className="catalog_index_country_row_name"><a href='<?php echo($data['current_url'] . $value['country_code']); ?>'><?php echo($country_component->prepare_country_name($value['country'])); ?></a>
                    <div className="catalog_index_country_placemarks_count"><?php echo(my_pass_through(@self::trace('placemarks_count/2/text')).$value['placemarks_count']); ?></div>
                </div>
                <div className="clear"></div>
            </div>

        </For>









            <?php foreach ($data['data'] as $value) : ?>

            <?php endforeach; ?>






            <div className="clear"></div>



            <div className="catalog_block_last_articles_title" style="position:relative">
                <img style="display: inline-block;width: 40px;" src="<?php echo(MY_IMG_URL); ?>article_icon.png"/>
                <span style="display: block; ;position: absolute;top: 20px;left: 60px; color:#333"><?php echo my_pass_through(@self::trace('main/last_articles/text')); ?></span>
            </div>
            <div style="background-color:#fff; margin:0 10px;">
                <?php $this->trace_block('_pages' . MY_DS . 'main' . MY_DS . 'articles_list'); ?>
            </div>



        </div>

        <div className="clear"></div>


    </BrowserView>


    <MobileView>
    </MobileView>
</React.Fragment>

);
}
}













function mapStateToProps(state) {
                let data = state.dynamicText['data'];
                return {
                data
}
}
let mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(Hat)






















