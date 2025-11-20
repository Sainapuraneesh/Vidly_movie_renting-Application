// p14: Test Driven Development -TDD
//from lec-202
const mongoose = require('mongoose');
const express = require('express');
const { Rental } = require('../Models/rentals');
const auth = require('../middleware/auth');
const router = express.Router();
const moment = require('moment');//returns function //Lec-209
const { Movie } = require('../Models/movies');
const Joi = require('joi');
const validate = require('../middleware/validate');//returns mw function


router.post('/',[auth, validate(validateReturn)] ,async (req, res) => {
    
    const rental= await Rental.findOne({
        'customer._id': req.body.customerId,//syntax for accessing or storing data in a sub document ⭐⭐
        'movie._id': req.body.movieId
    }); //Mosh has refactored this findOne() method in lec-213 but i didn't do it
    
    if(!rental) return res.status(404).send('Rental not found');//lec-205

    if(rental.dateReturned) return res.status(400).send('Rentals is aldready processed'); //if return date is aldready set//lec-206

    rental.dateReturned = new Date();
    const no_of_days = moment().diff(rental.dateOut, 'days');//returns no of days by getting difference b/w today & dateOut
    rental.rentalFee = no_of_days * rental.movie.dailyRentalRate;
    await rental.save();

    await Movie.updateOne({_id:rental.movie._id}, {
        $inc: { numberInStock: 1 }
    });

    return res.status(200).send(rental);
});

function validateReturn(obj){
    const schema = Joi.object({
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required()
    });
    return schema.validate(obj); //returns object having 2 property error and value
}

module.exports=router;