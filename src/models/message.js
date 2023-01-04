const { Schema, model } = require('mongoose');

const MessageSchema = Schema({
  username: {
    type: String,
    required: true
  },
  id: {
    type: Number,
    required: true
  },
  message: {
    type: String,
    required: true
  }
});

MessageSchema.methods.toJSON = function() {
  const { __v, ...message } = this.toObject();
  return message;
}

module.exports = model('Message', MessageSchema);