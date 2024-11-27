import { WebSocketServer } from 'ws';


function sendBloop(ws) {
    ws.send('bloop');
}

function connection(ws) {
  var id=setInterval(sendBloop.bind(null,ws), 10*1000);
  console.log("bloop bloop started for "+id);
  ws.on('close',function bye(){
    clearInterval(id);
    console.log("bloop bloop ended for "+id);
  });
}

const wss = new WebSocketServer({ port: 8087 });
console.log("Serveur Websocket en attente sur le port 8087");
wss.on('connection', connection);










