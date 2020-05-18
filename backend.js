const sseChannel = require("./sseChannel");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const port = process.env.PORT || 3002;

let count = 1;

const xSSE = new sseChannel();

//Here i make the route active
//If the front end connects to the route it will receive the counter updates
app.get("/counter", xSSE.middleWare());

//Function to send the counter to the frontEnd
const sendCounter = () => {
  console.log(`Responding counter:${count}\tClients:${xSSE.count()}`);
  xSSE.broadcast({ count });
  count++;
};

sendCounter();

setInterval(() => {
  sendCounter();
}, 3000);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
