const winston=require('winston');
require('winston-mongodb');

module.exports = function(){ 
    
    winston.add(new winston.transports.File({ filename: 'logfile.log' }));//means it only writes errors to logfile.log,not on the terminal.
    winston.add(new winston.transports.Console({ colorize: true, prettyPrint: true }));//this helps to write error meassage on the terminal.
    winston.add(new winston.transports.MongoDB({ 
        db:'mongodb://localhost/vidly',
        level: 'info'
    }));//this creates new collection in database (called log) to store the error message.
    
    process.on('uncaughtException',(exe)=>{ //lec-150  It is event handler function which handles a event called "uncaughtException" 
        winston.info(exe.message);
    });
    // throw new Error('Something Failed.');   //lec-150 -"uncaughtException"
    process.on('unhandledRejection',(exe)=>{ //lec-150  It is event handler function which handles a event called "uncaughtException" 
        winston.error(exe.message);
    });
    // Promise.reject(new Error('Something failed miserably.'));   //lec-151
    
}