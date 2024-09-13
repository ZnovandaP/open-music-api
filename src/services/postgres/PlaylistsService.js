const { Pool } = require('pg');
const generateid = require('../../utils/generateId');
const InvariantError = require('../../exceptions/InvariantError');
const AuthorizationError = require('../../exceptions/AuthorizationError');
const NotFoundError = require('../../exceptions/NotFoundError');

class PlaylistsService {
  constructor(playlistCollaborationsService) {
    this._pool = new Pool();
    this._playlistCollaborationsService = playlistCollaborationsService;
  }

  async addPlaylist(name, ownerId) {
    const id = `playlist-${generateid(16)}`;

    const query = {
      text: 'INSERT INTO playlists VALUES($1, $2, $3) RETURNING id',
      values: [id, name, ownerId],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Playlist gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getPlaylistsByOwnerId(ownerId) {
    const query = {
      text: `
      SELECT p.id, p.name, u.username FROM playlists as p
      LEFT JOIN users as u ON p.owner = u.id
      LEFT JOIN playlist_collaborations as pc ON pc.playlist_id = p.id
      WHERE pc.user_id = $1 OR p.owner = $1
      `,
      values: [ownerId],
    };
    const result = await this._pool.query(query);
    return result.rows;
  }

  async deletePlaylistById(id, owner) {
    await this.verifyPlaylistOwner(id, owner);

    const query = {
      text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new InvariantError('Playlist gagal dihapus. Id tidak ditemukan');
    }
  }

  async getPlaylistById(id) {
    const query = {
      text: 'SELECT * FROM playlists WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    return result.rows[0];
  }

  async verifyPlaylistOwner(id, owner) {
    const { owner: ownerPlaylist } = await this.getPlaylistById(id);

    if (ownerPlaylist !== owner) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }

  async verifyOwnerAccessPlaylist(playlistId, userId) {
    try {
      await this.verifyPlaylistOwner(playlistId, userId);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      // eslint-disable-next-line no-useless-catch
      try {
        await this._playlistCollaborationsService.verifyCollaboratorPlaylist(playlistId, userId);
      } catch {
        throw error;
      }
    }
  }
}

module.exports = PlaylistsService;
