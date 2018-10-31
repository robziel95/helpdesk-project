const express =require("express");
const router = express.Router();
const Ticket = require('../models/ticket');

router.post("/api/tickets", (req, res, next) => {
  console.log("got post request");
  const ticket = new Ticket({
    title: req.body.title,
    priority: req.body.priority,
    description: req.body.description
  });
  console.log("Ticket created");
  console.log(ticket);
  //.body is from body parser
  ticket.save().then(createdTicket => {
    console.log("Ticket save");
    res.status(201).json({
      message: 'Ticket added successfully',
      //send with response auto generated user id
      ticketId: createdTicket._id
    });
  });
});




module.exports = router;
