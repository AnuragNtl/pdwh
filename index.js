var fs=require("fs");
var express=require("express");
var app=express();
var session=require("express-session");
var db=2;
var mongoClient
var bodyParser=require("body-parser");
var cookieParser=require("cookie-parser");
var access=require("./access.js"); bParser=bodyParser.urlencoded({extended:true});
app.use(bParser);
app.set("view engine","pug");
app.set("view","views");
//app.use(bParser.json());
app.use(cookieParser());
app.use(function(req, res, next) {

  res.header("Access-Control-Allow-Origin", "*");

  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  next();

});
app.get("/",function(req,res)
{
    //db.collection("dw").insert({category:2});
    db.collection("dw").find({}).toArray(function(err,res1)
    {
        console.log(res1);
        res1="<html><body>"+JSON.stringify(res1)+"<form name='frm1' method='POST' action='/addCategory'><input type='text' name='catName' />  <input type='text' name='catPath' /> <input type='submit' value='Submit' /></form></body></html>";
        res.send(res1);
    })
    //res.send({categories:4})
});
app.post("/addCategory",function(req,res)
{
    var catName=req.body.catName,catPath=JSON.parse(req.body.catPath);
    access.verifyPath(catPath,function(err,ver)
    {
        if(err)
        {
            res.send(err);
        }
        else
        {
            if(ver)
            {   db.collection("dw").insert({"category":catName,baseCategory:catPath});
            res.send({success:1});
            }
            else
            {
                    res.send({"error":"Cannot verify path"});
            }
        }
    });
    
});

app.get("/getSub",function(req,res)
{
    var path=JSON.parse(req.query.path);    
    db.collection("dw").find({baseCategory:path}).toArray(function(err,data)
    {
        var r=[];
        for(i in data)
        {
            r.push(data[i].category);
        }
        res.send(r);
    });
});

app.get("/addValue",function(req,res)
{
    var cat=[];
try
{
    cat=JSON.parse(req.query.cat);
}
catch(e)
{
res.send({success:0});
return;
}
var val=req.query.val;
access.verifyPath(cat,function(err1,ver)
{
if(err1)
{
res.send({success:0,error:"Verify Path"});
return;
}
var target=cat.pop();
    db.collection("dw").update({category:target,baseCategory:cat},{$addToSet:{values:val}},function(err,r1)
{
if(err)
res.send(err);
else
{
    res.send({success:1});
}
});

});

});

app.get("/getMatrix",function(req,res)
{
    var r=[];
    var path=JSON.parse(req.query.path),feature1=req.query.feature1,feature2=req.query.feature2;
    path.push(feature1);
    db.collection("dw").query({category:feature2,baseCategory:path}).toArray(function(err,r1)
    {
        if(err)
        {
            res.send({success:0,error:"db error"});
            return;
        }
        for(i in r1)
        {
            if(r1[i].category==feature)
            {
                var s={};
                s[feature1]=r1[i].values;
            r.push(s);
            }
        }
    });
    res.send(r);
});

access=new access(function(err,db1)
{
    if(err)
    console.log(err);
    else
    {
    db=db1;
    app.listen(8084);
    }
});
