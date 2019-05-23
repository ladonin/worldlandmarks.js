import consts from 'src/settings/Constants';
import messages from 'src/settings/Messages';


export default {
    process: (message) => {
        if (process.env.NODE_ENV === consts.MY_PROCESS_DEV) {
            throw('#' + messages.ERROR_SYNTHETIC_STATUS + ': ' + message);
        }
    }
}