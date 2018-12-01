import request from 'supertest';
import app from '../src/app';

describe('Express Server', () => {
  test('It should response the GET method to /', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
  });

  test('It should response error the GET method to /abc', async () => {
    const response = await request(app).get('/abc');
    expect(response.statusCode).toBe(501);
  });

  test('It should response error the GET method to /sms', async () => {
    const response = await request(app).post('/sms');
    expect(response.statusCode).toBe(400);
  });
});
