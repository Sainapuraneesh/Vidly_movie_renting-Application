const winston=require('winston');
const express=require('express');
const app = express();

require('./startup/logging')();//handles logging errors(printing errors),therefore I added it at top
require('./startup/routes')(app); //calling function by passing app as an argument to it
require('./startup/db')(); //calling for db connection
require('./startup/config')();
require('./startup/validation')();
require('./startup/prod')(app);

const port=process.env.PORT || 3000;
const server = app.listen(port, ()=>{   winston.info(`Listening on port number ${port}...`);     }); //returns server object

module.exports=server;