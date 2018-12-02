import request from 'supertest';
import app from '../../src/app';

describe('Express Server integration tests', () => {
  test('It should send multiple messages with POST to /sms', async () => {
    await request(app)
      .post('/sms')
      .send({ to: process.env.BURST_TEST_PHONE, messages:[
        'Hi, this website it good http://linkedin.com, or , https://www.littlebird.com.au',
        'Hi Morning',
        '3rd message'
      ] })
      .set('Accept', 'application/json')
      .expect(200);
  });

  test('It should send one of the multiple messages with POST to /sms', async () => {
    await request(app)
      .post('/sms')
      .send({ to: process.env.BURST_TEST_PHONE, messages:[
        'hi',
        ''
      ] })
      .set('Accept', 'application/json')
      .expect(200);
  });
});
