/**
 * Created by dhl on 2016/10/31.
 */
var express = require("express");
var path = require('path');
var proxy = require("express-http-proxy");
var app = express();
var port = 8080;

var apiProxy = proxy("localhost:8000",{
  forwardPath:function(req,res){
    return req._parsedUrl.path.substr(4);//去掉前面的"/api"
  }
})
app.use("/api/*",apiProxy);
// app.use("/admin/*",apiProxy);
// app.use("*.xls",apiProxy);
// app.use(express.static('assets'));
app.use('/',express.static(path.join(__dirname, '')));
app.use('/assets',express.static(path.join(__dirname, 'assets')));

app.use(function(req, res) {
  // Use res.sendfile, as it streams instead of reading the file into memory.
  res.sendfile(__dirname + '/index.html');
});

app.listen(port);
console.log('Now serving the app at http://localhost:'+port);
