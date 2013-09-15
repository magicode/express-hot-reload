var domain = require("domain");
var watch = require('watch');
var http = require('http');

var port = process.env.PORT || 3000;
var host = process.env.IP || "0.0.0.0";

var obj = {};
obj.app = function(){};

var appFile = './app';


function clearCache(){
	module.children = [];
	for(var i in require.cache ) delete require.cache[i];  
}

function loadApp(){
	var loadDomain = domain.create();	
	loadDomain.on('error', function(err) { console.error(err.stack); });
	loadDomain.run(function(){
		require(appFile)(obj);
	});
	return loadDomain;
}
    
loadApp();
 
var willReload = false;

watch.watchTree( __dirname ,  
		{ filter: function(f,stats){ return !(/(.js|.json)$/).test(f) && stats.isFile(); } }  , 
		function (f, curr, prev) {
			if (typeof f == "object" && prev === null && curr === null) { } else {
				
				if(willReload) return; willReload = true;
				setTimeout(function(){
					willReload = false;
					clearCache();
					loadApp();
					console.log("reload app");
				},1000);
				
			}
});

http.createServer(function(){ 
    obj.app.apply(null, arguments); 
}).listen( port , host , function(){
    console.log('server listening on  %s:%s' ,host, port);
});
