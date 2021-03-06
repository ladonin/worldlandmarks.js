/*
 * File src/app/parents/Action.js
 * import Action from 'src/app/parents/Action';
 *
 * Common action component
 */

import React from 'react';
import Consts from 'src/settings/Constants';
import Socket from 'src/app/socket/Socket';
import Common, {UpdateStyleData, ClearActionData, ClearStyleData, ClearBackgroundData} from 'src/app/parents/Common';
import Events from 'src/modules/Events';
import ReactHelmet from 'react-helmet';

export default class Action extends Common
{

    constructor()
    {
        super();
        this.currentUrl = null;
        this.refreshAction = this.refreshAction.bind(this);
    }


    componentWillUnmount()
    {
        this.props.clearActionData();
        this.props.clearStyleData();
        this.props.clearBackgroundData();
        Events.remove(Consts.EVENT_REFRESH_ACTION, this.refreshAction);
    }


    componentDidMount()
    {
        Socket.actionQuery(this.props.match.params);
        this.currentUrl = this.props.match.url;
        Events.dispatch(Consts.EVENT_RESET_PAGE_SCROLLING);
        Events.add(Consts.EVENT_REFRESH_ACTION, this.refreshAction);
    }


    refreshAction()
    {
        Socket.actionQuery(this.props.match.params);
    }


    componentDidUpdate()
    {
        if (this.currentUrl !== this.props.match.url) {
            Socket.actionQuery(this.props.match.params);
            Events.dispatch(Consts.EVENT_RESET_PAGE_SCROLLING);
        }
        this.currentUrl = this.props.match.url;
    }


    getHeader(data)
    {
        if (!data && !(this.props.redux && this.props.redux.actionData)) {
            return null;
        }

        let _meta = [];
        let _data = {};

        if (data) {
            _data = data;
        } else {
            _data = this.props.redux.actionData;
        }

        if (_data.description) {
            _meta.push(
                {"name": "description", "content": _data.description}
            );
        }
        if (_data.keywords) {
            _meta.push(
                {"name": "keywords", "content": _data.keywords}
            );
        }

        return (
                <React.Fragment>
                    <ReactHelmet
                        title={_data.title}
                        meta={_meta}
                    />
                </React.Fragment>);
    }
}

export const MapDispatchToProps = {
    updateStyleData: UpdateStyleData,
    clearActionData: ClearActionData,
    clearStyleData: ClearStyleData,
    clearBackgroundData: ClearBackgroundData
}

// Only for this controller/action
// Get state data only after the data will comes from necessary controller/action

// Note: when old component unmounts and new one mounts
// then the new component mounts with old state data and only then updated with new state data
// (old data cleared in componentWillUnmount event, but new component is already mounted)
// and we need to prevent mounting a new component with previous component's data (it happens on mount level)
/*
 * @param {object} state - redux state
 * @param {string} controller - accepted controller name
 * @param {string} action - accepted action name
 *
 * @param {object/null} - state result for actions
 */
export function GetState(state, controller, action)
{

    // NOTE: case when state.staticData['controller'] === 'undefined' means that data has came for the first time (first request at all)
    // In the future, the names of controller and action in staic data will be updated only
    if (typeof state.staticData['controller'] === 'undefined'
            || typeof state.staticData['action'] === 'undefined'
            || state.staticData['controller'] !== controller
            || state.staticData['action'] !== action
            ) {
        return {};
    }
    return {
        redux:{
            staticData:state.staticData,
            actionData:state.actionData,
        }
    };
}