const redis = require('redis');
const config = require('../../utils/config');

class CacheService {
  constructor() {
    this.halfHour = 1800; // in seconds
    this._client = redis.createClient({
      socket: {
        host: config.redis.server,
      },
    });

    this._client.on('error', (error) => {
      console.log(error);
    });

    this._client.connect();
  }

  async set(key, value, exInSeconds = this.halfHour) {
    await this._client.set(key, value, {
      EX: exInSeconds,
    });
  }

  async get(key) {
    const result = await this._client.get(key);

    if (!result) {
      throw new Error('Cache tidak ditemukan!');
    }

    return result;
  }

  async delete(key) {
    await this._client.del(key);
  }
}

module.exports = CacheService;
