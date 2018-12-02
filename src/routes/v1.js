import express from 'express';
import { createResponse } from '../utils/response';
import { OperationalError } from '../errors/errors';
import { sendSMSs } from '../sms/sms';

const router = new express.Router();

router.get('/', (req, res) => {
  res.status(200).send('Send SMS API, version 1');
});

router
  .route('/sms')
  .post(async (req, res, next) => {
    if (req.is('*/json')) {
      const body = req.body;
      if (!body.to) {
        Promise.resolve().then(() => {
          throw new OperationalError('Phone number is empty', 422);
        }).catch(next);
        return;
      }
      if (!body.messages) {
        Promise.resolve().then(() => {
          throw new OperationalError('Messages is empty', 422);
        }).catch(next);
        return;
      }

      const phone = body.to;
      const messages = body.messages;
      if (!Array.isArray(messages)) {
        Promise.resolve().then(() => {
          throw new OperationalError('Messages is not array', 422);
        }).catch(next);
        return;
      }

      if (messages.length > 3) {
        Promise.resolve().then(() => {
          throw new OperationalError('Messages is too long, can only contain 3 messages per time', 422);
        }).catch(next);
        return;
      }
      try {
        const result = await sendSMSs(phone, messages);
        let retureArray;
        if (Array.isArray(result)) {
          retureArray = result.map(element => {
            if (element.statusCode === 200) {
              return 'Delived';
            } else {
              if(element.statusCode){
                return 'Delivery failed';
              }else{
                return 'Unknown';
              }
            }
          });
          // returnMsg = JSON.stringify(retureArray);
        }
        createResponse(res, 200, null, 'SMS delivery status', retureArray);
      } catch (error) {
        Promise.resolve().then(() => {
          throw error;
        }).catch(next);
        return;
      }

    } else {
      Promise.resolve().then(() => {
        throw new OperationalError('Not supported format', 400);
      }).catch(next);
      return;
    }
  });


export default router;
