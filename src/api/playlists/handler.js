/* eslint-disable no-unused-vars */
const autoBind = require('auto-bind');

class PlaylistsHandler {
  constructor({
    playlistsService, playlistSongsService, songsService, playlistSongActivitiesService, validator,
  }) {
    this._playlistsService = playlistsService;
    this._playlistSongsService = playlistSongsService;
    this._songsService = songsService;
    this._playlistSongActivitiesService = playlistSongActivitiesService;
    this._validator = validator;

    autoBind(this);
  }

  async postPlaylistHandler(request, h) {
    this._validator.validatePostPlaylistsPayloadSchema(request.payload);
    const { name } = request.payload;
    const { id: ownerId } = request.auth.credentials;

    const playlistId = await this._playlistsService.addPlaylist(name, ownerId);

    const response = h.response({
      status: 'success',
      data: {
        playlistId,
      },
    });

    response.code(201);

    return response;
  }

  async getPlaylistsHandler(request, h) {
    const { id: ownerId } = request.auth.credentials;

    const playlists = await this._playlistsService.getPlaylistsByOwnerId(ownerId);

    return {
      status: 'success',
      data: {
        playlists,
      },
    };
  }

  async deletePlaylistHandler(request, h) {
    const { playlistId } = request.params;
    const { id: ownerId } = request.auth.credentials;

    await this._playlistsService.deletePlaylistById(playlistId, ownerId);
    return {
      status: 'success',
      message: 'Playlist berhasil dihapus',
    };
  }

  async postSongToPlaylistHandler(request, h) {
    this._validator.validatePostSongToPlaylistsPlayloadSchema(request.payload);
    const { playlistId } = request.params;
    const { songId } = request.payload;
    const { id: ownerId } = request.auth.credentials;

    await this._playlistsService.verifyOwnerAccessPlaylist(playlistId, ownerId);
    //! playlist id is legit (exists) when method above is success to executed

    const { id: songIdExists } = await this._songsService.getSongById(songId);

    await this._playlistSongsService.addSongToPlaylist(songIdExists, playlistId);

    // add history activity
    await this._playlistSongActivitiesService.addPlaylistSongActiviy({
      playlistId,
      songId: songIdExists,
      userId: ownerId,
      action: 'add',
    });

    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil ditambahkan ke playlist',
    });

    response.code(201);

    return response;
  }

  async getDetailPlaylistHandler(request, h) {
    const { playlistId } = request.params;
    const { id: ownerId } = request.auth.credentials;

    await this._playlistsService.verifyOwnerAccessPlaylist(playlistId, ownerId);

    const playlist = await this._playlistSongsService.getPlaylistSongs(playlistId);

    return {
      status: 'success',
      data: {
        playlist,
      },
    };
  }

  async deleteSongFromPlaylistHandler(request, h) {
    this._validator.validateDeleteSongFromPlaylistsPlayloadSchema(request.payload);

    const { playlistId } = request.params;
    const { songId } = request.payload;
    const { id: ownerId } = request.auth.credentials;

    await this._playlistsService.verifyOwnerAccessPlaylist(playlistId, ownerId);

    const { id: songIdExists } = await this._songsService.getSongById(songId);

    await this._playlistSongsService.deleteSongFromPlaylist(songIdExists);

    // add history activity
    await this._playlistSongActivitiesService.addPlaylistSongActiviy({
      playlistId,
      songId: songIdExists,
      userId: ownerId,
      action: 'delete',
    });

    return {
      status: 'success',
      message: 'Lagu berhasil dihapus dari playlist',
    };
  }
}

module.exports = PlaylistsHandler;
