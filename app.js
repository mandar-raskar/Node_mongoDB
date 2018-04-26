var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var path = require('path');

var MongoClient = require('mongodb').MongoClient;
var url ="mongodb://localhost:27017/form";

var app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

MongoClient.connect(url,function(err,db){
  if(err)
  throw err;

  app.get('/',function(req,res){
    res.sendFile(path.join(__dirname+'/form.html'));
  });

  app.post('/data', function(req,res){
    var today = new Date();
      var firstname = req.body.fname;
      var lastname = req.body.lname;
      var password = req.body.upass;
      var cpassword = req.body.cpass;
      var email = req.body.uemail;
      var address = req.body.uadd;
      var gender = req.body.ugen;
      var dob = req.body.udob;
      var mobile = req.body.umob;
      var date = today;
  });


  var dbo = db.db("form");
  var details = {
    firstname : firstname, lastname : lastname, password : password , cpassword : cpassword, email : email ,address : address, gender : gender, dob : dob, mobile : mobile, date :date
  };
  dbo.collection("form-data").insertOne(details, function(err,res){
    if(err)
    throw err;

    console.log("1 document inserted");
  });
  app.get('/',function(err,res){
    res.sendFile(path.join(__dirname + '/login.html'));
  });

  app.get('/data1',function(err,res){
    var username = req.query.uname;
    var userPassword = req.query.uPass;

    dbo.collection("form-data").findOne({firstname : username},function(err,res){
      if(err)
      throw err;

      console.log(res);
    });


  });

  app.get('/',function(err,res){
    res.sendFile(path.join(__dirname + '/editprofile.html'));
  });

  app.put('/data2',function(err,res){
    var firstname = req.body.fname;
    var lastname = req.body.lname;
    var mob = req.body.umob;
    var address = req.body.uadd;
    var email =req.body.uemail;

    dbo.collection("form-data").updateMany({
      firstname : firstname, lastname :lastname, mobile : mob, address : address, email : email
    },function(err,res){
      if (err)
      throw err;

      console.log(res);
    });
  });
});

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
