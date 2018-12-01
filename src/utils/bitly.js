
import request from 'requestretry';
import {InternalError} from '../errors/errors';
import {getLogger} from '../utils/loggerfactory';

const logger = getLogger('bitly.js');

const bitlyAPIRoot = 'https://api-ssl.bitly.com/v3/shorten';

// stic with json format for now
// https://dev.bitly.com/links.html
const getsShortenAPI = (url, login, apiKey) => {
  return `${bitlyAPIRoot}?login=${login}&apiKey=${apiKey}&longUrl=${url}&format=json`;
};

export const shortURL = async (url, login, apiKey) =>{
  const result = await request.get(
    getsShortenAPI(url,login,apiKey),{
      json: true,
      maxAttempts: 5,  
      retryDelay: 5000, 
      retryStrategy: request.RetryStrategies.HTTPOrNetworkError // (default) retry on 5xx or network errors
    });

  if(result.statusCode == 200){
    const resultBody = result.body;
    if(resultBody.status_code == 200){
      return resultBody.data.url;
    }
    logger.info(`bitly return failed result ${JSON.stringify(resultBody, null, 4)}`);
    throw new InternalError(`Failed to shorten the URL ${url}`);
  }

  logger.info(`bitly backedn failed ${result.statusCode}`);
  throw new InternalError(`Failed to shorten the URL ${url}`);
};