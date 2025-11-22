const Joi=require('joi');
const express=require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {Customer, validate, validatewhileupdate} = require('../Models/customers')


router.get('/', async (req,res)=>{
    const cust= await Customer.find().sort({name:1}); //Get all genres,it is similar to "Select * " in sql,then sort by name
    res.send(JSON.stringify(cust));
});


router.get('/:id',async (req,res)=>{
    const cust= await Customer.findById(req.params.id);
    if(!cust) return res.status(404).send('object not found pass correct route parameter');

    res.send(JSON.stringify(cust));
});

router.post('/', async (req,res)=>{
    //input validation
    const {error} = validate(req.body); //error is null means message is valid
    if(error) return res.status(400).send(error.details[0].message); //bad request

    const customer = new Customer({
    isGold:req.body.isGold,
    name:req.body.name,
    phone:req.body.phone
    }); //created Genre object
    try{
        const cust = await customer.save();
        res.send(JSON.stringify(cust));
    }
    catch(exe){
            res.send('please send valid data '+exe);
    }
});

router.put('/:id', async (req,res)=>{
    //input validation
    const {error}=validatewhileupdate(req.body);
    if(error) return res.status(400).send(error.details[0].message); //bad reqsuest

    //search the customer document
    const cust = await Customer.findByIdAndUpdate(req.params.id, {name:req.body.name,phone:req.body.phone}, {new:true}); //new:true is used to get document after making update
    if(!cust) return res.status(404).send('object not found pass correct route parameter');

    res.send(JSON.stringify(cust));
});

router.delete('/:id', async (req,res)=>{
    const cust=await Customer.findByIdAndDelete(req.params.id);
    if(!cust) return res.status(404).send('object not found pass correct route parameter');

    res.send(JSON.stringify(cust));
});

module.exports = router;