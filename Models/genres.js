const Joi=require('joi');
const mongoose = require('mongoose');

const genreSchema = new mongoose.Schema({
    genre:{type:String, required:true},
    name:String
});
const Genre = mongoose.model('Genre', genreSchema);

function validateinput(obj){
    // ✅ it is modern Joi syntax
    const schema = Joi.object({
        genre: Joi.string().min(3).max(50).required()
    });
    return schema.validate(obj); //returns object having 2 property error and value
}
module.exports.Genre = Genre;
module.exports.validate = validateinput;
module.exports.genreSchema = genreSchema;
