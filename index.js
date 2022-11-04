const socket = io('https://smchat.up.railway.app/');
//const socket = io('ws://localhost:4000/');

if(!window.sessionStorage.getItem('username'))
    window.sessionStorage.setItem('username', window.prompt('Please enter your name!'));

const username = window.sessionStorage.getItem('username')


socket.on('connect', () => {
  socket.emit('register', JSON.stringify({username}))
})


socket.on('disconnect', () => {
  console.log(socket.id,' disconnected')
})

socket.on('message', message => {
  appendChat(JSON.parse(message));
})


function appendChat(chat){
  let chats__container = document.querySelector(".chats__container");
  let new_chat = document.createElement('section');
  let new_chat_date = document.createElement('span');
  let new_chat_text = document.createElement('section');
  new_chat_text.appendChild(document.createTextNode(chat.text));
  new_chat_date.appendChild(document.createTextNode(`${chat.name === username? 'You' : chat.name}  |  ${chat.date}`))

  new_chat.classList.add('chats__chat');
  new_chat_text.classList.add('chat__text');
  new_chat_date.classList.add('chat__date');
  new_chat.append(new_chat_date);
  new_chat.append(new_chat_text)

  chats__container.append(new_chat);
}

function sanitizeInput(){
  let input__field = document.querySelector('input');
  let actual__text = input__field.value.trim();

  return actual__text;
}


function clearMessage(){
  document.querySelector('input').value = '';
}

function sendMessage(){
  let message = sanitizeInput();
  if(message) {
    socket.emit('message', JSON.stringify({name: username, text: sanitizeInput(), date: new Date().toLocaleString()}))
    clearMessage()
  }
    

  else console.log('Can\'t send empty message')
}


let input__field = document.querySelector('input');
let send__icon = document.querySelector('.sendIcon');
send__icon.addEventListener('click', sendMessage)
input__field.addEventListener('keyup', ev => {
  if (ev.key == 'Enter') sendMessage();
})
