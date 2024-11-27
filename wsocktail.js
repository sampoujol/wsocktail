
import { WebSocketServer } from 'ws';
import * as fs from 'fs';
import * as os from 'os';
import * as readline from 'readline';

function connect(ws){
  var options = {
    logFile: 'toto.txt',
    endOfLineChar: os.EOL
  };
  

  //on envoie le debut du fichier
  const inputStream = fs.createReadStream(options.logFile);
  var lineReader = readline.createInterface({
    input: inputStream,
    terminal: false,
  });
  lineReader.on("line", function (line) {
    ws.send(line);
  });




  // Obtain the initial size of the log file before we begin watching it.
  var fileSize = fs.statSync(options.logFile).size;
  fs.watchFile(options.logFile, function (current, previous) {
    // Check if file modified time is less than last time.
    // If so, nothing changed so don't bother parsing.
    if (current.mtime <= previous.mtime) { return; }

    // We're only going to read the portion of the file that
    // we have not read so far. Obtain new file size.
    var newFileSize = fs.statSync(options.logFile).size;
    // Calculate size difference.
    var sizeDiff = newFileSize - fileSize;
    // If less than zero then Hearthstone truncated its log file
    // since we last read it in order to save space.
    // Set fileSize to zero and set the size difference to the current
    // size of the file.
    if (sizeDiff < 0) {
      fileSize = 0;
      sizeDiff = newFileSize;
    }
    // Create a buffer to hold only the data we intend to read.
    var buffer = new Buffer(sizeDiff);
    // Obtain reference to the file's descriptor.
    var fileDescriptor = fs.openSync(options.logFile, 'r');
    // Synchronously read from the file starting from where we read
    // to last time and store data in our buffer.
    fs.readSync(fileDescriptor, buffer, 0, sizeDiff, fileSize);
    fs.closeSync(fileDescriptor); // close the file
    // Set old file size to the new size for next read.
    fileSize = newFileSize;

    // Parse the line(s) in the buffer.
    parseBuffer(buffer);
  });

  function parseBuffer (buffer) {
    // Iterate over each line in the buffer.
    buffer.toString().split(options.endOfLineChar).forEach(function (line) {
      // Do stuff with the line :)
       ws.send(line);
    });
  }

  ws.on('close',function bye(){
    fs.unwatchFile(options.logFile);
  });
}

const wss = new WebSocketServer({ port: 8087 });
console.log("Serveur Websocket TAIL en attente sur le port 8087");
wss.on('connection', connect);


