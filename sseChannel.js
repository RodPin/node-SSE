function sseChannel() {
  const connectedClients = {};
  let count = 0;
  const pvConnect = (pRes) => {
    pRes.writeHead(200, {
      Connection: "keep-alive",
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
    });
    count++;
    pRes.sseId = count;
    connectedClients[pRes.sseId] = pRes;
  };

  const pvDisconnect = (pSSEId) => {
    delete connectedClients[pSSEId];
  };

  this.count = () => {
    return Object.keys(connectedClients).length;
  };

  this.broadcast = (pData) => {
    if (!pData) {
      return;
    }
    try {
      // throw new Error("Broadcast error");
      for (const xRes in connectedClients) {
        const xClient = connectedClients[xRes];
        xClient.write(`data: ${JSON.stringify(pData)}`);
        xClient.write("\n\n");
      }
    } catch (err) {
      console.log(`Broadcast console log ${err}`);
    }
  };
  this.close = () => {
    for (const xRes in connectedClients) {
      const xClient = connectedClients[xRes];
      xClient.end();
    }
  };
  this.middleWare = () => {
    return [
      (req, res, next) => {
        //Cria a conexão
        pvConnect(res);

        req.on("close", () => {
          //Fecha a conexão
          pvDisconnect(res.sseId);
        });

        next();
      },
      (err, req, res, next) => {
        console.log(`Tratado ${err}`);
        next();
      },
    ];
  };
}

module.exports = sseChannel;
