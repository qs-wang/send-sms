import request from 'supertest';
import app from '../src/app';

describe('Express Server', () => {
  test('It should response the GET method to /', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
  });
});
