/* This handles Promise rejection instead of handling promise everywhere just use this function,as try block is the only thing
which makes difference in every route handler function,so the function passed is called inside try block(i.e., handler(req,res)) 
see genre.js-->get method   Lec -146 */
function asyncmiddleware(handler){
    return async(req,res,next)=>{
        try{
            await handler(req,res);
        }
        catch(exe){
            next(exe);
        }
    }
} //this will return request handler function
module.exports=asyncmiddleware;