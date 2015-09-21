var express = require('express');
var app = express();

app.use(express.static(__dirname + '/public')); 


app.get('/', function(req, res) {
	res.sendfile('index.html', {root: __dirname });
});

var port = process.env.PORT || 5000;
app.listen(port);

console.log('Listening on localhost: ' + port);

exports = module.exports = app;      