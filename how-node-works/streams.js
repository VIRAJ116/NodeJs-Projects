const fs = require('fs');
const server = require('http').createServer();

server.on('request', (req,res) => {

    // Solution 1, this will load entire file on response

    // fs.readFile('test-file.txt', (err,data) => {
    //     if(err) console.log("err: ", err);
    //     res.end(data);
    // });

    //Solution 2, using streams

    // const readable = fs.createReadStream('test-file.txt')
    // readable.on('data', chunk => {
    //     res.write(chunk);
    // })
    // readable.on('end', () => {
    //     res.end();
    // })
    // readable.on('error', err => {
    //     console.log("err",err);
    //     res.statusCode(500);
    //     res.end('File not found!')
    // })

    // Solution 3,
    const readable = fs.createReadStream('test-file.txt');
    readable.pipe(res);
    //readable source.pipe(writable Dest)
})

server.listen(5000, '192.168.1.27', () => {
    console.log('Listning to server');
})