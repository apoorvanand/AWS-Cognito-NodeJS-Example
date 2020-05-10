import express from 'express';

import awsCognitoController from '../controllers/awsCognito.controller';

const router = new express.Router();
const {signUp, signIn, verifyUserToken, updateUser, deleteUser} = awsCognitoController;

router.post('/signUp/', signUp);
router.post('/signIn/', signIn);
router.post('/user/verify', verifyUserToken);
router.post('/user/update', updateUser);
router.post('/user/delete', deleteUser);

export default router;