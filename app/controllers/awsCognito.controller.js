import globalHelper from '../helpers/global.helper';
import validate from '../helpers/validate.helper';
import awsCognito from '../helpers/awsCognito.helper';

const {apiSuccessHandler, apiFailureHandler} = globalHelper;
const {awsCognitoSignUp, awsCognitoSignIn, awsCognitoTokenVerify, awsCognitoUpdateUser, awsCognitoDeleteUser} = awsCognito;

/**
 * signUp by aws cognito
 *
 * @param req
 * @param res
 * @returns {Promise<{}>}
 */
const signUp = async (req, res) => {
    try {
        const {body} = req;
        const rules = {
            username: 'required',
            password: 'required',
            email: 'required|email',
            phone_number: 'required',
            name: 'required'
        };
        const validator = new validate(body, rules);
        if (validator.run() === false) {
            return apiFailureHandler(req, res, 400, validator.errorStr());
        }
        const {username, password, email, phone_number, name} = body;

        const userData = {
            email,
            name,
            phone_number
        };
        let result = await awsCognitoSignUp(username, password, userData);
        if (result.status == 200) {
            return apiSuccessHandler(req, res, 200, null, result);
        }
        return apiFailureHandler(req, res, 400, result.message);
    } catch (error) {
        return apiFailureHandler(req, res, 500, null, error);
    }
};

/**
 * signIn by aws cognito
 *
 * @param req
 * @param res
 * @returns {Promise<{}>}
 */
const signIn = async (req, res) => {
    try {
        const {body} = req;
        const rules = {
            username: 'required',
            password: 'required'
        };
        const validator = new validate(body, rules);
        if (validator.run() === false) {
            return apiFailureHandler(req, res, 400, validator.errorStr());
        }
        const {username, password} = body;

        let result = await awsCognitoSignIn(username, password);
        if (result.status == 200) {
            return apiSuccessHandler(req, res, 200, null, result);
        }
        return apiFailureHandler(req, res, 400, result.message);
    } catch (error) {
        return apiFailureHandler(req, res, 500, null, error);
    }
};

/**
 * token verify by aws cognito
 *
 * @param req
 * @param res
 * @returns {Promise<{}>}
 */
const verifyUserToken = async (req, res) => {
    try {
        const {body} = req;
        const rules = {
            token: 'required'
        };
        const validator = new validate(body, rules);
        if (validator.run() === false) {
            return apiFailureHandler(req, res, 400, validator.errorStr());
        }
        const {token} = body;

        let result = await awsCognitoTokenVerify(token);
        console.log(result);
        if (result.status == 200) {
            return apiSuccessHandler(req, res, 200, null, result);
        }
        return apiFailureHandler(req, res, 400, result.message);
    } catch (error) {
        return apiFailureHandler(req, res, 500, null, error);
    }
};

/**
 * update user by aws cognito
 *
 * @param req
 * @param res
 * @returns {Promise<{}>}
 */
const updateUser = async (req, res) => {
    try {
        const {body} = req;
        const rules = {
            username: 'required',
            password: 'required',
            email: 'required|email',
            phone_number: 'required',
            name: 'required'
        };
        const validator = new validate(body, rules);
        if (validator.run() === false) {
            return apiFailureHandler(req, res, 400, validator.errorStr());
        }
        const {username, password, email, phone_number, name} = body;

        const userUpdateData = {
            email,
            name,
            phone_number
        };
        let result = await awsCognitoUpdateUser(username, password, userUpdateData);
        if (result.status == 200) {
            return apiSuccessHandler(req, res, 200, null, result);
        }
        return apiFailureHandler(req, res, 400, result.message);
    } catch (error) {
        return apiFailureHandler(req, res, 500, null, error);
    }
};

/**
 * delete aws cognito user
 *
 * @param req
 * @param res
 * @returns {Promise<{}>}
 */
const deleteUser = async (req, res) => {
    try {
        const {body} = req;
        const rules = {
            username: 'required',
            refreshToken: 'required'
        };
        const validator = new validate(body, rules);
        if (validator.run() === false) {
            return apiFailureHandler(req, res, 400, validator.errorStr());
        }
        const {username, refreshToken} = body;

        let result = await awsCognitoDeleteUser(username, refreshToken);
        if (result.status == 200) {
            return apiSuccessHandler(req, res, 200, null, result);
        }
        return apiFailureHandler(req, res, 400, result.message);
    } catch (error) {
        return apiFailureHandler(req, res, 500, null, error);
    }
};

export default {
    signUp,
    signIn,
    verifyUserToken,
    updateUser,
    deleteUser
}