const express = require("express");
const request = require("request");
const cors = require("cors");
const bodyParser = require("body-parser");
const events = require("events");
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const port = process.env.PORT || 3002;
const wEvent = new events.EventEmitter();
var connectedClients = [];
let count = 1;

//Function to send the counter to the frontEnd
const sendCounter = () => {
  setTimeout(() => {
    //Send the counter to the client every 3 seconds
    console.log("Responding counter: " + count);
    wEvent.emit("broadCast", { count });
    count++;
    sendCounter();
  }, 3000);
};
//Here i make the route active
//If the front end connects to the route it will receive the counter updates
app.get("/counter", sseChannel);

function sseChannel(req, res) {
  connectedClients.push(res);
  //Make the connection active
  res.writeHead(200, {
    Connection: "keep-alive",
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
  });

  wEvent.on("broadCast", (pObject) => {
    this.broadCast(pObject);
  });

  //Broadcast Envia para todos os clients conectados
  this.broadCast = (pObject) => {
    for (const xRes of connectedClients) {
      xRes.write(`data: ${JSON.stringify(pObject)}`);
      xRes.write("\n\n");
    }
  };

  //When user closes client (navegador) we need to remove it from the connectedClients array
  req.on("close", () => {
    connectedClients = connectedClients.filter((c) => c !== res);
  });
}
sendCounter();

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
