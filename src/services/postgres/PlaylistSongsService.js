const { Pool } = require('pg');
const generateid = require('../../utils/generateId');
const InvariantError = require('../../exceptions/InvariantError');

class PlaylistSongsService {
  constructor() {
    this._pool = new Pool();
  }

  async addSongToPlaylist(songId, playlistId) {
    const id = `ps-${generateid()}`;

    const query = {
      text: `
      INSERT INTO playlist_songs (id, song_id, playlist_id)
      VALUES($1, $2, $3) RETURNING id
      `,
      values: [id, songId, playlistId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Lagu gagal ditambahkan kedalam playlist');
    }

    return result.rows[0].id;
  }

  async getPlaylistSongs(playlistId) {
    const query = {
      text: `
      SELECT p.id, p.name, u.username, 
      COALESCE(
        array_agg(
          json_build_object(
            'id', s.id,
            'title', s.title,
            'performer', s.performer
          )
        ) FILTER (WHERE ps.song_id IS NOT NULL),
        ARRAY[]::json[]
      ) AS songs
      from playlist_songs AS ps
      JOIN playlists AS p ON p.id = ps.playlist_id
      JOIN songs AS s ON s.id = ps.song_id
      JOIN users AS u ON u.id = p.owner
      WHERE ps.playlist_id = $1
      GROUP BY p.id, p.name, u.username
      `,
      values: [playlistId],
    };

    const result = await this._pool.query(query);
    return result.rows[0];
  }

  async deleteSongFromPlaylist(songId) {
    const query = {
      text: 'DELETE FROM playlist_songs WHERE song_id = $1 RETURNING id',
      values: [songId],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new InvariantError('Lagu gagal dihapus dari playlist');
    }
  }
}

module.exports = PlaylistSongsService;
