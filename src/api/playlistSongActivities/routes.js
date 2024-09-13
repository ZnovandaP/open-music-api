const routes = (handler) => [
  {
    method: 'GET',
    path: '/playlists/{playlistId}/activities',
    handler: handler.getDetailPlaylistActivities,
    options: {
      auth: 'openmusic_jwt',
    },
  },
];

module.exports = routes;