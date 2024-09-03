const EventEmitter = require('events');
const http = require('http');

class Sales extends EventEmitter {
    constructor() {
        super();
    }
}

const myEmitter = new Sales();

myEmitter.on('newSale', () =>  {
    console.log('There was a new sale!')
})

myEmitter.on('newSale', () => {
    console.log('Customer name: Jonas');
})

myEmitter.emit('newSale');

const server = http.createServer();
server.on('request', (req,res) => {
    console.log('Request received');
    console.log(req.url);
    res.end('Request received');
})
server.on('request', (req,res) => {
    console.log('Another Request received')
})
server.on('close', () => {
    console.log('server clsoed');
})

server.listen(5000, '192.168.1.27', () => {
    console.log('Listning to server');
})