const express =require("express");
const router = express.Router();
const Ticket = require('../models/ticket');
const User = require('../models/user');
const checkAuth = require('../middleware/check-auth');

router.post("/api/tickets", checkAuth, (req, res, next) => {
  const ticket = new Ticket({
    title: req.body.title,
    priority: req.body.priority,
    description: req.body.description,
    creator: req.userData.userId,
    status: req.body.status,
    creationDate: req.body.creationDate
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
    creator: req.body.creator,
    status: req.body.status,
    creationDate: req.body.date
  });
  let updateTicket;
  User.findById(req.userData.userId)
  .then(
    user =>{
      if(user.userType == 'administrator'){
        //If user sending request is admin -- update post by id only
        updateTicket = Ticket.updateOne({_id: req.params.id}, ticket);
      }else{
        //If user sending request is not admin -- update post by id and check if authenticeted user created ticket
        updateTicket = Ticket.updateOne({_id: req.params.id, creator: req.userData.userId}, ticket);
      }

      updateTicket.then(
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
    }
  )
  .catch(
    error => {
      res.status(500).json({
        message: "User authentication problem!"
      })
    }
  );
});

router.get('/api/tickets', (req, res, next) => {
  //req.query;//those are parameters send in url after "?" sign, each parameter is separated by &
  const pageSize = +req.query.pagesize;//we retrieve value from query named pageSize, cast it to number with +, if we dont pass it, its value will be undefined
  const currentPage = Number(req.query.page); //+ at the begginning casts to number, same as Number method
  const ticketQuery = Ticket.find();
  //postQuery will be executed after we call then
  let fetchedTickets;

  if (pageSize && currentPage){
    //if we get parameters, we modify ticketQuery
    ticketQuery
    .skip(pageSize * (currentPage - 1)) //skip first n elements
    .limit(pageSize); //display only declared amount of items
  }
  ticketQuery
  .then(documents => {
    fetchedTickets = documents;
    return Ticket.count();
  })
  .then(count => {
    res.status(200).json({
      message: 'Tickets fetched succesfully',
      tickets: fetchedTickets,
      maxTickets: count
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
  let deleteTicket;
  User.findById(req.userData.userId)
  .then(
    user =>{
      if(user.userType == 'administrator'){
        //If user sending request is admin -- delete post by id
        deleteTicket = Ticket.deleteOne({ _id: req.params.id });
      }else{
        //If user sending request is not admin -- delete post by id and check if authenticeted user created ticket
        deleteTicket = Ticket.deleteOne({ _id: req.params.id, creator: req.userData.userId });
      }

      deleteTicket.then(
        (result) => {
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
    }
  ).catch(
    error => {
      res.status(500).json({
        message: "User authentication problem!"
      })
    }
  );
});

module.exports = router;
