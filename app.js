
var express = require('express');

var app = express();  

module.exports = function(obj) {
    
    if(!obj.sessionStore) obj.sessionStore = new express.session.MemoryStore();
    
     
    app.use(express.cookieParser('<your secret here>'));
    app.use(express.session({ store: obj.sessionStore }));
    app.use(app.router);
    
    app.get("/",function(req,res){
        req.session.count = req.session.count ? req.session.count + 1 : 1;
        res.end("your count: " + req.session.count);
    });
     
    obj.app = app;

};

