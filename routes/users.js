const express=require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {User,validate} = require('../Models/users'); //Restructing the project I seperarted model and joi validation into one file
const _ = require('lodash');
const bcrypt=require('bcrypt');
const auth=require('../middleware/auth');

router.get('/me', auth, async(req,res)=>{ //lec 1138
    const user =await User.findById(req.user._id).select('-password');//to find details of particular user if user is authenticated
    res.send(JSON.stringify(user));
});

router.post('/', async (req,res)=>{
    const {error} = validate(req.body); //error is null means message is valid
    if(error) return res.status(400).send(error.details[0].message); //bad request

    // If user is aldready registered
    let user=await User.findOne({email:req.body.email});
    if(user) return res.status(400).send('user aldready exhists');
        // If user is not registered then create a new user
    // user = new User({
    //     name:req.body.name,
    //     email:req.body.email,
    //     password:req.body.password
    // }); -->instead use below 👇
    user = new User( _.pick(req.body,['name','email','password']));

    //Hashing password lec:128
    const salt = await bcrypt.genSalt(10); //generates salt
    user.password=await bcrypt.hash(user.password,salt); //genreates hashed password to store it in DB
    await user.save();

    const token = user.generateAuthToken(); //generateAuthToken() is defined in Models/users
    res.header('x-auth-token',token).send(_.pick(user,['_id','name','email'])); //passing token in Http response header//lec 134
});

module.exports = router;