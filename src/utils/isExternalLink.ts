/**
 * Returns true if a url is considered external
 * @param {string} url The input url
 * @returns {boolean} Whether or not the url is external
 */
const isExternalLink = (url: string) => {
  const regex = new RegExp('^(?:[a-z]+:)?//', 'i');
  return regex.test(url);
};

export { isExternalLink };
