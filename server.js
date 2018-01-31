const express = require('express');
//const http = require('http');
const app = express();


//app.set('port', 3000);
app.use('/src',express.static( __dirname+'/src'));
app.use('/data',express.static( __dirname+'/data'));
app.use('/css',express.static( __dirname+'/css'));
app.use('/views',express.static( __dirname+'/views'));
app.use('/images',express.static( __dirname+'/images'));

app.get('/', (req, res) => {
    res.sendFile(__dirname+'/index.html');
})
app.listen(8000, () => {
    console.log('server is running at 3000');
});