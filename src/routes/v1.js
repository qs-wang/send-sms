import express from 'express';
import { createResponse } from '../utils/response';
import {OperationalError} from '../errors/errors';

const router = new express.Router();

router.get('/', (req, res) => {
  //TODO: provide a list of apis,or forbid?
  res.status(200).send('Send SMS API, version 1');
});

router
  .route('/sms')
  .get(async (req, res,next) => {
    if (req.is('*/json')) {
      await createResponse(res, 200, null, 'SMS sent');
    } else {
      Promise.resolve().then(function () {
        throw new OperationalError('Not supported format', 401);
      }).catch(next); 
    }
  });


export default router;
