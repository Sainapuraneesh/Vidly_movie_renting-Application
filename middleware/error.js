const winston = require('winston');

function error(err,req,res,next){
     winston.error(err.message,err);//or winston.log(err.message); //this will log the meassage on console 


     res.status(500).send('Something failed.'); //this will send the message to the client
}
module.exports=error;