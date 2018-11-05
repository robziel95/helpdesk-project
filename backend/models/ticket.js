const mongoose = require('mongoose');

const ticketSchema = mongoose.Schema({
  title: {type: String, required: true},
  priority: {type: String, required: true},
  description: {type: String, required: true},
<<<<<<< HEAD
<<<<<<< HEAD
  //ref allows to define to which model this id belongs
  creator: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true}
=======
  status: {type: String, required: true}
>>>>>>> Tickets status added
=======
  status: {type: String, required: true}
>>>>>>> Tickets status added
});

module.exports = mongoose.model('Ticket', ticketSchema);
//create model from schema
