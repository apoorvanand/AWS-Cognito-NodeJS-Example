import express from 'express';

// include routes
import awsCognitoRoute from './awsCognito.route';

const router = express.Router();

// without authentication
router.use('/', awsCognitoRoute);

export default router;