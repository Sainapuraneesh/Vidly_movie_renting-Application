//Lec 117
const Joi=require('joi');
const express=require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {Movie,validateMovie} = require('../Models/movies');
const {Genre} = require('../Models/genres');

router.get('/', async (req,res)=>{
    const movies= await Movie.find().sort({name:1}); //Get all genres,it is similar to "Select * " in sql,then sort by name
    res.send(JSON.stringify(movies));
});

router.get('/:id',async (req,res)=>{
    const movie= await Movie.findById(req.params.id);
    if(!movie) return res.status(404).send('object not found pass correct route parameter');

    res.send(JSON.stringify(movie));
});

router.post('/', async (req,res)=>{
    //input validation
    const {error} = validateMovie(req.body); //error is null means message is valid
    if(error) return res.status(400).send(error.details[0].message); //bad request

    const genre = await Genre.findById(req.body.genreId);
    if(!genre) return res.status(404).send('object not found ');

    const movie = new Movie({
    title:req.body.title,
    genre: {
        _id:genre._id,
        genre:genre.genre
    },
    numberInStock:req.body.numberInStock,
    dailyRentalRate:req.body.dailyRentalRate
    });
    try{
        await movie.save();
        res.send(JSON.stringify(movie));
    }
    catch(exe){
            res.send('please send valid data '+exe);
    }
});

router.put('/:id', async (req,res)=>{
    //input validation
    const {error}=validateMovie(req.body);
    if(error) return res.status(400).send(error.details[0].message); //bad request

    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(400).send('Invalid genre.');

    const movie = await Movie.findByIdAndUpdate(req.params.id, {
        title:req.body.title,
        genre: {
        _id: genre._id,
        name: genre.name
        },
        dailyRentalRate:req.body.dailyRentalRate,
        numberInStock:req.body.numberInStock
    }, {new:true});

    if(!movie) return res.status(404).send('The movie with the given ID was not found.');

    res.send(JSON.stringify(movie));
});

router.delete('/:id', async (req,res)=>{
    const movie=await Movie.findByIdAndDelete(req.params.id);
    if(!movie) return res.status(404).send('object not found');

    res.send(JSON.stringify(movie));
});

module.exports = router;