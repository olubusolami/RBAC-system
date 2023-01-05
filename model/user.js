const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const validator = require("validator");
 
const UserSchema = new Schema({
 email: {
  type: String,
  required: true,
  trim: true,
  unique: true,
  validate: [validator.isEmail, "Please provide a valid email address."],
 },
 password: {
  type: String,
  required: true
 },
 role: {
  type: String,
  required: true,
  default: 'basic',
  enum: ["basic", "supervisor", "admin"]
 },
 token: {
  type: String
 }
});
 
const User = mongoose.model('user', UserSchema);
 
module.exports = User;