import express from 'express';
import bodyParser from 'body-parser';

import routes from '../routes/index.route';
import globalHelper from '../helpers/global.helper';

const app = express();
const {apiFailureHandler} = globalHelper;

// set body data in request
app.use(bodyParser.json({limit: '150mb'}));
app.use(bodyParser.urlencoded({limit: '150mb', extended: true}));

//use static file
app.use(express.static('public'));

// API normal router
app.use('/api/v1/', routes);

// invalid route handling
app.use(function (req, res) {
    return apiFailureHandler(req, res, 404);
});

export default app;