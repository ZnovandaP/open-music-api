const { Pool } = require('pg');
const generateid = require('../../utils/generateId');
const NotFoundError = require('../../exceptions/NotFoundError');
const InvariantError = require('../../exceptions/InvariantError');

class UserAlbumLikesService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  async upVoteAlbum(userId, albumId) {
    const id = `likealbum-${generateid()}`;

    const query = {
      text: 'INSERT INTO user_album_likes VALUES($1, $2, $3) RETURNING id',
      values: [id, userId, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new Error('Vote pada album gagal ditambahkan');
    }

    await this._cacheService.delete('album:likes');

    return result.rows[0].id;
  }

  async downVoteAlbum(userId, albumId) {
    const query = {
      text: 'DELETE FROM user_album_likes WHERE user_id = $1 AND album_id = $2 RETURNING id',
      values: [userId, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Vote pada album tidak ditemukan');
    }

    await this._cacheService.delete('album:likes');

    return result.rows[0].id;
  }

  async getCountVoteAlbum(albumId) {
    try {
      const result = await this._cacheService.get('album:likes');

      return {
        isCache: true,
        count: Number(result),
      };
    } catch (error) {
      const query = {
        text: 'SELECT COUNT(*) FROM user_album_likes WHERE album_id = $1',
        values: [albumId],
      };

      const result = await this._pool.query(query);

      if (!result.rows.length) {
        throw new NotFoundError('Vote pada album tidak ditemukan');
      }

      const countVotes = result.rows[0].count;

      await this._cacheService.set('album:likes', countVotes);

      return {
        isCache: false,
        count: Number(countVotes),
      };
    }
  }

  async verifyUserIsUpVote(userId, albumId) {
    const query = {
      text: 'SELECT * FROM user_album_likes WHERE user_id = $1 AND album_id = $2',
      values: [userId, albumId],
    };

    const result = await this._pool.query(query);

    if (result.rows.length) {
      throw new InvariantError('Anda sudah memberikan like pada album ini');
    }
  }

  async verifyUserIsDownVote(userId, albumId) {
    const query = {
      text: 'SELECT * FROM user_album_likes WHERE user_id = $1 AND album_id = $2',
      values: [userId, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Album tidak ditemukan');
    }
  }
}

module.exports = UserAlbumLikesService;
