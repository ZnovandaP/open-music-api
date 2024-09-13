const { Pool } = require('pg');
const generateid = require('../../utils/generateId');
const InvariantError = require('../../exceptions/InvariantError');

class PlaylistCollaborationsService {
  constructor() {
    this._pool = new Pool();
  }

  async addPlaylistCollaboration(playlistId, userId) {
    try {
      const id = `pcollab-${generateid()}`;

      const query = {
        text: `INSERT INTO playlist_collaborations (id, playlist_id, user_id) 
      VALUES($1, $2, $3) RETURNING id`,
        values: [id, playlistId, userId],
      };

      const result = await this._pool.query(query);

      return result.rows[0].id;
    } catch (error) {
      throw new InvariantError('Kolaborasi gagal ditambahkan');
    }
  }

  async deletePlaylistCollaboration(playlistId, userId) {
    const query = {
      text: 'DELETE FROM playlist_collaborations WHERE playlist_id = $1 AND user_id = $2 RETURNING id',
      values: [playlistId, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Kolaborasi gagal dihapus');
    }

    return result.rows[0].id;
  }

  async verifyCollaboratorPlaylist(playlistId, userId) {
    const query = {
      text: 'SELECT id FROM playlist_collaborations WHERE playlist_id = $1 AND user_id = $2',
      values: [playlistId, userId],
    };

    const result = await this._pool.query(query);

    console.log(result.rows);

    if (!result.rows.length) {
      throw new InvariantError('Kolaborasi gagal diverifikasi');
    }
  }
}

module.exports = PlaylistCollaborationsService;
