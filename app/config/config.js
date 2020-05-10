import dotenv from 'dotenv';

// configure dotenv, will load vars in .env in PROCESS.ENV
dotenv.config();

const config = {
    name: process.env.APP_NAME,
    env: process.env.APP_ENV,
    debug: process.env.APP_DEBUG,
    url: process.env.APP_URL,
    port: process.env.APP_PORT,
    timezone: process.env.APP_TIMEZONE,
    awsCognito: {
        clientId: process.env.COGNITO_CLIENT_ID,
        poolId: process.env.COGNITO_POOL_ID,
        poolRegion: process.env.COGNITO_POOL_REGION
    }
};

export default config;