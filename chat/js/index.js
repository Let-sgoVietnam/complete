var socket = io();

var body = document.getElementById('body');
var chat = document.getElementById('chat');
var text = document.getElementById('text');
var send_msg = document.getElementById('send_msg');

var room = 0;
var name = '';

const urlParams = new URL(location.href).searchParams;

name = urlParams.get('name');
room = urlParams.get('room');
console.log('4312'+name);

socket.on('connect', function() {
  socket.emit('newUser', name, room, socket.id);
});

socket.on('conn', function(text, roomtarget) {
  console.log(roomtarget);
  if(roomtarget == room)
  {
    var message = document.createElement('div');
    var node = document.createTextNode(`${text.message}`);
    var className = '';

    switch(text.type) {
      case 'connect':
        className = 'connect';
        break;

      case 'disconnect':
        className = 'disconnect';
        break;
    }

    message.classList.add(className);
    message.appendChild(node);
    chat.appendChild(message);
  }
});

socket.on('update', function(text, roomtarget) {
  var message = document.createElement('div');
  var node = document.createTextNode(`${text.name}: ${text.message}`);
  var className = '';
  
  className = 'other';
  message.classList.add(className);
  message.appendChild(node);
  chat.appendChild(message);
});

socket.on('loadmsg', function(text, roomtarget) {
  if(room === roomtarget && text.type === 'loadmsg')
  {
    console.log(text);
    var className = '';
    var message = document.createElement('div');
    console.log(name);
    if(name === text.name)
    {
      var node = document.createTextNode(`${text.message}`);
      className = 'me';
      console.log(message);
    }
    else if(name === 'server')
    {
      var node = document.createTextNode(`${text.name}`);
      className = 'server';
    }
    else {
      var node = document.createTextNode(`${text.name}: ${text.message}`);
      className = 'other';
    }
    message.classList.add(className);
    message.appendChild(node);
    console.log(message.innerHTML);  
    message.innerHTML = message.innerHTML.replace(/&lt;|</gm, '<');
    message.innerHTML = message.innerHTML.replace(/&gt;|>/gm, '>');
    console.log(message.innerHTML);
    chat.appendChild(message);

    var scrollingElement = (document.scrollingElement || document.body);
    window.scrollTo(0, scrollingElement.scrollHeight );
  }
});

socket.on('checkroom', function() {
  let ans = prompt('방을 찾을 수 없습니다, 새로 생성할까요?[y/]', '');
  if(ans === 'y') {
    socket.emit('createroom', {type: 'createroom'}, room);
  }
  else{
    location.reload();
  }
});


text.addEventListener("keydown", (e) => {
  if(e.key==="Enter" && !e.shiftKey)
  {
    console.log(e);
    send_m('me');
  }
});

function send_m(className) {
  if(name && room){
  var message = text.value;
  message = message.replace(/(\n|\r\n)/g, '<br>');
  console.log(message);
  
  text.value = '';

  var msg = document.createElement('div');
  var node = document.createTextNode(message);
  msg.classList.add(className);
  msg.appendChild(node);
  console.log(msg.innerHTML);
  msg.innerHTML = msg.innerHTML.replace(/&lt;/gm, '<');
  msg.innerHTML = msg.innerHTML.replace(/&gt;/gm, '>');
  console.log(msg.innerHTML);
  chat.appendChild(msg);
  socket.emit('message', {type: 'message', message : message}, room);
  
  text.style.height = '30px';
  }
};