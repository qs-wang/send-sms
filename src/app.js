import express from 'express';
import bodyParser from 'body-parser';
import expressValidator from 'express-validator';
import loggerMiddleware from 'morgan';
import cors from 'cors';
import { getLogger } from './utils/loggerfactory';
import routes from './routes';
import { createResponse } from './utils/response';
import config from './config';

const logger = getLogger('app');

/**
 * Create the express app
 */
const app = express();

/**
 * Configure application
 */
app.set('port', config.app.port);
app.set('baseUrl', config.app.baseUrl);

// TODO:
// compression?

/**
 * Set up middlewares
 */
app.use(loggerMiddleware(':method :url :status :res[content-length] - :response-time ms'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));
app.use(expressValidator());

/**
 *  Cors enable
 */
// TODO: Later implement route specific CORS or dynamic origin. Now allowed for all origin
app.use(cors());

/**
 * Set up versioning and routes
 */
app.use('/', routes.v1);
app.use('/v1/', routes.v1);

/**
 * App wide handlers for unsupported and error
 */
app.use((req, res) => {
  createResponse(res, 501, `${req.method} method of path ${req.url} is not supported yet`);
});
app.use((err, _, res) => {
  logger.error(err.stack);
  // TODO: treat different type errors
  createResponse(res, 500, 'Something broke! Please raise a ticket');
});

export default app;