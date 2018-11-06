const mongoose = require('mongoose');

const ticketSchema = mongoose.Schema({
  title: {type: String, required: true},
  priority: {type: String, required: true},
  description: {type: String, required: true},
  //ref allows to define to which model this id belongs
  creator: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true}
});

module.exports = mongoose.model('Ticket', ticketSchema);
//create model from schema
