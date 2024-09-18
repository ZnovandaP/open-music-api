/* eslint-disable no-unused-vars */
const autoBind = require('auto-bind');

class ExportsHandler {
  constructor({ producerService, playlistsService, validator }) {
    this._producerService = producerService;
    this._playlistsService = playlistsService;
    this._validator = validator;

    autoBind(this);
  }

  async postExportPlaylistHandler(request, h) {
    this._validator.validateExportPlaylistPayload(request.payload);
    const { playlistId } = request.params;
    const { targetEmail } = request.payload;
    const { id: ownerId } = request.auth.credentials;

    const message = {
      ownerId,
      playlistId,
      targetEmail,
    };

    await this._playlistsService.verifyOwnerAccessPlaylist(playlistId, ownerId);
    //! playlist id is legit (exists) when method above is success to executed

    await this._producerService.sendMessage('export:playlist', JSON.stringify(message));

    const response = h.response({
      status: 'success',
      message: 'Permintaan Anda sedang kami proses',
    });

    response.code(201);

    return response;
  }
}

module.exports = ExportsHandler;
