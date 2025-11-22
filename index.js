const winston=require('winston');
const express=require('express');
const app = express();

require('./startup/logging')();//handles logging errors(printing errors),therefore I added it at top
require('./startup/config')();
require('./startup/db')(); //calling for db connection
require('./startup/validation')();
require('./startup/routes')(app); //calling function by passing app as an argument to it
require('./startup/prod')(app);

const port=process.env.PORT || 3000;
const server = app.listen(port, '0.0.0.0', ()=>{   winston.info(`Listening on port number ${port}...`);     }); //returns server object

module.exports=server;