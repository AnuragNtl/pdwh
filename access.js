var MongoClient=require("mongodb").MongoClient;
function find(cntxt,s)
{
    for(i in cntxt)
    if(s==cntxt[i])
    return true;
    return false;
}
function Access(onConnect)
{
    var that=this;
MongoClient.connect("mongodb://localhost:27017",function(err,client)
{
    if(err)
    onConnect(err,null);
    else
    {
        
    that.db=    client.db("pdatawarehouse");
    onConnect(null,that.db);
    }
});
}
Access.prototype.db=null;
Access.prototype.verifyPath=function(path,onFetch)
{
    this.db.collection("dw").find({category:{$in:path}}).toArray(function(err,res)
    {
        if(err)
        onFetch(err,null);
        else
        {
            var r={};
            for(var i=0;i<res.length;i++)
            {
                var s={};
                s[res[i].category]=res[i].baseCategory;
                r=Object.assign(r,s);
            }
            console.log(r);
            for(var i=1;i<path.length;i++)
            {
                if(!r[path[i]] || !r[path[i-1]])
                {
                    onFetch(false,false);
                    return;
                }
                if(!find(r[path[i]],path[i-1]))
                {
                    console.log(path[i-1]+" not found in "+path[i].baseCategory);
                onFetch(false,false);
                return;
                }
            }
            onFetch(false,true);
        }
    });
}
module.exports=Access;