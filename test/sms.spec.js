import * as sms from '../src/sms/sms';
import * as bitly from '../src/utils/bitly';
import request from 'requestretry';

describe('sms api', () => {

  it('should return the shorten url', async () => {
    const shortURLMock =  jest.spyOn(bitly,'shortURL');
    // override the implementation
    shortURLMock.mockImplementation( async () =>  {
      return Promise.resolve( 'http://a.com/a');
    });


    const sendViaBurstMock = jest.spyOn(request, 'post');
    // override the implementation
    sendViaBurstMock.mockImplementation( async () =>  {
      return Promise.resolve({
        statusCode: 200
      });
    });
    const result = await sms.sendSMS('123456', 'Hi http://example.com');
    expect(result).toEqual({'code':'SUCCESS','description':'OK'});
  });

  it('should throw 500 error', async () => {
    const shortURLMock =  jest.spyOn(bitly,'shortURL');
    // override the implementation
    shortURLMock.mockImplementation( async () =>  {
      return Promise.resolve( 'http://a.com/a');
    });


    const sendViaBurstMock = jest.spyOn(request, 'post');
    // override the implementation
    sendViaBurstMock.mockImplementation( async () =>  {
      return Promise.resolve({
        statusCode: 500
      });
    });
    try {
      await sms.sendSMS('123456', 'Hi http://example.com');
      fail();//eslint-disable-line no-undef
    } catch (error) {
      expect(error.code).toBe(500);
    }
  });

  it('should throw 400 error', async () => {
    const shortURLMock =  jest.spyOn(bitly,'shortURL');
    // override the implementation
    shortURLMock.mockImplementation( async () =>  {
      return Promise.resolve( 'http://a.com/a');
    });


    const sendViaBurstMock = jest.spyOn(request, 'post');
    // override the implementation
    sendViaBurstMock.mockImplementation( async () =>  {
      return Promise.resolve({
        statusCode: 400,
        body:{
          description: 'not supported'
        }
      });
    });
    try {
      await sms.sendSMS('123456', 'Hi http://example.com');
      fail();//eslint-disable-line no-undef
    } catch (error) {
      expect(error.code).toBe(400);
    }
  });
});