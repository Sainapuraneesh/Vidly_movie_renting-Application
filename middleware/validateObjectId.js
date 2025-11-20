//lec-188
const mongoose =require('mongoose');
module.exports= function(req,res,next){
    if(!mongoose.Types.ObjectId.isValid(req.params.id)){ //checks whether id is valid or not(it should be of type object_id)
        return res.status(404).send('Invalid ID.'); //user not found
    }
    next();
}