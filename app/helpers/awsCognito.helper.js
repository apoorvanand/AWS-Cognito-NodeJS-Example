import * as AmazonCognitoIdentity from 'amazon-cognito-identity-js';
import fetch from 'node-fetch';
import request from 'request';
import jwkToPem from 'jwk-to-pem';
import jwt from 'jsonwebtoken';

import config from '../config/config';

global.fetch = fetch;
global.navigator = () => null;

const poolData = {
    UserPoolId: config.awsCognito.poolId,
    ClientId: config.awsCognito.clientId
};

const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
const tokenVerifyUrl = 'https://cognito-idp.' + config.awsCognito.poolRegion + '.amazonaws.com/' + config.awsCognito.poolId + '/.well-known/jwks.json';
console.log(tokenVerifyUrl);

/*===========================================| response handler functions |===============================================*/
/**
 * AWS cognito signUp response heading
 *
 * @param username
 * @param password
 * @param attributeList
 */
const awsCognitoSignUpHandler = (username, password, attributeList) => {
    return new Promise((resolve, reject) => {
        userPool.signUp(username, password, attributeList, null, (err, result) => {
            if (err) {
                reject(err);
            }
            resolve(result);
        });
    });
};

/**
 * AWS cognito signIn response heading
 *
 * @param authenticationDetails
 * @param userData
 */
const awsCognitoSignInHandler = (authenticationDetails, userData) => {
    return new Promise((resolve, reject) => {
        const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
        cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: (result) => {
                return resolve(result);
            },
            onFailure: ((err) => {
                return reject(err);
            })
        });
    });
};

/**
 * AWS cognito token verify response heading
 *
 * @param attributeList
 * @param userData
 */
const awsCognitoTokenVerifyHandle = (token) => {
    return new Promise((resolve, reject) => {
        request({
                url: tokenVerifyUrl,
                json: true
            },
            (error, response, body) => {
                if (!error && response.statusCode === 200) {
                    let pems = {};
                    let keys = body['keys'];
                    for (let i = 0; i < keys.length; i++) {
                        //Convert each key to PEM
                        let key_id = keys[i].kid;
                        let modulus = keys[i].n;
                        let exponent = keys[i].e;
                        let key_type = keys[i].kty;
                        let jwk = {kty: key_type, n: modulus, e: exponent};
                        let pem = jwkToPem(jwk);
                        pems[key_id] = pem;
                    }
                    //validate the token
                    let decodedJwt = jwt.decode(token, {complete: true});
                    if (!decodedJwt) {
                        return reject("Not a valid JWT token");
                    }

                    let kid = decodedJwt.header.kid;
                    let pem = pems[kid];
                    if (!pem) {
                        return reject("Invalid Token.");
                    }

                    jwt.verify(token, pem, (err, payload) => {
                        if (err) {
                            return reject("Invalid Token.");
                        } else {
                            return resolve(payload);
                        }
                    });
                } else {
                    return reject("Error! Unable to download JWKs.");
                }
            });
    });
};

/**
 * AWS cognito update user response heading
 *
 * @param attributeList
 * @param userData
 */
const awsCognitoUpdateUserHandler = (authenticationDetails, userData, attributeList) => {
    return new Promise((resolve, reject) => {
        const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
        cognitoUser.updateAttributes(attributeList, (err, result) => {
            if (err) {
                return reject(err);
            }
            return resolve(result);
        });
    });
};

/**
 * AWS cognito delete user response heading
 *
 * @param attributeList
 * @param userData
 */
const awsCognitoDeleteUserHandler = (userData, refreshToken) => {
    return new Promise((resolve, reject) => {
        const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
        cognitoUser.refreshSession(refreshToken, (err, session) => {
            if (err) {
                return reject(err);
            }
            return resolve(session);
        });
    });
};

/*===========================================| functions |===============================================*/

/**
 * sign-up with AWS cognito
 *
 * @param username
 * @param password
 * @param userData
 */
const awsCognitoSignUp = async (username, password, userData) => {
    try {
        let attributeList = [];
        Object.keys(userData).map((key) => {
            attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name: key, Value: userData[key]}));
        });
        const awsResponse = await awsCognitoSignUpHandler(username, password, attributeList);
        return {
            status: 200,
            userSub: awsResponse.userSub,
            data: awsResponse
        };
    } catch (error) {
        return {
            status: 400,
            message: error.message
        };
    }
};

/**
 * signIn with AWS cognito
 *
 * @param username
 * @param password
 */
const awsCognitoSignIn = async (username, password) => {
    try {
        const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
            Username: username,
            Password: password
        });
        const userData = {
            Username: username,
            Pool: userPool
        };
        const awsResponse = await awsCognitoSignInHandler(authenticationDetails, userData);
        return {
            status: 200,
            userSub: awsResponse.accessToken.payload.sub,
            token: awsResponse.accessToken.jwtToken,
            data: awsResponse
        };
    } catch (error) {
        return {
            status: 400,
            message: error.message
        };
    }
};

/**
 * AWS cognito token verify
 *
 * @param token
 */
const awsCognitoTokenVerify = async (token) => {
    try {
        const awsResponse = await awsCognitoTokenVerifyHandle(token)
        return {
            status: 200,
            data: awsResponse
        };
    } catch (error) {
        return {
            status: 400,
            message: error
        };
    }
};

/**
 * AWS cognito user data update
 *
 * @param username
 * @param password
 * @param updateUserData
 */
const awsCognitoUpdateUser = async (username, password, updateUserData) => {
    try {
        let attributeList = [];
        Object.keys(updateUserData).map((key) => {
            attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name: key, Value: updateUserData[key]}));
        });

        var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
            Username: username,
            Password: password,
        });
        const userData = {
            Username: username,
            Pool: userPool
        };

        const awsResponse = await awsCognitoUpdateUserHandler(authenticationDetails, userData, attributeList);
        return {
            status: 200,
            userSub: awsResponse.userSub,
            data: awsResponse
        };
    } catch (error) {
        console.log(error);
        return {
            status: 400,
            message: error.message
        };
    }
};

/**
 * AWS cognito user delete
 *
 * @param Username
 * @param refreshToken
 */
const awsCognitoDeleteUser = async (username, refreshToken) => {
    try {
        const RefreshToken = new AmazonCognitoIdentity.CognitoRefreshToken({RefreshToken: refreshToken});
        const userData = {
            Username: username,
            Pool: userPool
        };

        const awsResponse = await awsCognitoDeleteUserHandler(userData, refreshToken);
        return {
            status: 200,
            data: awsResponse
        };
    } catch (error) {
        console.log(error);
        return {
            status: 400,
            message: error.message
        };
    }
};

export default {
    awsCognitoSignUp,
    awsCognitoSignIn,
    awsCognitoTokenVerify,
    awsCognitoUpdateUser,
    awsCognitoDeleteUser
};