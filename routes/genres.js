const express=require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {Genre,validate} = require('../Models/genres'); //Restructing the project I seperarted model and joi validation into one file
const auth = require('../middleware/auth');//returns auth function it is actually a user-defined mw func
const admin = require('../middleware/admin');
const asyncmiddleware = require('../middleware/try_catch_reuse_code');//This handles Promise rejection
const validateObjectId = require('../middleware/validateObjectId');/* returns a mw function that validates 
whether the id passed in routes (as a route parameters) is of type object_id or not  */

router.get('/', asyncmiddleware(async (req,res,next)=>{
    // throw new Error('could not get genres.');
    const genres= await Genre.find().sort({genre:1}); //Get all genres,it is similar to "Select * " in sql,then sort by name
    res.send(genres);
})
);

router.get('/:id',validateObjectId,asyncmiddleware(async (req,res)=>{
    
    const genre= await Genre.findById(req.params.id);
    if(!genre) return res.status(404).send('object not found pass correct route parameter');/*checks whether 
    any document in db has this given id or not,if present then fetch that document,if id is not present then 
    it means document donot exhists. so return 404 status  */

    res.send(genre);
})
);

router.post('/',auth, asyncmiddleware(async (req,res)=>{ //it is protected route Lec 137

    //input validation
    const {error} = validate(req.body); //error is null means message is valid
    
    if(error) return res.status(400).send(error.details[0].message); //bad request

    const genre = new Genre({
        genre:req.body.genre
    }); //created Genre object

    await genre.save();
    res.send(genre);
})
);

router.put('/:id',validateObjectId, async (req,res)=>{
    //input validation
    const {error}=validate(req.body);
    if(error) return res.status(400).send(error.details[0].message); //bad request

    //search the genre document
    const genre = await Genre.findByIdAndUpdate(req.params.id, {genre:req.body.genre}, {new:true}); //new:true is used to get document after making update
    if(!genre) return res.status(404).send('object not found pass correct route parameter');

    res.send(genre);
});

router.delete('/:id', [auth,admin] ,async (req,res)=>{
    const genre=await Genre.findByIdAndDelete(req.params.id);
    if(!genre) return res.status(404).send('object not found pass correct route parameter');

    res.send(genre);
});

module.exports = router;