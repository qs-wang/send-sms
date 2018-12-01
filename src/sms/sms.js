import request from 'requestretry';
import { findURLs, replaceURLs } from '../utils/text';
import config from '../config';
import { shortURL } from '../utils/bitly';
import { getLogger } from '../utils/loggerfactory';
import querystring from 'querystring';
import {OperationalError } from '../errors/errors';

const logger = getLogger('sms.js');

logger.debug(JSON.stringify(config, null, 4));

export const sendSMSs = (phone, messages) => {
  logger.info(`Send SMSs, length is: ${messages.length}`);
  // const sendPromises = [];
  // Promise.all()
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

  // TODO: if one of them failed, go or not???
  const shortURLs = await Promise.all(shortenPromises);
  logger.debug(`Short urls: ${JSON.stringify(shortURLs)}`);

  const smsMessage = replaceURLs(message, shortURLs);
  logger.debug(`SMSMessage is : ${smsMessage}`);

  const result = await sendSMSViaBurst(phone, smsMessage);
  logger.debug(`Send SMS result: ${JSON.stringify(result)}`);

};

const burstAPI = 'https://api.transmitsms.com/send-sms.json';

export const sendSMSViaBurst = async (phone, message) => {
  logger.info('Sending SMS via burst api');
  const messageData = querystring.stringify({
    message,
    to: phone
  });

  const result = request.post({
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
    maxAttempts: 5,
    retryDelay: 5000,
    retryStrategy: request.RetryStrategies.HTTPOrNetworkError // (default) retry on 5xx or network errors
  });

  if (result.statusCode != 200) {
    if (result.statusCode == 500) {
      throw new OperationalError('Internal server error, please contact the technical support', 500);
    } else {
      throw new OperationalError(result.body.description, result.statusCode);
    }
  }
};