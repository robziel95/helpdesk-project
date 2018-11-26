const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const userRoutes = require("./routes/users")
const ticketRoutes = require("./routes/tickets")

const app = express();

app.use(bodyParser.json());

mongoose.connect(
  'mongodb://localhost:27017/helpdeskSeed'
  //"mongodb+srv://robz:EnyhIPVvwPUkeqeE@cluster0-zpzps.mongodb.net/helpdesk?retryWrites=true"
)
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
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  //allow to read resources fromm all origins
  res.setHeader("Access-Control-Allow-Methods",
  "GET, POST, PATCH, DELETE, PUT, OPTIONS"
  );
  next();
});

app.use(userRoutes);
app.use(ticketRoutes);

module.exports = app;
