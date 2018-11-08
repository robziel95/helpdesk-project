const express =require("express");
const router = express.Router();
const Ticket = require('../models/ticket');
const checkAuth = require('../middleware/check-auth');

router.post("/api/tickets", checkAuth, (req, res, next) => {
  const ticket = new Ticket({
    title: req.body.title,
    priority: req.body.priority,
    description: req.body.description,
    creator: req.userData.userId,
    status: req.body.status
  });
  //.body is from body parser
  ticket.save()
  .then(createdTicket => {
    res.status(201).json({
      message: 'Ticket added successfully',
      //send with response auto generated ticket id
      ticketId: createdTicket._id
    });
  })
  .catch(
    error => {
      res.status(500).json({
        message: "Creating a post failed!"
      })
    }
  );
});

router.put("/api/tickets/:id", checkAuth, (req, res, next) => {
  const ticket = new Ticket({
    _id: req.body.id,
    title: req.body.title,
    priority: req.body.priority,
    description: req.body.description,
    creator: req.userData.userId,
    status: req.body.status
  });
  //.body is from body parser
  Ticket.updateOne({_id: req.params.id, creator: req.userData.userId}, ticket)
  .then(
    result => {
      //nmodified is a field in result which tells if sth was modified
      if (result.nModified > 0) {
        res.status(200).json({message: 'Update successful!'})
      }else{
        res.status(401).json({message: 'Not authorized!'})
      }
    }
  )
  .catch(
    error => {
      res.status(500).json({
        message: "Couldn't update post!"
      })
    }
  );
});

router.get('/api/tickets', (req, res, next) => {
  Ticket.find().then(documents => {
    res.status(200).json({
      message: 'Tickets fetched succesfully',
      tickets: documents
    });
  })
  .catch(
    error => {
      res.status(500).json({
        message: "Fetching posts failed!"
      })
    }
  );
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
  )
  .catch(
    error => {
      res.status(500).json({
        message: "Fetching post failed!"
      })
    }
  );
});

router.delete("/api/tickets/:id", checkAuth, (req, res, next) => {
  Ticket.deleteOne({ _id: req.params.id, creator: req.userData.userId })
  .then(
    result => {
      if (result.n > 0) {
        res.status(200).json({message: 'Deletion successful!'})
      }else{
        res.status(401).json({message: 'Not authorized!'})
      }
    }
  )
  .catch(
    error => {
      res.status(500).json({
        message: "Deleting post failed!"
      })
    }
  );
});

module.exports = router;
