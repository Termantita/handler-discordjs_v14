const { Schema, model } = require('mongoose');

const UserSchema = Schema({
  username: {
    type: String,
    required: true
  },
  id: {
    type: Number,
    required: true
  },
  msg: {
    type: String,
    required: true
  }
});

UserSchema.methods.toJSON = function() {
  const { __v, ...user } = this.toObject();
  return user;
}

module.exports = model('User', UserSchema);