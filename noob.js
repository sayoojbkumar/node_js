var express=require('express');
var fs=require('fs');
var bodyParser = require('body-parser');
var mysql=require('mysql');
var nodemailer=require('nodemailer');
var mustache=require('mustache-express');
var app= express();
var messages="";
var msgid;
var data;
var secret;
var email;
var name;
var passwd;

app.use(bodyParser.urlencoded({ extended: true })); 
app.use(express.static('public'));

app.get('/favicon.ico', (req, res) => res.status(204));

app.get("/",function(req,res){
  res.sendFile(__dirname + '/index.html');
});

app.post("/register.html",function(req,res){
  email=req.body.email;
  name=req.body.name;
  passwd=req.body.password;
  console.log(req.body);
  var sender=nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:"sayoojbkumar@gmail.com",
        pass:"galaxyfive"

    }
   });
   var mail={
     from:"sayoojbkumar@gmail.com",
     to:email,
     subject:"welcome to creative secret message!",
     text:" hello"+name+"come fall in love with us \n your password is "+passwd
   };
   sender.sendMail(mail,function(err,info){
     if (err){
       console.log(err)
     }
     else
     {
       console.log("email send");
     }

   });
  var mysql=require('mysql');
  var conn=mysql.createConnection({
    host:"localhost",
    user:"sbk",
    password:"password",
    database:"creative"
  });
  conn.connect(function(err){
    if (err) throw err;
    console.log("conected");
    var sql="insert into users (name,email,password) value('"+name+"','"+email+"','"+passwd+"');"
    console.log(sql);
    conn.query(sql,function(err,result){
      if (err) throw err;
      console.log(result);
    });
  });
  res.redirect('/login.html');
  
});

app.post('/login.html',function(req,res){
  console.log(req.body);
  mysql=require('mysql');
  var conn=mysql.createConnection({
    host:"localhost",
    user:"sbk",
    password:"password",
    database:"creative"
  });
  conn.connect(function(err){
    if (err) throw err;
    console.log("sucess");
    var sql="select * from users where email='"+req.body.email+"' and password='"+req.body.password+"';";
    console.log(sql);
    conn.query(sql,function(err,result){
      console.log(result);
      if (result.length==1){
        data=result;
        secret="brevcqgb"
        console.log(secret);
        var conn=mysql.createConnection({
          host:"localhost",
          user:"sbk",
          password:"password",
          database:"creative"
        });
        var sql1="select*from messages where id="+data[0].id+";";
        conn.connect(function(err){
        if (err) throw err;
        conn.query(sql1,function(err,result){
        if (err) throw err;
        var msgdata=result;
        console.log(msgdata);
        var no_of_msg=msgdata.length;
        messages="";
        for(var i=0;i<no_of_msg;i++)
        {
          messages=messages+'('+i+')'+msgdata[i].message+"   ";
        }
      });
    });
        res.redirect('/dashboard.mustache');
      }
      else
      {
        res.redirect('/login.html')
      }
    });

  });
});
app.engine('mustache',mustache());
app.set('view engine','mustache');
app.get('/dashboard.mustache',function(req,res){
  if(secret=="brevcqgb"){
    var host=req.get('host');
    res.render(__dirname+'/dashboard.mustache',{host:host,name:data[0].name,message:messages,id:data[0].id});

  }
  else{
    res.write("you need to login");
  }
});
app.engine('mustache',mustache());
app.set('view engine','mustache');
app.get('/:id',function(req,res){
  if(req.url!='/favico.ico'){
  console.log(req.url.slice(1,req.url.length));
  msgid=req.url.slice(1,req.url.length);
  res.render(__dirname+'/send_mssg.mustache',{msgid:msgid});
  app.post('/send_mssg.mustache',function(req,res){
  conn=mysql.createConnection(
    {
      host:"localhost",
      user:"sbk",
      password:"password",
      database:"creative"
    });
    conn.connect(function(err){
      if(err) throw err;
      console.log("sucess");
      var sql="insert into messages values("+req.body.id+",'"+req.body.message+"');";
      console.log(sql);
      conn.query(sql,function(err,result){
        if (err) throw err;
        res.redirect('/register.html');
      });
    });

});
}
});
app.listen(1830);