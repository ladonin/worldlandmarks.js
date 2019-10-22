/*
 * File src/app/controllers/articles/actions/_Common.js
 * import ArticleCountry from 'src/app/controllers/articles/actions/_Common';
 *
 * Common action component for Articles controller's actions
 */

import Action from 'src/app/parents/Action';

class Common extends Action
{

    constructor()
    {
        super();
        this.shouldBottomUpdate = 1;
    }


    shouldComponentUpdate(nextProps, nextState)
    {
        if (this.props.match.url !== nextProps.match.url) {
            return true;
        }

        if (!this.props.redux) {
            return true;
        }

        if (this.props.redux && this.props.redux.actionData !== nextProps.redux.actionData) {
            this.shouldBottomUpdate++;
            return true
        }

        return false;
    }
}

export default Common;