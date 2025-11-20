const config=require('config'); //lec 133


module.exports = function(){
    if(!config.get('jwtPrivatekey')){ //if we didn't set env variable  //lec 133
        throw new Error('FATAL ERROR: jwtPrivateKey is not defined');
    }
}