import WebSocket from 'ws';

const ws = new WebSocket('ws://localhost:4001');

ws.on('open', () => {
  const tag = 'blooper';
  ws.send(tag);

  ws.send(tag); // what if we do it again?
});

ws.on('ping', () => {
  console.log('got pinged!');
});
