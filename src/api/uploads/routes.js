const path = require('path');

const routes = (handler) => [
  {
    method: 'POST',
    path: '/albums/{id}/covers',
    handler: handler.postUploadsCoverAlbumHandler,
    options: {
      payload: {
        allow: 'multipart/form-data',
        multipart: true,
        output: 'stream',
        maxBytes: 512000,
      },
    },
  },

  {
    method: 'GET',
    path: '/albums/{id}/covers/{param*}',
    handler: {
      directory: {
        path: path.resolve(__dirname, 'files', 'images'),
      },
    },
  },
];

module.exports = routes;
