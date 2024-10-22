/* eslint-disable no-unused-vars */
const autoBind = require('auto-bind');

class PlaylistSongActivitiesHandler {
  constructor(playlistSongActivitiesService, playlistsService) {
    this._playlistSongActivitiesService = playlistSongActivitiesService;
    this._playlistsService = playlistsService;

    autoBind(this);
  }

  async getDetailPlaylistActivities(request, h) {
    const { playlistId } = request.params;
    const { id: ownerId } = request.auth.credentials;

    await this._playlistsService.verifyPlaylistOwner(playlistId, ownerId);

    const detailPlaylistActivities = await this._playlistSongActivitiesService
      .getDetailPlaylistSongActivities(playlistId);

    return {
      status: 'success',
      data: {
        ...detailPlaylistActivities,
      },
    };
  }
}

module.exports = PlaylistSongActivitiesHandler;
