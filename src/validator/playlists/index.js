const { PostPlaylistsPayloadSchema, PostSongToPlaylistsPlayloadSchema, DeleteSongFromPlaylistsPlayloadSchema } = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

const PlaylistsValidator = {
  validatePostPlaylistsPayloadSchema: (payload) => {
    const validationResult = PostPlaylistsPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },

  validatePostSongToPlaylistsPlayloadSchema: (payload) => {
    const validationResult = PostSongToPlaylistsPlayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },

  validateDeleteSongFromPlaylistsPlayloadSchema: (payload) => {
    const validationResult = DeleteSongFromPlaylistsPlayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = PlaylistsValidator;
