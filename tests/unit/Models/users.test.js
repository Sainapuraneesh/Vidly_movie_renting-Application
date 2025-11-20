//Lec 179
const {User} = require('../../../Models/users');
const jwt = require('jsonwebtoken');
const config = require('config');
const mongoose =require('mongoose');

describe('user.generateAuthToken', () => {
    it('should return a valid jwt', () => { 
        const obj ={_id: new mongoose.Types.ObjectId().toHexString() , isAdmin: true };
        const user = new User(obj);
        const token = user.generateAuthToken();
        const payload = jwt.verify(token, config.get('jwtPrivatekey'));//if token is valid then it returns it's payload(this method decodes the token)
        expect(payload).toMatchObject(obj);
    });
});