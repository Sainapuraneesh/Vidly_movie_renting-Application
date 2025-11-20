//lec-212 
// Created mw function for handling returned object from joi validation function //This mw function used in routes/returns.js file


const validate = (validator) => {
    return (req, res, next) => { //returns mw function
        const {error} = validator(req.body);
        if(error) return res.status(400).send(error.details[0].message);
        next();
    }
}
module.exports = validate;