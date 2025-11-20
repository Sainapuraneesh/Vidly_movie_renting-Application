//lec 118
const Joi = require('joi');
// Joi.objectId = require('joi-objectid')(Joi); //returns function //lec 121👈//it is enough to import this line only once at-->index.js
const mongoose = require('mongoose');

/*⭐Note Iam not using customer and movie collections directly here via importing,instead Iam creating new schema for
customer and movie,inside Rental collection(⭐Basically here also we are embedding the customer and movie document inside rental doc,
but not directly using the schema which is aldready defined in customer.js and movie.js, bcoz I don't want all it's properties so I 
defined a new schema with same name but this donot produce any new collections bcoz it is just schema not a model ⭐)*/

const Rental = mongoose.model('Rental', new mongoose.Schema({
  customer: { 
    type: new mongoose.Schema({ // directly defining schema here only
      name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
      },
      isGold: {
        type: Boolean,
        default: false
      },
      phone: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 10
      }      
    }),  
    required: true
  },
  movie: {
    type: new mongoose.Schema({
      title: {
        type: String,
        required: true,
        trim: true, 
        minlength: 3,
        maxlength: 255
      },
      dailyRentalRate: { 
        type: Number, 
        required: true,
        min: 0,
        max: 255
      }   
    }),
    required: true
  },
  dateOut: { 
    type: Date, 
    required: true,
    default: Date.now
  },
  dateReturned: { 
    type: Date
  },
  rentalFee: { 
    type: Number, 
    min: 0
  }
}));


function validateRental(rental) { //server receives customerId & movieId data from client for validating it
  const schema = {
    customerId: Joi.objectId().required(), //lec 121👈
    movieId: Joi.objectId().required()
  };
  return Joi.validate(rental, schema);
}

exports.Rental = Rental; 
exports.validate = validateRental;