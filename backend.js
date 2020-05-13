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
const responder = (res) => {
  setTimeout(() => {
    console.log("Responding " + count);
    res.write("data:" + JSON.stringify({ count }));
    res.write("\n\n");
    count++;
    responder(res);
  }, 3000);
};
app.get("/detailWithSSE", (req, res) => {
  res.writeHead(200, {
    Connection: "keep-alive",
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
  });
  responder(res);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
