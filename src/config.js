import dotenv from 'dotenv';

dotenv.load({
  path: '.env',
});

const config = {
  app: {
    port: parseInt(process.env.APP_PORT, 10) || 8000,
    baseUrl: process.env.HOST_URL || 'http://localhost:8000'
  }
};

export default config;