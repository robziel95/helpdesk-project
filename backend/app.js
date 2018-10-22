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
  user.save().then(createdPost => {
    res.status(201).json({
      message: 'User added successfully',
      postId: createdPost._id
    });
  });
});
/*
app.post("/api/posts", (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  post.save().then(createdPost => {
    res.status(201).json({
      message: 'Post added successfully',
      postId: createdPost._id
    });
  });
});
*/
app.get('/api/users', (req, res, next) => {
  const users = [
    {id: '1', name: 'John', surname: 'Doe'},
    {id: '2', name: 'Scarlet', surname: 'Johanson'},
    {id: '3', name: 'John', surname: 'Snow'},
    {id: '4', name: 'Tom', surname: 'Cruze'}
  ];
  res.status(200).json({
    message: 'Users fetched succesfully',
    users: users
  });
})

module.exports = app;
