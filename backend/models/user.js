const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  name: {type: String, required: true},
  surname: {type: String, required: true}
});

module.exports = mongoose.model('User', userSchema);
//create model from schema
