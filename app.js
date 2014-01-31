
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

// all environments
app.set('port', process.env.PORT || 8079);
app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//app.get('/', routes.index);
app.get('/', routes.indexx);
app.get('/users', user.list);

var APIFunctions = {
 
		GET : {
			ledSwitch : function ( data, callback ){
 
				data.url.value = parseInt( data.url.value, 0 );
				data.url.led = parseInt( data.url.led, 0);
				if( data.url.value === 1 || data.url.value === 0){
				
					console.log( data.url.led, data.url.value );
				}
 
				callback( data.url.value );
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
