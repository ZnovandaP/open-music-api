const routes = require('./routes');
const PlaylistCollaborationHandler = require('./handler');

module.exports = {
  name: 'playlist_collaborations',
  version: '1.0,0',
  register: async (server, {
    playlistCollaborationsService, playlistsService, usersService, validator,
  }) => {
    const playlistCollaborationHandler = new PlaylistCollaborationHandler(
      {
        playlistCollaborationsService,
        playlistsService,
        usersService,
        validator,
      },
    );

    server.route(routes(playlistCollaborationHandler));
  },
};
