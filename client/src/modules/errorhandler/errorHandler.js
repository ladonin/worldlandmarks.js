import consts from 'src/settings/constants';
import messages from 'src/settings/messages';


export default {
    process: (message) => {
        if (process.env.NODE_ENV === consts.MY_PROCESS_DEV) {
            throw('#' + messages.ERROR_SYNTHETIC_STATUS + ': ' + message);
        }
    }
}