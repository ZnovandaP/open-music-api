/* eslint-disable no-unused-vars */
const autoBind = require('auto-bind');

class ALbumVoteHandler {
  constructor(userAlbumLikesService, albumsService) {
    this._userAlbumLikesService = userAlbumLikesService;
    this._albumsService = albumsService;

    autoBind(this);
  }

  async postUpVoteAlbumHandler(request, h) {
    const { id: albumId } = request.params;

    const { id: userId } = request.auth.credentials;

    const { id: albumIdExist } = await this._albumsService.getIdAlbum(albumId);

    await this._userAlbumLikesService.verifyUserIsUpVote(userId, albumIdExist);

    await this._userAlbumLikesService.upVoteAlbum(userId, albumIdExist);

    const response = h.response({
      status: 'success',
      message: 'Album berhasil ditambahkan di favorit',
    });

    response.code(201);

    return response;
  }

  async deleteDownVoteAlbumHandler(request, h) {
    const { id: albumId } = request.params;
    const { id: userId } = request.auth.credentials;

    const { id: albumIdExist } = await this._albumsService.getIdAlbum(albumId);

    await this._userAlbumLikesService.verifyUserIsDownVote(userId, albumIdExist);

    await this._userAlbumLikesService.downVoteAlbum(userId, albumIdExist);

    return {
      status: 'success',
      message: 'Album berhasil dihapus dari favorit',
    };
  }

  async getCountVoteAlbumHandler(request, h) {
    const { id: albumId } = request.params;

    const { id: albumIdExist } = await this._albumsService.getIdAlbum(albumId);

    const likes = await this._userAlbumLikesService.getCountVoteAlbum(albumIdExist);

    return {
      status: 'success',
      data: {
        likes,
      },
    };
  }
}

module.exports = ALbumVoteHandler;
