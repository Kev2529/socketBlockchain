var app = require('http').createServer(handler)
//var io = require('socket.io')(app)
var url = require('url')
var fs = require('fs')
var redis = require('redis');
const net = require('net');


// Redis connection
var client = redis.createClient(); //creates a new client

client.on('connect', function() {
    console.log('connected to redis');
});



//List of PlugID & ListMobil users ID
var listPlug = [];
var listMobil = [];
var ID = null;

function JSONtoString (JSONdata) {
  return (JSON.stringify(JSONdata));
}


function stringtoJSON (string) {
  return (JSON.parse(string));
}

function getClientJSON(c)
{
  for (plug in listPlug)
  {
    if (c === listPlug[plug].socket)
      return (listPlug[plug]);
  }
  for (mobil in listMobil)
  {
    if (c === listMobil[mobil].socket)
      return (listMobil[mobil]);
  }
  return (null);
}
//This will open a server at localhost:5000. Navigate to this in your browser.
//app.listen(5000);

const server = net.createServer((c) => {
  //console.log(c._handle.fd);
    // 'connection' listener
  console.log('client connected');



 /* if (clientJSON.type === 'plug') {
    console.log(clientJSON);
    listPlug.push(clientJSON);
  }
  else if (clientJSON.type === 'mobil') {
    var user  = client.get(clientJSON.password)
    if (var)
      listMobil.push(clientJSON);
  }*/
    var  clientJSON =
      {
        "socket" : c,
        "type" : null
      };



  //Close connection with 'End' event
  c.on('end', () => {
    console.log('client disconnected');
  });

  //Callback with 'Data' event
  c.on('data', (data) => {
    var jsonData = JSON.parse(data);
    console.log(jsonData);
    //récupérer clientJSON dans listMobil ou listPlug
    var clientJSON = getClientJSON(c);
    //si clientJSON n'existe pas, le créer si data contient type
    if (clientJSON == null)
    {
      clientJSON =
      {
        "socket" : c,
        "type" : null
      };
      if (ID == null && jsonData.ID)
        ID = jsonData.ID;
      if (ID) {
        clientJSON.ID = ID;
        console.log('ID : ' + ID);
      }

      if (jsonData.type == 'plug')
      {
        clientJSON.type = "plug";
        listPlug.push(clientJSON);
        c.write(JSONtoString({"message" : "on"}));
      }
      else if (jsonData.type == 'mobil')
      {
        client.hget("user:user", 'password', function (err, obj)
        {
          if (obj !== jsonData.password)
          {
            c.write(JSONtoString({"message" : "Wrong password"}));
            c.end('Mobil bye\n');
            return;
          }
        });
        clientJSON.type = "mobil";
        listMobil.push(clientJSON);
      }
      else
      {
        console.log("Wrong pass ?");
        c.end('None type\n');
        return;
      }
    }
    else
    {
      console.log('Compte validé');
      //si clientJSON existe, agir selon le type
      if (clientJSON.type == 'plug')
      {
        console.log('Plug');
        //code plug
      }
      else if (clientJSON.type == 'mobil')
      {
        console.log('Mobil');
        //code mobil
      }
    }



    /*for (var client in listClient) {
      console.log(listClient[client].socket._handle.fd);
    }

    var object = JSON.parse(data)
    console.log(object);
    if (object.type === 'mobile') {
      console.log("Mobile");
      client.get(object.username, function (err, reply) {
        console.log('Key')
        if (reply !== object.password)
          c.end('Wrong User');
        else
          console.log("Ok");
      });
      var name = client.get(object.username);
      console.log("Test : " + object.username);
    }*/
    //console.log(stringtoJSON(data));
  /*if (data == 'Message recu') {
    var toto = {"message" : "exit","id" : "prout"};
    c.write(stringifyJSON(toto));
  }*/
  })
  var test = {"message" : "Reçu","id" : "prout"};
  c.write(JSONtoString(test));
});

server.on('error', (err) => {
  throw err;
});


server.listen(5000, () => {
  console.log('server bound');
});


// Http handler function
function handler (req, res) {

    // Using URL to parse the requested URL
    console.log('Req : ' + req);
    console.log('Res : ' + res);
    var path = url.parse(req.url).pathname;

    // Managing the root route
    if (path == '/') {
        index = fs.readFile(__dirname+'/public/index.html', 
            function(error,data) {

                if (error) {
                    res.writeHead(500);
                    return res.end("Error: unable to load index.html");
                }

                res.writeHead(200,{'Content-Type': 'text/html'});
                res.end(data);
            });
    // Managing the route for the javascript files
    } else if( /\.(js)$/.test(path) ) {
        index = fs.readFile(__dirname+'/public'+path, 
            function(error,data) {

                if (error) {
                    res.writeHead(500);
                    return res.end("Error: unable to load " + path);
                }

                res.writeHead(200,{'Content-Type': 'text/plain'});
                res.end(data);
            });
    } else {
        res.writeHead(404);
        res.end("Error: 404 - File not found.");
    }

}
/*
// Web Socket Connection
io.sockets.on('connection', function (socket) {
  socket.emit('hello', 'world');

  // If we recieved a command from a client to start watering lets do so
  socket.on('example', function(data) {
      console.log(data);

      //delay = data.duration;
      delay = data["duration"];

      // Set a timer for when we should stop watering
      setTimeout(function(){
          socket.emit("example-pong");
      }, delay*1000);

  });
  
});*/

//app.listen(3000);
