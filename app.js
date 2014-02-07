
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');

var narf = require( 'narf' );
var fs = require( "fs" );
var url = require( "url" );

var app = express();

var util  = require('util'),
    spawn = require('child_process').spawn;
    //ls    = spawn('ls', ['-lh', '/usr']);
    
var five = require( 'johnny-five' ),
    board;

board = new five.Board();

//var scribe = require('./scribe');    

// all environments
app.set('port', process.env.PORT || 8079);
app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');
app.set('env', 'development');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
//app.use(scribe.logger);

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
  console.info("[Develop]");
}

//app.get('/', routes.index);
app.get('/', routes.indexx);
app.get('/users', user.list);

// You can use any of the following anywhere Scribe will
// both SAVE to file and PRINT to console whatever

/**
console.log("[Tagname]Simple message");
console.info("[Tagname]Simple message");
console.warn("[Tagname]Simple message");
console.error("[Tagname]Simple message");
console.realtime("[Tagname]Simple message");
console.high("[Tagname]Simple message");
console.normal("[Tagname]Simple message");
console.low("[Tagname]Simple message"); */

// The board's pins will not be accessible until
// the board has reported that it is ready
board.on("ready", function() {
	var val = 0;

	// Set pin 4 and 5 to OUTPUT mode
	this.pinMode( 4, 1 );
	this.pinMode( 5, 1 );
 
	// Mode Table
	// INPUT:   0
	// OUTPUT:  1
	// ANALOG:  2
	// PWM:     3
	// SERVO:   4
	this.digitalWrite( 4, 1 );
	this.digitalWrite( 5, 1 );

	/* Api functions */
	var self = this;	
	var Bmp085 = require('./bmp085'),
	    testStandardMode = function () {
	       	var barometer = new Bmp085({'debug': true});
	        barometer.read(function (data) {
	            console.log("Standard mode", data);
	            testHighresMode();
	        });
	    },
	    testHighresMode = function () {
	        var barometer = new Bmp085({'mode':2});
	        barometer.read(function (data) {
	            console.log("Highres mode", data);
	            testUltraHighresMode();
	        });

	    },
	    testUltraHighresMode = function () {
	        var barometer = new Bmp085({'mode':3});
	        barometer.read(function (data) {
	            console.log("Ultra highres mode", data);
	        });
	    },
	    startTest = function () {
	        testStandardMode();
	    };
    
	/* configuration of I2C device */
	/* this.firmata.sendI2CConfig(); */

	var APIFunctions = {
 
		GET : {
			ledSwitch : function ( data, callback ){
 
				data.url.value = parseInt( data.url.value, 0 );
				data.url.led = parseInt( data.url.led, 0);
				if( data.url.value === 1 || data.url.value === 0){
					console.info( "[ledSwitch]", data.url.led, data.url.value );
					self.digitalWrite( data.url.led, data.url.value );
				};	 
				callback( data.url.value );
			},
			takePict : function (data, callback) {
			    //var pocv  = spawn('/home/debian/Git/androxx01/public/cgi-bin/pocv.py', []);
			    console.info('[takePict] stdout: ' + data.url.file);
		        var pocv = spawn(data.url.file, []);
	            var outcode;
			    
			    pocv.stdout.on('data', function (data) {
                  console.info('[takePict] stdout: ' + data);
                });

                pocv.stderr.on('data', function (data) {
                  console.error('[takePict] stderr: ' + data);
                });

                pocv.on('exit', function (code) {
                  outcode = code;
                  console.log('[takePict] child process exited with code ' + code);
                  callback(outcode);
                });
                
			},
			readSensor : function (data, callback){
				console.log('[readSensor] pocztek testow !')
				startTest();
				self.firmata.sendI2CWriteRequest(0x68,[0x22,0x00,0x08,0x2A]);
				self.firmata.sendI2CReadRequest(0x68,4,function(data){
					var ppms = 0;
					ppms |= data[1] & 0xFF;
					ppms = ppms << 8;
					ppms |= data[2] & 0xFF;
					var checksum = data[0] + data[1] + data[2];
					if(checksum === data[3]){
						console.log('Current PPMs: '+ppms);
					} else {
						console.log('Checksum failure');
					}
				});
				callback('OK');
			}
		},
		POST : {}
	};

	console.log( narf );
 
	var hs = new narf.HttpServer( { port : 8080 } ).start();
 
	hs.on( 'port', function( port ){
		hs.addAPI( { functions : APIFunctions } );
	} );	
});
 
narf.setDebug( true );

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server is listening on port ' + app.get('port'));
});


