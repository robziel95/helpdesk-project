const express =require("express");
const router = express.Router();
const User = require('../models/user');
const bcrypt = require("bcrypt");

//npm install --save body-parser
router.post("/api/users/create", (req, res, next) => {

  //hash user password with package bcrypt so they are not stored in raw form in database
  bcrypt.hash(req.body.password, 10, ).then(
    hash => {
      const user = new User({
        name: req.body.name,
        surname: req.body.surname,
        email: req.body.email,

        //store everything normal, but password's encrypted hash
        password: hash
      });
        //.body is from body parser
      user.save().then(createdUser => {
        result => {
          res.status(201).json({
            message: 'User created',
            result: result
          });
        }
      })
      .catch(
        err => {
          res.status(500).json({
            message: "Invalid authentication credentials!"
          });
        }
      );
    }
  );
});

router.put("/api/users/:id", (req, res, next) => {
  const user = new User({
    _id: req.body.id,
    name: req.body.name,
    surname: req.body.surname,
    email: req.body.email,
    password: req.body.password
  });
  //.body is from body parser
  User.updateOne({_id: req.params.id}, user).then(
    result => {
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

router.get('/api/users/:id', (req, res, next) => {
  User.findById(req.params.id).then(
    user =>{
      if (user) {
        res.status(200).json(user);
      } else{
        res.status(404).json({message: 'User not found!'});
      }
    }
  );
});

router.delete("/api/users/:id", (req, res, next) => {
  User.deleteOne({ _id: req.params.id }).then(
    result => {
      console.log(result);
      res.status(200).json({message: 'User deleted!'});
    }
  )
});

module.exports = router;
