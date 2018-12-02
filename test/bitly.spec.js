import { shortURL } from '../src/utils/bitly';
import request from 'requestretry';
import { InternalError, OperationalError } from '../src/errors/errors';

describe('bitly api', () => {

  it('should return the shorten url', async () => {
    const getMock = jest.spyOn(request, 'get');
    // override the implementation
    getMock.mockImplementation(() =>  {
      return {
        statusCode: 200,
        body: {
          status_code: 200,
          data:{
            url: 'http://a.com/abc'
          }
        }
      };
    });

    const result = await shortURL('www.google.com', 'login', 'key');

    expect(result).toEqual('http://a.com/abc');
  });

  it('should throw error from bilty api', async () => {
    const getMock = jest.spyOn(request, 'get');

    // override the implementation
    getMock.mockImplementation(() =>  {
      return {
        statusCode: 200,
        body: {
          status_code: 500
        }
      };
    });

    try {
      await shortURL('http:/www.google.com', 'login', 'key');
      fail();  //eslint-disable-line no-undef
    } catch (error) {
      expect(error instanceof OperationalError).toBeTruthy();
      expect(error.code).toBe(500);
      expect(error.message).toEqual('Failed to shorten the URL http:/www.google.com');
    }
  });

  it('should throw error from request failure', async () => {
    const addMock = jest.spyOn(request, 'get');

    // override the implementation
    addMock.mockImplementation(() =>  {
      return {
        statusCode: 400,
      };
    });

    try {
      await shortURL('http:/www.google.com', 'login', 'key');
      fail(); //eslint-disable-line no-undef
    } catch (error) {
      expect(error instanceof InternalError).toBeTruthy();
    }
  });
});