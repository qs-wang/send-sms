import request from 'requestretry';
import { findURLs, replaceURLs } from '../utils/text';
import config from '../config';
import { shortURL } from '../utils/bitly';
import { getLogger } from '../utils/loggerfactory';
import querystring from 'querystring';
import { OperationalError } from '../errors/errors';

const logger = getLogger('sms.js');

export const sendSMSs = async (phone, messages) => {
  logger.info(`Send SMSs, length is: ${messages.length}`);
  const sendPromises = [];

  messages.forEach((message) => {
    sendPromises.push(sendSMS(phone, message));
  });

  return Promise.all(sendPromises
    .map(p => p.catch(e => {
      return {
        statusCode: e.code || 500
      };
    })));
};

export const sendSMS = async (phone, message) => {
  logger.info(`Send SMS to phone: ${phone}`);

  const urls = findURLs(message);
  logger.info(`Found urls in message: ${JSON.stringify(urls, null, 4)}`);

  const shortenPromises = [];
  urls.forEach(urlItem => {
    shortenPromises.push(Promise.resolve().then(async () => {
      const shortenURL = await shortURL(urlItem.url, config.app.bitlyLogin, config.app.bitlyAPIKey);
      return {
        raw: urlItem.raw,
        url: shortenURL
      };
    }));
  });

  const shortURLs = await Promise.all(shortenPromises
    .map(p => p.catch(() => {
      return;
    })));
  logger.debug(`Short urls: ${JSON.stringify(shortURLs)}`);

  // because we put undefined to the promise.all
  // remove them here.
  const filteredShortURLs = shortURLs.filter(element => {
    return element;
  });

  const smsMessage = replaceURLs(message, filteredShortURLs);
  logger.debug(`SMSMessage is : ${smsMessage}`);

  const result = await sendSMSViaBurst(phone, smsMessage);
  logger.debug(`Send SMS result: ${JSON.stringify(result)}`);

  return result;

};

const burstAPI = 'https://api.transmitsms.com/send-sms.json';
export const sendSMSViaBurst = async (phone, message) => {
  logger.info('Sending SMS via burst api');
  const messageData = querystring.stringify({
    message,
    to: phone
  });

  const result = await request.post({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': messageData.length
    },
    url: burstAPI,
    body: messageData,
    json: true,
    auth: {
      user: config.app.burstAPIKey,
      pass: config.app.burstAPISecret
    },
    maxAttempts: 2,
    retryDelay: 1000,
    retryStrategy: request.RetryStrategies.HTTPOrNetworkError // (default) retry on 5xx or network errors
  });

  if (result.statusCode != 200) {
    if (result.statusCode == 500) {
      throw new OperationalError('Internal server error, please contact the technical support', 500);
    } else {
      let message = 'Send SMS api failed';
      if (result.body && result.body.description) {
        message = result.body.description;
      }
      throw new OperationalError(message, result.statusCode);
    }
  }

  return result;
};