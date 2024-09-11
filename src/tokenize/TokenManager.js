/* eslint-disable class-methods-use-this */
const Jwt = require('@hapi/jwt');
const InvariantError = require('../exceptions/InvariantError');

class TokenManager {
  generateAccessToken(payload) {
    return Jwt.token.generate(payload, process.env.ACCESS_TOKEN_KEY);
  }

  generateRefreshToken(payload) {
    return Jwt.token.generate(payload, process.env.REFRESH_TOKEN_KEY);
  }

  verifyRefreshToken(token) {
    try {
      const artifact = Jwt.token.decode(token);
      Jwt.token.verifySignature(artifact, process.env.REFRESH_TOKEN_KEY);

      const { payload } = artifact.decoded;
      return payload;
    } catch (error) {
      throw new InvariantError('Refresh token tidak valid');
    }
  }
}

module.exports = TokenManager;
