
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
    
//var five = require( 'johnny-five' ), board;

//board = new five.Board();

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


	/* Api functions */
	var self = this;	

	var APIFunctions = {
 
		GET : {
			ledSwitch : function ( data, callback ){
 
				data.url.value = parseInt( data.url.value, 0 );
				data.url.led = parseInt( data.url.led, 0);
				if( data.url.value === 1 || data.url.value === 0){
					console.info( "[ledSwitch]", data.url.led, data.url.value );
				//	self.digitalWrite( data.url.led, data.url.value );
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
                
			}
		},
		POST : {}
	};

	console.log( narf );
 
	var hs = new narf.HttpServer( { port : 8080 } ).start();
 
	hs.on( 'port', function( port ){
		hs.addAPI( { functions : APIFunctions } );
	} );	
 
narf.setDebug( true );

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server is listening on port ' + app.get('port'));
});


