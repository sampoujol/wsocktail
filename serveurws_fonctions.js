
import * as fs from 'fs';
import * as os from 'os';





/**
 * Lit et envoie  sur le websocket len octets depuis la position startpos du fichier
 * @param ws la websocket ouverte
 * @param options
 * @param startpos la position de debut de lecture
 * @param len la longueur à lire
 */
function readNSend(ws, options, startpos, len){
  console.log("entering readNSend, startpos "+startpos+" len "+len);
  // creation d'un tampon pour lire les nouveautés
  var buffer = new Buffer(len);
  var fileDescriptor = fs.openSync(options.logFile, 'r');
  // lecture des nouveautés
  fs.readSync(fileDescriptor, buffer, 0, len, startpos);
  fs.closeSync(fileDescriptor); // close the file
  console.log("sending");
  ws.send(buffer.toString());
}



/**
 * Callback executé à lors de la connection d'un client au websocket
 * @param ws
 */
export function connect(ws){

  // structure de donnees decrivant le fichier à scruter
  var options = {
    logFile: 'toto.txt',
    endOfLineChar: os.EOL
  };

  //etape 1, on lit le fichier en entier avant d'attendre les changements
  console.log("Reading first part");
  var spos = 0;
  var fsz = fs.statSync(options.logFile).size;
  readNSend(ws, options, spos,fsz);
  spos=fsz;

  //etape 2, on scrute le fichier pour observer d'éventuels changements
  console.log("now waiting for changes");
  fs.watchFile(options.logFile, function (current, previous) {
    console.log("Just woke up");
    // On envoie les dernieres lignes du fichier
    // - si la date de dèrniere modification a changé
    if (current.mtime > previous.mtime) {
      fsz = fs.statSync(options.logFile).size;
      var sizeDiff = fsz - spos;
      /* si la difference  de taille est negative le fichié a été tronqué */
      if (sizeDiff < 0) {
        spos = 0;
        sizeDiff = newFileSize;
      }
      readNSend(ws, options,spos,sizeDiff);
      spos=fsz;
    }
  });


  //on libere les ressources proprement lors de la deconnexion
  ws.on('close',function bye(){
    fs.unwatchFile(options.logFile);
  });
}




