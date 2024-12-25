

const http = require('http');
const WebSocket = require('ws');
const fs = require('fs');

const server = http.createServer();
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('Client connected');

  ws.on('message', (message) => {
    console.log('received: %s', message);    
    // Отправка сообщения всем подключенным клиентам
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        //client.send(JSON.stringify(message));
        client.send(message.toString());
        if (message === 'start') client.send('start');
        //if (message === 'stop') client.send('stop');
        //if (message === 'reset') client.send('reset');
        //if (!isNaN(message)) client.send(message + '');
      }
    });
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

// Обработка исключительных ситуаций и ошибок
process.on('uncaughtException', (err) => {
  const errorMessage = `Caught exception: ${err.message}\nStack Trace: ${err.stack}\n`;
  console.error(errorMessage);
  fs.appendFileSync('log.txt', errorMessage); // Запись ошибки в log.txt
});

process.on('unhandledRejection', (reason, promise) => {
  const errorMessage = `Unhandled Rejection at: ${promise}, reason: ${reason}\n`;
  console.error(errorMessage);
  fs.appendFileSync('log.txt', errorMessage); // Запись ошибки в log.txt
});

const PORT = 8080;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is listening on port ${PORT}`);
})