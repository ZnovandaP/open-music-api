const routes = require('./routes');
const UploadsHandler = require('./handler');

module.exports = {
  name: 'upload-cover-album',
  version: '1.0,0',
  register: async (server, { albumsService, storageService, validator }) => {
    const uploadsHandler = new UploadsHandler({ albumsService, storageService, validator });

    server.route(routes(uploadsHandler));
  },
};
