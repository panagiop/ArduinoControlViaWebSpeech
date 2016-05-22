var express = require('express');
var router = express.Router();
var app = express();
var server = app.listen(process.env.PORT || 3000);
var five = require('johnny-five');
var io = require('socket.io')(server);

var path = require('path');

var colorNameToHex = require('./colorNameToHex');

var clientpath = path.normalize(__dirname + '/../client');
app.set('views', path.join(clientpath, 'views'));

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(express.static(path.join(clientpath, 'public'), { maxAge: 2628000000 }));
app.use('/bower_components',  express.static(clientpath + '/bower_components', { maxAge: 2628000000 } ));

var led, ledColor;
var board = new five.Board();

board.on("ready", function() {
    led = new five.Led.RGB([ 9, 10, 11 ]);

    io.on('connection', function(socket) {
        socket.on('led:color:change', function (data) {
            ledColor = colorNameToHex[data];
            if (ledColor !== undefined) {
                led.color(ledColor);
            }
        });
    });
});

require('./routes')(app);
exports = module.exports = app;
