import Consts from 'src/settings/Constants';
import Messages from 'src/settings/Messages';


export default {
    process: (message) => {
        if (process.env.NODE_ENV === Consts.PROCESS_DEV) {
            throw('#' + Messages.ERROR_SYNTHETIC_STATUS + ': ' + message);
        }
    }
}