const express =require("express");
const router = express.Router();
const User = require('../models/user');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const checkAuth = require('../middleware/check-auth');

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
        password: hash,
        userType: req.body.userType,
        nickname: req.body.nickname
      });
        //.body is from body parser
      user.save().then(
        result => {
          res.status(201).json({
            message: 'User created',
            result: result
          });
        }
      )
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

router.put("/api/users/:id", checkAuth, (req, res, next) => {

  bcrypt.hash(req.body.password, 10, ).then(
    hash => {
      const user = new User({
        _id: req.body.id,
        name: req.body.name,
        surname: req.body.surname,
        email: req.body.email,
        //store everything normal, but password's encrypted hash
        password: hash,
        userType: req.body.userType,
        nickname: req.body.nickname
      });

      User.updateOne({_id: req.params.id}, user)
      .then(
        result => {
          res.status(200).json({message: 'Update successful!'})
        }
      )
      .catch(
        error => {
          res.status(500).json({
            message: "Failed to update user!"
          })
        }
      );
    }
  );
});

router.get('/api/users', (req, res, next) => {
  User.find()
  .then(documents => {
    res.status(200).json({
      message: 'Users fetched succesfully',
      users: documents
    });
  })
  .catch(
    error => {
      res.status(500).json({
        message: "User fetch failed!"
      })
    }
  );
})

router.get('/api/users/:id', (req, res, next) => {
  User.findById(req.params.id)
  .then(
    user =>{
      if (user) {
        res.status(200).json(user);
      } else{
        res.status(404).json({message: 'User not found!'});
      }
    }
  )
  .catch(
    error => {
      res.status(500).json({
        message: "User fetch failed!"
      })
    }
  );
});

router.delete("/api/users/:id", checkAuth, (req, res, next) => {
  User.deleteOne({ _id: req.params.id })
  .then(
    result => {
      res.status(200).json({message: 'User deleted!'});
    }
  )
  .catch(
    error => {
      res.status(500).json({
        message: "User deletion failed!"
      })
    }
  );
});

router.post("/api/user/login", (req, res, next) => {
  let fetchedUser;
  //email is unique
  User.findOne({email: req.body.email})
  .then(
    user => {
      if (!user) {
        return res.status(401).json({
          message: "Auth failed"
        });
      }
      //fetch user
      fetchedUser = user;
      //return result of compare of input password with fetched in user data
      //compare is used, because encrypted password can not be decrypted
      return bcrypt.compare(req.body.password, user.password);
    })
  .then( result => {
    //if compare fails
    if (!result) {
      //return to prevent execution of further code in then block
      return res.status(401).json({
        message: "Auth failed"
      });
    }
    //if compare success
    //.sign method creates a new token
    const token = jwt.sign(
      //token stores user id, email
      {email: fetchedUser.email, userId: fetchedUser._id},
      'this-is-a-very-long-secret-key-used-to-encode-a-token',
      //Add token expire property
      { expiresIn: "1h" }
    );
    //return info to frontend
    res.status(200).json({
      token: token,
      //seconds
      expiresIn: 3600,
      loggedUser: fetchedUser
    });
  })
  .catch(
    err => {
      return res.status(401).json({
        message: "Invalid authentication credentials, login failed!"
      })
    }
  );
})

module.exports = router;
