//Lec 117
const Joi=require('joi');
const mongoose = require('mongoose');
const {genreSchema} = require('../Models/genres')

const movieSchema = new mongoose.Schema({
    title: {
        type:String,
        required:true,
        trim:true,
        minlength:3,
        maxlength:255
    },
    genre :{
        type:genreSchema,
        required:true
    },
    numberInStock :{
        type:Number,
        required:true,
        min:0,
        max:255
    },
    dailyRentalRate: {
        type:Number,
        required:true,
        min:0,
        max:255
    } 
});
const Movie = mongoose.model('Movie',movieSchema);

function validateMovie(obj){
    const joi_schema =Joi.object({
        title:Joi.string().min(3).max(255).required(),
        genreId:Joi.objectId().required(),//⭐⭐so see here genreId is not present in mongoose schema,therefore we say joi schema can grow independent of mongoose schema(joi schema validates user's input)
        numberInStock:Joi.number().min(0).required(),
        dailyRentalRate:Joi.number().min(0).required()
    });
    return joi_schema.validate(obj);
}

module.exports.validateMovie = validateMovie;
module.exports.Movie = Movie;