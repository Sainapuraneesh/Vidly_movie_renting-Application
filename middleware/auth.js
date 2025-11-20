const jwt=require('jsonwebtoken');
const config=require('config');

function auth(req,res,next){
    const token= req.header('x-auth-token');
    if(!token) return res.status(401).send('Access denied.No token provided.');

    try{
    const payload= jwt.verify(token,config.get('jwtPrivatekey'));//if token is valid,then it returns payload which is a part of token
    req.user= payload;//creating property called user with value payload inside request object
    next(); //to pass control back to the route handler function
    }catch(exe){
        res.status(400).send('Invalid token.token is not valid');
    }
}
module.exports=auth;