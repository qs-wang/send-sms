import _ from './env.js'; //eslint-disable-line no-unused-vars

const config = {
  app: {
    port: parseInt(process.env.APP_PORT, 10) || 8000,
    baseUrl: process.env.HOST_URL || 'http://localhost:8000',
    bitlyLogin: process.env.BITLY_LOGIN,
    bitlyAPIKey: process.env.BITLY_API_KEY,
    burstAPIKey:process.env.BURST_API_KEY,
    burstAPISecret: process.env.BURST_API_SECRET
  }
};

export default config;