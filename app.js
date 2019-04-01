var express=require("express");
var {buildSchema}=require("graphql");
var db;
var app=express();
var graphqlHTTP=require("express-graphql");
var schema=buildSchema(`
type Query
{
	getSub(path:[String]!):[String]
}
`);
var root={
getSub: async (path)=>
{
let r=await getSubs(path.path);
return r;
},
addValue:(cat,val)=>
{
	access.verifyPath()
}
};
async function addValue(val,cat)
{
	
}
async function getSubs(path)
{
	 var p=new Promise(function(resolve,reject)
	 {
	 db.collection("dw").find({baseCategory:path}).toArray(function(err,data)
    {
        var r=[];
        for(i in data)
        {
            r.push(data[i].category);
        }
      resolve(r);  
    });
	});
	 let categories=await p;
	 return categories;
}
app.use("/graphql",graphqlHTTP({schema:schema,rootValue:root,graphiql:true}));
var access=new (require("./access.js"))(function(r,db1)
	{
		if(r)
		{
			console.log(r);
		}
		else
		{
			db=db1;
app.listen(8088);
		}
	});
