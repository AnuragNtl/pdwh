var express=require("express");
var {buildSchema}=require("graphql");
var db;
var app=express();
var graphqlHTTP=require("express-graphql");
var schema=buildSchema(`
type Branch
{
    leafName:String,
    ancestorPath:[String]
}
  type Mutation
  {
addValue(catName:String,catPath:[String]):String
  }
type Query
{
  getSub(path:[String]!):[String],
  #find(name:String):[Branch]
}
`);
class Branch
{
    constructor(name,path)
    {
        this.name=name;
        this.path=path;
    }
    leafName()
    {
        return this.leafName;
    }
    ancestorPath()
    {
        return this.path;
    }
}

var root={
getSub: async (path)=>
{
let r=await getSubs(path.path);
return r;
},
addValue:async ({catName,catPath})=>
{
  console.log("_______");
  return await addVal(catName,catPath);
}
};
async function verifyPath(catPath)
{
let p=new Promise((resolve,reject)=>
    {
    access.verifyPath(catPath,(err,ver)=>
    {
      if(err)
      {
        console.log(err);
        resolve(false);
        }
      else
      resolve(ver);
  });
    });
let ver=await p;
    return ver;
}
async function addVal(cat,catPath)
{
	let ver=await verifyPath(catPath);
  if(ver)
   return await new Promise((resolve,reject)=>
     {
      db.collection("dw").insert({category:cat,baseCategory:catPath},function(err,res)
        {
        if(err)
          reject(err);
          else
            resolve(true);
        });

     });
  else
    return false;
  
 }
async function find(name,path)
{
    return await new Promise((resolve,reject)=>
    {
        db.collection("dw").find({baseCategory:name}).toArray(function(err,res)
        {
            if(err)
            reject(err);
            else
            {
                let branchList=[];
            for(let i in res)
            branchList.push(new Branch(res[i].category,res[i].baseCategory));
            resolve(branchList)
            }
        });
    });
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
