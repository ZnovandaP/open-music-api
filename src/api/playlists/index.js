const routes = require('./routes');
const PlaylistsHandler = require('./handler');

module.exports = {
  name: 'playlists',
  version: '1.0,0',
  register: async (server, {
    playlistSongsService, playlistsService, songsService, validator,
  }) => {
    const playlistsHandler = new PlaylistsHandler({
      playlistSongsService,
      playlistsService,
      songsService,
      validator,
    });

    server.route(routes(playlistsHandler));
  },
};