const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const User = require('./models/user');

const app = express();

app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/helpdesk')
.then(
  () => {
    console.log("connected to database");
  }
)
.catch(
  () => {
    console.log("connection failed");
  }
);

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  //allow to read resources fromm all origins
  res.setHeader("Access-Control-Allow-Methods",
  "GET, POST, PATCH, DELETE, PUT, OPTIONS"
  );
  next();
});

//npm install --save body-parser
app.post("/api/users", (req, res, next) => {
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
app.get('/api/users', (req, res, next) => {
  User.find().then(documents => {
    res.status(200).json({
      message: 'Users fetched succesfully',
      users: documents
    });
  });
})

app.delete("/api/users/:id", (req, res, next) => {
  User.deleteOne({ _id: req.params.id }).then(
    result => {
      console.log(result);
      res.status(200).json({message: 'User deleted!'});
    }
  )
});

module.exports = app;
