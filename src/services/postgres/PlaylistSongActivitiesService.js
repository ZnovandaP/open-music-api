const { Pool } = require('pg');
const generateid = require('../../utils/generateId');
const InvariantError = require('../../exceptions/InvariantError');

class PlaylistSongActivitiesService {
  constructor() {
    this._pool = new Pool();
  }

  async addPlaylistSongActiviy({
    playlistId, songId, userId, action,
  }) {
    const id = `psa-${generateid()}`;

    const query = {
      text: `
      INSERT INTO playlist_song_activities (id, playlist_id, song_id, user_id, action)
      VALUES($1, $2, $3, $4, $5) RETURNING id
      `,
      values: [id, playlistId, songId, userId, action],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Activity gagal ditambahkan ke playlist');
    }

    return result.rows[0].id;
  }

  async getDetailPlaylistSongActivities(playlistId) {
    const query = {
      text: `
      SELECT p.id as "playlistId", 
        COALESCE(
          array_agg(
            json_build_object(
              'username', u.username,
              'title', s.title,
              'action', psa.action,
              'time', psa.time
            )
          ) FILTER (WHERE psa.song_id IS NOT NULL AND u.username IS NOT NULL),
            ARRAY[]::json[]
        ) as activities
      FROM playlists AS p
      JOIN playlist_song_activities AS psa  ON p.id = psa.playlist_id
      JOIN songs AS s ON s.id = psa.song_id
      JOIN users AS u ON u.id = psa.user_id
      WHERE psa.playlist_id = $1
      GROUP BY p.id;
      `,
      values: [playlistId],
    };
    const result = await this._pool.query(query);

    return result.rows[0];
  }
}

module.exports = PlaylistSongActivitiesService;
