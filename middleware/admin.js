function admin(req,res,next){
    
    if(!req.user.isAdmin) return res.status(403).send('Access denied');//if user is not an admin//403 means forbidden

    next();
}
module.exports=admin;