/* eslint-disable no-unused-vars */
const autoBind = require('auto-bind');
const NotFoundError = require('../../exceptions/NotFoundError');

class SongsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  async postSongHandler(request, h) {
    this._validator.validateSongPayload(request.payload);
    const {
      title, year, performer, genre, duration = null, albumId = null,
    } = request.payload;

    const songId = await this._service.addSong({
      title, year, performer, genre, duration, albumId,
    });

    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil ditambahkan',
      data: {
        songId,
      },
    });

    response.code(201);

    return response;
  }

  async getSongsHandler(request) {
    const { title, performer } = request.query;

    if (title && performer) {
      const songs = await this._service.getSongsByTitleAndPerformer(title, performer);
      return {
        status: 'success',
        data: {
          songs,
        },
      };
    }

    if (title) {
      const songs = await this._service.getSongsByTitle(title);
      return {
        status: 'success',
        data: {
          songs,
        },
      };
    }

    if (performer) {
      const songs = await this._service.getSongsByPerformer(performer);
      return {
        status: 'success',
        data: {
          songs,
        },
      };
    }

    const songs = await this._service.getSongs();
    return {
      status: 'success',
      data: {
        songs,
      },
    };
  }

  async getSongByIdHandler(request, h) {
    const { id } = request.params;

    const song = await this._service.getSongById(id);
    return {
      status: 'success',
      data: {
        song,
      },
    };
  }

  async putSongByIdHandler(request, h) {
    this._validator.validateSongPayload(request.payload);
    const { id } = request.params;

    await this._service.editSongById(id, request.payload);

    return {
      status: 'success',
      message: 'Lagu berhasil diperbarui',
    };
  }

  async deleteSongByIdHandler(request, h) {
    const { id } = request.params;
    await this._service.deleteSongById(id);
    return {
      status: 'success',
      message: 'Lagu berhasil dihapus',
    };
  }
}

/* eslint-disable no-unused-vars */

module.exports = SongsHandler;
