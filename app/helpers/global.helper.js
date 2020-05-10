import statusCodes from './statusCodes';
import config from "../config/config";

/**
 * success API response
 *
 * @param req
 * @param res
 * @param code
 * @param message
 * @param data
 * @returns {{}}
 */
const apiSuccessHandler = (req, res, code = 200, message = null, data = {}) => {
    let status = statusCodes.data.find((data) => data.code === code);
    if (typeof status === 'undefined') {
        status = {
            'code': 200,
            'message': 'Success',
        };
    }

    let apiResponse = {};
    apiResponse.status = status.code;
    apiResponse.message = (message) ? message : status.message;
    apiResponse.data = data;
    return res.status(200).send(apiResponse);
};

/**
 * fail API response
 *
 * @param req
 * @param res
 * @param code
 * @param message
 * @param data
 * @returns {{}}
 */
const apiFailureHandler = (req, res, code = 400, message = null, data = {}) => {
    let status = statusCodes.data.find((data) => data.code === code);
    if (typeof status === 'undefined') {
        status = {
            'code': 400,
            'message': 'Error',
        };
    }

    let apiResponse = {};
    apiResponse.status = status.code;
    apiResponse.message = (message) ? message : status.message;
    apiResponse.data = (status.code != 500) ? data : {};
    if (status.code != 400) {
        if (config.debug) {
            console.log('CODE: ' + status.code + '  | ERROR: ', data);
        }
        return res.status(status.code).send(apiResponse);
    } else {
        return res.status(200).send(apiResponse);
    }
};

/**
 * convert camel case to string
 *
 * @param text
 * @returns {string}
 */
const camelCaseToStr = (text) => {
    const result = text.replace(/([A-Z])/g, " $1");
    return result.charAt(0).toUpperCase() + result.slice(1);
};

export default {
    apiSuccessHandler,
    apiFailureHandler,
    camelCaseToStr
};