const express=require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {User} = require('../Models/users'); //Restructing the project I seperarted model and joi validation into one file
const Joi=require('joi');
const bcrypt=require('bcrypt');

router.post('/', async (req,res)=>{
    const {error} = validate(req.body); //error is null means message is valid
    if(error) return res.status(400).send(error.details[0].message); //bad request

   const user=await User.findOne({email:req.body.email});
   if(!user) return res.status(400).send('Invalid email and password');

   const invalidPassword=await bcrypt.compare(req.body.password,user.password); //returns true if both are same after comparision
   if(!invalidPassword) return res.status(400).send('Invalid email and password');
   
   const token = user.generateAuthToken();//generateAuthToken() is defined in Models/users
   res.send(token);
});

function validate(user){
    const schema = Joi.object({
        email: Joi.string().min(5).max(255).required().email(), //Note that we use .email() to validate emails 👈
        password: Joi.string().min(5).max(255).required()
    });
    return schema.validate(user);
}

module.exports = router;