const express = require('express');
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.json());

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
  const user = req.body;
  //.body is from body parser
  console.log(user);
  res.status(201).json({
    message: 'User added successfully'
  });
});

app.get('/api/users', (req, res, next) => {
  const users = [
    {id: 1, name: 'John', surname: 'Doe'},
    {id: 2, name: 'Scarlet', surname: 'Johanson'},
    {id: 3, name: 'John', surname: 'Snow'},
    {id: 4, name: 'Tom', surname: 'Cruze'}
  ];
  res.status(200).json({
    message: 'Users fetched succesfully',
    users: users
  });
})

module.exports = app;
