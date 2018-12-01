import { findURLs, replaceInText, replaceURLs } from '../src/utils/text';

describe('The text manipulate util', () => {
  it('should find the urls in the text', () => {
    const someText = 'this is a text with a link www.example.com .., and http://example.com';
    const result = findURLs(someText);
    expect(result.length).toBe(2);
    expect(result).toEqual([
      {
        'raw': 'www.example.com',
        'url': 'http://www.example.com'
      },
      {
        'raw': 'http://example.com',
        'url': 'http://example.com'
      }
    ]);
  });

  it('should replace the whole word match only', () => {
    const someText = 'this is a text with a link www.example.com .., and http://www.example.com and another www.example.com';
    const result = replaceInText(someText, 'www.example.com', 'http:/a.com/abcd');
    expect(result).toBe('this is a text with a link http:/a.com/abcd .., and http://www.example.com and another http:/a.com/abcd');
  });

  it('should replace the old urls with corresponding new urls', () => {
    const someText = 'this is a text with a link www.example.com .., and http://www.example.com and another www.example.com';
    const result = replaceURLs(someText, [
      {
        raw: 'www.example.com',
        url: 'http:/a.com/abcd'
      },
      {
        raw: 'http://www.example.com',
        url: 'http:/a.com/abcd'
      }
    ]);
    expect(result).toBe('this is a text with a link http:/a.com/abcd .., and http:/a.com/abcd and another http:/a.com/abcd');
  });

  it('should replace the old urls with corresponding new urls with duplicated item', () => {
    const someText = 'this is a text with a link www.example.com .., and http://www.example.com and another www.example.com';
    const result = replaceURLs(someText, [
      {
        raw: 'www.example.com',
        url: 'http:/a.com/abcd'
      },
      {
        raw: 'http://www.example.com',
        url: 'http:/a.com/abcd'
      },
      {
        raw: 'www.example.com',
        url: 'http:/a.com/abcd'
      },
    ]);
    expect(result).toBe('this is a text with a link http:/a.com/abcd .., and http:/a.com/abcd and another http:/a.com/abcd');
  });
});