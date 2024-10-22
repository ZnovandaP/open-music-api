const {
  PostPlaylistCollaborationPayloadSchema,
  DeletePlaylistCollaborationPayloadSchema,
} = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

const PlaylistCollaborationsValidator = {
  validatePostPlaylistCollaborationPayloadSchema: (payload) => {
    const validationResult = PostPlaylistCollaborationPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },

  validateDeletePlaylistCollaborationPayloadSchema: (payload) => {
    const validationResult = DeletePlaylistCollaborationPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = PlaylistCollaborationsValidator;
