import Consts from 'src/settings/Consts';
import Messages from 'src/settings/Messages';


export default {
    process: (message) => {
        if (process.env.NODE_ENV === Consts.MY_PROCESS_DEV) {
            throw new Error('#' + Messages.ERROR_SYNTHETIC_STATUS + ': ' + message);
        }
    }
}