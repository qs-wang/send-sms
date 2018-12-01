import anchorme from 'anchorme';

/**
 * Return an array of the urls found in the text. URL is normalized, 
 * ie. www.example.com -> http://www.example.com
 * return example:
 * [
      {
        "raw": "www.example.com",
        "url": "http://www.example.com"
      },
      {
        "raw": "http://example.com",
        "url": "http://example.com"
      }
    ]
 */
export const findURLs = (text) => {
  const urlObjects = anchorme(text, {
    list: true,
    files: false,
    emails: false
  });

  return urlObjects.map((value) => {
    return {
      raw: value.raw,
      url: `${value.protocol}${value.encoded}`
    };
  });
};

/**
 * Replace the raw url text in the given text with new url for every element of the urlObjects
 * @param {*} text 
 * @param {*} urlObjects  array as the example below
 * [
      {
        raw: 'www.google.com',
        url: 'http:/a.com/abcd'
      },
      {
        raw: 'www.google.com',
        url: 'http:/a.com/abcd'
      },
    ]
 */
export const replaceURLs = (text, urlObjects) => {
  urlObjects.forEach(element => {
    text = replaceInText(text, element.raw, element.url);
  });

  return text;
};

/**
 * Replace the whole word match of originalWord to newWord
 * @param {*} text cannot be null
 * @param {*} originalWord the world to be replaced
 * @param {*} newWord replacing word
 */
export const replaceInText = (text, originalWord, newWord) => {
  const regex = new RegExp(`( |^)${originalWord}\\b`, 'g');
  return text.replace(regex, `$1${newWord}`);
};