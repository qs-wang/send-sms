import express from 'express';
import {createResponse} from '../utils/response';

const router = new express.Router();

router.get('/', (req, res) => {
  //TODO: provide a list of apis,or forbid?
  res.status(200).send('Send SMS API, version 1');
});

router
  .route('/sms')
  .get(async (req, res)=>{
    await createResponse(res, 200, null, 'SMS sent');
  });


export default router;
