//Lec 125
const Joi=require('joi');
const { required } = require('joi/lib/types/lazy');
const { type } = require('joi/lib/types/object');
const mongoose = require('mongoose');
const jwt=require('jsonwebtoken');
const config=require('config');
const boolean = require('joi/lib/types/boolean');

const userSchema = new mongoose.Schema({
    name: {
        type:String,
        required:true,
        minlength:3,
        maxlength:50
    },
    email: {
        type: String,
        required:true,
        minlength:5,
        maxlength:255,
        unique:true //Lec 125 setting email as unique
    },
    password: {
        type: String,
        required:true,
        minlength:5,
        maxlength:1024, //we keep it's length large becoz we have to hash the password to store it in a database(after hashing the length will increase)
    },
    isAdmin: Boolean
});
//defining generateAuthToken function(it is actually a key with function as a value defined in schema called userSchema)here we are making changes in schema.
userSchema.methods.generateAuthToken= function(){ //lec 135-->encapsulating logic in Models
    const token = jwt.sign({_id: this._id, isAdmin:this.isAdmin}, config.get('jwtPrivatekey'));//returns Json web token & here jwtPrivatekey is an application setting,whereas config.get('jwtPrivatekey') will return env variable //lec 133
    return token;
}

const User = mongoose.model('User',userSchema);

function validateUser(user){
    const schema = Joi.object({
        name: Joi.string().min(3).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(), //Note that we use .email() to validate emails 👈
        password: Joi.string().min(5).max(255).required() //password got from users is hashed
    });
    return schema.validate(user);
}

module.exports.validate = validateUser;
module.exports.User = User;