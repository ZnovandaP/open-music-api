const routes = (handler) => [
  {
    method: 'POST',
    path: '/collaborations',
    handler: handler.postPlaylistCollaborationHandler,
    options: {
      auth: 'openmusic_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/collaborations',
    handler: handler.deletePlaylistCollaborationHandler,
    options: {
      auth: 'openmusic_jwt',
    },
  },
];

module.exports = routes;
