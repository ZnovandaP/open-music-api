const Joi = require('joi');

const PostPlaylistCollaborationPayloadSchema = Joi.object({
  playlistId: Joi.string().required(),
  userId: Joi.string().required(),
});

const DeletePlaylistCollaborationPayloadSchema = Joi.object({
  playlistId: Joi.string().required(),
  userId: Joi.string().required(),
});

module.exports = {
  PostPlaylistCollaborationPayloadSchema,
  DeletePlaylistCollaborationPayloadSchema,
};
