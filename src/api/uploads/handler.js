/* eslint-disable no-unused-vars */
const autoBind = require('auto-bind');
const config = require('../../utils/config');

class UploadsHandler {
  constructor({ albumsService, storageService, validator }) {
    this._albumsService = albumsService;
    this._storageService = storageService;
    this._validator = validator;

    autoBind(this);
  }

  async postUploadsCoverAlbumHandler(request, h) {
    const { cover } = request.payload;
    const { id: albumId } = request.params;

    this._validator.validateImageHeaders(cover.hapi.headers);

    const { id: albumIdExist } = await this._albumsService.getIdAlbum(albumId);

    const filename = await this._storageService.writeFile(cover, cover.hapi);

    const urlCover = `http://${config.app.host}:${config.app.port}/albums/${albumId}/covers/${filename}`;

    await this._albumsService.updateCoverAlbum(albumIdExist, urlCover);

    const response = h.response({
      status: 'success',
      message: 'Sampul berhasil diunggah',
    });

    response.code(201);

    return response;
  }
}

module.exports = UploadsHandler;
