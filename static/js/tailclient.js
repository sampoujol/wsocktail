

function connect(){
    var zone=document.getElementsByClassName("termwin")[0];
    var socket = new WebSocket("ws://localhost:8080");
    socket.onopen=function (event){
        established(event,zone);
    }
    socket.onmessage=function(event){
        newdata(event,zone);
    };
    socket.onclose=function(event){
        srvdiconnect(event,zone);
    }
    socket.onerror=function(event){
        error(event,zone)
    };

}

function established(event,zone){
    zone.innerText+="[Connexion établie]\n";
}

function newdata(event,zone){
    console.log("["+event.data+"] reçu");
    zone.innerText+=event.data;
}

function srvdiconnect(event,zone){
    zone.innerText+="[Disconnected]\n";
}

function error(event,zone){
    zone.innerText+="[Erreur]\n";
}
