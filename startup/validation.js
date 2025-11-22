// const Joi = require('joi'); //lec 122

// module.exports = function(){
//     Joi.objectId = require('joi-objectid')(Joi); //returns function//lec 122👈 
//     /*it is enough to import this line only once at-->index.js rather than importing it in every file where Joi.objectId is used  */
// }

// changed to joi-oid at last while  deploying 👇
const Joi = require('joi');

module.exports = function() {
    Joi.objectId = require('joi-oid')(Joi);//returns function//lec 122👈 
    /*it is enough to import this line only once at-->index.js rather than importing it in every file where Joi.objectId is used  */
}