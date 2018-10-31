const express =require("express");
const router = express.Router();
const Ticket = require('../models/ticket');

router.post("/api/tickets", (req, res, next) => {
  const ticket = new Ticket({
    title: req.body.title,
    priority: req.body.priority,
    description: req.body.description
  });
  //.body is from body parser
  ticket.save().then(createdTicket => {
    res.status(201).json({
      message: 'Ticket added successfully',
      //send with response auto generated ticket id
      ticketId: createdTicket._id
    });
  });
});

router.put("/api/tickets/:id", (req, res, next) => {
  const ticket = new Ticket({
    _id: req.body.id,
    title: req.body.title,
    priority: req.body.priority,
    description: req.body.description
  });
  //.body is from body parser
  Ticket.updateOne({_id: req.params.id}, ticket).then(
    result => {
      res.status(200).json({message: 'Update successful!'})
    }
  );
});

router.get('/api/tickets', (req, res, next) => {
  Ticket.find().then(documents => {
    res.status(200).json({
      message: 'Tickets fetched succesfully',
      tickets: documents
    });
  });
})

router.get('/api/tickets/:id', (req, res, next) => {
  Ticket.findById(req.params.id).then(
    ticket =>{
      if (ticket) {
        res.status(200).json(ticket);
      } else{
        res.status(404).json({message: 'Ticket not found!'});
      }
    }
  );
});

router.delete("/api/tickets/:id", (req, res, next) => {
  Ticket.deleteOne({ _id: req.params.id }).then(
    result => {
      res.status(200).json({message: 'Ticket deleted!'});
    }
  )
});

module.exports = router;
