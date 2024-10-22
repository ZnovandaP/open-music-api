const { customAlphabet } = require('nanoid');

const generateid = (length = 16) => {
  const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  return customAlphabet(alphabet, length)();
};

module.exports = generateid;
