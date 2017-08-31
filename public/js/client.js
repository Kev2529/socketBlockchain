var socket = io('http://localhost:3000');

socket.on('test', function (data) {
    console.log("pongClient");
});

window.addEventListener("load", function(){

  var button = document.getElementById('hello');

  button.addEventListener('click', function() {
      console.log("pingCLient");
      socket.emit('example', { duration: 5 });
  });

});