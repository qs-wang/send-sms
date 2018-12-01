
/**
 * This class is for helping run the bitly restapi, and analyse the return format
 * This should not run as the auto test suit.
 */

import _ from '../../src/env'; //eslint-disable-line no-unused-vars
import request from 'requestretry';
import { getLogger } from '../../src/utils/loggerfactory';

const logger = getLogger('bitly.spec.js');

const bitlyAPIRoot = 'https://api-ssl.bitly.com/v3/shorten';

describe('bitly Api', () => {
  let shorttenAPI;

  beforeEach(()=> {
    shorttenAPI = `${bitlyAPIRoot}?login=${process.env.BITLY_LOGIN}&apiKey=${process.env.BITLY_API_KEY}&format=json`;
  });
  // test('It should encode the url', () => {
  //   const url = 'http://example.com/page?parameter=value#anchor';

  //   const result = encodeURIComponent(url);
  //   expect(result).toBe('http%3A%2F%2Fexample.com%2Fpage%3Fparameter%3Dvalue%23anchor');
  // });

  test('It should shorten the IP', async () => {
    const url = 'http://192.168.3.3';
    const result =  await request.get(`${shorttenAPI}&longUrl=${encodeURIComponent(url)}`, {
      json: true,
      maxAttempts: 5,
      retryDelay: 5000,
      retryStrategy: request.RetryStrategies.HTTPOrNetworkError // (default) retry on 5xx or network errors
    });

    expect(result.statusCode).toBe(200);
    logger.info(`The body is ${JSON.stringify(result.body, null, 4)}`);
  });

  test('It should shorten the url without wwww', async () => {
    const url = 'http://google.com';
    
    const result = await request.get(`${shorttenAPI}&longUrl=${encodeURIComponent(url)}`, {
      json: true,
      maxAttempts: 5,
      retryDelay: 5000,
      retryStrategy: request.RetryStrategies.HTTPOrNetworkError // (default) retry on 5xx or network errors
    });

    expect(result.statusCode).toBe(200);
    logger.info(`The body is ${JSON.stringify(result.body, null, 4)}`);
  });


  test('It should return body with error for invalid http url', async () => {
    const url = 'http//192.168.3.3';

    const result = await request.get(`${shorttenAPI}&longUrl=${encodeURIComponent(url)}`, {
      json: true,
      maxAttempts: 5,
      retryDelay: 5000,
      retryStrategy: request.RetryStrategies.HTTPOrNetworkError // (default) retry on 5xx or network errors
    });

    expect(result.statusCode).toBe(200);
    logger.info(`The body is ${JSON.stringify(result.body, null, 4)}`);
  });


  test('It should return body with error for email', async () => {
    const url = 'a@a.com';

    const result = await request.get(`${shorttenAPI}&longUrl=${encodeURIComponent(url)}`, {
      json: true,
      maxAttempts: 5,
      retryDelay: 5000,
      retryStrategy: request.RetryStrategies.HTTPOrNetworkError // (default) retry on 5xx or network errors
    });

    expect(result.statusCode).toBe(200);
    logger.info(`The body is ${JSON.stringify(result.body, null, 4)}`);
  });
});
