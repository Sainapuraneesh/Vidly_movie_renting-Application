// In this below function i will add all the code for setting up routes and other middleware (lec-153-startup folder is created)
const express=require('express');
const genres=require('../routes/genres'); // returns router object
const home=require('../routes/home');
const customers=require('../routes/customers');
const movies=require('../routes/movies');
const rentals=require('../routes/rentals');
const users=require('../routes/users');
const auth=require('../routes/auth');
const error=require('../middleware/error');
const returns=require('../routes/returns');//lec-202

module.exports = function(app){
    app.use(express.json());

    app.use('/api/genres',genres);
    app.use('/',home);
    app.use('/api/customers',customers);
    app.use('/api/movies',movies);
    app.use('/api/rentals',rentals);
    app.use('/api/users',users);
    app.use('/api/auth',auth);
    app.use('/api/returns',returns);

    app.use(error);//Lec-145
}