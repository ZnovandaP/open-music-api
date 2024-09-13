/* eslint-disable no-unused-vars */
const autoBind = require('auto-bind');

class PlaylistCollaborationHandler {
  constructor({
    playlistCollaborationsService, playlistsService, usersService, validator,
  }) {
    this._playlistCollaborationsService = playlistCollaborationsService;
    this._playlistsService = playlistsService;
    this._usersService = usersService;
    this._validator = validator;

    autoBind(this);
  }

  async postPlaylistCollaborationHandler(request, h) {
    this._validator.validatePostPlaylistCollaborationPayloadSchema(request.payload);

    const { id: ownerId } = request.auth.credentials;
    const { playlistId, userId } = request.payload;

    console.log(playlistId, userId);

    await this._playlistsService.verifyPlaylistOwner(playlistId, ownerId);
    await this._usersService.verifyUserIsExistById(userId);

    const collaborationId = await this._playlistCollaborationsService
      .addPlaylistCollaboration(playlistId, userId);

    const respose = h.response({
      status: 'success',
      data: {
        collaborationId,
      },
    });

    respose.code(201);

    return respose;
  }

  async deletePlaylistCollaborationHandler(request, h) {
    this._validator.validateDeletePlaylistCollaborationPayloadSchema(request.payload);

    const { id: ownerId } = request.auth.credentials;
    const { playlistId, userId } = request.payload;

    await this._playlistsService.verifyPlaylistOwner(playlistId, ownerId);
    await this._usersService.verifyUserIsExistById(userId);

    await this._playlistCollaborationsService.deletePlaylistCollaboration(playlistId, userId);

    return {
      status: 'success',
      message: 'Kolaborasi berhasil dihapus',
    };
  }
}

module.exports = PlaylistCollaborationHandler;
