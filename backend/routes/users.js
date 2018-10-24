const express =require("express");
const router = express.Router();
const User = require('../models/user');

//npm install --save body-parser
router.post("/api/users", (req, res, next) => {
  const user = new User({
    name: req.body.name,
    surname: req.body.surname
  });
  //.body is from body parser
  user.save().then(createdUser => {
    res.status(201).json({
      message: 'User added successfully',
      //send with response auto generated user id
      userId: createdUser._id
    });
  });
});

router.put("/api/users/:id", (req, res, next) => {
  const user = new User({
    _id: req.body.id,
    name: req.body.name,
    surname: req.body.surname
  });
  //.body is from body parser
  User.updateOne({_id: req.params.id}, user).then(
    result => {
      console.log(result);
      res.status(200).json({message: 'Update successful!'})
    }
  );
});

router.get('/api/users', (req, res, next) => {
  User.find().then(documents => {
    res.status(200).json({
      message: 'Users fetched succesfully',
      users: documents
    });
  });
})

router.delete("/api/users/:id", (req, res, next) => {
  User.deleteOne({ _id: req.params.id }).then(
    result => {
      console.log(result);
      res.status(200).json({message: 'User deleted!'});
    }
  )
});

module.exports = router;
