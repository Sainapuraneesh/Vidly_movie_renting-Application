const Joi=require('joi');
const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    name: {
        type:String,
        required:true,
        minlength:3,
        maxlength:50
    },
    isGold: {
        type:Boolean,
        required:true
    },
    phone:{
        type:String,
        minlength:10,
        maxlength:10
    }
});
const Customer = mongoose.model('Customer',customerSchema);

function validateinput(obj){
    // ✅ it is modern Joi syntax
    const schema = Joi.object({
        name: Joi.string().min(3).max(50).required(),
        isGold:Joi.boolean().required(),
        phone:Joi.string().min(10).max(10)
    });
    return schema.validate(obj); //returns object having 2 property error and value
}

function validatewhileupdate(obj){ //bcoz while update we can update any number fields we want,so here required property is removed while updating
    // ✅ it is modern Joi syntax
    const schema = Joi.object({
        name: Joi.string().min(3).max(50),
        isGold:Joi.boolean(),
        phone:Joi.string().min(10).max(10)
    });
    return schema.validate(obj); //returns object having 2 property error and value
}

module.exports.validate = validateinput;
module.exports.validatewhileupdate = validatewhileupdate;
module.exports.Customer = Customer;