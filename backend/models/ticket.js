const mongoose = require('mongoose');

const ticketSchema = mongoose.Schema({
  title: {type: String, required: true},
  priority: {type: String, required: true},
  description: {type: String, required: true},
<<<<<<< HEAD
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
=======
  status: {type: String, required: true}
>>>>>>> 794983bd6d0130edaf979231fd1824c0cca9ce0c
});

module.exports = mongoose.model('Ticket', ticketSchema);
//create model from schema
