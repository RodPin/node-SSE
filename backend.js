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

//Function to send the counter to the frontEnd
const xSSE = new SSE("/counter");
const sendCounter = () => {
  -setTimeout(() => {
    //Send the counter to the client every 3 seconds

    xSSE.broadCast({ count });

    count++;
    sendCounter();
  }, 3000);
};
//Here i make the route active
//If the front end connects to the route it will receive the counter updates
function SSE(pPath) {
  if (!pPath) {
    throw "No endPoint found, you need to pass an endpoint to 'SSE()'";
  }
  //Basically if we don`t save all the connections we had so far, it will only be possible to send the message to the last client
  //Thats why we create this array of clients
  this.connectedClients = [];
  app.get(pPath, (req, res) => {
    this.broadCast = (pObj) => {
      console.log("Responding counter: ", pObj.count);
      //Here we send to the clients individually (we set it on line 37)
      for (xClient of this.connectedClients) {
        xClient.write(`data: ${JSON.stringify(pObj)}`);
        xClient.write("\n\n");
      }
    };
    //Identifying the connected client with an id
    const clientId = Date.now();
    //Pushing the client to the connectedClients array
    console.log("Connected Client: " + clientId);
    this.connectedClients.push(res);

    //Make the connection active
    res.writeHead(200, {
      Connection: "keep-alive",
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
    });
    //When user closes client (navegador) we need to remove it from the connectedClients array
    req.on("close", () => {
      console.log(`Disconnected Client: ${clientId}`);
      this.connectedClients = this.connectedClients.filter((c) => c !== res);
    });
  });
}

sendCounter();

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
