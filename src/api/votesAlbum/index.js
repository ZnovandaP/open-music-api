const routes = require('./routes');
const ALbumVoteHandler = require('./handler');

module.exports = {
  name: 'votes-Album',
  version: '1.0,0',
  register: async (server, { userAlbumLikesService, albumsService }) => {
    const aLbumVoteHandler = new ALbumVoteHandler(userAlbumLikesService, albumsService);

    server.route(routes(aLbumVoteHandler));
  },
};
