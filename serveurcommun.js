/* Modules */
import express from 'express';
import path from "path";
import { fileURLToPath } from 'url';
import { connect } from './serveurws_fonctions.js';
import * as http from 'http';
import { WebSocketServer } from 'ws';

// iniitialisation du framework express
const app = express();

// Numero du port qui acceptera les connections http et websocket en même temps
const port = 8080;




// srepertoire pour les fichiers statiques (CSS, JS, images, etc.)
const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory
app.use(express.static(path.join(__dirname, 'static')));


const httpServer = http.createServer(  app );
const wss = new WebSocketServer({ server: httpServer });

// Un exemple de route avec express
app.get('/', (req, res) => {
    res.send('Hello, World!'); // Send 'Hello, World!' as the response
});
wss.on('connection', connect);

// on demare le serveur qui ecoute les requêtes http et passe en websocket si besoin

httpServer.listen( port, function listening(){
    console.log( 'En attente de requetes sur le port ' + port +' http + websocket');
});
