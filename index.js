var http = require('http');
var express = require('express');
var DynamicKey5 = require('./lib/DynamicKey5');

var PORT = process.env.PORT || 8080;
// Get the Vendor and Sign Key
var APP_ID = process.env.APP_ID || '61f569b4c7f64febbe279d8fc1681b44';
//var APP_ID = process.env.APP_ID || '38967ad7eeb34a65841a8ed8ac515c2a';
//var APP_ID = process.env.APP_ID || 'd412364f3e8142d09efc0486ca79eff8';
// var APP_CERTIFICATE = process.env.APP_CERTIFICATE || '321a0a7938aa4d118fa9e0993f2c8b1b';
var APP_CERTIFICATE = process.env.APP_CERTIFICATE || '321a0a7938aa4d118fa9e0993f2c8b1b';
// Verify that the API Key and API Secret are defined
if (!(APP_ID && APP_CERTIFICATE)) {
    throw new Error('You must define an APP_ID and APP_CERTIFICATE');
    process.exit();
}


var app = express();
app.disable('x-powered-by');
app.set('port', PORT);
app.use(express.favicon());
app.use(app.router);
app.use(express.static(__dirname + '/public'));

var unixTs = Math.round(new Date().getTime() / 1000);
var randomInt = Math.round(Math.random()*100000000);

var generateMediaChannelDynamicKey = function(req, resp){
	resp.header('Access-Control-Allow-Origin', "*");
    var channelName = req.query.channelName;
    if (!channelName){
        return resp.status(400).json({'error':'channel name is required'}).send();
    }

    var uid = req.query.uid;
        if (!uid){
        return resp.status(400).json({'error':'uid is required'}).send();
    }

    var expiredTs = req.query.expiredTs;
        if (!expiredTs){
        return resp.status(400).json({'error':'expiredTs is required'}).send();
    }

    //var media_channel_key = channelName;//(channelName).toUpperCase();//DynamicKey5.generateMediaChannelKey(APP_ID, APP_CERTIFICATE, channelName, unixTs, randomInt, uid, expiredTs);
    var media_channel_key = DynamicKey5.generateMediaChannelKey(APP_ID, APP_CERTIFICATE, channelName, unixTs, randomInt, uid, expiredTs);
	// console.log(DynamicKey5.generateMediaChannelKey(APP_ID, APP_CERTIFICATE, channelName, unixTs, randomInt, uid, expiredTs));
	// console.log(media_channel_key);
    return resp.json({'media_channel_key': media_channel_key}).send();
};

app.get('/app_id', function(req, res){
    if (!APP_ID){
        res.send(500, {
            error: "No APP_ID"
        });
    }
    res.send(APP_ID);
});

app.get('/media_channel_key', generateMediaChannelDynamicKey);

http.createServer(app).listen(app.get('port'), function() {
 	console.log('Agora WebRTC Live Broadcasting demo starts at ', app.get('port'));
});
