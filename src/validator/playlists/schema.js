const Joi = require('joi');

const PostPlaylistsPayloadSchema = Joi.object({
  name: Joi.string().required(),
});

const PostSongToPlaylistsPlayloadSchema = Joi.object({
  songId: Joi.string().required(),
});

const DeleteSongFromPlaylistsPlayloadSchema = Joi.object({
  songId: Joi.string().required(),
});

module.exports = {
  PostPlaylistsPayloadSchema,
  PostSongToPlaylistsPlayloadSchema,
  DeleteSongFromPlaylistsPlayloadSchema,
};
