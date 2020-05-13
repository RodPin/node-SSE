const express = require("express");
const request = require("request");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const port = process.env.PORT || 3002;

let count = 1;
//Basically if we don`t save all the connections we had so far, it will only be possible to send the message to the last client
//Thats why we create this array of clients
let connectedClients = [];

//Function to send the counter to the frontEnd
const sendCounter = (res) => {
  setTimeout(() => {
    //Send the counter to the client every 3 seconds
    console.log("Responding counter: " + count);
    //Here we send to the clients individually (we set it on line 37)
    for (xClient of connectedClients) {
      xClient.res.write(`data: ${JSON.stringify({ count })}`);
      xClient.res.write("\n\n");
    }
    count++;
    sendCounter(res);
  }, 3000);
};
//Here i make the route active
//If the front end connects to the route it will receive the counter updates
app.get("/counter", (req, res) => {
  //Identifying the connected client with an id
  const clientId = Date.now();
  //Pushing the client to the connectedClients array
  console.log("Connected Client: " + clientId);
  connectedClients.push({ id: clientId, res });

  //Make the connection active
  res.writeHead(200, {
    Connection: "keep-alive",
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
  });
  //When user closes client (navegador) we need to remove it from the connectedClients array
  req.on("close", () => {
    console.log(`Disconnected Client: ${clientId}`);
    connectedClients = connectedClients.filter((c) => c.id !== clientId);
  });
  sendCounter(res);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
